// Navigation Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    hamburger.setAttribute('aria-expanded', String(isExpanded));
    hamburger.setAttribute('aria-label', isExpanded ? '메뉴 닫기' : '메뉴 열기');
});
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.05, // 5%만 보여도 애니메이션 시작
    rootMargin: '0px 0px 100px 0px' // 뷰포트 100px 아래에서 미리 로드
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // 한 번 실행 후 관찰 중지 (성능 최적화)
        }
    });
}, observerOptions);

// 페이지 로드 후 스크롤 애니메이션 요소들 관찰
document.addEventListener('DOMContentLoaded', () => {
    // 새로고침 시 해시(#awards 등)로 강제 점프되는 문제 방지
    // - 새로고침(reload)인 경우에만 해시를 제거하고 상단으로 이동
    try {
        const nav = performance.getEntriesByType('navigation')[0];
        const isReload = (nav && nav.type === 'reload') || (performance.navigation && performance.navigation.type === 1);
        if (isReload && window.location.hash) {
            // 해시 제거 (URL 정리)
            history.replaceState(null, '', window.location.pathname + window.location.search);
            // 스크롤 복원 비활성화 후 상단으로 이동
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    } catch (e) {
        // 성능 API 미지원 브라우저 대응: 무시
    }

    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        section.classList.add('scroll-reveal');
        observer.observe(section);
    });

    // --- Project Filter Functionality ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    const filterProjects = (filterValue) => {
        projectItems.forEach(item => {
            const categories = item.dataset.category ? item.dataset.category.split(' ') : [];
            if (filterValue === 'all' || categories.includes(filterValue)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProjects(filterValue);
        });
    });

    // Default filter on page load - Show all projects
    if (filterButtons.length > 0) {
        filterProjects('all');
    }
});

// 헤더 스크롤 효과
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(248, 249, 250, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(248, 249, 250, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// --- Lightbox Functionality ---
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
let lastFocusedBeforeLightbox = null;

document.querySelectorAll('.project-thumbnail-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const imageUrl = link.href;
        lightboxImage.setAttribute('src', imageUrl);
        lightboxOverlay.classList.add('visible');
        document.body.classList.add('no-scroll');
        lastFocusedBeforeLightbox = document.activeElement;
        lightboxClose.focus();
    });
});

function closeLightbox() {
    lightboxOverlay.classList.remove('visible');
    document.body.classList.remove('no-scroll');
    // Reset image src after transition to prevent loading old image on next open
    setTimeout(() => {
        lightboxImage.setAttribute('src', '');
    }, 300);
    if (lastFocusedBeforeLightbox) {
        lastFocusedBeforeLightbox.focus();
        lastFocusedBeforeLightbox = null;
    }
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', e => {
    // Close only if the overlay itself is clicked, not the image
    if (e.target === lightboxOverlay) {
        closeLightbox();
    }
});
// Close lightbox with Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay.classList.contains('visible')) {
        closeLightbox();
    }
});
// Focus trap for lightbox (close button only focusable)
lightboxOverlay.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('visible')) return;
    if (e.key === 'Tab') {
        e.preventDefault();
        lightboxClose.focus();
    }
});

// --- Awards Modal Functionality ---
const awardsModal = document.getElementById('awards-modal');
const awardsModalClose = document.querySelector('#awards-modal .awards-modal-close');
const awardsModalBody = document.getElementById('awards-modal-body');
let lastFocusedBeforeAwards = null;

const awardsData = {
    'disney-internship': {
        title: '디즈니 인턴십, 없던 길을 만들다',
        whatIDid: '학교에 없는 디즈니월드 인턴십에 참여하고자, <strong>자매결연 대학을 모두 조사</strong>하여 가능한 경로를 찾아냈습니다. <br>이를 근거로 국제처장님을 설득했고, 미국 대학 담당자와의 미팅을 통해 최종적으로 <strong>디즈니 리크루터와의 면접 기회</strong>를 스스로 만들었습니다.',
        whatILearned: '비록 최종 합격하지는 못했지만, 이 경험을 통해 <strong>기회는 주어지는 것이 아니라, 명확한 논리와 끈질긴 실행력으로 직접 만들 수 있다</strong>는 것을 배웠습니다. \'안된다\'는 현실 앞에서 문제를 분석하고 대안을 찾아 목표 바로 앞까지 도달했던 이 과정은 저의 가장 큰 자산입니다.',
        link: null,
        linkText: null
    },
    'future-project': {
        title: '대전 서구 대학생 미래동행 프로젝트 대상',
        whatIDid: '지역 생활환경 문제를 해결하기 위해 <br>팀원들과 함께 대전 갑천을 <strong>직접 현장조사하고 데이터를 수집</strong>했습니다. <br>이를 바탕으로 전문가 멘토링을 거쳐 실현 가능한 <strong>환경 개선 솔루션을 기획</strong>하고 발표하여 대상을 수상했습니다.',
        whatILearned: '책상이 아닌 현장에서 직접 문제를 발견하고, 지역 주민 및 전문가와 함께 해결책을 만들어가는 <strong>\'리빙랩(Living Lab)\' 방식의 중요성</strong>을 체감했습니다. 실제 데이터와 현장의 목소리가 기획의 가장 중요한 시작점임을 배웠습니다.',
        link: 'https://www.chungnamilbo.co.kr/news/articleView.html?idxno=800167',
        linkText: '📰 충남일보 보도자료 보기'
    },
    'school-presentation': {
        title: '교내외 프레젠테이션 대회 2회 수상',
        whatIDid: '\'나의 꿈과 미래\'라는 주제를 <strong>청중이 공감할 수 있는 스토리로 구조화</strong>하여 교내 발표대회 최우수상을 수상했습니다. <br>이에 안주하지 않고 충청권역 대학연합 발표대회에 도전하여 <strong>더 큰 무대에서 장려상</strong>을 받으며 역량을 검증했습니다.',
        whatILearned: '좋은 기획은 결국 <strong>사람의 마음을 움직이는 \'설득\'의 과정</strong>임을 깨달았습니다. 현재의 성공에 안주하지 않고 더 큰 무대에 도전하며 성장하는 즐거움을 배웠고, 복잡한 생각을 명확한 논리와 스토리로 전달하는 <strong>커뮤니케이션 역량</strong>을 길렀습니다.',
        link: null,
        linkText: null
    },
    'sk-sunny': {
        title: 'SK SUNNY 대학생 봉사단 & 멘토링',
        whatIDid: '고등학생 눈높이에 맞춰 <br> <strong>역할극, 팸플릿을 활용한 사이버범죄 예방 교육</strong>을 기획 및 실행했습니다. <br>또한, 신입생 멘토로서 <strong>맞춤형 대학 생활 로드맵</strong>을 함께 설계해주었습니다.',
        whatILearned: '메시지를 전달할 때, \'무엇을\' 말하는가보다 <strong>\'어떻게\' 전달하는가가 더 중요</strong>할 수 있다는 것을 배웠습니다. 사용자의 특성을 먼저 파악하고 그에 맞는 <strong>최적의 경험(UX)을 설계하는 기획의 기본</strong>을 실습했습니다.',
        link: null,
        linkText: null
    },
    'samsung-resort': {
        title: '삼성물산 리조트부문 Cast',
        whatIDid: '수륙양용차와 사파리 트램을 운전하며 매일 수천 명 고객의 안전과 행복을 책임졌습니다. <br>특히 운행 중 차량 RPM 바가 빠지는 돌발 상황에서, <strong>침착하게 상황을 전파하고 경험을 바탕으로 차량을 안전하게 멈춰</strong> 인명사고를 막았습니다.',
        whatILearned: '<strong>고객의 목소리(VOC)와 현장 관찰</strong>이 서비스 개선의 핵심임을 배웠습니다. 수많은 돌발 상황과 비상조치훈련을 통해, 어떤 위기에서도 침착하게 문제를 분석하고 <strong>명확한 커뮤니케이션으로 최적의 해결책을 찾아내는 능력</strong>을 길렀습니다.',
        link: null,
        linkText: null
    },
    'crossworld': {
        title: '크로스월드 해외 문화체험',
        whatIDid: '교내 프로그램을 통해 베트남, 미얀마 친구들과 함께 베트남 다낭을 여행하며 <strong>서로의 문화를 직접 체험하고 교류</strong>했습니다. <br>이를 통해 다양한 국가 출신의 유학생들과 깊이 있는 소통을 나누었습니다.',
        whatILearned: '<strong>다양한 문화적 배경을 가진 사용자들을 이해하는 글로벌 감각</strong>을 기를 수 있었습니다. 문화의 차이를 존중하면서도 공통점을 찾아 소통하는 방법을 배웠으며, 이는 \'도마시장 리빙랩\' 프로젝트에서 <strong>외국인 유학생을 타겟으로 서비스를 기획</strong>할 때 큰 도움이 되었습니다.',
        link: null,
        linkText: null
    }
};

document.querySelectorAll('.award-card').forEach(card => {
    // Make award cards keyboard accessible
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const titleEl = card.querySelector('h3');
    if (titleEl) card.setAttribute('aria-label', `${titleEl.textContent} 상세 보기`);

    const openAward = () => {
        const awardKey = card.getAttribute('data-award');
        const data = awardsData[awardKey];
        
        let linkHtml = '';
        if (data.link) {
            linkHtml = `<a href="${data.link}" target="_blank" class="modal-link">${data.linkText}</a>`;
        }
        
        awardsModalBody.innerHTML = `
            <h2 id="awards-modal-title">${data.title}</h2>
            <h3>어떤 일을 했나?</h3>
            <p>${data.whatIDid}</p>
            <h3>무엇을 배웠나?</h3>
            <p>${data.whatILearned}</p>
            ${linkHtml}
        `;
        
        awardsModal.style.display = 'block';
        document.body.classList.add('no-scroll');
        lastFocusedBeforeAwards = document.activeElement;
        awardsModalClose.focus();
    };

    card.addEventListener('click', openAward);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openAward();
        }
    });
});

function closeAwardsModal() {
    awardsModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
    if (lastFocusedBeforeAwards) {
        lastFocusedBeforeAwards.focus();
        lastFocusedBeforeAwards = null;
    }
}

awardsModalClose.addEventListener('click', closeAwardsModal);
awardsModal.addEventListener('click', e => {
    if (e.target === awardsModal) {
        closeAwardsModal();
    }
});
// Close awards modal with Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && awardsModal.style.display === 'block') {
        closeAwardsModal();
    }
});
// Focus trap within awards modal
awardsModal.addEventListener('keydown', (e) => {
    if (awardsModal.style.display !== 'block') return;
    if (e.key !== 'Tab') return;
    const focusable = awardsModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const focusables = Array.from(focusable).filter(el => !el.hasAttribute('disabled'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// --- Case Study Modal Functionality ---
const caseStudyModal = document.getElementById('case-study-modal');
const caseStudyModalClose = caseStudyModal.querySelector('.awards-modal-close'); // Use querySelector on the modal element
const caseStudyModalBody = document.getElementById('case-study-modal-body');
const caseStudyTrigger = document.getElementById('case-study-trigger');
let lastFocusedBeforeCase = null;

const caseStudyData = {
    title: 'Case Study: 캠퍼스 헬퍼',
    sections: [
        {
            title: '1. 문제 정의 (The Problem)',
            content: '모든 것은 하나의 질문에서 시작되었습니다. "왜 학생들은 빈 강의실을 찾아 헤매야 할까?", "왜 학교 시간표 정보는 찾기 어려운 PDF 파일로만 제공될까?" 이처럼 비효율적인 정보 접근성 문제를 해결하고 싶었습니다.'
        },
        {
            title: '2. 목표 설정 (The Goal)',
            content: '이 문제를 해결하기 위해 다음과 같은 구체적인 목표를 세웠습니다: <br>1. 3번의 클릭만으로 현재 비어있는 모든 강의실 목록을 보여주자. <br>2. 가장 혼잡한 시간대와 건물을 시각적으로 파악할 수 있게 하자. <br>3. 443명 교수님의 시간표를 쉽게 검색할 수 있게 하자.'
        },
        {
            title: '3. 나의 역할 (My Role)',
            content: '이 프로젝트에서 저는 기획부터 개발까지 전 과정을 주도했습니다. <br>• **기획:** 핵심 기능 정의, UI/UX 설계 <br>• **데이터 처리:** Python을 이용한 4,238개 강의 데이터 파싱 및 정제 <br>• **프론트엔드 개발:** Vanilla JavaScript 기반 SPA(Single Page Application) 구현'
        },
        {
            title: '4. 핵심 과정 및 의사결정 (Process & Key Decisions)',
            content: '가장 큰 도전은 4,238개의 강의 데이터가 담긴 PDF 파일을 웹에서 사용할 수 있는 형태로 가공하는 것이었습니다. Python의 PyPDF2 라이브러리를 사용하여 텍스트를 추출하고, 정규표현식으로 데이터를 정제하여 JSON 파일로 변환했습니다. 또한, 캠퍼스 혼잡도를 효과적으로 보여주기 위해 여러 라이브러리를 검토한 끝에, 가장 가볍고 직관적인 Chart.js를 선택하여 데이터를 시각화했습니다.'
        },
        {
            title: '5. 최종 결과물 (The Outcome)',
            content: '그 결과, 실시간 빈 강의실 찾기, 캠퍼스 혼잡도 시각화, 교수님 시간표 조회, 점심 메뉴 룰렛 등 학생들의 실제 불편함을 해결하는 다양한 기능을 갖춘 웹앱을 완성할 수 있었습니다.'
        },
        {
            title: '6. 회고 및 교훈 (Retrospective & Lessons Learned)',
            content: '이 프로젝트를 통해 사용자의 작은 불편함 속에 큰 기회가 있다는 것을 깨달았습니다. 만약 다시 이 프로젝트를 한다면, 초기 기획 단계에서 실제 학생들을 대상으로 사용성 테스트를 진행하여 피드백을 더 적극적으로 반영하고 싶습니다. 기술은 목적이 아니라, 문제를 해결하는 가장 효과적인 도구여야 함을 배웠습니다.'
        }
    ]
};

caseStudyTrigger.addEventListener('click', e => {
    e.preventDefault();
    
    let modalHtml = `<h2 id="case-study-modal-title">${caseStudyData.title}</h2>`;
    caseStudyData.sections.forEach(section => {
        modalHtml += `
            <h3>${section.title}</h3>
            <p>${section.content}</p>
        `;
    });
    
    caseStudyModalBody.innerHTML = modalHtml;
    caseStudyModal.style.display = 'block';
    document.body.classList.add('no-scroll');
    lastFocusedBeforeCase = document.activeElement;
    caseStudyModalClose.focus();
});

function closeCaseStudyModal() {
    caseStudyModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
    if (lastFocusedBeforeCase) {
        lastFocusedBeforeCase.focus();
        lastFocusedBeforeCase = null;
    }
}

caseStudyModalClose.addEventListener('click', closeCaseStudyModal);
caseStudyModal.addEventListener('click', e => {
    if (e.target === caseStudyModal) {
        closeCaseStudyModal();
    }
});
// Close case study modal with Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseStudyModal.style.display === 'block') {
        closeCaseStudyModal();
    }
});
// Focus trap within case study modal
caseStudyModal.addEventListener('keydown', (e) => {
    if (caseStudyModal.style.display !== 'block') return;
    if (e.key !== 'Tab') return;
    const focusable = caseStudyModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const focusables = Array.from(focusable).filter(el => !el.hasAttribute('disabled'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// QR Code Modal - Initialize after DOM and library are loaded
let qrModalInitialized = false;

function initQRCodeModal() {
    // Prevent multiple initializations
    if (qrModalInitialized) {
        return;
    }
    
    const qrModal = document.getElementById('qr-modal');
    const qrModalClose = qrModal?.querySelector('.qr-modal-close');
    const qrCanvas = document.getElementById('qr-code-canvas');
    const qrUrl = document.getElementById('qr-code-url');
    const qrButtons = document.querySelectorAll('.btn-qr');
    
    if (!qrModal || !qrModalClose || !qrCanvas || !qrUrl) {
        console.error('QR Modal elements not found', { qrModal, qrModalClose, qrCanvas, qrUrl });
        return;
    }
    
    if (qrButtons.length === 0) {
        console.warn('No QR buttons found');
        return;
    }
    
    console.log('Initializing QR Code Modal with', qrButtons.length, 'buttons');
    qrModalInitialized = true;
    
    let lastFocusedBeforeQR = null;

    function openQRModal(url) {
        console.log('openQRModal called with URL:', url);
        if (!url) {
            console.error('No URL provided to openQRModal');
            alert('QR 코드를 생성할 URL이 없습니다.');
            return;
        }
        
        // Always use online API for reliability (especially on GitHub Pages)
        console.log('Generating QR code using online API...');
        useOnlineQR(url);
    }
    
    function useOnlineQR(url) {
        // Use online QR code API (no CORS for images from qrserver.com)
        const qrImage = new Image();
        const encodedUrl = encodeURIComponent(url);
        
        // Set canvas size first
        qrCanvas.width = 256;
        qrCanvas.height = 256;
        qrCanvas.style.display = 'block';
        
        qrImage.onload = function() {
            try {
                const ctx = qrCanvas.getContext('2d');
                ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
                ctx.drawImage(qrImage, 0, 0, qrCanvas.width, qrCanvas.height);
                showQRModal(url);
            } catch (error) {
                console.error('Error drawing QR code:', error);
                showQRModal(url);
            }
        };
        
        qrImage.onerror = function(error) {
            console.error('Failed to load QR code image:', error);
            // Show modal anyway with URL text
            qrCanvas.style.display = 'none';
            showQRModal(url);
        };
        
        // Using api.qrserver.com (works without CORS for img tags)
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedUrl}`;
    }
    
    function showQRModal(url) {
        console.log('Showing QR modal for URL:', url);
        qrUrl.textContent = url;
        qrModal.classList.add('visible');
        document.body.classList.add('no-scroll');
        lastFocusedBeforeQR = document.activeElement;
        
        // Make sure canvas is visible
        qrCanvas.style.display = 'block';
        
        // Focus close button
        setTimeout(() => {
            qrModalClose.focus();
        }, 100);
        
        console.log('QR modal should be visible now');
    }

    function closeQRModal() {
        qrModal.classList.remove('visible');
        document.body.classList.remove('no-scroll');
        if (lastFocusedBeforeQR) {
            lastFocusedBeforeQR.focus();
            lastFocusedBeforeQR = null;
        }
    }

    // QR Code button click handlers
    qrButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = button.getAttribute('data-qr-url');
            console.log('QR button clicked, URL:', url);
            if (url) {
                openQRModal(url);
            } else {
                console.error('No data-qr-url attribute found on button');
            }
        });
    });
    
    console.log('QR Code Modal initialized successfully');

    // QR Modal close handlers
    qrModalClose.addEventListener('click', closeQRModal);
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            closeQRModal();
        }
    });

    // QR Modal keyboard handlers
    document.addEventListener('keydown', (e) => {
        if (qrModal.classList.contains('visible') && e.key === 'Escape') {
            closeQRModal();
        }
    });

    // Focus trap within QR modal
    qrModal.addEventListener('keydown', (e) => {
        if (!qrModal.classList.contains('visible')) return;
        if (e.key !== 'Tab') return;
        const focusable = qrModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const focusables = Array.from(focusable).filter(el => !el.hasAttribute('disabled'));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });
}

// Initialize QR Code Modal - Works with or without library (uses online API as fallback)
function initializeQRCodeFeature() {
    console.log('Initializing QR Code feature...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initQRCodeModal, 100);
        });
    } else {
        // DOM is already ready
        setTimeout(initQRCodeModal, 100);
    }
    
    // Also try on window load as backup
    window.addEventListener('load', function() {
        if (!qrModalInitialized) {
            console.log('QR Code modal not initialized yet, trying again...');
            setTimeout(initQRCodeModal, 200);
        }
    });
}

// Start initialization
initializeQRCodeFeature();


// ==========================================================
// 행정안전부 대국민 안내 포털 인터랙션 스크립트 (script.js)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 0. 테마 (다크 모드 / 야간 모드) 초기화
  initThemeToggle();

  // 1. 탭 네비게이션 (5대 핵심 업무)
  initTabNavigation();

  // 2. 아코디언 (FAQ)
  initFaqAccordion();

  // 3. 실시간 서비스 필터 및 검색
  initSearch();
});

/* ----------------------------------------------------------
   0. 야간 모드 (다크 모드) 토글 & 저장
---------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('mois_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // 저장된 설정이 있거나 OS 기본이 다크 모드일 때 적용
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('mois_theme', isDark ? 'dark' : 'light');
    });
  }
}

/* ----------------------------------------------------------
   1. 5대 핵심업무 탭 전환
---------------------------------------------------------- */
function initTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 액티브 클래스 제거
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      // 선택된 탭 활성화
      btn.classList.add('active');
      const targetPanelId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ----------------------------------------------------------
   2. FAQ 아코디언 토글
---------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // 다른 열려있는 항목 닫기
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));

      // 클릭한 항목 토글
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ----------------------------------------------------------
   3. 서비스 검색 및 필터 기능
---------------------------------------------------------- */
function initSearch() {
  const searchInput = document.getElementById('serviceSearch');
  const btnSearch = document.getElementById('btnSearch');

  if (searchInput && btnSearch) {
    btnSearch.addEventListener('click', () => {
      executeSearch(searchInput.value);
    });

    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        executeSearch(searchInput.value);
      } else {
        // 타이핑 시 실시간 필터
        executeSearch(searchInput.value);
      }
    });
  }
}

function filterSearch(keyword) {
  const searchInput = document.getElementById('serviceSearch');
  if (searchInput) {
    searchInput.value = keyword;
    executeSearch(keyword);
    // 서비스 영역으로 스크롤 이동
    const section = document.getElementById('life-services');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function executeSearch(query) {
  const term = query.trim().toLowerCase();
  const serviceCards = document.querySelectorAll('.service-item-card');

  serviceCards.forEach(card => {
    const keywordData = card.getAttribute('data-keyword') || '';
    const cardText = card.innerText.toLowerCase();

    if (!term || keywordData.toLowerCase().includes(term) || cardText.includes(term)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

/* ----------------------------------------------------------
   4. 상식 퀴즈 검증 로직
---------------------------------------------------------- */
let correctCount = 0;
const answeredQuestions = new Set();

function checkAnswer(questionNum, optionIdx, isCorrect) {
  if (answeredQuestions.has(questionNum)) {
    return; // 이미 응답한 문항은 재선택 방지
  }
  answeredQuestions.add(questionNum);

  const card = document.querySelector(`.quiz-card[data-quiz="${questionNum}"]`);
  const buttons = card.querySelectorAll('.opt-btn');
  const feedback = document.getElementById(`feedback-${questionNum}`);

  // 버튼 비활성화 및 정답/오답 스타일 적용
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === optionIdx) {
      if (isCorrect) {
        btn.classList.add('correct');
      } else {
        btn.classList.add('wrong');
      }
    }
  });

  if (isCorrect) {
    correctCount++;
    feedback.className = 'quiz-feedback feedback-success';
    feedback.innerHTML = '🎉 정답입니다! 아주 정확하게 알고 계시네요.';
  } else {
    feedback.className = 'quiz-feedback feedback-error';
    feedback.innerHTML = '❌ 아쉽네요! 정답을 다시 한 번 확인해 보세요.';
  }

  // 점수 갱신
  const scoreBadge = document.getElementById('quizScore');
  if (scoreBadge) {
    scoreBadge.innerText = `점수: ${correctCount} / 3`;
    if (answeredQuestions.size === 3) {
      setTimeout(() => {
        if (correctCount === 3) {
          alert(`축하합니다! 3문제를 모두 맞히셨습니다. 당신은 행정안전부 상식 달인! 🏆`);
        } else {
          alert(`퀴즈 완료! ${correctCount}문제를 맞히셨습니다. 참여해 주셔서 감사합니다! 👍`);
        }
      }, 300);
    }
  }
}

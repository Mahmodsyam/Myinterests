/**
 * ====================================================================
 *المنطق التفاعلي لموقع «تحدّي معرفة محمود — أسئلة عن مفضّلاتي 🎯🤖💛»
 * ====================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'mahmoud_shorouq_pure_quiz_v4';
  const THEME_STORAGE_KEY = 'mahmoud_shorouq_theme_v2';

  let state = {
    currentStep: 0,
    currentStepId: 'step-0',
    color: null,     // السؤال ١: الألوان المفضلة (الرمادي والأخضر)
    food: null,      // السؤال ٢: الأكلات المفضلة (المسقعة والشاورما)
    drink: null,     // السؤال ٣: المشروب المفضل (النسكافيه والشاي)
    outing: null,    // السؤال ٤: الطشات المفضلة (البحر والمطاعم)
    interest: null,  // السؤال ٥: الاهتمامات والشغف (البرمجة والويب)
    happy: null,     // السؤال ٦: أكثر شغلة بتفرح محمود
    trait: null,     // السؤال ٧: أكثر صفة بتميز محمود بعين شروق
    gift: '',        // السؤال ٨: جائزة التحدي المطلوبة
    note: ''         // السؤال ٨: كلمة من قلب شروق لمحمود
  };

  let dodgeCount = 0;
  let isDodgeAnimating = false;
  let noBtnOffset = { x: 0, y: 0 };
  let toastTimeout = null;
  let robotSpeechTimer = null;
  let autoNextTimer = null;
  let robotJokeIndex = 0;

  const elements = {
    progressSection: document.getElementById('progressSection'),
    progressStepName: document.getElementById('progressStepName'),
    progressCounter: document.getElementById('progressCounter'),
    progressBarFill: document.getElementById('progressBarFill'),
    navigationBar: document.getElementById('navigationBar'),
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    btnNextText: document.getElementById('btnNextText'),

    // زر تبديل الثيم (سهرة النجوم / شروق الشمس)
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeToggleIcon: document.getElementById('themeToggleIcon'),
    themeToggleLabel: document.getElementById('themeToggleLabel'),

    // شاشة الترحيب والدعوة
    programmerWelcomeText: document.getElementById('programmerWelcomeText'),
    programmerWelcomeSub: document.getElementById('programmerWelcomeSub'),
    invitationBadge: document.getElementById('invitationBadge'),
    invitationQuestion: document.getElementById('invitationQuestion'),
    invitationSubtitle: document.getElementById('invitationSubtitle'),
    invitationArena: document.getElementById('invitationArena'),
    dodgeSpeechBubble: document.getElementById('dodgeSpeechBubble'),
    btnYes: document.getElementById('btnYes'),
    btnYesText: document.getElementById('btnYesText'),
    btnNo: document.getElementById('btnNo'),
    btnNoText: document.getElementById('btnNoText'),

    // فقاعة روبوت الباشمهندس محمود التفاعلية 🤖
    robotAssistantCard: document.getElementById('robotAssistantCard'),
    robotAvatarEmoji: document.getElementById('robotAvatarEmoji'),
    robotAssistantName: document.getElementById('robotAssistantName'),
    robotStatusText: document.getElementById('robotStatusText'),
    robotBubbleMessage: document.getElementById('robotBubbleMessage'),
    btnRobotJoke: document.getElementById('btnRobotJoke'),
    btnRobotJokeText: document.getElementById('btnRobotJokeText'),
    btnRobotMinimize: document.getElementById('btnRobotMinimize'),

    // شبكات بطاقات الأسئلة السبعة
    citiesGrid: document.getElementById('citiesGrid'),
    foodGrid: document.getElementById('foodGrid'),
    dessertGrid: document.getElementById('dessertGrid'),
    outingGrid: document.getElementById('outingGrid'),
    interestGrid: document.getElementById('interestGrid'),
    happyGrid: document.getElementById('happyGrid'),
    traitGrid: document.getElementById('traitGrid'),

    // خطوة جائزة التحدي والرسالة (step-8)
    step8Title: document.getElementById('step8Title'),
    giftSubtitle: document.getElementById('giftSubtitle'),
    giftSuggestionsChips: document.getElementById('giftSuggestionsChips'),
    giftInputLabel: document.getElementById('giftInputLabel'),
    giftInput: document.getElementById('giftInput'),
    noteInputLabel: document.getElementById('noteInputLabel'),
    personalNoteInput: document.getElementById('personalNoteInput'),

    // شاشة الملخص والشهادة (step-summary)
    summaryTitle: document.getElementById('summaryTitle'),
    trophyBadgeBanner: document.getElementById('trophyBadgeBanner'),
    trophyIcon: document.getElementById('trophyIcon'),
    trophyScoreTitle: document.getElementById('trophyScoreTitle'),
    trophyScoreSub: document.getElementById('trophyScoreSub'),
    summaryColorVal: document.getElementById('summaryColorVal'),
    summaryFoodVal: document.getElementById('summaryFoodVal'),
    summaryDrinkVal: document.getElementById('summaryDrinkVal'),
    summaryOutingVal: document.getElementById('summaryOutingVal'),
    summaryInterestVal: document.getElementById('summaryInterestVal'),
    summaryHappyVal: document.getElementById('summaryHappyVal'),
    summaryTraitVal: document.getElementById('summaryTraitVal'),
    summaryGiftVal: document.getElementById('summaryGiftVal'),
    summaryNoteBox: document.getElementById('summaryNoteBox'),
    summaryNoteVal: document.getElementById('summaryNoteVal'),
    summaryLoveQuote: document.getElementById('summaryLoveQuote'),
    btnSendWhatsApp: document.getElementById('btnSendWhatsApp'),
    btnWhatsappText: document.getElementById('btnWhatsappText'),
    btnCopyDetails: document.getElementById('btnCopyDetails'),
    btnEditChoices: document.getElementById('btnEditChoices'),
    btnResetApp: document.getElementById('btnResetApp'),

    // النوافذ والإشعارات
    celebrationModal: document.getElementById('celebrationModal'),
    modalTitle: document.getElementById('modalTitle'),
    btnStartPlanning: document.getElementById('btnStartPlanning'),
    confirmResetModal: document.getElementById('confirmResetModal'),
    btnConfirmReset: document.getElementById('btnConfirmReset'),
    btnCancelReset: document.getElementById('btnCancelReset'),
    sweetToast: document.getElementById('sweetToast'),
    footerText: document.getElementById('footerText'),
    particlesContainer: document.getElementById('particlesContainer'),
    confettiContainer: document.getElementById('confettiContainer')
  };

  function init() {
    initThemeSystem();
    applyConfigTexts();
    createBackgroundParticles();
    setupRobotAssistant();
    setupInvitationEvents();
    setupQuizHintButtons();
    setupGiftStepEvents();
    setupNavigationEvents();
    setupSummaryActions();
    loadDraftFromStorage();
  }

  // ------------------------------------------------------------------
  // نظام تبديل النمط الفوري (سهرة النجوم / شروق الشمس الدافئ)
  // ------------------------------------------------------------------
  function initThemeSystem() {
    let savedTheme = 'midnight';
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dawn' || stored === 'midnight') {
        savedTheme = stored;
      }
    } catch (e) {}

    applyTheme(savedTheme, false);

    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'midnight';
        const next = current === 'midnight' ? 'dawn' : 'midnight';
        applyTheme(next, true);
      });
    }
  }

  function applyTheme(themeName, announce) {
    document.documentElement.setAttribute('data-theme', themeName);
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    if (themeName === 'dawn') {
      if (elements.themeToggleIcon) elements.themeToggleIcon.textContent = '🌙';
      if (elements.themeToggleLabel) elements.themeToggleLabel.textContent = 'نمط سهرة النجوم';
      if (metaTheme) metaTheme.setAttribute('content', '#fff7f3');
      if (announce) showToast('تم التبديل إلى نمط «شروق الشمس الدافئ» ☀️🌸');
    } else {
      if (elements.themeToggleIcon) elements.themeToggleIcon.textContent = '☀️';
      if (elements.themeToggleLabel) elements.themeToggleLabel.textContent = 'نمط شروق الشمس';
      if (metaTheme) metaTheme.setAttribute('content', '#0b0816');
      if (announce) showToast('تم التبديل إلى نمط «سهرة النجوم المخملية» 🌙✨');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch (e) {}
  }

  function applyConfigTexts() {
    const cfg = APP_CONFIG;

    if (elements.programmerWelcomeText && cfg.welcome) {
      elements.programmerWelcomeText.textContent = cfg.welcome.title;
      elements.programmerWelcomeSub.textContent = cfg.welcome.subtitle;
    }

    if (cfg.robotAssistant) {
      if (elements.robotAssistantName && cfg.robotAssistant.name) {
        elements.robotAssistantName.textContent = cfg.robotAssistant.name;
      }
      if (elements.robotStatusText && cfg.robotAssistant.statusText) {
        elements.robotStatusText.textContent = cfg.robotAssistant.statusText;
      }
      if (elements.btnRobotJokeText && cfg.robotAssistant.jokeBtnText) {
        elements.btnRobotJokeText.textContent = cfg.robotAssistant.jokeBtnText;
      }
    }

    elements.invitationBadge.textContent = cfg.invitation.badge;
    elements.invitationQuestion.textContent = cfg.invitation.question;
    elements.invitationSubtitle.textContent = cfg.invitation.subtitle;
    elements.btnYesText.textContent = cfg.invitation.yesBtn;
    elements.btnNoText.textContent = cfg.invitation.noBtn;

    const st = cfg.uiTexts.stepTitles;
    if (st) {
      const s1 = document.getElementById('step1Title');
      const s2 = document.getElementById('step2Title');
      const s3 = document.getElementById('step3Title');
      const s4 = document.getElementById('step4Title');
      const s5 = document.getElementById('step5Title');
      const s6 = document.getElementById('step6Title');
      const s7 = document.getElementById('step7Title');
      if (s1 && st.step1) s1.textContent = st.step1;
      if (s2 && st.step2) s2.textContent = st.step2;
      if (s3 && st.step3) s3.textContent = st.step3;
      if (s4 && st.step4) s4.textContent = st.step4;
      if (s5 && st.step5) s5.textContent = st.step5;
      if (s6 && st.step6) s6.textContent = st.step6;
      if (s7 && st.step7) s7.textContent = st.step7;
    }

    if (elements.step8Title && cfg.giftConfig) {
      elements.step8Title.textContent = cfg.giftConfig.title;
      elements.giftSubtitle.textContent = cfg.giftConfig.subtitle;
      elements.giftInputLabel.textContent = cfg.giftConfig.giftInputLabel;
      elements.giftInput.placeholder = cfg.giftConfig.giftPlaceholder;
      elements.noteInputLabel.textContent = cfg.giftConfig.noteLabel;
      elements.personalNoteInput.placeholder = cfg.giftConfig.notePlaceholder;
    }

    if (elements.summaryTitle && st && st.summary) {
      elements.summaryTitle.textContent = st.summary;
    }
    if (elements.summaryLoveQuote) {
      elements.summaryLoveQuote.textContent = cfg.uiTexts.summaryLoveQuote;
    }
    if (elements.footerText) {
      elements.footerText.innerHTML = `${cfg.uiTexts.footerText} <span class="footer-heart">💛</span>`;
    }
  }

  // ------------------------------------------------------------------
  // فقاعة روبوت الباشمهندس التفاعلية (Robot Assistant Logic 🤖💬)
  // ------------------------------------------------------------------
  function setupRobotAssistant() {
    if (!elements.robotAssistantCard) return;

    if (elements.btnRobotMinimize) {
      elements.btnRobotMinimize.addEventListener('click', () => {
        const isMinimized = elements.robotAssistantCard.classList.toggle('minimized');
        elements.btnRobotMinimize.textContent = isMinimized ? '💬' : '➖';
      });
    }

    if (elements.btnRobotJoke) {
      elements.btnRobotJoke.addEventListener('click', () => {
        const jokes = (APP_CONFIG.robotAssistant && APP_CONFIG.robotAssistant.programmerCompliments) || [];
        if (jokes.length === 0) return;

        const msg = jokes[robotJokeIndex % jokes.length];
        robotJokeIndex++;
        updateRobotSpeech(msg, '🥰', true);
        launchFloatingHeartsBurst();
      });
    }
  }

  function updateRobotSpeech(text, emojiFace = '🤖', pulse = true) {
    if (!elements.robotBubbleMessage) return;

    if (elements.robotAvatarEmoji) {
      elements.robotAvatarEmoji.textContent = emojiFace;
    }

    elements.robotBubbleMessage.style.opacity = '0.3';
    clearTimeout(robotSpeechTimer);

    robotSpeechTimer = setTimeout(() => {
      elements.robotBubbleMessage.textContent = text;
      elements.robotBubbleMessage.style.opacity = '1';
      if (pulse && elements.robotAssistantCard) {
        elements.robotAssistantCard.classList.remove('robot-pulse');
        void elements.robotAssistantCard.offsetWidth;
        elements.robotAssistantCard.classList.add('robot-pulse');
      }
    }, 100);
  }

  function triggerRobotStepMessage(stepId) {
    if (!APP_CONFIG.robotAssistant || !APP_CONFIG.robotAssistant.stepMessages) return;
    const msg = APP_CONFIG.robotAssistant.stepMessages[stepId];
    if (msg) {
      const stepEmojis = {
        'step-0': '🤖',
        'step-1': '🎨',
        'step-2': '🍽️',
        'step-3': '☕',
        'step-4': '🌊',
        'step-5': '💻',
        'step-6': '🥰',
        'step-7': '💝',
        'step-8': '🎁',
        'step-summary': '🏆'
      };
      updateRobotSpeech(msg, stepEmojis[stepId] || '🤖', true);
    }
  }

  // ------------------------------------------------------------------
  // زر «لا» الهارب الذكي وقبول التحدي
  // ------------------------------------------------------------------
  function setupInvitationEvents() {
    const btnNo = elements.btnNo;
    const arena = elements.invitationArena;
    const bubble = elements.dodgeSpeechBubble;
    const phrases = APP_CONFIG.invitation.noEscapePhrases;

    function dodge() {
      if (isDodgeAnimating) return;
      isDodgeAnimating = true;

      if (!btnNo.classList.contains('escaped')) {
        btnNo.classList.add('escaped');
      }

      const arenaRect = arena.getBoundingClientRect();
      const btnNoRect = btnNo.getBoundingClientRect();
      const btnYesRect = elements.btnYes.getBoundingClientRect();

      // موقع الزر الأصلي بدون إزاحة
      const originLeft = btnNoRect.left - noBtnOffset.x;
      const originTop = btnNoRect.top - noBtnOffset.y;

      // تحديد نطاق حركة قريب ولطيف داخل الصندوق بحيث لا يبتعد كثيراً أبداً
      const maxRadiusX = Math.min(110, Math.max(65, Math.floor(arenaRect.width * 0.24)));
      const maxRadiusY = 54;

      const minTx = Math.max(-maxRadiusX, (arenaRect.left + 16) - originLeft);
      const maxTx = Math.min(maxRadiusX, (arenaRect.right - btnNoRect.width - 16) - originLeft);
      const minTy = Math.max(-maxRadiusY, (arenaRect.top + 48) - originTop);
      const maxTy = Math.min(maxRadiusY, (arenaRect.bottom - btnNoRect.height - 14) - originTop);

      let candidateX = 0;
      let candidateY = 0;
      let attempts = 0;

      do {
        // قفزة ناعمة بمسافة متوسطة (50 إلى 90 بكسل) في اتجاه جديد
        const angle = Math.random() * Math.PI * 2;
        const stepDist = 52 + Math.random() * 38;
        let tx = noBtnOffset.x + Math.cos(angle) * stepDist;
        let ty = noBtnOffset.y + Math.sin(angle) * (stepDist * 0.75);

        // إبقاء الإزاحة ضمن الحدود المسموحة القريبة
        if (tx < minTx || tx > maxTx) {
          tx = minTx + Math.random() * Math.max(10, maxTx - minTx);
        }
        if (ty < minTy || ty > maxTy) {
          ty = minTy + Math.random() * Math.max(10, maxTy - minTy);
        }

        candidateX = Math.max(minTx, Math.min(maxTx, tx));
        candidateY = Math.max(minTy, Math.min(maxTy, ty));
        attempts++;

        const newLeft = originLeft + candidateX;
        const newTop = originTop + candidateY;

        const overlapX =
          newLeft < btnYesRect.right + 10 &&
          newLeft + btnNoRect.width + 10 > btnYesRect.left;
        const overlapY =
          newTop < btnYesRect.bottom + 10 &&
          newTop + btnNoRect.height + 10 > btnYesRect.top;

        const movedDist = Math.hypot(candidateX - noBtnOffset.x, candidateY - noBtnOffset.y);
        if ((!overlapX || !overlapY) && movedDist >= 32) break;
      } while (attempts < 24);

      noBtnOffset.x = Math.round(candidateX);
      noBtnOffset.y = Math.round(candidateY);

      const randomTilt = (Math.random() * 12 - 6).toFixed(1);
      btnNo.style.transform = `translate3d(${noBtnOffset.x}px, ${noBtnOffset.y}px, 0) rotate(${randomTilt}deg)`;

      // نبضة أنيميشن مرنة (Jelly Bounce) للنص الداخلي أثناء القفزة
      if (elements.btnNoText && elements.btnNoText.animate) {
        elements.btnNoText.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.18, 0.86)' },
          { transform: 'scale(0.92, 1.08)' },
          { transform: 'scale(1)' }
        ], {
          duration: 380,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        });
      }

      showDodgePhrase();

      setTimeout(() => {
        isDodgeAnimating = false;
      }, 150);
    }

    function showDodgePhrase() {
      const phrase = phrases[dodgeCount % phrases.length];
      dodgeCount++;
      bubble.textContent = phrase;
      bubble.classList.add('show');

      if (APP_CONFIG.robotAssistant && APP_CONFIG.robotAssistant.reactionMessages) {
        updateRobotSpeech(APP_CONFIG.robotAssistant.reactionMessages.dodgeNo || phrase, '😂', true);
      }

      clearTimeout(bubble._timer);
      bubble._timer = setTimeout(() => {
        bubble.classList.remove('show');
      }, 2500);
    }

    arena.addEventListener('mousemove', function (e) {
      if (state.currentStep !== 0) return;
      if (isDodgeAnimating) return;

      const rect = btnNo.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (distance < 55) {
        dodge();
      }
    });

    btnNo.addEventListener('mouseenter', function (e) {
      e.preventDefault();
      dodge();
    });

    btnNo.addEventListener('touchstart', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dodge();
    }, { passive: false });

    btnNo.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dodge();
    });

    btnNo.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dodge();
    });

    elements.btnYes.addEventListener('click', function () {
      handleAcceptInvitation();
    });
  }

  function handleAcceptInvitation() {
    launchConfetti();
    launchFloatingHeartsBurst();

    elements.modalTitle.textContent = APP_CONFIG.invitation.acceptedTitle;
    elements.celebrationModal.classList.add('show');

    elements.btnStartPlanning.onclick = function () {
      elements.celebrationModal.classList.remove('show');
      goToStep('step-1');
    };

    setTimeout(() => {
      if (elements.celebrationModal.classList.contains('show')) {
        elements.celebrationModal.classList.remove('show');
        if (state.currentStepId === 'step-0' || state.currentStep === 0) {
          goToStep('step-1');
        }
      }
    }, 1800);
  }

  // ------------------------------------------------------------------
  // إعداد أزرار التلميح السري من روبوت محمود 💡
  // ------------------------------------------------------------------
  function setupQuizHintButtons() {
    const hintBtns = document.querySelectorAll('.btn-quiz-hint');
    hintBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stepId = btn.getAttribute('data-hint-step');
        const hintBox = document.getElementById(`hintBox-${stepId}`);
        const hintText = (APP_CONFIG.quizHints && APP_CONFIG.quizHints[stepId]) || 'فكّري بقلب محمود ورح تعرفي الإجابة فوراً 😉💛';
        if (hintBox) {
          hintBox.textContent = hintText;
          hintBox.style.display = 'block';
        }
        updateRobotSpeech(hintText, '💡', true);
      });
    });
  }

  // ------------------------------------------------------------------
  // دالة موحدة لتوليد بطاقات الأسئلة والتفاعل معها والانتقال التلقائي
  // ------------------------------------------------------------------
  function renderQuizCardsGrid(gridEl, items, stateKey, isFactualQuestion) {
    if (!gridEl || !items) return;
    gridEl.innerHTML = '';

    items.forEach(item => {
      const selectedObj = state[stateKey];
      const isSelected = selectedObj && selectedObj.id === item.id;
      const card = document.createElement('div');
      card.className = `option-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

      const descText = item.vibe || item.desc || '';
      let feedbackBadgeHtml = '';
      if (isSelected) {
        if (!isFactualQuestion || item.isCorrect) {
          feedbackBadgeHtml = `<div style="margin-top:8px; font-size:0.86rem; font-weight:800; color:#34d399;">✅ إجابة صحيحة ١٠٠٪! جاري الانتقال للسؤال التالي... 🎯✨</div>`;
        } else {
          feedbackBadgeHtml = `<div style="margin-top:8px; font-size:0.84rem; font-weight:800; color:#fbbf24;">🤭 مش هاد الخيار! جربي خيار ثاني أو اضغطي التلميح السري 💡</div>`;
        }
      }

      card.innerHTML = `
        <span class="check-badge">✓</span>
        <div class="option-card-icon">${item.icon}</div>
        <div class="option-card-title">${item.name}</div>
        <div class="option-card-desc">${descText}</div>
        ${feedbackBadgeHtml}
      `;

      card.addEventListener('click', () => {
        clearTimeout(autoNextTimer);
        state[stateKey] = item;
        saveDraftToStorage();
        renderQuizCardsGrid(gridEl, items, stateKey, isFactualQuestion);

        const reactions = (APP_CONFIG.robotAssistant && APP_CONFIG.robotAssistant.reactionMessages) || {};
        if (isFactualQuestion) {
          if (item.isCorrect) {
            updateRobotSpeech(reactions.selectCorrect || 'إجابة صحيحة ١٠٠٪ يا شروق! 😍🎯', '🥳', true);
            showToast('✅ إجابة صحيحة ١٠٠٪! كفو يا شروق.. ننتقل للسؤال التالي 😍🎯');
            launchFloatingHeartsBurst();
            autoNextTimer = setTimeout(() => {
              handleNextStep();
            }, 950);
          } else {
            updateRobotSpeech(reactions.selectWrong || 'إجابة قريبة بس مش هاي المفضلة عند محمود 🤭 جربي خيار ثاني! 💡', '🤭', true);
            showToast('🤭 مش هاد الخيار! جربي خيار ثاني أو اضغطي زر التلميح السري 💡');
            shakeCurrentStep();
          }
        } else {
          updateRobotSpeech(reactions.selectSpecial || 'يا عيني على هالاختيار الحلو! 💝✨', '🥰', true);
          showToast('✅ اختيار يفتح النفس! جاري الانتقال للسؤال التالي... 💝✨');
          launchFloatingHeartsBurst();
          autoNextTimer = setTimeout(() => {
            handleNextStep();
          }, 950);
        }
      });

      gridEl.appendChild(card);
    });
  }

  function renderStep1Colors() {
    renderQuizCardsGrid(elements.citiesGrid, APP_CONFIG.favoriteColors, 'color', true);
  }

  function renderStep2Foods() {
    renderQuizCardsGrid(elements.foodGrid, APP_CONFIG.favoriteFoods, 'food', true);
  }

  function renderStep3Drinks() {
    renderQuizCardsGrid(elements.dessertGrid, APP_CONFIG.favoriteDrinks, 'drink', true);
  }

  function renderStep4Outings() {
    renderQuizCardsGrid(elements.outingGrid, APP_CONFIG.favoriteOutings, 'outing', true);
  }

  function renderStep5Interests() {
    renderQuizCardsGrid(elements.interestGrid, APP_CONFIG.favoriteInterests, 'interest', true);
  }

  function renderStep6Happy() {
    renderQuizCardsGrid(elements.happyGrid, APP_CONFIG.whatMakesMahmoudHappy, 'happy', false);
  }

  function renderStep7Trait() {
    renderQuizCardsGrid(elements.traitGrid, APP_CONFIG.specialTraitsInMahmoud, 'trait', false);
  }

  // ------------------------------------------------------------------
  // السؤال الثامن (step-8): جائزة التحدّي وكلمة لمحمود 🎁💌
  // ------------------------------------------------------------------
  function renderStep8Gift() {
    if (!elements.giftSuggestionsChips || !APP_CONFIG.giftConfig) return;
    elements.giftSuggestionsChips.innerHTML = '';

    const suggestions = APP_CONFIG.giftConfig.quickSuggestions || [];
    suggestions.forEach(suggestion => {
      const isSelected = state.gift === suggestion;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `gift-pill ${isSelected ? 'active' : ''}`;
      chip.textContent = suggestion;

      chip.addEventListener('click', () => {
        state.gift = suggestion;
        if (elements.giftInput) {
          elements.giftInput.value = suggestion;
        }
        saveDraftToStorage();
        renderStep8Gift();
        if (APP_CONFIG.robotAssistant && APP_CONFIG.robotAssistant.reactionMessages) {
          updateRobotSpeech(APP_CONFIG.robotAssistant.reactionMessages.selectGift, '🎁', true);
        }
      });

      elements.giftSuggestionsChips.appendChild(chip);
    });

    if (elements.giftInput && document.activeElement !== elements.giftInput) {
      elements.giftInput.value = state.gift || '';
    }
    if (elements.personalNoteInput && document.activeElement !== elements.personalNoteInput) {
      elements.personalNoteInput.value = state.note || '';
    }
  }

  function setupGiftStepEvents() {
    if (elements.giftInput) {
      elements.giftInput.addEventListener('input', (e) => {
        state.gift = e.target.value;
        saveDraftToStorage();
        const chips = elements.giftSuggestionsChips ? elements.giftSuggestionsChips.querySelectorAll('.gift-pill') : [];
        chips.forEach(chip => {
          chip.classList.toggle('active', chip.textContent === state.gift.trim());
        });
      });
    }

    if (elements.personalNoteInput) {
      elements.personalNoteInput.addEventListener('input', (e) => {
        state.note = e.target.value;
        saveDraftToStorage();
      });
    }
  }

  // ------------------------------------------------------------------
  // حساب النتيجة وعرض شهادة التحدّي النهائية (step-summary) 🏆📜
  // ------------------------------------------------------------------
  function calculateQuizScore() {
    const factualAnswers = [state.color, state.food, state.drink, state.outing, state.interest];
    let correctCount = 0;
    factualAnswers.forEach(ans => {
      if (ans && ans.isCorrect) correctCount++;
    });
    return {
      score: correctCount,
      total: 5,
      percent: Math.round((correctCount / 5) * 100)
    };
  }

  function formatAnswerSummary(chosenItem, correctLabel) {
    if (!chosenItem) return '-';
    const base = `${chosenItem.name} ${chosenItem.icon || ''}`;
    if (chosenItem.isCorrect) {
      return `${base} (✅ صح ١٠٠٪)`;
    }
    return `${base} (الصحيح: ${correctLabel})`;
  }

  function renderSummaryStep() {
    const result = calculateQuizScore();

    if (elements.trophyScoreTitle && elements.trophyScoreSub) {
      const arScore = toArabicNumerals(result.score);
      const arTotal = toArabicNumerals(result.total);
      const arPercent = toArabicNumerals(result.percent);

      if (result.score === 5) {
        if (elements.trophyIcon) elements.trophyIcon.textContent = '🏆';
        elements.trophyScoreTitle.textContent = `النتيجة النهائية: ${arScore} / ${arTotal} (${arPercent}٪) — خبيرة قلب محمود الأولى! 👑💛`;
        elements.trophyScoreSub.textContent = 'ما شاء الله يا شروق! جبتِ العلامة الكاملة وحافظة كل تفاصيل محمود عن ظهر قلب 🎯✨';
      } else if (result.score >= 3) {
        if (elements.trophyIcon) elements.trophyIcon.textContent = '🌟';
        elements.trophyScoreTitle.textContent = `النتيجة النهائية: ${arScore} / ${arTotal} (${arPercent}٪) — شطورة وقريبة جداً من العلامة الكاملة! 😍✨`;
        elements.trophyScoreSub.textContent = 'نتيجة حلوة كثير يا شروق! وهلق صرتِ عارفة كل مفضلات محمود ١٠٠٪ 💛';
      } else {
        if (elements.trophyIcon) elements.trophyIcon.textContent = '💝';
        elements.trophyScoreTitle.textContent = `النتيجة النهائية: ${arScore} / ${arTotal} (${arPercent}٪) — أجمل من يشارك بالتحدّي! 🌸💛`;
        elements.trophyScoreSub.textContent = 'الأسئلة كشفتلك كل أسرار ومفضلات محمود.. فيكِ تعدّلي إجاباتكِ أو ترسليها لمحمود! 😉';
      }
    }

    if (elements.summaryColorVal) {
      elements.summaryColorVal.textContent = formatAnswerSummary(state.color, 'الرمادي والأخضر 🩶💚');
    }
    if (elements.summaryFoodVal) {
      elements.summaryFoodVal.textContent = formatAnswerSummary(state.food, 'الشاورما أو المسقعة أو الفت 🌯🍆🍲');
    }
    if (elements.summaryDrinkVal) {
      elements.summaryDrinkVal.textContent = formatAnswerSummary(state.drink, 'النسكافيه والشاي ☕🍵');
    }
    if (elements.summaryOutingVal) {
      elements.summaryOutingVal.textContent = formatAnswerSummary(state.outing, 'طلعات البحر والمطاعم 🌊🍽️');
    }
    if (elements.summaryInterestVal) {
      elements.summaryInterestVal.textContent = formatAnswerSummary(state.interest, 'البرمجة وتطوير الويب 💻🌐');
    }
    if (elements.summaryHappyVal) {
      elements.summaryHappyVal.textContent = state.happy ? `${state.happy.name} ${state.happy.icon || ''}` : '-';
    }
    if (elements.summaryTraitVal) {
      elements.summaryTraitVal.textContent = state.trait ? `${state.trait.name} ${state.trait.icon || ''}` : '-';
    }
    if (elements.summaryGiftVal) {
      elements.summaryGiftVal.textContent = (state.gift && state.gift.trim()) ? state.gift.trim() : 'مفاجأة حلوة على ذوق محمود 🎀';
    }

    if (state.note && state.note.trim().length > 0) {
      elements.summaryNoteBox.style.display = 'block';
      elements.summaryNoteVal.textContent = state.note.trim();
    } else {
      elements.summaryNoteBox.style.display = 'none';
    }
  }

  // ------------------------------------------------------------------
  // توليد رسالة الواتساب النهائية لمحمود 💬
  // ------------------------------------------------------------------
  function generateAppointmentMessage() {
    const result = calculateQuizScore();
    const colorAns = formatAnswerSummary(state.color, 'الرمادي والأخضر 🩶💚');
    const foodAns = formatAnswerSummary(state.food, 'الشاورما أو المسقعة أو الفت 🌯🍆🍲');
    const drinkAns = formatAnswerSummary(state.drink, 'النسكافيه والشاي ☕🍵');
    const outingAns = formatAnswerSummary(state.outing, 'طلعات البحر والمطاعم 🌊🍽️');
    const interestAns = formatAnswerSummary(state.interest, 'البرمجة وتطوير الويب 💻🌐');
    const happyAns = state.happy ? `${state.happy.name} ${state.happy.icon || ''}` : 'غير محدد';
    const traitAns = state.trait ? `${state.trait.name} ${state.trait.icon || ''}` : 'غير محدد';
    const giftText = (state.gift && state.gift.trim().length > 0)
      ? state.gift.trim()
      : 'مفاجأة حلوة على ذوق محمود 🎀';

    let text = `محمود 💛 هذه نتيجتي وإجاباتي في «تحدّي معرفة محمود وأشيائه المفضّلة» (عبر روبوتك الذكي 🤖🏆):\n\n` +
      `🏆 النتيجة النهائية بالتحدّي: ${result.score} من ${result.total} (${result.percent}%)\n\n` +
      `🎯 أولاً: إجاباتي عن مفضّلاتك:\n` +
      `🎨 ألوانك المفضلة: ${colorAns}\n` +
      `🍽️ أكلاتك المفضلة: ${foodAns}\n` +
      `☕ مشروبك المفضل: ${drinkAns}\n` +
      `🌊 طشاتك المفضلة: ${outingAns}\n` +
      `💻 اهتمامك وشغفك الأول: ${interestAns}\n\n` +
      `✨ ثانياً: الأسئلة المميزة عنك:\n` +
      `🥰 أكثر شغلة بتفرّح قلبك: ${happyAns}\n` +
      `💝 أكثر صفة بعشقها بشخصيتك: ${traitAns}\n` +
      `🎁 جائزة التحدّي اللي بطلبها منك: ${giftText}\n`;

    if (state.note && state.note.trim().length > 0) {
      text += `💌 كلمة من قلب شروق: ${state.note.trim()}\n`;
    }

    text += `\nربنا يخليلي إياك يا أحلى باشمهندس بالدنيا 💍💛 — شروق و م. محمود صيام`;
    return text;
  }

  function setupSummaryActions() {
    elements.btnSendWhatsApp.addEventListener('click', () => {
      const msg = generateAppointmentMessage();
      const phone = (APP_CONFIG.whatsappNumber || '').replace(/[^0-9]/g, '');

      if (!phone) {
        copyToClipboard(msg);
        showToast('تم نسخ النتيجة لمشاركتها مع محمود! 💌');
        setTimeout(() => {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        }, 600);
        return;
      }

      showToast('جارِ فتح واتساب لإرسال نتيجتكِ لمحمود 💌');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');
    });

    elements.btnCopyDetails.addEventListener('click', () => {
      const msg = generateAppointmentMessage();
      copyToClipboard(msg);
      showToast(APP_CONFIG.uiTexts.summaryActions.copiedSuccess || 'تم نسخ نتيجة التحدّي وإجاباتكِ بنجاح! 💛');
    });

    elements.btnEditChoices.addEventListener('click', () => {
      goToStep('step-1');
    });

    elements.btnResetApp.addEventListener('click', () => {
      elements.confirmResetModal.classList.add('show');
    });

    elements.btnConfirmReset.addEventListener('click', () => {
      elements.confirmResetModal.classList.remove('show');
      resetAllData();
      goToStep('step-0');
      showToast('تمت إعادة ضبط التحدّي للبدء من جديد 🌸');
    });

    elements.btnCancelReset.addEventListener('click', () => {
      elements.confirmResetModal.classList.remove('show');
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Copy command failed', err);
    }
    document.body.removeChild(textArea);
  }

  // ------------------------------------------------------------------
  // مسار الأسئلة والتنقل والتحقق اللطيف (Wizard Flow & Validation)
  // ------------------------------------------------------------------
  function getCurrentFlow() {
    return [
      'step-1',
      'step-2',
      'step-3',
      'step-4',
      'step-5',
      'step-6',
      'step-7',
      'step-8',
      'step-summary'
    ];
  }

  function normalizeStepId(step) {
    if (step === 0 || step === '0' || step === 'step-0') return 'step-0';
    if (step === 1 || step === '1' || step === 'step-1') return 'step-1';
    if (step === 2 || step === '2' || step === 'step-2') return 'step-2';
    if (step === 3 || step === '3' || step === 'step-3') return 'step-3';
    if (step === 4 || step === '4' || step === 'step-4') return 'step-4';
    if (step === 5 || step === '5' || step === 'step-5') return 'step-5';
    if (step === 6 || step === '6' || step === 'step-6') return 'step-6';
    if (step === 7 || step === '7' || step === 'step-7') return 'step-7';
    if (step === 8 || step === '8' || step === 'step-8') return 'step-8';
    if (step === 'summary' || step === 'step-summary') return 'step-summary';
    return 'step-0';
  }

  function setupNavigationEvents() {
    elements.btnNext.addEventListener('click', () => {
      handleNextStep();
    });

    elements.btnPrev.addEventListener('click', () => {
      handlePrevStep();
    });
  }

  function handleNextStep() {
    clearTimeout(autoNextTimer);
    const currentId = state.currentStepId || 'step-0';
    const alerts = APP_CONFIG.uiTexts.validationAlerts || {};
    const flow = getCurrentFlow();

    if (currentId === 'step-1' && (!state.color || !state.color.isCorrect)) {
      showToast(state.color ? 'اختاري الإجابة الصحيحة أولاً أو اضغطي التلميح السري 💡🎨' : (alerts.step1 || 'اختاري أولاً الألوان المفضلة لمحمود يا شروق 🎨💛'));
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-2' && (!state.food || !state.food.isCorrect)) {
      showToast(state.food ? 'اختاري الأكلة الصحيحة أولاً أو اضغطي التلميح السري 💡🍽️' : (alerts.step2 || 'اختاري الأكلات المفضلة اللي بحبها محمود 🍽️😋'));
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-3' && (!state.drink || !state.drink.isCorrect)) {
      showToast(state.drink ? 'اختاري المشروب الصحيح أولاً أو اضغطي التلميح السري 💡☕' : (alerts.step3 || 'اختاري المشروب المفضل عند محمود ☕🍵'));
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-4' && (!state.outing || !state.outing.isCorrect)) {
      showToast(state.outing ? 'اختاري الطشة الصحيحة أولاً أو اضغطي التلميح السري 💡🌊' : (alerts.step4 || 'اختاري الطشة والأماكن اللي بحبها محمود كثير 🌊🍴'));
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-5' && (!state.interest || !state.interest.isCorrect)) {
      showToast(state.interest ? 'اختاري الاهتمام الصحيح أولاً أو اضغطي التلميح السري 💡💻' : (alerts.step5 || 'اختاري اهتمام وشغف محمود الأول 💻🌐'));
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-6' && !state.happy) {
      showToast(alerts.step6 || 'اختاري الشغلة اللي بتفرّح قلب محمود يا عسل 🥰✨');
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-7' && !state.trait) {
      showToast(alerts.step7 || 'اختاري أكثر صفة بتحبيها في شخصية محمود 💝👑');
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-8') {
      if (!state.gift || !state.gift.trim()) {
        state.gift = 'مفاجأة حلوة على ذوق محمود 🎀';
      }
    }

    const idx = flow.indexOf(currentId);
    if (idx !== -1 && idx < flow.length - 1) {
      goToStep(flow[idx + 1]);
    }
  }

  function handlePrevStep() {
    clearTimeout(autoNextTimer);
    const currentId = state.currentStepId || 'step-0';
    const flow = getCurrentFlow();
    const idx = flow.indexOf(currentId);

    if (idx === 0) {
      goToStep('step-0');
    } else if (idx > 0) {
      goToStep(flow[idx - 1]);
    }
  }

  function goToStep(step) {
    clearTimeout(autoNextTimer);
    const stepId = normalizeStepId(step);
    state.currentStepId = stepId;
    state.currentStep = stepId === 'step-0' ? 0 : stepId;
    saveDraftToStorage();

    const ALL_STEPS = [
      'step-0',
      'step-1',
      'step-2',
      'step-3',
      'step-4',
      'step-5',
      'step-6',
      'step-7',
      'step-8',
      'step-summary'
    ];
    ALL_STEPS.forEach(id => {
      const container = document.getElementById(id);
      if (container) container.style.display = 'none';
    });

    const activeContainer = document.getElementById(stepId);
    if (activeContainer) {
      activeContainer.style.display = 'block';
    }

    if (stepId !== 'step-0') {
      resetNoButtonPosition();
    }

    if (stepId === 'step-0') {
      elements.progressSection.style.display = 'none';
      elements.navigationBar.style.display = 'none';
    } else if (stepId === 'step-summary') {
      elements.progressSection.style.display = 'none';
      elements.navigationBar.style.display = 'none';
      renderSummaryStep();
      launchConfetti();
    } else {
      elements.progressSection.style.display = 'block';
      elements.navigationBar.style.display = 'flex';
      updateProgressUI(stepId);
      if (elements.btnNextText) {
        elements.btnNextText.textContent = stepId === 'step-8' ? 'اعرض نتيجتي النهائية 🏆←' : 'السؤال التالي ←';
      }
    }

    switch (stepId) {
      case 'step-1': renderStep1Colors(); break;
      case 'step-2': renderStep2Foods(); break;
      case 'step-3': renderStep3Drinks(); break;
      case 'step-4': renderStep4Outings(); break;
      case 'step-5': renderStep5Interests(); break;
      case 'step-6': renderStep6Happy(); break;
      case 'step-7': renderStep7Trait(); break;
      case 'step-8': renderStep8Gift(); break;
      case 'step-summary': renderSummaryStep(); break;
    }

    triggerRobotStepMessage(stepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgressUI(stepId) {
    const flow = getCurrentFlow();
    const planningFlow = flow.slice(0, flow.length - 1);
    const totalSteps = planningFlow.length;
    const currentIndex = planningFlow.indexOf(stepId);
    const stepNumber = currentIndex !== -1 ? currentIndex + 1 : 1;

    const stepTitlesMap = {
      'step-1': 'الألوان المفضلة لمحمود 🎨',
      'step-2': 'الأكلات المفضلة لمحمود 🍽️',
      'step-3': 'المشروب المفضل لمحمود ☕',
      'step-4': 'الطشات المفضلة لمحمود 🌊',
      'step-5': 'اهتمامات محمود وشغفه 💻',
      'step-6': 'أكثر شغلة بتفرّح محمود 🥰',
      'step-7': 'أكثر صفة بتميز محمود 💝',
      'step-8': 'جائزة التحدّي وكلمتكِ 🎁'
    };

    elements.progressStepName.textContent = stepTitlesMap[stepId] || '';
    elements.progressCounter.textContent = `السؤال ${toArabicNumerals(stepNumber)} من ${toArabicNumerals(totalSteps)}`;

    const percent = Math.round((stepNumber / totalSteps) * 100);
    elements.progressBarFill.style.width = `${percent}%`;

    const stepPillsContainer = document.getElementById('stepPills');
    if (stepPillsContainer) {
      stepPillsContainer.innerHTML = '';
      for (let i = 0; i < totalSteps; i++) {
        const pill = document.createElement('div');
        pill.className = 'step-pill';
        if (i === currentIndex) {
          pill.classList.add('active');
        } else if (i < currentIndex) {
          pill.classList.add('completed');
        }
        stepPillsContainer.appendChild(pill);
      }
    }
  }

  function shakeCurrentStep() {
    const active = document.getElementById(state.currentStepId || 'step-0');
    if (active && active.animate) {
      active.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' }
      ], {
        duration: 400,
        easing: 'ease-in-out'
      });
    }
  }

  function resetNoButtonPosition() {
    const btnNo = elements.btnNo;
    if (!btnNo) return;
    noBtnOffset = { x: 0, y: 0 };
    btnNo.classList.remove('escaped');
    btnNo.style.position = '';
    btnNo.style.left = '';
    btnNo.style.top = '';
    btnNo.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
    if (elements.dodgeSpeechBubble) {
      elements.dodgeSpeechBubble.classList.remove('show');
    }
  }

  // ------------------------------------------------------------------
  // إدارة التخزين المحلي (LocalStorage Draft Persistence)
  // ------------------------------------------------------------------
  function saveDraftToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function loadDraftFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          state = Object.assign(state, parsed);
          if (state.currentStepId && state.currentStepId !== 'step-0') {
            goToStep(state.currentStepId);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage parse error:', e);
    }
    goToStep('step-0');
  }

  function resetAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    state = {
      currentStep: 0,
      currentStepId: 'step-0',
      color: null,
      food: null,
      drink: null,
      outing: null,
      interest: null,
      happy: null,
      trait: null,
      gift: '',
      note: ''
    };
    dodgeCount = 0;
    document.querySelectorAll('.quiz-hint-text').forEach(el => {
      el.style.display = 'none';
    });
    resetNoButtonPosition();
  }

  // ------------------------------------------------------------------
  // إشعار التنبيه اللطيف والمؤثرات البصرية الاحتفالية
  // ------------------------------------------------------------------
  function showToast(message) {
    if (!elements.sweetToast) return;
    elements.sweetToast.textContent = message;
    elements.sweetToast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      elements.sweetToast.classList.remove('show');
    }, 3200);
  }

  function createBackgroundParticles() {
    const container = elements.particlesContainer;
    if (!container) return;

    const symbols = ['✨', '💛', '🎯', '💻', '🌊', '☕', '🌸'];
    const count = 16;

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'floating-heart';
      span.textContent = symbols[i % symbols.length];
      span.style.left = `${Math.random() * 100}%`;
      span.style.fontSize = `${14 + Math.random() * 12}px`;
      span.style.animationDuration = `${12 + Math.random() * 14}s`;
      span.style.animationDelay = `${Math.random() * 8}s`;
      container.appendChild(span);
    }
  }

  function launchConfetti() {
    const container = elements.confettiContainer;
    if (!container) return;

    const symbols = ['🎉', '🏆', '💛', '✨', '🎯', '🌸', '👑'];
    const pieces = 28;

    for (let i = 0; i < pieces; i++) {
      const piece = document.createElement('span');
      piece.className = 'floating-heart';
      piece.textContent = symbols[i % symbols.length];
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.fontSize = `${18 + Math.random() * 14}px`;
      piece.style.animationDuration = `${2.2 + Math.random() * 1.8}s`;
      piece.style.animationDelay = `${Math.random() * 0.4}s`;

      container.appendChild(piece);
      setTimeout(() => {
        piece.remove();
      }, 4200);
    }
  }

  function launchFloatingHeartsBurst() {
    const container = elements.confettiContainer;
    if (!container) return;

    const hearts = ['💛', '🎯', '✨', '😍', '🌸', '💻'];
    for (let i = 0; i < 14; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = hearts[i % hearts.length];
      heart.style.left = `${20 + Math.random() * 60}%`;
      heart.style.fontSize = `${18 + Math.random() * 14}px`;
      heart.style.animationDuration = `${1.8 + Math.random() * 1.2}s`;
      container.appendChild(heart);
      setTimeout(() => heart.remove(), 3000);
    }
  }

  function toArabicNumerals(num) {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, d => arabicDigits[parseInt(d, 10)]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

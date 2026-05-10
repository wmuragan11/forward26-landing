/* ============================================
   FORWARD'26 — JS (без библиотек)
   ============================================ */

/* ---------- Данные (генерация контента, чтобы избежать дублирования в мобильной/десктопной вёрстке) ---------- */

const MENTORS = [
  { initials: 'АК', name: 'Анна Кулешова', role: 'Senior Frontend, Яндекс', topic: 'CSS-архитектура и дизайн-системы', tone: '#d6ff4b' },
  { initials: 'ДМ', name: 'Дмитрий Морозов', role: 'Tech Lead, Авито',         topic: 'Производительность лендингов',   tone: '#ff5b3a' },
  { initials: 'ЕВ', name: 'Елена Воронина', role: 'Frontend, Lamoda',          topic: 'Анимации и микро-взаимодействия',tone: '#9bb1ff' },
  { initials: 'ИС', name: 'Игорь Соловьёв', role: 'Independent, ex-Тинькофф',  topic: 'Pixel-perfect и работа с Figma', tone: '#ffd34a' },
  { initials: 'МР', name: 'Мария Радченко', role: 'Lead Designer-Dev',         topic: 'Связка дизайн ↔ код',            tone: '#c0ffae' },
  { initials: 'ПЛ', name: 'Павел Лесков',   role: 'Frontend, Студия 42',       topic: 'JavaScript: квизы и игры',       tone: '#ffaad8' },
  { initials: 'СВ', name: 'Сергей Волков',  role: 'AI-Engineer & Dev',         topic: 'Cursor, Claude и AI-workflow',   tone: '#9aeaff' },
  { initials: 'ОН', name: 'Ольга Нестерова',role: 'Email-разработчик',         topic: 'Сложные HTML-рассылки',          tone: '#e0c8ff' },
];

const STAGES = [
  {
    num: '01', week: 'Неделя 1–2',
    title: 'Современный CSS',
    desc: 'Grid, контейнерные запросы, subgrid, OKLCH, view-transitions. Как писать CSS, который не превращается в свалку через полгода.',
    skills: ['Grid', 'Container Queries', 'OKLCH', 'View Transitions', 'CSS Custom Props']
  },
  {
    num: '02', week: 'Неделя 3–4',
    title: 'Pixel-perfect и адаптив',
    desc: 'Чтение макета в Figma, поведение типографики между брейкпойнтами, fluid-сетки, нюансы экспорта ассетов.',
    skills: ['Figma Dev Mode', 'Fluid Type', 'CSS clamp()', 'Mobile-first', 'Pixel Perfect']
  },
  {
    num: '03', week: 'Неделя 5–6',
    title: 'JS-интерактив',
    desc: 'Табы, аккордеоны, кастомные слайдеры, валидация форм, простые игры и квизы — всё на чистом JS, без зависимостей.',
    skills: ['Vanilla JS', 'Carousel', 'Quiz', 'IntersectionObserver', 'Web Animations API']
  },
  {
    num: '04', week: 'Неделя 7–8',
    title: 'Анимации',
    desc: 'CSS keyframes, GSAP с ScrollTrigger, Lottie, кейсы из реальной коммерческой практики. Учимся не «душить» производительность.',
    skills: ['CSS Animations', 'GSAP', 'ScrollTrigger', 'Lottie', 'will-change']
  },
  {
    num: '05', week: 'Неделя 9–10',
    title: 'AI-driven workflow',
    desc: 'Claude, Cursor, GPT в реальной работе верстальщика. Промптинг, проверка кода, генерация бэкенд-частей под лендинг.',
    skills: ['Claude', 'Cursor', 'GPT-4', 'Промптинг', 'AI-driven debug']
  },
  {
    num: '06', week: 'Неделя 11–12',
    title: 'Финальный проект',
    desc: 'Сборка собственного коммерческого лендинга с нуля: бриф → макет → вёрстка → анимации → деплой → защита.',
    skills: ['Project', 'Deploy', 'Vercel', 'Защита', 'Портфолио']
  },
];

/* ============================================
   1. КАРУСЕЛЬ МЕНТОРОВ (автоматическая, зацикленная)
   Используем infinite CSS-marquee + дублирование DOM,
   чтобы получить бесшовную бесконечную ленту.
   Раз в 4 секунды — синхронный «тик» с подсветкой следующей карточки
   (требование ТЗ — менять автоматически каждые 4 секунды).
   ============================================ */
const mentorsTrack = document.getElementById('mentorsTrack');

function renderMentors() {
  // Создаём слайды дважды — для бесшовного зацикленного скролла
  const html = MENTORS.map(m => mentorCardHTML(m)).join('');
  mentorsTrack.innerHTML = html + html;
}

function mentorCardHTML(m) {
  return `
    <li class="m-card">
      <div class="m-card__avatar" style="background:${m.tone}">${m.initials}</div>
      <div class="m-card__body">
        <h3 class="m-card__name">${m.name}</h3>
        <p class="m-card__role">${m.role}</p>
        <p class="m-card__topic"><b>Тема:</b> ${m.topic}</p>
      </div>
    </li>
  `;
}

renderMentors();

// Дополнительный «тик» каждые 4 секунды для подсветки активной карточки.
// Сама лента крутится плавно через CSS-анимацию, без рывков.
let activeMentor = 0;
function tickMentors() {
  const cards = mentorsTrack.querySelectorAll('.m-card');
  cards.forEach(c => c.classList.remove('is-spotlight'));
  if (cards[activeMentor]) cards[activeMentor].classList.add('is-spotlight');
  activeMentor = (activeMentor + 1) % MENTORS.length;
}
tickMentors();
setInterval(tickMentors, 4000);

/* ============================================
   2. КАРУСЕЛЬ ЭТАПОВ (ручная, без зацикливания, без автоплея)
   ============================================ */
const stagesTrack = document.getElementById('stagesTrack');
const stagesPrev  = document.getElementById('stagesPrev');
const stagesNext  = document.getElementById('stagesNext');
const stagesProgress = document.getElementById('stagesProgress');

function renderStages() {
  stagesTrack.innerHTML = STAGES.map(stageCardHTML).join('');
  stagesProgress.innerHTML = STAGES.map(() => '<span></span>').join('');
}

function stageCardHTML(s) {
  return `
    <li class="s-card" aria-roledescription="slide">
      <div class="s-card__head">
        <span class="s-card__num">${s.num}</span>
        <span class="s-card__week">${s.week}</span>
      </div>
      <div class="s-card__body">
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <ul class="s-card__skills">
          ${s.skills.map(sk => `<li>${sk}</li>`).join('')}
        </ul>
      </div>
    </li>
  `;
}

renderStages();

let stageIdx = 0;
function updateStages() {
  stagesTrack.style.transform = `translate3d(${-stageIdx * 100}%, 0, 0)`;

  // Прогресс
  const dots = stagesProgress.querySelectorAll('span');
  dots.forEach((d, i) => {
    d.classList.toggle('is-active', i === stageIdx);
    d.classList.toggle('is-passed', i < stageIdx);
  });

  // Кнопки (не зацикленная карусель — упираемся в края)
  stagesPrev.disabled = stageIdx === 0;
  stagesNext.disabled = stageIdx === STAGES.length - 1;
}
updateStages();

stagesPrev.addEventListener('click', () => {
  if (stageIdx > 0) { stageIdx--; updateStages(); }
});
stagesNext.addEventListener('click', () => {
  if (stageIdx < STAGES.length - 1) { stageIdx++; updateStages(); }
});

// Свайп на тачах
let touchStartX = 0;
let touchDeltaX = 0;
stagesTrack.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
stagesTrack.addEventListener('touchmove', e => {
  touchDeltaX = e.touches[0].clientX - touchStartX;
}, { passive: true });
stagesTrack.addEventListener('touchend', () => {
  if (Math.abs(touchDeltaX) > 50) {
    if (touchDeltaX < 0 && stageIdx < STAGES.length - 1) stageIdx++;
    else if (touchDeltaX > 0 && stageIdx > 0) stageIdx--;
    updateStages();
  }
  touchDeltaX = 0;
});

// Стрелки клавиатуры
document.addEventListener('keydown', e => {
  // Слушаем только если фокус не в форме
  if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (e.key === 'ArrowLeft' && stageIdx > 0) { stageIdx--; updateStages(); }
  if (e.key === 'ArrowRight' && stageIdx < STAGES.length - 1) { stageIdx++; updateStages(); }
});

/* ============================================
   3. ПЛАВНЫЙ ЯКОРНЫЙ СКРОЛЛ С УЧЁТОМ ШАПКИ
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.length <= 1) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerH = document.querySelector('.header').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================
   4. ОТКРЫТИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
   ============================================ */
const revealTargets = document.querySelectorAll('.section-head, .feature, .about__text, .stat, .m-carousel, .s-carousel, .form');
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

revealTargets.forEach(el => io.observe(el));

/* ============================================
   5. ФОРМА — простая клиентская валидация
   ============================================ */
const form = document.getElementById('signupForm');
const note = document.getElementById('formNote');

form.addEventListener('submit', e => {
  e.preventDefault();
  note.classList.remove('is-success', 'is-error');
  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();

  if (!name) { setFormNote('Укажите имя', 'error'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFormNote('Проверьте email — кажется, в нём опечатка', 'error');
    return;
  }

  setFormNote('Заявка отправлена. Свяжемся в течение суток.', 'success');
  form.reset();
});

function setFormNote(text, type) {
  note.textContent = text;
  note.classList.remove('is-success', 'is-error');
  if (type) note.classList.add('is-' + type);
}

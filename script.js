// Дата и время начала свадебного дня.
const WEDDING_DATE = new Date('2026-08-07T16:00:00+03:00');

const els = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
  countTitle: document.querySelector('.count-title'),
};

function declension(number, words) {
  const n = Math.abs(number) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return words[2];
  if (n1 > 1 && n1 < 5) return words[1];
  if (n1 === 1) return words[0];
  return words[2];
}

function updateCountdown() {
  const now = new Date();
  const weddingHasStarted = now >= WEDDING_DATE;
  let diff = Math.max(0, WEDDING_DATE - now);
  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);
  diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);

  els.days.textContent = days;
  els.hours.textContent = String(hours).padStart(2, '0');
  els.minutes.textContent = String(minutes).padStart(2, '0');
  els.seconds.textContent = String(seconds).padStart(2, '0');

  els.days.nextElementSibling.textContent = declension(days, ['день', 'дня', 'дней']);
  els.hours.nextElementSibling.textContent = declension(hours, ['час', 'часа', 'часов']);
  els.minutes.nextElementSibling.textContent = declension(minutes, ['минута', 'минуты', 'минут']);
  els.seconds.nextElementSibling.textContent = declension(seconds, ['секунда', 'секунды', 'секунд']);

  if (weddingHasStarted) {
    els.countTitle.textContent = 'Наш особенный день наступил!';
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

const rsvpCard = document.querySelector('.rsvp-card');
const rsvpTriggers = document.querySelectorAll('.rsvp-open, .rsvp-nav');
const rsvpClose = document.querySelector('.rsvp-close');
let lastRsvpTrigger = null;

function openRsvp(trigger) {
  lastRsvpTrigger = trigger;
  rsvpCard.hidden = false;
  rsvpCard.classList.add('is-open');
  rsvpTriggers.forEach((button) => button.setAttribute('aria-expanded', 'true'));
  requestAnimationFrame(() => {
    rsvpCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    rsvpCard.focus({ preventScroll: true });
  });
}

function closeRsvp() {
  rsvpCard.classList.remove('is-open');
  rsvpCard.hidden = true;
  rsvpTriggers.forEach((button) => button.setAttribute('aria-expanded', 'false'));
  lastRsvpTrigger?.focus({ preventScroll: true });
}

rsvpTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => openRsvp(trigger));
});
rsvpClose.addEventListener('click', closeRsvp);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !rsvpCard.hidden) closeRsvp();
});

const inspirationToggle = document.querySelector('.inspiration-toggle');
const inspirationPanel = document.getElementById('dress-inspiration');
const inspirationLabel = document.querySelector('.inspiration-label');

inspirationToggle.addEventListener('click', () => {
  const willOpen = inspirationPanel.hidden;
  inspirationPanel.hidden = !willOpen;
  inspirationToggle.setAttribute('aria-expanded', String(willOpen));
  inspirationLabel.textContent = willOpen ? 'Скрыть идеи образов' : 'Показать идеи образов';
  if (willOpen) inspirationPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

const navItems = [...document.querySelectorAll('.quick-nav__item[data-target]')];
const navTargets = navItems
  .map((item) => ({ item, target: document.getElementById(item.dataset.target) }))
  .filter(({ target }) => target);
let navUpdateQueued = false;

function updateActiveNavigation() {
  navUpdateQueued = false;
  const marker = window.scrollY + window.innerHeight * 0.38;
  let current = navTargets[0];

  navTargets.forEach((entry) => {
    const targetTop = entry.target.getBoundingClientRect().top + window.scrollY;
    if (targetTop <= marker) current = entry;
  });

  navItems.forEach((item) => {
    const isCurrent = item === current.item;
    item.classList.toggle('is-active', isCurrent);
    if (isCurrent) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

window.addEventListener('scroll', () => {
  if (navUpdateQueued) return;
  navUpdateQueued = true;
  requestAnimationFrame(updateActiveNavigation);
}, { passive: true });
window.addEventListener('resize', updateActiveNavigation);
updateActiveNavigation();

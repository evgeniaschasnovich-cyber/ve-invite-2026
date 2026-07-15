// Дата и время начала свадебного дня.
const WEDDING_DATE = new Date('2026-08-07T16:00:00+03:00');

// Замените на реальный email для подтверждений.
const RSVP_EMAIL = 'your-email@example.com';

const els = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
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
}

updateCountdown();
setInterval(updateCountdown, 1000);

const rsvpCard = document.querySelector('.rsvp-card');
document.querySelector('.rsvp-open').addEventListener('click', () => {
  rsvpCard.classList.add('is-open');
  rsvpCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
document.querySelector('.rsvp-close').addEventListener('click', () => {
  rsvpCard.classList.remove('is-open');
});

document.getElementById('rsvpForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent('Подтверждение присутствия на свадьбе');
  const body = encodeURIComponent(
    `Имя: ${data.get('name')}\n` +
    `Ответ: ${data.get('answer')}\n` +
    `Комментарий: ${data.get('comment') || '—'}`
  );
  window.location.href = `mailto:${RSVP_EMAIL}?subject=${subject}&body=${body}`;
});

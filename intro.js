const LETTERS = ['V','I','S','I','O','N'];

function shake() {
  document.body.style.transform = `translate(${(Math.random()-0.5)*18}px, ${(Math.random()-0.5)*18}px)`;
  setTimeout(() => document.body.style.transform = '', 120);
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fadeIn(el, ms = 600) {
  el.style.opacity = 0;
  el.style.transition = `opacity ${ms}ms ease`;
  el.style.display = '';
  await wait(30);
  el.style.opacity = 1;
  await wait(ms);
}

async function fadeOut(el, ms = 500) {
  el.style.transition = `opacity ${ms}ms ease`;
  el.style.opacity = 0;
  await wait(ms);
  el.style.display = 'none';
}

export async function runIntro() {
  const screen = document.getElementById('intro-screen');
  const uup = document.getElementById('intro-uup');
  const presents = document.getElementById('intro-presents');
  const visionWrap = document.getElementById('intro-vision');
  const learningEl = document.getElementById('intro-learning');

  // Step 1: UUP
  await fadeIn(uup);
  await wait(1400);
  await fadeOut(uup);

  // Step 2: presents
  await fadeIn(presents);
  await wait(1600);
  await fadeOut(presents);

  // Step 3: VISION letter by letter
  visionWrap.style.display = 'flex';
  visionWrap.style.opacity = 1;

  for (let i = 0; i < LETTERS.length; i++) {
    const span = document.createElement('span');
    span.className = 'vision-letter';
    span.textContent = LETTERS[i];
    span.style.opacity = 0;
    span.style.transform = 'scale(2.5) translateY(-30px)';
    span.style.transition = 'opacity 0.15s, transform 0.2s cubic-bezier(.17,.67,.3,1.5)';
    visionWrap.appendChild(span);

    await wait(30);
    span.style.opacity = 1;
    span.style.transform = 'scale(1) translateY(0)';
    shake();
    await wait(180);
  }

  // Step 4: Learning
  await wait(300);
  await fadeIn(learningEl, 400);
  await wait(1200);

  // Step 5: Fade whole screen then redirect
  await fadeOut(screen, 700);
  window.location.href = 'main.html';
}

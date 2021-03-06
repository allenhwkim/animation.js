
function setOptions() {
  const durationEl = document.querySelector('.selection .duration-ms select');
  [1000, 250, 500, 2000, 3000, 5000].forEach((key) => {
    durationEl.insertAdjacentHTML('beforeend',
        `<option value="${key}">${key}</option>`);
  });
  durationEl.size = 6;

  const timingsEl = document.querySelector('.selection .timing select');
  for (var key in Animation.timingFunctions) {
    timingsEl.insertAdjacentHTML('beforeend',
        `<option value="${key}">${key}</option>`);
  }
  timingsEl.size = Object.keys(Animation.timingFunctions).length; ;

  const drawEl = document.querySelector('.selection .draw select');
  for (var key in Animation.drawFunctions) {
    drawEl.insertAdjacentHTML('beforeend',
        `<option value="${key}">${key}</option>`);
  }
  drawEl.size = Object.keys(Animation.drawFunctions).length; ;
}

var timer;
function run(key) {
  const el = document.querySelector('.target');
  const durationEl = document.querySelector('.selection .duration-ms select');
  const timingsEl = document.querySelector('.selection .timing select');
  const drawEl = document.querySelector('.selection .draw select');
  const drawFn = Animation.drawFunctions[drawEl.value].bind(el);
  Animation.DURATION = parseInt(durationEl.value);
  Animation.TIMING = Animation.timingFunctions[timingsEl.value];
  document.querySelectorAll('.draw-fn').forEach((el) => el.innerHTML = drawEl.value);
  document.querySelector('.timing-fn').innerHTML = timingsEl.value;
  document.querySelector('.duration').innerHTML = durationEl.value;

  clearTimeout(timer);
  el.removeAttribute('style');
  animate(Animation.DURATION, Animation.TIMING, drawFn)
    .then(function() {
      timer = setTimeout((_) => el.removeAttribute('style'), 1000);
    });
}

function start() {
  const ballEl = document.querySelector('.ball');
  const targetEl = document.querySelector('.target');
  const explosionEl = document.querySelector('.explosion');
  targetEl.style.display = 'none';
  animate(1500, Animation.timingFunctions.bounceEaseOut, (timing, pct) => {
    ballEl.style.transform = `translateY(${timing * 200 - 150}px) rotate(${pct*300}deg)`;
    ballEl.style.left = `${pct*50}%`;
  }).then(_ => animate(3000, Animation.timingFunctions.easeOut, (timing, pct) => {
      ballEl.style.transform = `translateY(50px) rotate(${pct*300}deg)`;
      ballEl.style.left = `${50 + timing*50}%`;
    })
  ).then(_ => animate(300, Animation.timingFunctions.outExpo, timing => {
      ballEl.style.display = 'none';
      explosionEl.style.width = `${timing*600}px`;
      explosionEl.style.top = `-${timing*250}px`;
      explosionEl.style.right = `-${timing*250}px`;
    })
  ).then(_ => animate(1000, Animation.timingFunctions.inExpo, timing => {
      explosionEl.style.opacity = Math.max(0, 1 - timing*5);
      targetEl.style.display = '';
      targetEl.style.transform = `translateX(${100 - timing*100}%)`;
      targetEl.style.opacity = timing;
    })
  ).then( _ => {
    explosionEl.style.display = 'none';
  });
}

setOptions();
start();


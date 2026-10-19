/* Instagram carousel viewer — swipe / arrows / dots / keyboard. Self-contained, guarded. */
(function () {
  var stage = document.getElementById('cstage');
  var track = document.getElementById('ctrack');
  var dotsWrap = document.getElementById('cdots');
  var cur = document.getElementById('ccur');
  var prev = document.getElementById('cprev');
  var next = document.getElementById('cnext');
  if (!stage || !track) return;

  var slides = track.children.length;
  var i = 0;

  // build dots
  var dots = [];
  if (dotsWrap) {
    for (var d = 0; d < slides; d++) {
      var b = document.createElement('button');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Go to slide ' + (d + 1));
      (function (idx) { b.addEventListener('click', function () { go(idx); }); })(d);
      dotsWrap.appendChild(b);
      dots.push(b);
    }
  }

  function render(anim) {
    if (!anim) track.classList.add('no-anim');
    track.style.transform = 'translateX(' + (-i * 100) + '%)';
    if (!anim) requestAnimationFrame(function () { track.classList.remove('no-anim'); });
    if (cur) cur.textContent = String(i + 1);
    for (var k = 0; k < dots.length; k++) dots[k].classList.toggle('is-on', k === i);
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides - 1;
  }

  function go(n) { i = Math.max(0, Math.min(slides - 1, n)); render(true); }

  if (prev) prev.addEventListener('click', function () { go(i - 1); });
  if (next) next.addEventListener('click', function () { go(i + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') go(i - 1);
    else if (e.key === 'ArrowRight') go(i + 1);
  });

  // pointer swipe with drag-follow
  var dragging = false, startX = 0, dx = 0, w = 0;
  stage.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.cnav')) return;
    dragging = true; startX = e.clientX; dx = 0; w = stage.clientWidth;
    track.classList.add('no-anim');
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    dx = e.clientX - startX;
    // resistance at the ends
    if ((i === 0 && dx > 0) || (i === slides - 1 && dx < 0)) dx *= 0.32;
    track.style.transform = 'translateX(' + (-i * 100 + (dx / w) * 100) + '%)';
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('no-anim');
    var threshold = w * 0.16;
    if (dx <= -threshold) go(i + 1);
    else if (dx >= threshold) go(i - 1);
    else render(true);
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  render(false);
})();

// Enlarged image view for case study pages.
(function () {
  var dialog = document.querySelector('.lightbox');
  if (!dialog) return;
  var img = dialog.querySelector('.lightbox-img');
  var count = dialog.querySelector('.lb-count');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.shot-btn'));
  var current = 0;
  var opener = null;

  function show(i) {
    current = (i + buttons.length) % buttons.length;
    var src = buttons[current].querySelector('img');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    count.textContent = (current + 1) + ' / ' + buttons.length;
  }

  function open(i) {
    opener = buttons[i];
    show(i);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('lb-open');
    dialog.querySelector('.lb-close').focus();
  }

  function close() {
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  dialog.addEventListener('close', function () {
    document.body.classList.remove('lb-open');
    img.removeAttribute('src');
    if (opener) opener.focus();
  });

  buttons.forEach(function (b, i) {
    b.addEventListener('click', function () { open(i); });
  });

  dialog.querySelector('.lb-close').addEventListener('click', close);
  dialog.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  dialog.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });

  // Clicking/tapping the dark area around the image closes the view.
  dialog.addEventListener('click', function (ev) {
    if (ev.target === dialog) close();
  });

  document.addEventListener('keydown', function (ev) {
    if (!dialog.open) return;
    if (ev.key === 'ArrowRight') show(current + 1);
    else if (ev.key === 'ArrowLeft') show(current - 1);
    else if (ev.key === 'Escape' && !dialog.showModal) close();
  });

  // Swipe left/right on touch screens.
  var startX = null;
  dialog.addEventListener('touchstart', function (ev) { startX = ev.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', function (ev) {
    if (startX === null) return;
    var dx = ev.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();

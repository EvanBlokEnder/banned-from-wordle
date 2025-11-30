// content.js
(function() {
  // Prevent double injection
  if (window.__wordleBanPrankInjected) return;
  window.__wordleBanPrankInjected = true;

  // Create overlay that covers the entire page
  const overlay = document.createElement('div');
  overlay.id = 'wordle-ban-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '2147483647', // very high
    background: 'rgba(0,0,0,0.85)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto' // this div captures all clicks
  });

  // Make the underlying page unscrollable while overlay is present
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  // Modal box inside overlay
  const box = document.createElement('div');
  Object.assign(box.style, {
    maxWidth: '780px',
    width: '90%',
    padding: '34px',
    textAlign: 'center',
    borderRadius: '12px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
    boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
    pointerEvents: 'none' // prevents inner elements from receiving pointer events so the whole overlay remains unclickable
  });

  // Allow pointer events on the message text only for accessibility (but no buttons)
  box.style.pointerEvents = 'auto';

  const title = document.createElement('h1');
  title.textContent = "🚫 You're banned from Wordle";
  Object.assign(title.style, {
    margin: '0 0 12px 0',
    fontSize: '32px',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontWeight: '700'
  });

  const msg = document.createElement('p');
  msg.textContent = "Sorry — access to Wordle has been suspended for your account. Please contact the administration.";
  Object.assign(msg.style, {
    margin: '8px 0 20px 0',
    fontSize: '18px',
    lineHeight: '1.4',
    opacity: '0.95'
  });

  const small = document.createElement('p');
  small.textContent = "This is a joke. To remove the overlay press Ctrl+Shift+X.";
  Object.assign(small.style, {
    marginTop: '10px',
    fontSize: '13px',
    color: '#ddd',
    opacity: '0.9'
  });

  // Add a playful footer
  const footer = document.createElement('div');
  footer.textContent = "— Your friendly neighborhood prankster";
  Object.assign(footer.style, {
    marginTop: '18px',
    fontSize: '12px',
    color: '#bbb'
  });

  box.appendChild(title);
  box.appendChild(msg);
  box.appendChild(small);
  box.appendChild(footer);
  overlay.appendChild(box);

  // Capture clicks on overlay so clicks DO NOT reach page elements
  overlay.addEventListener('click', function (e) {
    // stop propagation and prevent default so background clicks are blocked
    e.stopPropagation();
    e.preventDefault();
    // small visual feedback: flash the message slightly
    box.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.995)' }, { transform: 'scale(1)' }], { duration: 180 });
  }, true);

  // Add to DOM
  document.documentElement.appendChild(overlay);

  // Keyboard shortcut to remove the overlay: Ctrl+Shift+X
  function removeOverlay() {
    if (!overlay) return;
    overlay.remove();
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    window.__wordleBanPrankInjected = false;
    window.removeEventListener('keydown', keyHandler, true);
  }

  function keyHandler(e) {
    const ctrl = e.ctrlKey || e.metaKey; // allow Cmd on Mac if someone wants to use it
    if (ctrl && e.shiftKey && (e.code === 'KeyX' || e.key.toLowerCase() === 'x')) {
      removeOverlay();
    }
  }

  window.addEventListener('keydown', keyHandler, true);

  // Defensive: if the page navigates (single-page app), re-inject if removed accidentally
  // (Not strictly necessary for Wordle page, but harmless)
  const observer = new MutationObserver(() => {
    if (!document.body.contains(overlay) && window.__wordleBanPrankInjected) {
      // re-attach overlay
      document.documentElement.appendChild(overlay);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Cleanup when the page is unloaded
  window.addEventListener('beforeunload', function () {
    try {
      observer.disconnect();
    } catch (err) {}
  });
})();


(function() {
  
  if (window.__wordleBanPrankInjected) return;
  window.__wordleBanPrankInjected = true;


  const overlay = document.createElement('div');
  overlay.id = 'wordle-ban-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '2147483647',
    background: 'rgba(0,0,0,0.85)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto' 
  });

  
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  
  const box = document.createElement('div');
  Object.assign(box.style, {
    maxWidth: '780px',
    width: '90%',
    padding: '34px',
    textAlign: 'center',
    borderRadius: '12px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
    boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
    pointerEvents: 'none' // 
  });

  
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

 
  overlay.addEventListener('click', function (e) {
    
    e.stopPropagation();
    e.preventDefault();
   
    box.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.995)' }, { transform: 'scale(1)' }], { duration: 180 });
  }, true);

 
  document.documentElement.appendChild(overlay);

 
  function removeOverlay() {
    if (!overlay) return;
    overlay.remove();
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    window.__wordleBanPrankInjected = false;
    window.removeEventListener('keydown', keyHandler, true);
  }

  function keyHandler(e) {
    const ctrl = e.ctrlKey || e.metaKey; 
    if (ctrl && e.shiftKey && (e.code === 'KeyX' || e.key.toLowerCase() === 'x')) {
      removeOverlay();
    }
  }

  window.addEventListener('keydown', keyHandler, true);

  
  const observer = new MutationObserver(() => {
    if (!document.body.contains(overlay) && window.__wordleBanPrankInjected) {
      
      document.documentElement.appendChild(overlay);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

 
  window.addEventListener('beforeunload', function () {
    try {
      observer.disconnect();
    } catch (err) {}
  });
})();

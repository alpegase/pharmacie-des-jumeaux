/* script.js - handles UI, WhatsApp, auth (localStorage) and export */
(() => {
  const WA_NUMBER = "237651202009"; // without plus for wa.me
  const WA_MESSAGE_DEFAULT = "Bonjour, j'aimerais des renseignements svp.";

  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => Array.from((ctx||document).querySelectorAll(s));

  // footer year
  try { document.getElementById('currentYear').textContent = new Date().getFullYear(); } catch(e){}

  // WhatsApp bubble
  const bubble = $('#whatsappBubble');
  const mini = $('#whatsappMini');
  const miniForm = $('#miniForm');
  const miniInput = $('#miniInput');
  const miniBody = $('#miniBody');
  const whatsappQuick = $('#whatsappQuick');

  function openMini(){ if(mini){ mini.classList.add('show'); mini.style.display='flex'; miniInput && miniInput.focus(); } }
  function closeMini(){ if(mini){ mini.classList.remove('show'); mini.style.display='none'; } }

  bubble && bubble.addEventListener('click', openMini);
  $('#miniClose') && $('#miniClose').addEventListener('click', closeMini);
  whatsappQuick && whatsappQuick.addEventListener('click', (e)=>{ e.preventDefault(); openMini(); });

  // mini-chat submit -> open wa.me
  if (miniForm) {
    miniForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = (miniInput.value||'').trim() || WA_MESSAGE_DEFAULT;
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');
      miniInput.value = '';
    });
  }

  // -----------------------
  // Authentication (localStorage)
  // -----------------------
  // users stored in localStorage under 'pdj_users' as array of {id,fullname,email,passwordHash,createdAt}
  function loadUsers(){ try{ return JSON.parse(localStorage.getItem('pdj_users')||'[]'); }catch(e){ return []; } }
  function saveUsers(arr){ localStorage.setItem('pdj_users', JSON.stringify(arr)); }

  async function sha256str(str){
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hex = Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
    return hex;
  }

  // Registration form
  const registerForm = $('#registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = new FormData(registerForm);
      const fullname = (form.get('fullname')||'').trim();
      const email = (form.get('email')||'').trim().toLowerCase();
      const password = (form.get('password')||'').trim();
      if (!fullname || !email || !password) { alert('Veuillez remplir tous les champs.'); return; }
      const users = loadUsers();
      if (users.find(u=>u.email===email)) { alert('Un compte existe déjà pour cet email.'); return; }
      const passHash = await sha256str(password);
      const user = { id: Date.now(), fullname, email, passwordHash: passHash, createdAt: new Date().toISOString() };
      users.push(user);
      saveUsers(users);
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      registerForm.reset();
    });
  }

  // Login form
  const loginForm = $('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = new FormData(loginForm);
      const email = (form.get('email')||'').trim().toLowerCase();
      const password = (form.get('password')||'').trim();
      if (!email || !password) { alert('Veuillez remplir tous les champs.'); return; }
      const users = loadUsers();
      const passHash = await sha256str(password);
      const user = users.find(u=>u.email===email && u.passwordHash===passHash);
      if (!user) { alert('Identifiants incorrects.'); return; }
      // simulate redirect to OAuth-like flow: here we redirect to index (or can do something else)
      alert('Connexion réussie. Redirection vers la page d'accueil...');
      window.location.href = 'pharmaciedesjumeaux.html';
    });
  }

  // Export users as JSON file (download)
  const exportBtn = $('#exportUsers');
  if (exportBtn) {
    exportBtn.addEventListener('click', (e) => {
      const users = loadUsers();
      const blob = new Blob([JSON.stringify(users, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pdj_users_export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Fichier exporté : pdj_users_export.json');
    });
  }

  // Social buttons: redirect to official auth pages (user can later replace with real OAuth)
  const googleBtn = $('#googleBtn');
  const facebookBtn = $('#facebookBtn');
  if (googleBtn) googleBtn.addEventListener('click', ()=> {
    // redirect to Google sign-in page (user will then sign in)
    window.open('https://accounts.google.com/signin', '_blank', 'noopener');
  });
  if (facebookBtn) facebookBtn.addEventListener('click', ()=> {
    window.open('https://www.facebook.com/login.php', '_blank', 'noopener');
  });

  // Service Worker registration (optional)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }

})();

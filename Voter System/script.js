// Basic site behaviour: language toggle, carousel, tabs, modals, voter search demo

// ------- Language toggle (English <-> Hindi) -------
const langBtn = document.getElementById('lang-btn');
const langs = {
  en: {
    title: "Election Commission of India",
    sub: "Voters' Service Portal — Demo",
    heroTitle: "Welcome to the Election Commission of India",
    heroSub: "Register, search voter list, download e-EPIC and track your application — all in one place.",
    searchTitle: "Search Your Name in Voter List",
    registerNow: "Register Now To Vote",
    searchBtn: "Search Your Name in Voter List",
    langBtn: "हिंदी में देखें",
    loginTitle: "Login",
    signupTitle: "Sign-up"
  },
  hi: {
    title: "भारत निर्वाचन आयोग",
    sub: "मतदाता सेवा पोर्टल — डेमो",
    heroTitle: "भारत निर्वाचन आयोग में आपका स्वागत है",
    heroSub: "रजिस्टर करें, मतदाता सूची खोजें, e-EPIC डाउनलोड करें और आवेदन का ट्रैक रखें।",
    searchTitle: "मतदाता सूची में अपना नाम खोजें",
    registerNow: "रजिस्टर करें (वोट के लिए)",
    searchBtn: "मतदाता सूची खोजें",
    langBtn: "View in English",
    loginTitle: "लॉगिन",
    signupTitle: "साइन-अप"
  }
};
let currentLang = localStorage.getItem('eci_lang') || 'en';
function applyLang() {
  const L = langs[currentLang];
  document.getElementById('site-title').textContent = L.title;
  const sub = document.getElementById('site-sub'); if(sub) sub.textContent = L.sub;
  const heroTitle = document.getElementById('hero-title'); if(heroTitle) heroTitle.textContent = L.heroTitle;
  const heroSub = document.getElementById('hero-sub'); if(heroSub) heroSub.textContent = L.heroSub;
  const searchTitle = document.getElementById('search-title'); if(searchTitle) searchTitle.textContent = L.searchTitle;
  const registerBtns = document.querySelectorAll('.hero-actions .btn.big'); if(registerBtns[0]) registerBtns[0].textContent = L.registerNow;
  const registerBtnsSmall = document.querySelectorAll('.hero-actions .btn.big')[1]; if(registerBtnsSmall) registerBtnsSmall.textContent = L.searchBtn;
  langBtn.textContent = L.langBtn;
  // modal titles
  const loginT = document.getElementById('login-title'); if(loginT) loginT.textContent = L.loginTitle;
  const signupT = document.getElementById('signup-title'); if(signupT) signupT.textContent = L.signupTitle;
  localStorage.setItem('eci_lang', currentLang);
}
langBtn && langBtn.addEventListener('click', ()=>{
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  applyLang();
});
applyLang();

// ------- Carousel (simple) -------
const slides = Array.from(document.querySelectorAll('#carousel .slide'));
let slideIndex = 0;
function showSlide(i){
  slides.forEach(s=>s.classList.remove('active'));
  slides[i].classList.add('active');
}
document.getElementById('next-slide').addEventListener('click', ()=>{
  slideIndex = (slideIndex+1) % slides.length; showSlide(slideIndex);
});
document.getElementById('prev-slide').addEventListener('click', ()=>{
  slideIndex = (slideIndex-1 + slides.length) % slides.length; showSlide(slideIndex);
});
let slideTimer = setInterval(()=>{ slideIndex=(slideIndex+1)%slides.length; showSlide(slideIndex); }, 5000);

// ------- Tabs -------
document.querySelectorAll('.tab-buttons .tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-buttons .tab').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-panels .panel').forEach(p=>p.classList.remove('active'));
    const panel = document.getElementById(tab);
    if(panel) panel.classList.add('active');
  });
});

// ------- Modals (login/signup) -------
function openModal(el){ if(!el) return; el.setAttribute('open',''); el.setAttribute('aria-hidden','false'); }
function closeModal(el){ if(!el) return; el.removeAttribute('open'); el.setAttribute('aria-hidden','true'); }
document.addEventListener('click', e=>{
  if(e.target.id === 'login-open') openModal(document.getElementById('loginModal'));
  if(e.target.id === 'signup-open') openModal(document.getElementById('signupModal'));
  if(e.target.dataset && e.target.dataset.close !== undefined) {
    const m = e.target.closest('.modal'); closeModal(m);
  }
  if(e.target.classList && e.target.classList.contains('modal-close')){
    const m = e.target.closest('.modal'); closeModal(m);
  }
});
// close on backdrop
document.querySelectorAll('.modal').forEach(m=>{
  m.addEventListener('click', e=>{ if(e.target === m) closeModal(m); });
});

// simple localStorage demo for signup/login
const signupForm = document.getElementById('signupForm');
if(signupForm){
  signupForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-pass').value;
    const users = JSON.parse(localStorage.getItem('eci_users') || '[]');
    users.push({name,email,pass});
    localStorage.setItem('eci_users', JSON.stringify(users));
    alert('Account created (demo). You may now login.');
    closeModal(document.getElementById('signupModal'));
  });
}
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const users = JSON.parse(localStorage.getItem('eci_users') || '[]');
    const found = users.find(u => (u.email===user || u.name===user) && u.pass===pass);
    if(found){ alert('Login success (demo). Hello ' + found.name); closeModal(document.getElementById('loginModal')); }
    else alert('Invalid credentials (demo). Please sign-up first.');
  });
}

// ------- Voter search (demo) -------
const vsf = document.getElementById('voter-search-form');
if(vsf){
  vsf.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('search-name').value.trim();
    const state = document.getElementById('search-state').value;
    const result = document.getElementById('search-result');
    if(!name){ result.textContent = 'Please enter a name or EPIC number.'; return; }
    // demo fake search
    result.textContent = 'Searching...';
    setTimeout(()=>{
      // fake: if name contains 'test' show not found; else show found demo
      if(name.toLowerCase().includes('xyz') || name.toLowerCase().includes('test')){
        result.innerHTML = '<strong>No record found.</strong> Please check spelling or try other details.';
      } else {
        result.innerHTML = '<strong>Record found:</strong> <br/> Name: '+name+'<br/> State: '+(state||'Not selected')+'<br/> EPIC: ABCD1234567';
      }
    }, 800);
  });
  document.getElementById('clear-search').addEventListener('click', ()=>{
    document.getElementById('search-name').value=''; document.getElementById('search-state').value=''; document.getElementById('search-result').textContent='';
  });
}

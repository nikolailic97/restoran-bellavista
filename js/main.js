/* ================================================================
   BELLAVISTA — main.js
   Verzija: 2.0.0

   SADRŽAJ:
   01. GSAP Inicijalizacija & Hero animacije
   02. Parallax efekti (ScrollTrigger)
   03. Scroll reveal za sve sekcije
   04. Navigacija — transparentna → solid
   05. Language toggle (SR / EN)
   06. Menu tabovi (sticky)
   07. Galerija lightbox
   08. Mobilna navigacija
   09. Smooth scroll (anchor links)
   ================================================================ */

/* ================================================================
   01. GSAP — INICIJALIZACIJA
   Pokreće se tek kada se stranica u potpunosti učita (window.load),
   čime se sprečavaju greške sa ScrollTrigger i neučitanim slikama.
   ================================================================ */
function initAnimations() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP nije učitan — sadržaj prikazan bez animacija.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── Postavi početna stanja (GSAP, ne CSS — fallback ostaje vidljiv) ── */
  gsap.set('#hero .rv',   { opacity: 0, y: 45 });
  gsap.set('.hero-scroll',{ opacity: 0 });
  gsap.set('.hero-img',   { scale: 1.16 });

  document.querySelectorAll('.rv').forEach(el => {
    if (!el.closest('#hero')) gsap.set(el, { opacity: 0, y: 30 });
  });

  /* ── Hero: zoom-in na učitavanju ── */
  gsap.to('.hero-img', { scale: 1, duration: 3.0, ease: 'power3.out' });

  /* ── Hero: staggered reveal elemenata ── */
  gsap.to('#hero .rv', {
    opacity: 1, y: 0,
    duration: 1.3, stagger: 0.2,
    ease: 'power3.out', delay: 0.35,
    onComplete() {
      document.querySelectorAll('#hero .rv').forEach(el => {
        el.style.opacity   = '';
        el.style.transform = '';
      });
    }
  });

  /* ── Scroll indikator ── */
  gsap.to('.hero-scroll', { opacity: 1, duration: 1.4, delay: 1.9, ease: 'power2.out' });

  /* ================================================================
     02. PARALLAX EFEKTI
  ================================================================ */
  gsap.to('.hero-img', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
    y: 130, ease: 'none'
  });

  gsap.to('.about-img-col img', {
    scrollTrigger: { trigger: '#o-nama', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    y: -40, ease: 'none'
  });

  /* ================================================================
     03. SCROLL REVEAL — sve sekcije osim hero-a
  ================================================================ */
  document.querySelectorAll('.rv').forEach(el => {
    if (el.closest('#hero')) return;
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      opacity: 1, y: 0, duration: 0.85, ease: 'power2.out'
    });
  });
}

window.addEventListener('load', initAnimations);

/* ================================================================
   04. NAVIGACIJA — transparentna → solid pri skrolovanju
================================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 70);
}, { passive: true });

/* ================================================================
   05. LANGUAGE TOGGLE (SR ↔ EN)
================================================================ */
let currentLang = 'sr';

function toggleLang() {
  currentLang = currentLang === 'sr' ? 'en' : 'sr';
  document.body.classList.toggle('lang-en', currentLang === 'en');
  document.getElementById('langLbl').textContent = currentLang === 'sr' ? 'EN' : 'SR';
  document.documentElement.lang = currentLang;
}
window.toggleLang = toggleLang;

/* ================================================================
   06. MENU TABOVI (sticky)
================================================================ */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.menu-panel');

function openTab(id, idx) {
  tabBtns.forEach(b   => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  tabPanels.forEach(p => p.classList.remove('active'));

  const panel = document.getElementById('p-' + id);
  if (panel) panel.classList.add('active');

  if (tabBtns[idx]) {
    tabBtns[idx].classList.add('active');
    tabBtns[idx].setAttribute('aria-selected', 'true');
    tabBtns[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}
window.openTab = openTab;

/* ================================================================
   07. GALERIJA LIGHTBOX
================================================================ */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');

function openLb(el) {
  const img = el.querySelector('img');
  if (!img) return;
  lbImg.src = img.src.replace(/w=\d+/, 'w=1400').replace(/h=\d+&/, '');
  lbImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lb-close').focus();
}

function closeLb() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lbImg.src = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
window.openLb  = openLb;
window.closeLb = closeLb;

/* ================================================================
   08. MOBILNA NAVIGACIJA
================================================================ */
const mobileNav = document.getElementById('mobileNav');

function openMob() {
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMob() {
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMob();
});

window.openMob  = openMob;
window.closeMob = closeMob;

/* ================================================================
   09. SMOOTH SCROLL (anchor links)
================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  });
});

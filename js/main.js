/* ================================================================
   BELLAVISTA — main.js  v2.1.0
================================================================ */

/* ================================================================
   01. GSAP INICIJALIZACIJA
================================================================ */
function initAnimations() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP nije učitan — sadržaj prikazan bez animacija.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  gsap.set('#hero .rv',    { opacity: 0, y: 45 });
  gsap.set('.hero-scroll', { opacity: 0 });
  gsap.set('.hero-img',    { scale: 1.16 });

  document.querySelectorAll('.rv').forEach(el => {
    if (!el.closest('#hero')) gsap.set(el, { opacity: 0, y: 30 });
  });

  gsap.to('.hero-img', { scale: 1, duration: 3.0, ease: 'power3.out' });

  gsap.to('#hero .rv', {
    opacity: 1, y: 0, duration: 1.3, stagger: 0.2, ease: 'power3.out', delay: 0.35,
    onComplete() {
      document.querySelectorAll('#hero .rv').forEach(el => {
        el.style.opacity = ''; el.style.transform = '';
      });
    }
  });

  gsap.to('.hero-scroll', { opacity: 1, duration: 1.4, delay: 1.9, ease: 'power2.out' });

  /* ── Parallax ── */
  gsap.to('.hero-img', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
    y: 130, ease: 'none'
  });
  gsap.to('.about-img-col img', {
    scrollTrigger: { trigger: '#o-nama', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    y: -40, ease: 'none'
  });

  /* ── Scroll reveal ── */
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
   02. NAVIGACIJA — scroll detection
================================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 70);
}, { passive: true });

/* ================================================================
   03. LANGUAGE TOGGLE
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
   04. MENU TABOVI
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
  if (typeof updateArrows === 'function') updateArrows();
}
window.openTab = openTab;

/* ================================================================
   05. LIGHTBOX
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
}
function closeLb() { lightbox.classList.remove('open'); document.body.style.overflow = ''; lbImg.src = ''; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
window.openLb  = openLb;
window.closeLb = closeLb;

/* ================================================================
   06. MOBILNA NAVIGACIJA
================================================================ */
const mobileNav = document.getElementById('mobileNav');
function openMob() { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMob() { mobileNav.classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMob();
});
window.openMob  = openMob;
window.closeMob = closeMob;

/* ================================================================
   07. SMOOTH SCROLL
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

/* ================================================================
   08. TAB STRELICE — navigacija tabovima na mobilnom
================================================================ */
(function () {
  const row  = document.getElementById('tabsRow');
  const btnL = document.getElementById('tabArrowLeft');
  const btnR = document.getElementById('tabArrowRight');
  if (!row || !btnL || !btnR) return;

  const STEP = 160; // px po kliku

  function updateArrows() {
    const atStart = row.scrollLeft <= 4;
    const atEnd   = row.scrollLeft >= row.scrollWidth - row.clientWidth - 4;
    btnL.disabled = atStart;
    btnR.disabled = atEnd;
  }

  function scrollTabs(dir) {
    row.scrollBy({ left: dir * STEP, behavior: 'smooth' });
    setTimeout(updateArrows, 350);
  }

  row.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows, { passive: true });
  window.addEventListener('load', updateArrows);

  updateArrows();
  window.scrollTabs    = scrollTabs;
  window.updateArrows  = updateArrows; /* expose za openTab */
}());
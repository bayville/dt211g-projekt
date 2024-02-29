import bodyScrollLockUpgrade from './body-scroll-lock-upgrade.js';

const btnOpen = document.querySelector('#btnOpen');
const btnClose = document.querySelector('#btnClose');
const media = window.matchMedia('(max-width: 48em)');
const mainNavMenu = document.querySelector('.mainnav__menu');
const main = document.querySelector('main');
const body = document.querySelector('body');

function openMobileMenu() {
  btnOpen.setAttribute('aria-expanded', 'true');
  mainNavMenu.removeAttribute('inert');
  mainNavMenu.removeAttribute('style');
  main.setAttribute('inert', '');
  bodyScrollLockUpgrade.disableBodyScroll(body);
  btnClose.focus();
}

function closeMobileMenu() {
  btnOpen.setAttribute('aria-expanded', 'false');
  mainNavMenu.setAttribute('inert', '');
  main.removeAttribute('inert');
  btnOpen.focus();
  bodyScrollLockUpgrade.enableBodyScroll(body);
  
  setTimeout(() => {
    mainNavMenu.style.transition = 'none';
  }, 500);
}

function setupTopNav(e) {
  e.matches
    ? (mainNavMenu.setAttribute('inert', ''), mainNavMenu.style.transition = 'none')
    : (mainNavMenu.removeAttribute('inert'), mainNavMenu.style.transition = '', mainNavMenu.style.transitionProperty = 'transform');
}


setupTopNav(media);

btnOpen.addEventListener('click', openMobileMenu);
btnClose.addEventListener('click', closeMobileMenu);

media.addEventListener('change', function (e) {
  setupTopNav(e);
});


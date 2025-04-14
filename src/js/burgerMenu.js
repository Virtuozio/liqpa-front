const html = document.querySelector('html');
const button = document.querySelector('.burger-menu__button');
const openIcon = document.querySelector('.burger-menu__open-icon');
const closeIcon = document.querySelector('.burger-menu__close-icon');
const backdrop = document.querySelector('.backdrop');
const hero = document.querySelector('.hero');
const burgerNav = document.querySelector('.burger-nav');

const toggle = () => {
  openIcon.classList.toggle('visually-hidden');
  closeIcon.classList.toggle('visually-hidden');
  backdrop.classList.toggle('visually-hidden');
  burgerNav.classList.toggle('visually-hidden');
  hero.classList.toggle('blur');
  html.classList.toggle('scrollBlock');
};

const handleClickMenu = e => {
  toggle();
};

const linkClick = e => {
  if (e.target.classList.value.indexOf('nav-link__burger') !== -1) {
    toggle();
  }
};

window.addEventListener('click', linkClick);
button.addEventListener('click', handleClickMenu);

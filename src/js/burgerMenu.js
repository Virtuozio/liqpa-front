const html = document.querySelector("html");
const button = document.querySelector(".burger-menu__button");
const openIcon = document.querySelector(".burger-menu__open-icon");
const closeIcon = document.querySelector(".burger-menu__close-icon");
const backdrop = document.querySelector(".backdrop");
const hero = document.getElementById("hero");
const burgerNav = document.querySelector(".burger-nav");

const toggle = () => {
  button.classList.toggle("active");
  backdrop.classList.toggle("active");
  burgerNav.classList.toggle("active");
  hero.classList.toggle("blur");
  html.classList.toggle("scrollBlock");
};

const handleClickMenu = (e) => {
  toggle();
};

const linkClick = (e) => {
  if (e.target.classList.contains("nav-link__burger")) {
    toggle();
  }
};

window.addEventListener("click", linkClick);
button.addEventListener("click", handleClickMenu);

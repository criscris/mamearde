const importHTML = () => {
  [...document.querySelectorAll('[data-source]')].forEach(element => {
    const source = element.getAttribute('data-source');
    fetch(source)
      .then(response => response.text())
      .then(text => element.innerHTML = text);
  });
};

const moveCarousel = (carouselId, offsetNorm) => {
  const carousel = document.querySelector(carouselId);
  const currentOffset = carousel.getAttribute('data-offset') || 0;
  const nextOffset = Math.max(
    -carousel.scrollWidth + carousel.clientWidth,
    Math.min(
      0,
      currentOffset - carousel.clientWidth * offsetNorm,
    ),
  );
  carousel.setAttribute('data-offset', nextOffset);
  carousel.style.transform = `translate(${nextOffset}px)`;
};

const next = carouselId => moveCarousel(carouselId, 1);
const previous = carouselId => moveCarousel(carouselId, -1);

const displayPage = () => {
  const pageName = location.hash.substr(1) || 'start';

  [...document.querySelectorAll(".page > div")].forEach(element => {
    const classes = element.classList;
    if (classes.contains(pageName)) {
      classes.add('on');
    } else {
      classes.remove('on');
    }
  });

  const slash = pageName.indexOf('/');
  const mainPageName = slash > 0 ? pageName.substring(0, slash) : pageName;

  [...document.querySelectorAll(".header .menu .entry")].forEach(element => {
    const classes = element.classList;
    if (classes.contains(mainPageName)) {
      classes.add('on');
    } else {
      classes.remove('on');
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  importHTML();
  displayPage();
});

window.addEventListener('hashchange', displayPage);

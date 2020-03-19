const importHTML = () => {
  return Promise.all([...document.querySelectorAll('[data-source]')].map(element => {
    const source = element.getAttribute('data-source');
    return fetch(source)
      .then(response => response.text())
      .then(text => element.innerHTML = text);
  }));
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

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const initGallery = () => {
  const gallery = document.querySelector('#startGallery');
  const children = shuffleArray([...document.querySelectorAll('#startGallery > div')])
  gallery.innerHTML = null;
  children.forEach(child => gallery.appendChild(child));
};

const contact = () => {
  const form = document.querySelector('#contactForm');
  const elements = form.elements;
  const name = form.elements['name'].value;
  const email = form.elements['email'].value;
  const subject = form.elements['emailSubject'].value;
  const message = form.elements['message'].value;
  console.log('name', name); 
  console.log('email', email); 
  console.log('subject', subject); 
  console.log('message', message);

  const response = document.querySelector('#contactForm > .response');

  Email.send({
    SecureToken : "a1f880c4-f8da-4949-b43a-ff0d949b839b",
    To : 'djwqidjqoi@trashmail.com',
    From : email,
    Subject : subject,
    Body : name + '\n' + email + '\n\n' + message,
  })
  .then(message => {
    console.info(message);
    response.innerHTML = 'Nachricht gesendet.';
  })
  .catch(error => {
    console.error(error);
    response.innerHTML = 'Nachricht konnte nicht gesendet werden.';
  });

  
}

document.addEventListener('DOMContentLoaded', () => {
  importHTML()
    .then(initGallery)
  displayPage();
});

window.addEventListener('hashchange', displayPage);

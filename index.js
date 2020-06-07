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

const lazyloadImages = (parentElement) => {
  [...parentElement.querySelectorAll("img")].forEach(image => {
    const url = image.getAttribute('data-src');
    if (url) {
      image.setAttribute('src', url);
      image.setAttribute('data-src', '');
    }
  });
};

const displayPage = () => {
  const pageName = location.hash.substr(1) || 'start';

  [...document.querySelectorAll(".page > div")].forEach(element => {
    const classes = element.classList;
    if (classes.contains(pageName)) {
      classes.add('on');
      lazyloadImages(element);
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
  children
    .slice(0, 8)
    .forEach(child => gallery.appendChild(child));
};

const contact = () => {
  const form = document.querySelector('#contactForm');
  const elements = form.elements;
  const name = form.elements['name'].value;
  const email = form.elements['email'].value;
  const subject = form.elements['emailSubject'].value;
  const message = form.elements['message'].value;

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
};

const sortTable = (tableId, columnIndex, noOfColumns) => {
  const table = document.querySelector(tableId);
  const children = [...document.querySelectorAll(tableId + ' > div')];
  const header = children.slice(0, noOfColumns);
  const rows = children.slice(noOfColumns);

  const ColumnState = {
    None: null,
    SortUp: 'sortUp',
    SortDown: 'sortDown',
  }

  let currentState = ColumnState.None;
  if (header[columnIndex].classList.contains(ColumnState.SortUp)) {
    currentState = ColumnState.SortUp;
  } else if (header[columnIndex].classList.contains(ColumnState.SortDown)) {
    currentState = ColumnState.SortDown;
  }

  const nextState = currentState === ColumnState.SortUp ? ColumnState.SortDown : ColumnState.SortUp;

  header.forEach((element, index) => {
    const classes = element.classList;
    classes.remove(ColumnState.SortUp);
    classes.remove(ColumnState.SortDown);

    if (index === columnIndex) {
      classes.add(nextState);
    }
  });

  table.innerHTML = null;
  header.forEach(child => table.appendChild(child));

  const sortStrings = rows
    .filter((element, index) => (index - columnIndex) % noOfColumns === 0)
    .map(element => element.textContent.trim());
  const sortIndices = sortStrings
    .map((value, index) => index)
    .sort((i1, i2) => {
      const s1 = sortStrings[i1];
      const s2 = sortStrings[i2];
      if (s1 == s2) {
        return 0;
      }
      const greaterThan = nextState === ColumnState.SortDown ? s1 < s2 : s1 > s2;
      return greaterThan ? 1 : -1; 
    })

  const sortedRows = [];
  sortIndices.forEach(oldIndex => {
    for (let i = 0; i < noOfColumns; i++) {
      sortedRows.push(rows[oldIndex * noOfColumns + i]);
    }
  });
  
  sortedRows.forEach(child => table.appendChild(child));
}

const initLinks = () => {
  [...document.querySelectorAll('a')].forEach(a => {
    if (a.href.indexOf('#projekte') >= 0) {
      a.onclick = () => window.scrollTo(0, 0);
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  importHTML()
    .then(initLinks)
    .then(initGallery)
    .then(displayPage)
});

window.addEventListener('hashchange', displayPage);

/**
 * Helper Functions
 */

const $ = document.querySelectorAll.bind(document);
const $$ = document.querySelector.bind(document);

/**
 * Go to
 */

function submitTo(event, url) {
  event.preventDefault();
  window.location.href = url;
}

/**
 * Home Carousel
 */

function initHomeCarousel() {
  const carouselItems = Array.from($('.js-carousel-item'));
  const carouselDots = Array.from($('.js-carousel-dot'));
  const carouselItemsCount = carouselItems.length;
  const carouselAutoplay = true;
  const carouselChangeDelay = 8000;
  let carouselInterval = null;
  const { hash } = window.location;

  function carouselSetIndex(indexActive) {
    if (carouselItems[indexActive]) {
      carouselItems[indexActive].classList.add('is-active');

      carouselItems.forEach((item, index) => {
        if (index !== indexActive) {
          item.classList.remove('is-active');
        }
      });
    }

    if (carouselDots[indexActive]) {
      carouselDots[indexActive].classList.add('is-active');

      carouselDots.forEach((dot, index) => {
        if (index !== indexActive) {
          dot.classList.remove('is-active');
        }
      });
    }

    return indexActive;
  }

  function carouselIncrementIndex(indexActive) {
    let index = indexActive + 1;

    if (index + 1 > carouselItemsCount) {
      index = 0;
    }

    return carouselSetIndex(index);
  }

  if (carouselItems.length) {
    let indexActive = 0;

    if (hash.startsWith('#carousel-')) {
      indexActive = parseInt(hash.replace('#carousel-', ''), 10);

      carouselDots.forEach((dot, index) => {
        if (index === indexActive) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });

      carouselItems.forEach((item, index) => {
        if (index === indexActive) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
    }

    carouselDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();

        indexActive = carouselDots.indexOf(e.target);

        if (carouselInterval) {
          clearInterval(carouselInterval);
          carouselInterval = setInterval(() => {
            indexActive = carouselIncrementIndex(indexActive);
          }, carouselChangeDelay);
        }

        indexActive = carouselSetIndex(indexActive);
      });
    });

    if (carouselAutoplay) {
      carouselInterval = setInterval(() => {
        indexActive = carouselIncrementIndex(indexActive);
      }, carouselChangeDelay);
    }
  }
}

initHomeCarousel();

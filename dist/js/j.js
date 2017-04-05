'use strict';

/**
 * Helper Functions
 */

var $ = document.querySelectorAll.bind(document);
var $$ = document.querySelector.bind(document);

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
  var carouselItems = Array.from($('.js-carousel-item'));
  var carouselDots = Array.from($('.js-carousel-dot'));
  var carouselItemsCount = carouselItems.length;
  var carouselAutoplay = true;
  var carouselChangeDelay = 8000;
  var carouselInterval = null;
  var hash = window.location.hash;


  function carouselSetIndex(indexActive) {
    if (carouselItems[indexActive]) {
      carouselItems[indexActive].classList.add('is-active');

      carouselItems.forEach(function (item, index) {
        if (index !== indexActive) {
          item.classList.remove('is-active');
        }
      });
    }

    if (carouselDots[indexActive]) {
      carouselDots[indexActive].classList.add('is-active');

      carouselDots.forEach(function (dot, index) {
        if (index !== indexActive) {
          dot.classList.remove('is-active');
        }
      });
    }

    return indexActive;
  }

  function carouselIncrementIndex(indexActive) {
    var index = indexActive + 1;

    if (index + 1 > carouselItemsCount) {
      index = 0;
    }

    return carouselSetIndex(index);
  }

  if (carouselItems.length) {
    var indexActive = 0;

    if (hash.startsWith('#carousel-')) {
      indexActive = parseInt(hash.replace('#carousel-', ''), 10);

      carouselDots.forEach(function (dot, index) {
        if (index === indexActive) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });

      carouselItems.forEach(function (item, index) {
        if (index === indexActive) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
    }

    carouselDots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        e.preventDefault();

        indexActive = carouselDots.indexOf(e.target);

        if (carouselInterval) {
          clearInterval(carouselInterval);
          carouselInterval = setInterval(function () {
            indexActive = carouselIncrementIndex(indexActive);
          }, carouselChangeDelay);
        }

        indexActive = carouselSetIndex(indexActive);
      });
    });

    if (carouselAutoplay) {
      carouselInterval = setInterval(function () {
        indexActive = carouselIncrementIndex(indexActive);
      }, carouselChangeDelay);
    }
  }
}

initHomeCarousel();
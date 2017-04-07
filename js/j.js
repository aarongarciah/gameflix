'use strict';

/**
 * Helper Functions
 */

var $ = document.querySelectorAll.bind(document);
var $$ = document.querySelector.bind(document);

/**
 * Submit to
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

/**
 * Header notifications
 */
function initNavNotifications() {
  var navNotifications = $$('.js-nav-notifications');

  if (navNotifications) {
    $$('.js-nav-notifications').addEventListener('click', function (e) {
      var elemTarget = e.path.find(function (x) {
        return x.classList.contains('js-nav-notifications');
      });

      if (elemTarget) {
        elemTarget.classList.toggle('is-active');
      }
    });
  }
}

initNavNotifications();

/**
 * Tabs
 */
function initTabs() {
  var tabs = $$('.js-tabs');

  if (tabs) {
    var tabsItems = tabs.querySelectorAll('.js-tabs-link');
    tabsItems.forEach(function (tab, index) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        var elemTarget = e.path.find(function (x) {
          return x.classList.contains('js-tabs-link');
        });

        if (elemTarget) {
          tabsItems.forEach(function (t) {
            return t.classList.remove('is-active');
          });
          elemTarget.classList.toggle('is-active');

          var tabContents = tabs.querySelectorAll('.js-tab-content');
          tabContents.forEach(function (t) {
            return t.classList.remove('is-active');
          });

          if (tabContents[index]) {
            tabContents[index].classList.add('is-active');
          }
        }
      });
    });
  }
}

initTabs();

var data = {
  labels: ['Oct 16', 'Nov 16', 'Dec 16', 'Jan 17', 'Feb 17', 'Mar 17', 'Apr 17'],
  datasets: [{
    label: '',
    fill: false,
    tension: -1,
    backgroundColor: '#f1657f',
    borderCapStyle: 'butt',
    pointBorderWidth: 0,
    data: [0.5, 1, 2, 8, 1, 3, 10]
  }]
};

var options = {
  scales: {
    xAxes: [{
      categorySpacing: 15,
      barPercentage: 0.5,
      gridLines: {
        display: false
      }
    }],
    yAxes: [{
      ticks: {
        // callback: (label, index, labels) => `${label} Mbps`,
      }
    }]
  },
  legendCallback: ''
};

window.onload = function () {
  var chartSession = $$('#chart');

  if (chartSession) {
    var ctx = chartSession.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
    });
  }
};
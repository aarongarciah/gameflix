/**
 * Helper Functions
 */

const $ = document.querySelectorAll.bind(document);
const $$ = document.querySelector.bind(document);

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

/**
 * Header notifications
 */
function initNavNotifications() {
  const navNotifications = $$('.js-nav-notifications');

  if (navNotifications) {
    $$('.js-nav-notifications').addEventListener('click', (e) => {
      const elemTarget = e.path.find(x => x.classList.contains('js-nav-notifications'));

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
  const tabs = $$('.js-tabs');

  if (tabs) {
    const tabsItems = tabs.querySelectorAll('.js-tabs-link');
    tabsItems.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const elemTarget = e.path.find(x => x.classList.contains('js-tabs-link'));

        if (elemTarget) {
          tabsItems.forEach(t => t.classList.remove('is-active'));
          elemTarget.classList.toggle('is-active');

          const tabContents = tabs.querySelectorAll('.js-tab-content');
          tabContents.forEach(t => t.classList.remove('is-active'));

          if (tabContents[index]) {
            tabContents[index].classList.add('is-active');
          }
        }
      });
    });
  }
}

initTabs();

window.onload = () => {
  const chartSession = $$('#chart');

  if (chartSession) {
    const ctx = chartSession.getContext('2d');

    const data = {
      labels: ['Oct 16', 'Nov 16', 'Dec 16', 'Jan 17', 'Feb 17', 'Mar 17', 'Apr 17'],
      datasets: [{
        label: '',
        fill: false,
        tension: -1,
        backgroundColor: '#f1657f',
        borderCapStyle: 'butt',
        pointBorderWidth: 0,
        data: [0.5, 1, 2, 8, 1, 3, 10],
      }],
    };

    const options = {
      scales: {
        xAxes: [{
          categorySpacing: 15,
          barPercentage: 0.5,
          gridLines: {
            display: false,
          },
        }],
        yAxes: [{
          ticks: {
            // callback: (label, index, labels) => `${label} Mbps`,
          },
        }],
      },
      legend: {
        display: false,
      },
    };

    new Chart(ctx, {
      type: 'bar',
      data,
      options,
    });
  }
};

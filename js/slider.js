document.addEventListener('DOMContentLoaded', () => {
  const reviewsSliderEl = document.querySelector('.reviews__swiper');
  if (!reviewsSliderEl) return;

  // 1rem = 10px на ширині макету — відступ масштабується разом зі сторінкою
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const DOTS = 5; // як у макеті: 5 крапок показують прогрес гортання

  // Зупиняємо всі відео й повертаємо постери
  const killAllVideos = () => {
    reviewsSliderEl.querySelectorAll('.review-slide video').forEach((video) => {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
    });
  };

  // Відео відкривається поверх постера по кліку (як у membership)
  const openVideo = (slide, url) => {
    killAllVideos();

    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'auto';
    video.addEventListener('ended', killAllVideos);
    slide.appendChild(video);

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        video.muted = true;
        video.play();
      });
    }
  };

  const swiper = new Swiper(reviewsSliderEl, {
    loop: true,
    slidesPerView: 'auto', // ширина слайда задається в CSS, сусідні слайди видно по краях
    centeredSlides: true,
    initialSlide: 1, // як у макеті: по центру другий відгук
    spaceBetween: 2 * rem,

    pagination: {
      el: '.reviews__pagination',
      type: 'custom',
      renderCustom: (sw, current, total) => {
        const active = Math.round(((current - 1) / Math.max(total - 1, 1)) * (DOTS - 1));
        let html = '';
        for (let i = 0; i < DOTS; i++) {
          html += `<span class="swiper-pagination-bullet${i === active ? ' swiper-pagination-bullet-active' : ''}"></span>`;
        }
        return html;
      },
    },

    navigation: {
      nextEl: '.reviews__next',
      prevEl: '.reviews__prev',
    },
  });

  swiper.on('slideChangeTransitionStart', killAllVideos);
  swiper.on('sliderMove', killAllVideos);

  reviewsSliderEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'VIDEO') return;
    const slide = e.target.closest('.review-slide');
    const url = slide && slide.dataset.video;
    if (!url) return;
    openVideo(slide, url);
  });
});

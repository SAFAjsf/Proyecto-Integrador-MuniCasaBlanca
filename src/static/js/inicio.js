
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".home-hero");
  const slides = Array.from(
    document.querySelectorAll(".hero-slide")
  );

  if (!hero || slides.length < 2) {
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let currentIndex = 0;
  let intervalId = null;

  function showNextSlide() {
    if (reducedMotion.matches || document.hidden) {
      return;
    }

    slides[currentIndex].classList.remove("is-active");

    currentIndex = (currentIndex + 1) % slides.length;

    slides[currentIndex].classList.add("is-active");
  }

  function startSlideshow() {
    if (
      intervalId !== null ||
      reducedMotion.matches ||
      document.hidden
    ) {
      return;
    }

    intervalId = window.setInterval(showNextSlide, 6500);
  }

  function stopSlideshow() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function updateSlideshow() {
    stopSlideshow();

    if (reducedMotion.matches) {
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === 0);
      });

      currentIndex = 0;
      return;
    }

    if (!document.hidden) {
      startSlideshow();
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", updateSlideshow);
  } else {
    reducedMotion.addListener(updateSlideshow);
  }

  updateSlideshow();
});


/* =========================================
   CARRUSEL AUTOMÁTICO DE ATRACTIVOS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("#attractions-carousel");
  const track = document.querySelector("#attractions-track");

  if (!carousel || !track) return;

  const copy = track.querySelector(".attractions-track-copy");
  const firstSlide = track.querySelector(".attraction-slide");

  if (!copy || !firstSlide) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let animationId = null;
  let previousTime = 0;
  let loopDistance = 0;
  let position = 0;
  let lastScrollLeft = 0;

  // Velocidad en píxeles por segundo.
  const speed = 20;

  function measureLoopDistance() {
    loopDistance =
      copy.getBoundingClientRect().left -
      firstSlide.getBoundingClientRect().left;
  }

  function animate(timestamp) {
    if (!previousTime) previousTime = timestamp;

    const delta = Math.min(timestamp - previousTime, 100);
    previousTime = timestamp;

    if (!document.hidden && !reducedMotion.matches) {
      if (loopDistance > 0) {
        position += speed * (delta / 1000);

        if (position >= loopDistance) {
          position %= loopDistance;
        }

        carousel.scrollLeft = position;
        lastScrollLeft = carousel.scrollLeft;
      }
    }

    animationId = window.requestAnimationFrame(animate);
  }

  function start() {
    if (
      animationId !== null ||
      reducedMotion.matches ||
      document.hidden
    ) {
      return;
    }

    measureLoopDistance();
    position = carousel.scrollLeft;
    lastScrollLeft = position;
    previousTime = 0;
    animationId = window.requestAnimationFrame(animate);
  }

  function stop() {
    if (animationId !== null) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  carousel.addEventListener("scroll", () => {
    const currentScrollLeft = carousel.scrollLeft;

    if (Math.abs(currentScrollLeft - lastScrollLeft) > 0.5) {
      position = currentScrollLeft;
    }

    lastScrollLeft = currentScrollLeft;
  }, { passive: true });

  window.addEventListener("resize", measureLoopDistance);

  // Detener cuando la pestaña deja de estar visible.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  // Respetar la preferencia de movimiento reducido.
  function updateMotionPreference() {
    stop();

    if (reducedMotion.matches) {
      carousel.scrollLeft = 0;
      position = 0;
      lastScrollLeft = 0;
      return;
    }

    start();
  }

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", updateMotionPreference);
  } else {
    reducedMotion.addListener(updateMotionPreference);
  }

  updateMotionPreference();
});

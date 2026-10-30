document.addEventListener("DOMContentLoaded", () => {
  const statsBanner = document.getElementById("coach-stats-banner");
  if (!statsBanner) return;

  const animateNumbers = (element) => {
    const targetText = element.textContent.trim();
    const targetValue = parseFloat(targetText);
    if (isNaN(targetValue)) return;

    // Визначаємо, чи число дробове (для 2.2)
    const isFloat = targetText.includes('.');
    
    const duration = 2000; // 2 секунди
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Плавне уповільнення в кінці (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * targetValue;

      // Форматування
      if (isFloat) {
        element.textContent = currentValue.toFixed(1); // Для 2.2 залишаємо один знак
      } else {
        element.textContent = Math.floor(currentValue); // Для 12 - цілі числа
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        // Гарантовано ставимо оригінальне значення в кінці
        element.textContent = targetText;
      }
    };

    requestAnimationFrame(updateNumber);
  };

  // Intersection Observer для запуску при доскролі
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3 // Спрацює, коли 30% банеру з'явиться на екрані
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll(".js-animate-number");
        numbers.forEach(num => animateNumbers(num));
        
        // Вимикаємо спостереження після першого відпрацювання
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(statsBanner);
});
document.addEventListener("DOMContentLoaded", () => {
  const faqTriggers = document.querySelectorAll(".faq__question");

  faqTriggers.forEach((trigger) => {
    const contentPanel = trigger.nextElementSibling;

    // За макетом усі відповіді відкриті одразу
    if (trigger.getAttribute("aria-expanded") === "true") {
      contentPanel.style.maxHeight = contentPanel.scrollHeight + "px";
    } else {
      contentPanel.style.maxHeight = "0";
    }

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      trigger.setAttribute("aria-expanded", String(!isExpanded));
      // Висота з scrollHeight — плавна анімація незалежно від обсягу тексту
      contentPanel.style.maxHeight = isExpanded ? "0" : contentPanel.scrollHeight + "px";
    });
  });

  // Після зміни ширини екрана перераховуємо висоту відкритих відповідей
  window.addEventListener("resize", () => {
    faqTriggers.forEach((trigger) => {
      if (trigger.getAttribute("aria-expanded") === "true") {
        const contentPanel = trigger.nextElementSibling;
        contentPanel.style.maxHeight = contentPanel.scrollHeight + "px";
      }
    });
  });
});

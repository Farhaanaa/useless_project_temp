document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");

  if (hero) {
    hero.style.opacity = "0";
    hero.style.transform = "translateY(12px)";

    requestAnimationFrame(() => {
      hero.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      hero.style.opacity = "1";
      hero.style.transform = "translateY(0)";
    });
  }
});

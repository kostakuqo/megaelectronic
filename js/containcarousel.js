 export function initContainSwipe() {

    const container = document.querySelector('.about-contain');
    const cards = document.querySelectorAll('.main-container');
    const dotsContainer = document.querySelector('.contain-dots');

    if (!container || cards.length === 0 || !dotsContainer) return;

    dotsContainer.innerHTML = "";

    // generate dots
    cards.forEach((_, index) => {

        const dot = document.createElement('div');
        dot.className = "contain-dot";
        if(index === 0) dot.classList.add("active");

        dot.addEventListener("click", () => {
            container.scrollTo({
                left: cards[index].offsetLeft,
                behavior: 'smooth'
            });
        });

        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".contain-dot");

    // Detect active card on scroll
    container.addEventListener("scroll", () => {

        let index = Math.round(
            container.scrollLeft / cards[0].offsetWidth
        );

        index = Math.min(index, cards.length - 1);

        dots.forEach(d => d.classList.remove("active"));
        dots[index].classList.add("active");
    });
}

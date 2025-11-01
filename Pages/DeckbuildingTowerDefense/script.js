
function querySelect(element) {
    return document.querySelector(element);
}

function querySelectAll(element) {
    return Array.from(document.querySelectorAll(element));
}

function createDecorationCircles() {
    const textBubbles = querySelectAll(".text-bubble")
    let horizMod = 'left';
    let vertMod = 'bottom';
    let colorMod = 'black';

    textBubbles.forEach(bubble => {
        const dec = document.createElement("div");
        for (let i = 0; i < 2; ++i){
            switch (Math.floor(Math.random() * 2)) {
                case 0:
                    i > 0 ? horizMod = 'left' : vertMod = 'top';
                    colorMod = 'rgba(137, 203, 221, 0.35)';
                    break;
                case 1:
                    i > 0 ? horizMod = 'right' : vertMod = 'bottom';
                    colorMod = 'rgba(205, 144, 215, 0.35)'
                    break;
            }
        }
        dec.className = `decoration-bubble ${horizMod} ${vertMod}`;
        dec.style.backgroundColor = colorMod;
        bubble.appendChild(dec);
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const scrollContainer = querySelect('.scrollable-window');

    scrollContainer.addEventListener('scroll', (e) => {
        const scrollY = e.target.scrollTop;
    
        querySelect('.landing-section').style.opacity = `${1 - scrollY/150}`;
        querySelect('.scroll-indicator').style.opacity = `${.5 - 2 * scrollY/150}`;
    
        if (scrollY < .3 * window.innerHeight) {
            querySelect('.main-page-content').style.transform = `translate(0px, ${0 - scrollY}px)`;
        }
    
    });

    createDecorationCircles();
})
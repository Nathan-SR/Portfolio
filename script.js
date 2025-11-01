function querySelect(element) {
    return document.querySelector(element);
}

function querySelectAll(element) {
    return Array.from(document.querySelectorAll(element));
}

function makeRotator(element, data, interval = 3000) {
    let i = 0;
    let visible = true;

    const swap = () => {
        visible = false;
        element.classList.add("fading");

        setTimeout(() => {
            i = (i + 1) % data.length;
            const { word, color, font } = data[i];
            element.textContent = word;
            element.style.color = color;
            element.style.fontFamily = font;
            element.style.fontSize = font === "Marck Script" ? "3vw" : "";
            element.classList.remove("fading");
            visible = true;
        }, 600);
    };

    const { word, color, font } = data[0];
    element.textContent = word;
    element.style.color = color;
    element.style.fontFamily = font;

    return setInterval(swap, interval);
}

let starfieldActive = false;
let glowClusterActive = false;

function ensureStarfield(count = 220) {
    if (starfieldActive) return;
    const container = querySelect('.stars');
    if (!container) return;
    const frag = document.createDocumentFragment();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const size = (Math.random() < 0.7 ? (Math.random() * 1.5 + 0.5) : (Math.random() * 2.5 + 0.5));
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.left = `${Math.random() * vw}px`;
        s.style.top = `${Math.random() * vh}px`;
        const duration = Math.random() * 5 + 3;
        const delay = Math.random() * 5;
        s.style.animationDuration = `${duration}s`;
        s.style.animationDelay = `${delay}s`;
        frag.appendChild(s);
    }
    container.innerHTML = '';
    container.appendChild(frag);
    starfieldActive = true;
}

function clearStarfield() {
    const container = querySelect('.stars');
    if (container) container.innerHTML = '';
    starfieldActive = false;
}

function ensureGlowCluster() {
    if (glowClusterActive) return;
    const host = querySelect('.portals-title-container');
    if (!host) return;
    const cluster = document.createElement('div');
    cluster.className = 'glow-cluster';
    const count = 120;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const d = document.createElement('div');
        d.className = 'glow-dot';
        const size = Math.random() * 8 + 2; // px
        d.style.width = `${size}px`;
        d.style.height = `${size}px`;
        d.style.left = `${Math.random() * 100}%`;
        d.style.top = `${Math.random() * 100}%`;
        frag.appendChild(d);
    }
    cluster.appendChild(frag);
    host.appendChild(cluster);
    glowClusterActive = true;
}

function clearGlowCluster() {
    const host = querySelect('.portals-title-container');
    if (!host) return;
    const existing = host.querySelector('.glow-cluster');
    if (existing) host.removeChild(existing);
    glowClusterActive = false;
}

const portalIds = ["six","zero","one","three","four","five","seven","eight"];
const idToFilter = {
    zero : "brightness(0) saturate(100%) invert(100%) sepia(61%) saturate(1782%) hue-rotate(308deg) brightness(115%) contrast(100%)",
    one  : "brightness(0) saturate(100%) invert(95%) sepia(53%) saturate(5729%) hue-rotate(171deg) brightness(106%) contrast(98%)",
    three: "brightness(0) saturate(100%) invert(95%) sepia(13%) saturate(1474%) hue-rotate(194deg) brightness(100%) contrast(97%)",
    four : "brightness(0) saturate(100%) invert(90%) sepia(8%)  saturate(1020%) hue-rotate(325deg) brightness(109%) contrast(103%)",
    six  : "brightness(0) saturate(100%) invert(88%) sepia(2%)  saturate(5621%) hue-rotate(189deg) brightness(108%) contrast(82%)",
    five : "brightness(0) saturate(100%) invert(88%) sepia(18%) saturate(844%)  hue-rotate(335deg) brightness(107%) contrast(98%)",
    seven: "brightness(0) saturate(100%) invert(95%) sepia(13%) saturate(1474%) hue-rotate(194deg) brightness(100%) contrast(97%)",
    eight: "brightness(0) saturate(100%) invert(88%) sepia(18%) saturate(844%)  hue-rotate(335deg) brightness(107%) contrast(98%)",
};

function buildPortalShapes() {

    const parent = querySelect(".pt-circles-parent");

    portalIds.forEach(id => {
        const w = document.createElement("div");
        w.className = `portals-wrapper ${id}`;

        const circle = document.createElement("div");
        circle.className = `portals-title-circle ${id}`;
        w.appendChild(circle);

        const star = document.createElement("img");
        star.src = "Images/Star.png";
        star.className = `portals-title-star ${id}`;
        const duration = Math.random() * 70 + 30;     
        const reverse = Math.random() < 0.5;
        star.style.animation = `${reverse ? "backspin":"spin"} ${duration}s linear infinite`;
        star.style.filter = idToFilter[id];

        w.appendChild(star);
        parent.appendChild(w);
    });

    const middleStar = document.createElement("img");
    middleStar.src = "Images/Star.png";
    middleStar.className = "portals-title-star two";
    parent.appendChild(middleStar);
}

function handleScroll(e) {
    const scrollY = e.currentTarget.scrollTop;
    const vh20 = 0.2 * innerHeight;
    const scrollThreshold = 0.6 * window.innerHeight;

    const darkActive = scrollY > scrollThreshold;

    if (darkActive) {
        ensureStarfield();
        ensureGlowCluster();
        querySelectAll('.portals-title-circle').forEach(c => { c.style.opacity = 0; c.style.display = 'none'; });
        querySelectAll('.portals-title-star').forEach(s => { s.style.opacity = 0; });
    } else {
        clearStarfield();
        clearGlowCluster();
        querySelectAll('.portals-title-circle').forEach(c => { c.style.display = ''; c.style.opacity = ''; });
        querySelectAll('.portals-title-star').forEach(s => { s.style.opacity = 0; });
    }

    querySelect(".scroll-indicator").style.opacity = `${0.5 - scrollY / 150}`;
    querySelect(".personal-statement-container").style.top = `${-scrollY}px`;

    querySelectAll(".circle").forEach(circle => {
        circle.style.opacity = String((100 - scrollY / 4) / 100);

        if (scrollY > 0) {
            circle.style.animation = "none";
            switch (true) {
                case circle.classList.contains("purple"):
                    circle.style.transform = `translate(-50%, -50%) translate(${scrollY * 0.1}px, ${scrollY * -0.075}px)`;
                    circle.style.width = `calc(58.3vw - ${scrollY / 4}px)`;
                    break;
                case circle.classList.contains("blue"):
                    circle.style.transform = `translate(-50%, -50%) translate(${scrollY * -0.075}px, ${scrollY * -0.075}px)`;
                    circle.style.width = `calc(66vw - ${scrollY / 2}px)`;
                    break;
                case circle.classList.contains("yellow"):
                    circle.style.transform = `translate(-50%, -50%) translate(${scrollY * 0.075}px, ${scrollY * -0.15}px)`;
                    break;
            }
        } else {
            const dur = circle.classList.contains("purple") ? "5s" : circle.classList.contains("blue") ? "4s" : "6s";
            circle.style.animation = `bob ${dur} ease-in-out infinite`;
    }});

    querySelect(".portals-title-star.two").style.opacity = darkActive ? '0' : `${(scrollY - vh20) / 200}`;

    querySelect(".scrollable-window").style.backgroundColor = `rgba(0,0,0,${(scrollY - vh20 * 3) / 200})`;

    querySelectAll(".portal-container").forEach(element => {
        element.style.opacity = `${(scrollY - 4 * vh20) / 200}`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    buildPortalShapes();

    makeRotator(
        querySelect("#rotator‑1"), [
        { word: "make games ", color: "rgb(107,79,151)", font: "Aldrich" },
        { word: "create tools ", color: "orange", font: "Allerta Stencil" },
        ], 9000
    );

    makeRotator(
        querySelect("#rotator‑2"), [
        { word: "agency ", color: "#9e72a6", font: "Aldrich" },
        { word: "ideas ", color: "#82c267", font: "Marck Script" },
        { word: "confidence ", color: "#00bbe0", font: "Koh Santepheap" },
        ], 3000
    );

    querySelect("#scrollcont").addEventListener("scroll", handleScroll);
});

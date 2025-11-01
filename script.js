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

function ensureStarfield() {
    if (starfieldActive) return;
    regenerateStarfield();
    starfieldActive = true;
}

function regenerateStarfield() {
    const container = querySelect('.stars');
    if (!container) return;
    const host = querySelect('.main-page-content');
    const width = host ? host.clientWidth : window.innerWidth;
    const height = host ? host.scrollHeight : window.innerHeight;
    const area = width * height;
    const density = 0.00015; // stars per pixel
    const count = Math.max(200, Math.min(1400, Math.floor(area * density)));

    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const size = (Math.random() < 0.75 ? (Math.random() * 1.4 + 0.6) : (Math.random() * 2.6 + 0.6));
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.left = `${Math.random() * width}px`;
        s.style.top = `${Math.random() * height}px`;
        const duration = Math.random() * 5 + 3;
        const delay = Math.random() * 5;
        s.style.animationDuration = `${duration}s`;
        s.style.animationDelay = `${delay}s`;
        frag.appendChild(s);
    }
    container.style.height = `${height}px`;
    container.innerHTML = '';
    container.appendChild(frag);
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

    const hostRect = host.getBoundingClientRect();
    const circleEls = querySelectAll('.portals-title-circle');
    if (!circleEls.length) return;

    const cluster = document.createElement('div');
    cluster.className = 'glow-cluster';

    const frag = document.createDocumentFragment();
    const dotsPerCircle = 65; // slightly less dense

    circleEls.forEach(circle => {
        const rect = circle.getBoundingClientRect();
        const cx = rect.left - hostRect.left + rect.width / 2;
        const cy = rect.top - hostRect.top + rect.height / 2;
        const radius = Math.min(rect.width, rect.height) / 2;

        for (let i = 0; i < dotsPerCircle; i++) {
            const d = document.createElement('div');
            d.className = 'glow-dot';
            const size = Math.random() * 7 + 2; // 2-9px
            // Slightly randomized around the circle edges with small jitter
            const r = Math.sqrt(Math.random()) * radius * (0.85 + Math.random() * 0.4); // 0.85r to 1.25r
            const angle = Math.random() * Math.PI * 2;
            const jitterX = (Math.random() - 0.5) * 8; // ±4px
            const jitterY = (Math.random() - 0.5) * 8; // ±4px
            const x = cx + r * Math.cos(angle) + jitterX - size / 2;
            const y = cy + r * Math.sin(angle) + jitterY - size / 2;
            d.style.width = `${size}px`;
            d.style.height = `${size}px`;
            d.style.left = `${x}px`;
            d.style.top = `${y}px`;
            frag.appendChild(d);
        }
    });

    cluster.appendChild(frag);
    host.appendChild(cluster);
    glowClusterActive = true;
}

function clearGlowCluster() {
    const host1 = querySelect('.banner-container');
    const host2 = querySelect('.portals-title-container');
    const existing1 = host1 ? host1.querySelector('.glow-cluster') : null;
    const existing2 = host2 ? host2.querySelector('.glow-cluster') : null;
    if (existing1 && host1) host1.removeChild(existing1);
    if (existing2 && host2) host2.removeChild(existing2);
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
        const starsEl = querySelect('.stars');
        if (starsEl) starsEl.style.display = 'block';
        ensureGlowCluster();
        // Hide big banner circles too
        querySelectAll('.circle').forEach(c => { c.style.display = 'none'; });
        querySelectAll('.portals-title-circle').forEach(c => { c.style.opacity = 0; c.style.display = 'none'; });
        querySelectAll('.portals-title-star').forEach(s => { s.style.opacity = 0; });
    } else {
        const starsEl = querySelect('.stars');
        if (starsEl) starsEl.style.display = 'none';
        clearGlowCluster();
        // Restore big banner circles
        querySelectAll('.circle').forEach(c => { c.style.display = ''; c.style.opacity = ''; });
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
    // Initialize state based on current scroll position
    const sc = querySelect("#scrollcont");
    if (sc) handleScroll({ currentTarget: sc });

    // Regenerate stars on resize when active
    window.addEventListener('resize', () => {
        if (starfieldActive) regenerateStarfield();
    });

    // Preload starfield immediately but keep hidden until scrolled into view
    regenerateStarfield();
    starfieldActive = true;
    const starsEl = querySelect('.stars');
    if (starsEl) starsEl.style.display = 'none';
});

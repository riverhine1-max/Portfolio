const projects = {
    "gilded-fate": {
        title: "Gilded Fate",
        type: "Unity • C# • Roguelike Deckbuilder",
        status: "Active development",
        description: "My current flagship project: a dark-fantasy roguelike deckbuilder built in Unity. It includes three playable heroes with distinct systems, a branching map, card/relic collections, status effects, controller support, progression, combat presentation, and ongoing balance and polish work.",
        details: [
            ["Role", "Game direction, systems design, implementation, UI/UX, balancing, QA"],
            ["Tech", "Unity, C#, Git/GitHub, custom game systems"],
            ["Development approach", "AI-assisted iteration and debugging with human direction, testing, design decisions, and final integration"]
        ],
        images: [
            "Images/portfolio-projects/gilded-fate-combat.webp",
            "Images/portfolio-projects/gilded-fate-menu.webp",
            "Images/portfolio-projects/gilded-fate-collection.webp"
        ],
        links: [
            ["View GitHub repository", "https://github.com/riverhine1-max/gilded-fate", true]
        ]
    },
    "exploding-nuts": {
        title: "Exploding Nuts",
        type: "Browser Game • Unity Evolution",
        status: "Prototype / learning project",
        description: "A stylized arena roguelite that shows the progression of my game-development skills. The project started with HTML, CSS, and JavaScript, then expanded into Unity and C# as I learned to build larger systems and 3D gameplay.",
        details: [
            ["What I built", "Menus, progression, fighters, weapon systems, lore, achievements, 3D gameplay experiments"],
            ["Tech progression", "HTML/CSS/JavaScript → Unity/C#"],
            ["Why it matters", "This project pushed me from smaller web interactions into larger game architecture and iteration"]
        ],
        images: [
            "Images/portfolio-projects/exploding-nuts-home.webp",
            "Images/portfolio-projects/exploding-nuts-gameplay.webp",
            "Images/portfolio-projects/exploding-nuts-armory.webp",
            "Images/portfolio-projects/exploding-nuts-unity.webp"
        ],
        links: [
            ["View GitHub repository", "https://github.com/riverhine1-max/Exploding-Nuts", true]
        ]
    },
    "website-demos": {
        title: "Local Business Website Redesigns",
        type: "Web Design • Client-style demos",
        status: "Live",
        description: "A set of unofficial redesign concepts for real Treasure Valley businesses. I research each business, rebuild the presentation around clearer calls to action and modern responsive design, host the demos with GitHub Pages, and use them for real outreach.",
        details: [
            ["Goal", "Turn web-development practice into real-world business experience"],
            ["Tech", "HTML, CSS, JavaScript, responsive layouts, GitHub Pages"],
            ["Current work", "Patriot Cleaning, Blast Exterior Cleaning, Boise Home Painting, PAINTCO, and more"]
        ],
        live: "https://riverhine1-max.github.io/Website-Demos/",
        links: [
            ["Open live redesign portfolio", "https://riverhine1-max.github.io/Website-Demos/", true],
            ["View GitHub repository", "https://github.com/riverhine1-max/Website-Demos", false]
        ]
    },
    "arc-ui": {
        title: "ARC Raiders UX/UI Study",
        type: "HTML • CSS • UI/UX",
        status: "School / early portfolio project",
        description: "An early interface and information-design project inspired by ARC Raiders. I organized navigation, game information, imagery, and themed presentation into a multi-section web experience.",
        details: [
            ["Focus", "Navigation, hierarchy, themed UI, readable game information"],
            ["Tech", "HTML and CSS"],
            ["What it shows", "An earlier stage of my UI/UX and front-end development before my larger game projects"]
        ],
        live: "Project/arc-raiders/index.html",
        links: [
            ["Open full project", "Project/arc-raiders/index.html", true]
        ]
    },
    "snake": {
        title: "Snake Game",
        type: "JavaScript • HTML Canvas",
        status: "Early coding project",
        description: "A playable Snake game built with JavaScript and the HTML Canvas API. It includes adjustable map size, keyboard input, collision detection, randomized food placement, a countdown, game-over state, and replay flow.",
        details: [
            ["Focus", "Core game loops and state"],
            ["Tech", "HTML, CSS, JavaScript, Canvas"],
            ["What I learned", "Input handling, collision logic, rendering, timers, and resetting game state"]
        ],
        live: "Project/snake/index.html",
        links: [
            ["Play Snake", "Project/snake/index.html", true]
        ]
    },
    "arc-db": {
        title: "ARC Raiders Database",
        type: "PHP • Database • Web",
        status: "Live",
        description: "A searchable game-data project that combines PHP with a database-backed interface. It was one of my first projects that went beyond a static page and worked with structured server-side data.",
        details: [
            ["Focus", "Searchable structured data and server-side rendering"],
            ["Tech", "PHP, HTML, CSS, database queries"],
            ["What I learned", "Connecting a web interface to stored data and building search/filter behavior"]
        ],
        live: "https://hiner2027.smtchs.org/testdb/DBArc.php?search=&search_column=weapon_name",
        links: [
            ["Open live database", "https://hiner2027.smtchs.org/testdb/DBArc.php?search=&search_column=weapon_name", true]
        ]
    }
};

const modal = document.getElementById("projectModal");
const modalMedia = document.getElementById("modalMedia");
const modalTitle = document.getElementById("modalTitle");
const modalType = document.getElementById("modalType");
const modalStatus = document.getElementById("modalStatus");
const modalDescription = document.getElementById("modalDescription");
const modalDetails = document.getElementById("modalDetails");
const modalActions = document.getElementById("modalActions");
let previousFocus;
const pageRegions = document.querySelectorAll('body > header, body > main, body > footer');

function renderImageGallery(images, title) {
    const first = images[0];
    modalMedia.innerHTML = `
        <div class="modal-main-media"><img id="modalMainImage" src="${first}" alt="${title} screenshot"></div>
        <div class="modal-gallery">
            ${images.map((image, index) => `
                <button class="gallery-thumb ${index === 0 ? "active" : ""}" type="button" data-gallery-image="${image}" aria-label="Show screenshot ${index + 1}">
                    <img src="${image}" alt="">
                </button>
            `).join("")}
        </div>`;

    const mainImage = document.getElementById("modalMainImage");
    modalMedia.querySelectorAll(".gallery-thumb").forEach(button => {
        button.addEventListener("click", () => {
            mainImage.src = button.dataset.galleryImage;
            modalMedia.querySelectorAll(".gallery-thumb").forEach(item => item.classList.remove("active"));
            button.classList.add("active");
        });
    });
}

function renderLivePreview(url, title) {
    modalMedia.innerHTML = `<div class="modal-main-media"><iframe src="${url}" title="${title} live preview" loading="eager"></iframe></div>`;
}

function openProject(projectId) {
    const project = projects[projectId];
    if (!project) return;
    previousFocus = document.activeElement;
    pageRegions.forEach(region => region.inert = true);

    modalTitle.textContent = project.title;
    modalType.textContent = project.type;
    modalStatus.textContent = project.status;
    modalDescription.textContent = project.description;

    modalDetails.innerHTML = project.details.map(([label, value]) => `
        <div class="detail-card"><strong>${label}</strong><span>${value}</span></div>
    `).join("");

    modalActions.innerHTML = project.links.map(([label, url, primary]) => `
        <a class="${primary ? "primary-link" : ""}" href="${url}" ${url.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ''}>${label} ↗</a>
    `).join("");

    if (project.images?.length) renderImageGallery(project.images, project.title);
    else if (project.live) renderLivePreview(project.live, project.title);

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.querySelector(".modal-close").focus();
}

function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalMedia.innerHTML = "";
    pageRegions.forEach(region => region.inert = false);
    previousFocus?.focus();
}

document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => openProject(card.dataset.project));
    card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProject(card.dataset.project);
        }
    });
});

document.querySelectorAll("[data-close-modal]").forEach(item => item.addEventListener("click", closeModal));
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
    if (event.key === "Tab" && modal.classList.contains("open")) {
        const items = [...modal.querySelectorAll('button, a[href], iframe')];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first.focus();
        }
    }
});

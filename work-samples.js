const projects = {
    "gilded-fate": {
        title: "Gilded Fate",
        type: "Unity • C# • Roguelike Deckbuilder",
        status: "Flagship project · Active development",
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
        live: "Project/snake/index.html?embed=1",
        interactive: true,
        links: [
            ["Play Snake", "Project/snake/index.html", true]
        ]
    },
    "arc-db": {
        title: "ARC Raiders Database",
        type: "PHP • Database • Web",
        status: "Case study · Interactive explorer",
        description: "A searchable game-data project that combines PHP with a database-backed interface. It was one of my first projects that went beyond a static page and worked with structured server-side data.",
        details: [
            ["Focus", "Searchable structured data and server-side rendering"],
            ["Tech", "PHP, HTML, CSS, database queries"],
            ["What I learned", "Connecting a web interface to stored data and building search/filter behavior"]
        ],
        images: ["Images/optimized/database-card.webp"],
        mediaNote: "Styled database explorer · Search and compare a September 2026 data snapshot.",
        links: [
            ["Open database explorer", "Project/arc-database/index.html", true]
        ]
    }
};

// Every media kind uses the same reserved stage and control strip.
const modal = document.getElementById('projectModal');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const closeButton = modal.querySelector('.modal-close');
let previousFocus = null;
let galleryIndex = 0;
let galleryItems = [];
let activeProject = null;

function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

function showGalleryItem(index) {
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[galleryIndex];
    const stage = modalMedia.querySelector('.project-modal__stage');
    stage.querySelector('video')?.pause();
    const media = element(item.type === 'video' ? 'video' : 'img');
    if (item.type === 'video') {
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
        if (item.poster) media.poster = item.poster;
        media.setAttribute('aria-label', item.alt);
    } else {
        media.alt = item.alt;
        media.decoding = 'async';
    }
    media.addEventListener('error', () => {
        if (stage.contains(media)) stage.append(element('p', 'media-fallback', 'This media could not load. Try another item or open the project using the links.'));
    });
    media.src = item.src;
    stage.replaceChildren(media);
    modalMedia.querySelector('.gallery-counter').textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
    modalMedia.querySelectorAll('.gallery-thumb').forEach((button, i) => button.setAttribute('aria-pressed', String(i === galleryIndex)));
}

function renderMedia(project) {
    modalMedia.replaceChildren();
    const stage = element('div', 'project-modal__stage');
    const controls = element('div', 'project-modal__gallery');
    modalMedia.append(stage, controls);
    // Optional media entries support { type: 'video', src, poster, alt } without a new layout.
    galleryItems = project.media || (project.images || []).map((src, i) => ({ type: 'image', src, alt: `${project.title} — screenshot ${i + 1}` }));
    if (galleryItems.length) {
        if (galleryItems.length > 1) {
            const previous = element('button', 'gallery-arrow', '‹');
            previous.type = 'button'; previous.setAttribute('aria-label', 'Previous media');
            previous.addEventListener('click', () => showGalleryItem(galleryIndex - 1));
            const thumbs = element('div', 'gallery-thumbs');
            galleryItems.forEach((item, i) => {
                const button = element('button', 'gallery-thumb');
                button.type = 'button';
                button.setAttribute('aria-label', `Show ${item.type === 'video' ? 'video' : 'screenshot'} ${i + 1}`);
                const thumb = element('img');
                thumb.src = item.poster || (item.src.startsWith('Images/portfolio-projects/')
                    ? item.src.replace('Images/portfolio-projects/', 'Images/optimized/').replace('.webp', '-800.webp')
                    : item.src);
                thumb.alt = '';
                if (item.type !== 'video' || item.poster) button.append(thumb);
                else button.textContent = '▶';
                button.addEventListener('click', () => showGalleryItem(i));
                thumbs.append(button);
            });
            const next = element('button', 'gallery-arrow', '›');
            next.type = 'button'; next.setAttribute('aria-label', 'Next media');
            next.addEventListener('click', () => showGalleryItem(galleryIndex + 1));
            controls.append(previous, thumbs, next);
        } else controls.append(element('p', 'media-caption', project.mediaNote || 'Project screenshot'));
        const counter = element('span', 'gallery-counter');
        counter.setAttribute('aria-live', 'polite');
        controls.append(counter);
        showGalleryItem(0);
    } else if (project.live) {
        const iframe = element('iframe', project.interactive ? 'project-modal__interactive' : 'project-modal__browser');
        iframe.title = `${project.title} — ${project.interactive ? 'playable game' : 'live website preview'}`;
        iframe.tabIndex = 0;
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox');
        iframe.src = project.live;
        iframe.addEventListener('load', () => {
            // Same-origin demos can forward Escape even when focus is inside the frame.
            try { iframe.contentDocument?.addEventListener('keydown', event => {
                if (event.key === 'Escape') { event.preventDefault(); closeModal(); }
            }); } catch { /* Cross-origin pages retain browser-native dialog handling. */ }
        });
        stage.append(iframe);
        controls.append(element('p', 'media-caption', project.interactive ? 'Click game to focus · Arrow keys / WASD · Touch controls' : 'Live website preview · Scroll inside the preview or open the full project.'));
    }
}

function openProject(projectId, trigger) {
    const project = projects[projectId];
    if (!project) return;
    previousFocus = trigger || document.querySelector(`[data-project="${projectId}"]`) || document.activeElement;
    activeProject = projectId;
    modalTitle.textContent = project.title;
    document.getElementById('modalType').textContent = project.type;
    document.getElementById('modalStatus').textContent = project.status;
    document.getElementById('modalDescription').textContent = project.description;
    const details = document.getElementById('modalDetails');
    details.replaceChildren(...project.details.map(([label, value]) => {
        const card = element('div', 'detail-card');
        card.append(element('dt', '', label), element('dd', '', value));
        return card;
    }));
    const actions = document.getElementById('modalActions');
    actions.replaceChildren(...project.links.map(([label, url, primary]) => {
        const link = element('a', primary ? 'primary-link' : '', `${label} ↗`);
        link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
        return link;
    }));
    renderMedia(project);
    document.body.classList.add('modal-open');
    if (!modal.open) modal.showModal();
    modal.querySelector('.project-modal__content').scrollTop = 0;
    modal.querySelector('.project-modal__details').scrollTop = 0;
    closeButton.focus({ preventScroll: true });
}

function cleanupModal() {
    if (!activeProject) return;
    modalMedia.querySelector('video')?.pause();
    modalMedia.replaceChildren(); // Unload running games, video and website frames.
    document.body.classList.remove('modal-open');
    if (location.hash.slice(1) === activeProject) history.replaceState(null, '', location.pathname + location.search);
    activeProject = null;
    previousFocus?.focus({ preventScroll: true });
    previousFocus = null;
}
function closeModal() {
    if (modal.open) modal.close();
    cleanupModal();
}
closeButton.addEventListener('click', closeModal);
modal.addEventListener('cancel', event => { event.preventDefault(); closeModal(); });
modal.addEventListener('close', () => {
    if (!modal.open) cleanupModal();
});
// Only a full backdrop click closes; dragging from inside the dialog does not.
let pointerStartedOutside = false;
function outside(event) {
    const r = modal.getBoundingClientRect();
    return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
}
modal.addEventListener('pointerdown', event => { pointerStartedOutside = outside(event); });
modal.addEventListener('click', event => { if (pointerStartedOutside && outside(event)) closeModal(); });
modal.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
        const items = [...modal.querySelectorAll('button, a[href], iframe, video[controls], [tabindex="0"]')]
            .filter(item => !item.disabled && item.getClientRects().length);
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first.focus();
        }
    }
    if (galleryItems.length > 1 && !event.target.closest('video') && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault(); showGalleryItem(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
});
document.querySelectorAll('.project-card').forEach(card => {
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', () => openProject(card.dataset.project, card));
    card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(card.dataset.project, card); }
    });
});
window.addEventListener('pageshow', event => {
    // Initial load can finish after someone has already opened a project.
    // Only a back/forward cache restoration needs stale dialog cleanup.
    if (event.persisted) {
        closeModal();
        document.body.classList.remove('modal-open');
    }
});
window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (Object.hasOwn(projects, id)) openProject(id);
});
const initialProject = location.hash.slice(1);
if (Object.hasOwn(projects, initialProject)) openProject(initialProject);

// The optional timeline uses the same modal, data, and focus-return behavior.
document.querySelectorAll('[data-open-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.openProject, button)));
const viewButtons = document.querySelectorAll('[data-project-view]');
function setProjectView(view) {
    const timeline = view === 'timeline';
    document.getElementById('projectGallery').hidden = timeline;
    document.getElementById('projectTimeline').hidden = !timeline;
    viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.projectView === view)));
    const url = new URL(location.href);
    if (timeline) url.searchParams.set('view', 'timeline'); else url.searchParams.delete('view');
    history.replaceState(null, '', url);
}
viewButtons.forEach(button => button.addEventListener('click', () => setProjectView(button.dataset.projectView)));
if (new URLSearchParams(location.search).get('view') === 'timeline') setProjectView('timeline');

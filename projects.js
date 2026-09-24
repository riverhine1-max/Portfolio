/* ==========================================================================
   PROJECTS — the single source of truth for the Work page and the homepage reel.

   ADD NEW WORK IN 3 STEPS
   1. Put your images in Images/ (a wide cover ~1600px and a thumb ~800px).
   2. Copy the TEMPLATE below, paste it at the top of the list, and fill it in.
   3. Commit. The Work page grid, index, filters, timeline and project count
      update automatically. Set `featured` to a number to put it in the
      homepage reel (1 = first). One open slot disappears per project you add,
      so lower SITE.openSlots when you want fewer "reserved" slots showing.

   TEMPLATE
   {
     id: 'my-new-game',                     // unique, lowercase, used for #links
     title: 'My New Game',
     year: '2026',
     categories: ['game'],                  // any of: game, web, experiment, concept
     featured: 5,                           // optional — homepage reel order
     timeline: 11, era: 'Next chapter',     // optional — Then → Now view
     discipline: 'Unity · C# · Genre',
     status: 'In development',
     tone: 'jade',                          // jade | gold | ember | violet
     summary: 'One or two sentences about the project.',
     tags: ['Unity', 'C#'],
     cover: 'Images/my-new-game-cover.webp',
     thumb: 'Images/my-new-game-thumb.webp',
     coverAlt: 'Describe the image',
     page: 'MyNewGame.html',                // optional case-study page
     // optional gallery (opens in the project viewer when there is no page):
     description: 'Longer description for the viewer.',
     details: [['Role', 'What you did'], ['Tech', 'Tools used']],
     media: [{ type: 'image', src: 'Images/shot.webp', alt: 'Caption' },
             { type: 'video', src: 'Media/clip.mp4', poster: 'Images/poster.webp', alt: 'Caption' }],
     links: [['Play it', 'https://…', true]]
   }
   ========================================================================== */
window.SITE = {
  openSlots: 2 // reserved "next project" cards shown after your work
};

window.PROJECTS = [
  {
    id: "gilded-fate",
    title: "Gilded Fate",
    year: "2026",
    categories: ["game"],
    featured: 1,
    timeline: 8,
    era: "Now · Flagship",
    discipline: "Unity · C# · Roguelike deckbuilder",
    status: "In development",
    tone: "jade",
    summary: "A dark-fantasy roguelike deckbuilder with three playable heroes, branching routes, relics, status effects, and interlocking card systems.",
    tags: ["Unity", "C#", "Systems design", "UI/UX", "Balancing"],
    cover: "Images/portfolio-projects/gilded-fate-title-20260916.webp",
    thumb: "Images/optimized/gilded-fate-title-20260916-thumb.webp",
    coverAlt: "Gilded Fate title screen",
    focus: "50% 45%",
    page: "GildedFate.html",
    size: "xl",
    timelineCopy: "Bringing systems, design, and iteration together in a Unity deckbuilder.",
    details: [
      ["Role", "Game direction, systems design, implementation, UI/UX, balancing, QA"],
      ["Tech", "Unity, C#, Git/GitHub, custom game systems"],
      ["Development approach", "AI-assisted iteration and debugging with human direction, testing, design decisions, and final integration"]
    ],
    media: [
      { type: "image", src: "Images/portfolio-projects/gilded-fate-title-20260916.webp", thumbnail: "Images/optimized/gilded-fate-title-20260916-thumb.webp", alt: "Title screen" },
      { type: "video", src: "Media/gilded-fate-gameplay.mp4", poster: "Images/portfolio-projects/gilded-fate-gameplay-poster.webp", alt: "Unity / C# · Gilded Fate gameplay" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-vanguard-20260916.webp", thumbnail: "Images/optimized/gilded-fate-vanguard-20260916-thumb.webp", alt: "The Vanguard — character archive" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-hexer-20260916.webp", thumbnail: "Images/optimized/gilded-fate-hexer-20260916-thumb.webp", alt: "The Hexer — character archive" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-reaper-20260916.webp", thumbnail: "Images/optimized/gilded-fate-reaper-20260916-thumb.webp", alt: "The Reaper — character archive" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-fateweave-20260916.webp", thumbnail: "Images/optimized/gilded-fate-fateweave-20260916-thumb.webp", alt: "The Fateweave — starting choices" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-map-20260916.webp", thumbnail: "Images/optimized/gilded-fate-map-20260916-thumb.webp", alt: "Branching map and Vault rooms" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-hexer-combat-20260916.webp", thumbnail: "Images/optimized/gilded-fate-hexer-combat-20260916-thumb.webp", alt: "Hexer combat — Hex Strike" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-sigils-20260916.webp", thumbnail: "Images/optimized/gilded-fate-sigils-20260916-thumb.webp", alt: "Choose a Sigil" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-hexer-status-20260916.webp", thumbnail: "Images/optimized/gilded-fate-hexer-status-20260916-thumb.webp", alt: "Hexer — Ember and status details" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-reaper-portrait.webp", thumbnail: "Images/optimized/gilded-fate-reaper-portrait-thumb.webp", alt: "Reaper — character detail" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-vanguard-portrait.webp", thumbnail: "Images/optimized/gilded-fate-vanguard-portrait-thumb.webp", alt: "Vanguard — character detail" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-reaper-combat-20260916.webp", thumbnail: "Images/optimized/gilded-fate-reaper-combat-20260916-thumb.webp", alt: "Reaper combat — Reaping Blow" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-soul-20260916.webp", thumbnail: "Images/optimized/gilded-fate-soul-20260916-thumb.webp", alt: "Reaper combat — Soul card" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-victory-20260916.webp", thumbnail: "Images/optimized/gilded-fate-victory-20260916-thumb.webp", alt: "Victory and card rewards" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-event-20260916.webp", thumbnail: "Images/optimized/gilded-fate-event-20260916-thumb.webp", alt: "The Fallen Banner — event choices" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-sanctuary-20260916.webp", thumbnail: "Images/optimized/gilded-fate-sanctuary-20260916-thumb.webp", alt: "Sanctuary — rest, upgrade, or bind" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-binding-20260916.webp", thumbnail: "Images/optimized/gilded-fate-binding-20260916-thumb.webp", alt: "Choose a Binding" },
      { type: "image", src: "Images/portfolio-projects/gilded-fate-shop-20260916.webp", thumbnail: "Images/optimized/gilded-fate-shop-20260916-thumb.webp", alt: "The Thread Broker — shop" }
    ],
    links: [
      ["View GitHub repository", "https://github.com/riverhine1-max/gilded-fate",true]
    ],
    modalType: "Unity • C# • Roguelike Deckbuilder",
    modalStatus: "Flagship project · Active development",
    description: "My current flagship project: a dark-fantasy roguelike deckbuilder built in Unity. It includes three playable heroes with distinct systems, a branching map, card/relic collections, status effects, controller support, progression, combat presentation, and ongoing balance and polish work."
  },
  {
    id: "grovefall",
    title: "GROVEFALL",
    year: "2027 target",
    categories: ["concept", "game"],
    featured: 2,
    timeline: 9,
    era: "Next · Dream game",
    discipline: "Third-person action adventure · Concept",
    status: "Pre-production",
    tone: "ember",
    summary: "A squirrel samurai crosses a ruined, machine-haunted world toward an awakening Iron Spire. Katana strikes charge a compact energy rifle.",
    tags: ["Game design", "GDD", "Concept trailers", "AI-assisted"],
    cover: "Images/grovefall-poster.webp?v=3",
    thumb: "Images/grovefall-poster.webp?v=3",
    coverAlt: "GROVEFALL concept frame: a small samurai squirrel looks up at the Iron Spire at sunset",
    focus: "50% 60%",
    page: "Grovefall.html",
    size: "lg",
    note: "Trailers are AI-generated gameplay visions, not recorded gameplay.",
    timelineCopy: "A third-person action concept with a public GDD and evolving trailer cuts."
  },
  {
    id: "exploding-nuts",
    title: "Exploding Nuts",
    year: "2025–26",
    categories: ["game"],
    featured: 3,
    timeline: 4,
    era: "From browser to Unity",
    discipline: "JavaScript → Unity · C#",
    status: "Prototype",
    tone: "gold",
    summary: "An arena roguelite that began as a browser game and grew into a Unity/C# project with progression, fighters, weapons, lore, and 3D gameplay.",
    tags: ["JavaScript", "Unity", "C#", "3D", "Game systems"],
    cover: "Images/portfolio-projects/exploding-nuts-unity-title-20260916.webp",
    thumb: "Images/optimized/exploding-nuts-unity-title-20260916-thumb.webp",
    coverAlt: "Exploding Nuts Unity main menu",
    focus: "40% 40%",
    page: "ExplodingNuts.html",
    size: "lg",
    timelineCopy: "Growing a browser prototype into Unity and C#.",
    details: [
      ["What I built", "Menus, progression, fighters, weapon systems, lore, achievements, 3D gameplay experiments"],
      ["Then · Web prototype", "I started in HTML, CSS, and JavaScript, building the fighter and arena selection flow, difficulty settings, run modifiers, collections, and relic armory. The Web-labeled screenshots and recording show that browser version."],
      ["Now · Unity / C#", "I carried the concept into Unity and C#, developing the standalone game, its 3D gameplay, controller-ready menus, and a live weapon assembly preview. The Unity-labeled screenshots and recording show this later stage."],
      ["Why it matters", "This project pushed me from smaller web interactions into larger game architecture and iteration"]
    ],
    media: [
      { type: "image", src: "Images/portfolio-projects/exploding-nuts-web-armory-20260916.webp", thumbnail: "Images/optimized/exploding-nuts-web-armory-20260916-thumb.webp", alt: "Web · Sap Relic Armory" },
      { type: "image", src: "Images/portfolio-projects/exploding-nuts-web-characters-20260916.webp", thumbnail: "Images/optimized/exploding-nuts-web-characters-20260916-thumb.webp", alt: "Web · Character collection" },
      { type: "image", src: "Images/portfolio-projects/exploding-nuts-web-arenas-20260916.webp", thumbnail: "Images/optimized/exploding-nuts-web-arenas-20260916-thumb.webp", alt: "Web · Arena collection" },
      { type: "image", src: "Images/portfolio-projects/exploding-nuts-web-fighter-20260916.webp", thumbnail: "Images/optimized/exploding-nuts-web-fighter-20260916-thumb.webp", alt: "Web · Choose your fighter" },
      { type: "image", src: "Images/portfolio-projects/exploding-nuts-web-arena-20260916.webp", thumbnail: "Images/optimized/exploding-nuts-web-arena-20260916-thumb.webp", alt: "Web · Choose your arena" },
      { type: "image", src: "Images/portfolio-projects/exploding-nuts-web-difficulty-20260916.webp", thumbnail: "Images/optimized/exploding-nuts-web-difficulty-20260916-thumb.webp", alt: "Web · Choose your difficulty" },
      { type: "image", src: "Images/portfolio-projects/exploding-nuts-web-modifier-20260916.webp", thumbnail: "Images/optimized/exploding-nuts-web-modifier-20260916-thumb.webp", alt: "Web · Choose a run modifier" },
      { type: "video", src: "Media/exploding-nuts-web-gameplay.mp4", poster: "Images/portfolio-projects/exploding-nuts-web-gameplay-poster.webp", alt: "Web · Browser gameplay" },
      { type: "image", src: "Images/portfolio-projects/exploding-nuts-unity-title-20260916.webp", thumbnail: "Images/optimized/exploding-nuts-unity-title-20260916-thumb.webp", alt: "Unity / C# · The Living Deep — main menu" },
      { type: "image", src: "Images/portfolio-projects/exploding-nuts-unity-assembly-20260916.webp", thumbnail: "Images/optimized/exploding-nuts-unity-assembly-20260916-thumb.webp", alt: "Unity / C# · Live 3D weapon assembly" },
      { type: "video", src: "Media/exploding-nuts-unity-gameplay.mp4", poster: "Images/portfolio-projects/exploding-nuts-unity-gameplay-poster.webp", alt: "Unity / C# · Gameplay" }
    ],
    links: [
      ["View GitHub repository", "https://github.com/riverhine1-max/Exploding-Nuts",true]
    ],
    modalType: "Browser Game • Unity Evolution",
    modalStatus: "Prototype / learning project",
    description: "A stylized arena roguelite that shows the progression of my game-development skills. The project started with HTML, CSS, and JavaScript, then expanded into Unity and C# as I learned to build larger systems and 3D gameplay."
  },
  {
    id: "website-demos",
    title: "Website Redesigns",
    year: "2026",
    categories: ["web"],
    featured: 4,
    timeline: 7,
    era: "Real-world applications",
    discipline: "Web design · Responsive · GitHub Pages",
    status: "Live",
    tone: "jade",
    summary: "Unofficial redesign concepts for Treasure Valley businesses, rebuilt around clearer calls to action and responsive layouts.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive", "GitHub Pages"],
    cover: "Images/optimized/websites-card.webp",
    thumb: "Images/optimized/websites-card.webp",
    coverAlt: "Local business website redesign collection",
    focus: "80% 80%",
    page: "WebsiteRedesigns.html",
    timelineCopy: "Applying web skills to local business redesign concepts.",
    details: [
      ["Goal", "Turn web-development practice into real-world business experience"],
      ["Tech", "HTML, CSS, JavaScript, responsive layouts, GitHub Pages"],
      ["Current work", "Patriot Cleaning, Blast Exterior Cleaning, Boise Home Painting, PAINTCO, and more"]
    ],
    live: "https://riverhine1-max.github.io/Website-Demos/",
    links: [
      ["Open live redesign portfolio", "https://riverhine1-max.github.io/Website-Demos/",true],
      ["View GitHub repository", "https://github.com/riverhine1-max/Website-Demos",false]
    ],
    modalType: "Web Design • Client-style demos",
    modalStatus: "Live",
    description: "A set of unofficial redesign concepts for real Treasure Valley businesses. I research each business, rebuild the presentation around clearer calls to action and modern responsive design, host the demos with GitHub Pages, and use them for real outreach."
  },
  {
    id: "custom-ai",
    title: "Custom AI R&D",
    year: "Research",
    categories: ["concept"],
    timeline: 10,
    era: "Next · Research",
    discipline: "Creative-workflow research",
    status: "Research phase",
    tone: "violet",
    summary: "Researching consistent, inspectable creative workflows: references, provenance, quality review, and GDD-aware assistance.",
    tags: ["Research", "Provenance", "Workflow design"],
    art: "ai",
    page: "CustomAIResearch.html",
    timelineCopy: "Researching inspectable, human-directed creative workflows."
  },
  {
    id: "shinkage",
    year: "Lab",
    categories: ["experiment", "game"],
    timeline: 6,
    era: "Character workflow experiment",
    title: "Shinkage",
    discipline: "Unity · C# · AI character workflow",
    status: "Unfinished experiment",
    tone: "gold",
    summary: "Testing an AI-assisted samurai character workflow with basic walking and jumping animations.",
    tags: ["Unity", "C#", "Higgsfield", "AI"],
    thumb: "Images/optimized/shinkage-courtyard-thumb.webp",
    cover: "Images/portfolio-projects/shinkage-courtyard.webp",
    coverAlt: "Shinkage — samurai in the training courtyard",
    timelineCopy: "Testing Higgsfield integration and samurai movement in Unity.",
    details: [
      ["What I tested", "The plugin connection, a 3D samurai character workflow, and basic walking and jumping animations in Unity."],
      ["What I learned", "Troubleshooting the connection improved the character model. I learned to check the tool connection and test generated assets in-engine before building more around them."],
      ["Current limits", "The integration is not fully completed. Walking and jumping are the only animations currently implemented; this is a learning experiment, not a finished game."]
    ],
    media: [
      { type: "image", src: "Images/portfolio-projects/shinkage-courtyard.webp", thumbnail: "Images/optimized/shinkage-courtyard-thumb.webp", alt: "Shinkage — samurai in the training courtyard" },
      { type: "video", src: "Media/shinkage-prototype.mp4", poster: "Images/portfolio-projects/shinkage-prototype-poster.webp", alt: "Shinkage · Movement experiment" },
      { type: "image", src: "Images/portfolio-projects/shinkage-pause.webp", thumbnail: "Images/optimized/shinkage-pause-thumb.webp", alt: "Shinkage — pause menu and training layout" }
    ],
    links: [],
    modalType: "Unity • C# • Higgsfield • AI",
    modalStatus: "Experiment · Unfinished integration",
    description: "A small Unity experiment in AI-assisted character creation and animation. I tested connecting Higgsfield to ChatGPT through a plugin and bringing a samurai swordsman into a training courtyard."
  },
  {
    id: "exploding-nuts-soulslike",
    year: "Lab",
    categories: ["experiment", "game"],
    timeline: 5,
    era: "Environment experiment",
    title: "Soulslike Experiment",
    discipline: "Unity · C# · Environment design",
    status: "Unfinished experiment",
    tone: "gold",
    summary: "Practicing terrain, lighting, level layout, and 3D world-building in Unity.",
    tags: ["Unity", "Terrain", "Lighting", "Level design"],
    thumb: "Images/optimized/soulslike-terrain-thumb.webp",
    cover: "Images/portfolio-projects/soulslike-terrain.webp",
    coverAlt: "Soulslike prototype — terrain and level layout in Unity",
    timelineCopy: "Practicing terrain, lighting, level layout, and world-building.",
    details: [
      ["What I explored", "Shaping terrain, arranging routes and spaces, placing environment elements, and testing the world from a player’s viewpoint."],
      ["What I learned", "Using a playable scene to judge scale, navigation, and lighting, then revising the environment through iteration."],
      ["Work in progress", "Some terrain uses AI-generated content and remains rough while I learn the workflow. This prototype documents that learning process; it is not a finished game."]
    ],
    media: [
      { type: "image", src: "Images/portfolio-projects/soulslike-terrain.webp", thumbnail: "Images/optimized/soulslike-terrain-thumb.webp", alt: "Soulslike prototype — terrain and level layout in Unity" },
      { type: "video", src: "Media/exploding-nuts-soulslike-prototype.mp4", poster: "Images/portfolio-projects/exploding-nuts-soulslike-prototype-poster.webp", alt: "Soulslike experiment · Early environment walkthrough" }
    ],
    links: [],
    modalType: "Unity • C# • Environment Design",
    modalStatus: "Learning prototype · Unfinished",
    description: "An unfinished Soulslike Unity prototype focused on terrain building, environment design, level layout, lighting, and 3D world-building."
  },
  {
    id: "arc-db",
    year: "Foundations",
    categories: ["web"],
    timeline: 3,
    era: "Working with data",
    title: "ARC Raiders Database",
    discipline: "PHP · Database · Web",
    status: "Interactive explorer",
    tone: "gold",
    summary: "A searchable game-data interface that moved me beyond static pages into structured, server-side data.",
    tags: ["PHP", "HTML", "CSS", "Database"],
    thumb: "Images/optimized/database-card.webp",
    cover: "Images/optimized/database-card.webp",
    coverAlt: "ARC Raiders database explorer screenshot",
    timelineCopy: "Moving beyond static pages with PHP and structured data.",
    details: [
      ["Focus", "Searchable structured data and server-side rendering"],
      ["Tech", "PHP, HTML, CSS, database queries"],
      ["What I learned", "Connecting a web interface to stored data and building search/filter behavior"]
    ],
    images: ["Images/optimized/database-card.webp"],
    mediaNote: "Styled database explorer · Search and compare a September 2026 data snapshot.",
    links: [
      ["Open database explorer", "Project/arc-database/index.html",true]
    ],
    modalType: "PHP • Database • Web",
    modalStatus: "Case study · Interactive explorer",
    description: "A searchable game-data project that combines PHP with a database-backed interface. It was one of my first projects that went beyond a static page and worked with structured server-side data."
  },
  {
    id: "arc-ui",
    year: "Foundations",
    categories: ["web"],
    timeline: 2,
    era: "First interfaces",
    title: "ARC Raiders UX/UI Study",
    discipline: "HTML · CSS · UI/UX",
    status: "UI/UX study",
    tone: "gold",
    summary: "An early interface study in organizing game information, navigation, and visual hierarchy.",
    tags: ["HTML", "CSS", "UI/UX", "Information design"],
    thumb: "Images/optimized/arc-ui-card.webp",
    cover: "Images/optimized/arc-ui-card.webp",
    coverAlt: "ARC Raiders interface study preview",
    timelineCopy: "Exploring page structure, navigation, and visual hierarchy.",
    details: [
      ["Focus", "Navigation, hierarchy, themed UI, readable game information"],
      ["Tech", "HTML and CSS"],
      ["What it shows", "An earlier stage of my UI/UX and front-end development before my larger game projects"]
    ],
    live: "Project/arc-raiders/index.html",
    links: [
      ["Open full project", "Project/arc-raiders/index.html",true]
    ],
    modalType: "HTML • CSS • UI/UX",
    modalStatus: "School / early portfolio project",
    description: "An early interface and information-design project inspired by ARC Raiders. I organized navigation, game information, imagery, and themed presentation into a multi-section web experience."
  },
  {
    id: "snake",
    year: "Foundations",
    categories: ["game", "web"],
    timeline: 1,
    era: "First game loops",
    title: "Snake",
    discipline: "JavaScript · HTML Canvas",
    status: "Playable",
    tone: "jade",
    summary: "One of my first JavaScript games: adjustable board, keyboard and touch controls, collision, countdown, and replay.",
    tags: ["JavaScript", "Canvas", "Game loop", "Input"],
    thumb: "Images/optimized/snake-card.webp",
    cover: "Images/optimized/snake-card.webp",
    coverAlt: "Snake playable game preview",
    timelineCopy: "Learning input, collision detection, and state with JavaScript.",
    details: [
      ["Focus", "Core game loops and state"],
      ["Tech", "HTML, CSS, JavaScript, Canvas"],
      ["What I learned", "Input handling, collision logic, rendering, timers, and resetting game state"]
    ],
    live: "Project/snake/index.html?embed=1",
    interactive: true,
    links: [
      ["Play Snake", "Project/snake/index.html",true]
    ],
    modalType: "JavaScript • HTML Canvas",
    modalStatus: "Early coding project",
    description: "A playable Snake game built with JavaScript and the HTML Canvas API. It includes adjustable map size, keyboard input, collision detection, randomized food placement, a countdown, game-over state, and replay flow."
  }
];

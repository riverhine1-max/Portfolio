const popup = document.getElementById("skill-popup");

document.querySelectorAll(".skill-tag").forEach(btn => {
    btn.addEventListener("mouseover", () => {
        const skill = btn.getAttribute("data-skill");
        const percent = btn.getAttribute("data-percent");
        const text = btn.getAttribute("data-text");

        popup.innerHTML = `
            <div style="position:relative;">
                <svg>
                    <circle class="bg" cx="60" cy="60" r="50"></circle>
                    <circle class="progress" cx="60" cy="60" r="50"></circle>
                </svg>
                <div class="circle-text">${percent}%</div>
            </div>
            <h3>${skill}</h3>
            <small>${text}</small>
        `;

        const rect = btn.getBoundingClientRect();
        popup.style.left = rect.left + "px";
        popup.style.top = rect.bottom + window.scrollY + "px";
        popup.style.display = "block";

        const progress = popup.querySelector(".progress");
        progress.style.strokeDashoffset = 314; 
        const offset = 314 - (314 * percent) / 100;
        setTimeout(() => {
            progress.style.strokeDashoffset = offset;
        }, 50);

        btn.addEventListener("mouseleave", () => {
            popup.style.display = "none";
            popup.innerHTML = '';
        }, { once: true }); 
    });
});

const lightbox = document.getElementById("lightbox");
const lightboxFrame = document.querySelector(".lightbox-frame");
const closeBtn = document.querySelector(".close");

// FULLSCREEN BUTTONS
document.querySelectorAll(".fullscreen-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        const iframe = btn.parentElement.querySelector("iframe");
        const src = iframe.getAttribute("src");

        // Load iframe into fullscreen
        lightboxFrame.innerHTML = `<iframe src="${src}"></iframe>`;

        lightbox.style.display = "block";
    });
});

// CLOSE LIGHTBOX
closeBtn?.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightboxFrame.innerHTML = ""; // stop iframe
});

// OPTIONAL: click outside to close
lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = "none";
        lightboxFrame.innerHTML = "";
    }
});

const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".arrow.right");
const prevBtn = document.querySelector(".arrow.left");

let current = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
}

nextBtn?.addEventListener("click", () => {
    current = (current + 1) % slides.length;
    showSlide(current);
});

prevBtn?.addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox) {
        lightbox.style.display = "none";
        lightboxFrame.innerHTML = "";
    }
});

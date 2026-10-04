* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}


:root {
    --bg: #07090f;
    --bg-soft: #0b0e16;
    --card: rgba(16, 20, 31, 0.72);
    --card-solid: #10141f;

    --border: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.16);

    --text: #f5f7fb;
    --muted: #8b93a7;
    --muted-light: #b8bfd0;

    --accent: #7c5cff;
    --accent-two: #22d3ee;

    --success: #37e89a;
    --danger: #ff647c;

    --radius: 18px;
}


html {
    scroll-behavior: smooth;
}


body {
    min-height: 100vh;

    background:
        radial-gradient(
            circle at 15% 10%,
            rgba(124, 92, 255, 0.13),
            transparent 30%
        ),
        radial-gradient(
            circle at 85% 20%,
            rgba(34, 211, 238, 0.08),
            transparent 25%
        ),
        var(--bg);

    color: var(--text);

    font-family:
        "Inter",
        sans-serif;

    overflow-x: hidden;
}


button,
input,
select {
    font: inherit;
}


button {
    cursor: pointer;
}


.hidden {
    display: none !important;
}


/* =========================================
   BACKGROUND
========================================= */

.background {
    position: fixed;
    inset: 0;

    pointer-events: none;

    z-index: -1;

    overflow: hidden;
}


.background-grid {
    position: absolute;
    inset: 0;

    opacity: 0.25;

    background-image:
        linear-gradient(
            rgba(255, 255, 255, 0.025) 1px,
            transparent 1px
        ),
        linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.025) 1px,
            transparent 1px
        );

    background-size: 70px 70px;

    mask-image:
        linear-gradient(
            to bottom,
            black,
            transparent 80%
        );
}


.background-glow {
    position: absolute;

    width: 500px;
    height: 500px;

    border-radius: 50%;

    filter: blur(120px);

    opacity: 0.12;
}


.glow-one {
    background: var(--accent);

    left: -200px;
    top: 200px;
}


.glow-two {
    background: var(--accent-two);

    right: -250px;
    top: 500px;
}


/* =========================================
   NAVBAR
========================================= */

.navbar {
    position: sticky;

    top: 0;

    z-index: 100;

    height: 76px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    padding: 0 5%;

    border-bottom: 1px solid var(--border);

    background:
        rgba(7, 9, 15, 0.78);

    backdrop-filter: blur(22px);
}


.brand {
    display: flex;

    align-items: center;

    gap: 12px;

    color: var(--text);

    text-decoration: none;
}


.brand-icon {
    width: 38px;
    height: 38px;

    display: grid;

    place-items: center;

    border-radius: 11px;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            #4c7dff
        );

    box-shadow:
        0 8px 30px
        rgba(124, 92, 255, 0.28);

    font-size: 19px;
    font-weight: 900;
}


.brand-text {
    display: flex;

    flex-direction: column;

    line-height: 1;
}


.brand-text strong {
    font-size: 14px;

    letter-spacing: 0.12em;
}


.brand-text span {
    margin-top: 4px;

    color: var(--muted);

    font-size: 9px;

    letter-spacing: 0.18em;
}


.nav-center {
    display: flex;

    align-items: center;

    gap: 8px;

    color: var(--muted);

    font-size: 12px;

    font-weight: 600;
}


.live-dot {
    width: 7px;
    height: 7px;

    border-radius: 50%;

    background: var(--success);

    box-shadow:
        0 0 12px
        rgba(55, 232, 154, 0.8);
}


.account-area {
    display: flex;

    align-items: center;
}


.discord-login {
    display: flex;

    align-items: center;

    gap: 9px;

    padding: 10px 16px;

    border: 1px solid
        rgba(124, 92, 255, 0.3);

    border-radius: 11px;

    background:
        rgba(124, 92, 255, 0.12);

    color: var(--text);

    font-size: 13px;

    font-weight: 700;

    transition: 0.2s ease;
}


.discord-login:hover {
    transform: translateY(-1px);

    background:
        rgba(124, 92, 255, 0.2);

    border-color:
        rgba(124, 92, 255, 0.55);
}


.discord-symbol {
    font-size: 16px;
}


.logged-in {
    display: flex;

    align-items: center;

    gap: 10px;
}


.user-avatar {
    width: 38px;
    height: 38px;

    border-radius: 50%;

    object-fit: cover;

    border: 2px solid
        rgba(124, 92, 255, 0.5);
}


.user-info {
    display: flex;

    flex-direction: column;
}


.user-info strong {
    font-size: 13px;
}


.user-info span {
    color: var(--muted);

    font-size: 10px;
}


.logout-btn {
    margin-left: 8px;

    padding: 8px 11px;

    border: 1px solid var(--border);

    border-radius: 9px;

    background: rgba(255, 255, 255, 0.04);

    color: var(--muted-light);

    font-size: 11px;
}


.logout-btn:hover {
    color: var(--text);

    border-color: var(--border-hover);
}


/* =========================================
   PAGE
========================================= */

.page {
    width: min(1400px, 90%);

    margin: auto;
}


/* =========================================
   HERO
========================================= */

.hero {
    min-height: 600px;

    display: grid;

    grid-template-columns:
        1.1fr
        0.9fr;

    align-items: center;

    gap: 50px;
}


.hero-content {
    padding: 80px 0;
}


.hero-pill {
    width: fit-content;

    display: flex;

    align-items: center;

    gap: 8px;

    padding: 7px 11px;

    border: 1px solid
        rgba(124, 92, 255, 0.22);

    border-radius: 999px;

    background:
        rgba(124, 92, 255, 0.07);

    color: #b9aaff;

    font-size: 10px;

    font-weight: 800;

    letter-spacing: 0.12em;
}


.hero-pill span {
    width: 6px;
    height: 6px;

    border-radius: 50%;

    background: var(--success);

    box-shadow:
        0 0 10px
        var(--success);
}


.hero h1 {
    max-width: 800px;

    margin-top: 22px;

    font-size:
        clamp(48px, 7vw, 88px);

    line-height: 0.98;

    letter-spacing: -0.065em;

    font-weight: 900;
}


.hero h1 span {
    background:
        linear-gradient(
            100deg,
            #a68cff,
            #5d8cff,
            #35d9ef
        );

    -webkit-background-clip: text;

    background-clip: text;

    color: transparent;
}


.hero p {
    max-width: 620px;

    margin-top: 25px;

    color: var(--muted);

    font-size: 16px;

    line-height: 1.8;
}


.hero-actions {
    display: flex;

    align-items: center;

    gap: 18px;

    margin-top: 34px;
}


.hero-button {
    display: flex;

    align-items: center;

    gap: 12px;

    padding: 13px 18px;

    border: none;

    border-radius: 12px;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            #5277ff
        );

    color: white;

    font-size: 13px;

    font-weight: 800;

    box-shadow:
        0 12px 35px
        rgba(124, 92, 255, 0.25);

    transition: 0.2s ease;
}


.hero-button:hover {
    transform: translateY(-2px);

    box-shadow:
        0 18px 45px
        rgba(124, 92, 255, 0.35);
}


.hero-status {
    display: flex;

    align-items: center;

    gap: 8px;

    color: var(--muted);

    font-size: 11px;
}


.status-check {
    width: 20px;
    height: 20px;

    display: grid;

    place-items: center;

    border-radius: 50%;

    background:
        rgba(55, 232, 154, 0.1);

    color: var(--success);
}


/* =========================================
   HERO VISUAL
========================================= */

.hero-visual {
    position: relative;

    height: 430px;

    display: grid;

    place-items: center;
}


.hero-card {
    position: absolute;

    width: 270px;
    height: 350px;

    border-radius: 24px;

    border: 1px solid
        rgba(255, 255, 255, 0.1);

    background:
        linear-gradient(
            145deg,
            rgba(26, 31, 47, 0.95),
            rgba(11, 14, 23, 0.92)
        );

    box-shadow:
        0 40px 100px
        rgba(0, 0, 0, 0.45);
}


.hero-card-back {
    transform:
        rotate(-9deg)
        translate(-50px, 10px);

    opacity: 0.45;
}


.hero-card-main {
    transform:
        rotate(6deg);

    padding: 20px;

    overflow: hidden;
}


.hero-card-top,
.hero-card-bottom {
    display: flex;

    justify-content: space-between;

    color: var(--muted);

    font-size: 9px;

    font-weight: 800;

    letter-spacing: 0.1em;
}


.hero-card-top span:last-child {
    color: #c2b6ff;
}


.hero-sprite {
    height: 260px;

    display: grid;

    place-items: center;

    position: relative;
}


.sprite-glow {
    position: absolute;

    width: 170px;
    height: 170px;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(124, 92, 255, 0.55),
            transparent 65%
        );

    filter: blur(20px);
}


.sprite-placeholder {
    position: relative;

    font-size: 100px;

    color: #b9aaff;

    text-shadow:
        0 0 35px
        rgba(124, 92, 255, 0.8);
}


.hero-card-bottom {
    align-items: center;

    padding-top: 13px;

    border-top: 1px solid var(--border);
}


.hero-card-bottom strong {
    color: var(--text);

    font-size: 12px;

    letter-spacing: 0;
}


.hero-card-bottom span {
    letter-spacing: 0;

    font-weight: 500;
}


/* =========================================
   WARNING
========================================= */

.auth-warning {
    display: flex;

    align-items: center;

    gap: 14px;

    padding: 15px 18px;

    margin-bottom: 70px;

    border: 1px solid
        rgba(255, 196, 87, 0.12);

    border-radius: 15px;

    background:
        rgba(255, 196, 87, 0.045);
}


.warning-icon {
    width: 34px;
    height: 34px;

    display: grid;

    place-items: center;

    flex-shrink: 0;

    border-radius: 10px;

    background:
        rgba(255, 196, 87, 0.1);

    color: #ffc457;

    font-weight: 900;
}


.auth-warning strong {
    font-size: 12px;
}


.auth-warning p {
    margin-top: 3px;

    color: var(--muted);

    font-size: 11px;
}


.auth-warning button {
    margin-left: auto;

    padding: 8px 13px;

    border: 1px solid
        rgba(255, 196, 87, 0.2);

    border-radius: 9px;

    background:
        rgba(255, 196, 87, 0.08);

    color: #ffc457;

    font-size: 11px;

    font-weight: 700;
}


/* =========================================
   HEADINGS
========================================= */

.section-heading {
    display: flex;

    align-items: end;

    justify-content: space-between;

    margin-bottom: 22px;
}


.section-heading.compact {
    margin-top: 70px;
}


.eyebrow {
    color: #8f7bff;

    font-size: 9px;

    font-weight: 900;

    letter-spacing: 0.2em;
}


.section-heading h2 {
    margin-top: 5px;

    font-size: 25px;

    letter-spacing: -0.04em;
}


.database-status {
    display: flex;

    align-items: center;

    gap: 7px;

    color: var(--muted);

    font-size: 11px;
}


.database-status i {
    width: 6px;
    height: 6px;

    border-radius: 50%;

    background: var(--success);
}


/* =========================================
   STATS
========================================= */

.stats-grid {
    display: grid;

    grid-template-columns:
        1.5fr
        1fr
        1fr
        1fr;

    gap: 12px;
}


.stat-card {
    min-height: 145px;

    padding: 20px;

    border: 1px solid var(--border);

    border-radius: var(--radius);

    background:
        linear-gradient(
            145deg,
            rgba(18, 23, 35, 0.85),
            rgba(12, 15, 24, 0.65)
        );

    backdrop-filter: blur(20px);
}


.stat-main {
    display: flex;

    align-items: center;

    gap: 18px;
}


.stat-icon {
    width: 52px;
    height: 52px;

    display: grid;

    place-items: center;

    border-radius: 15px;

    background:
        rgba(124, 92, 255, 0.1);

    color: #a894ff;

    font-size: 23px;
}


.stat-content {
    display: flex;

    flex-direction: column;
}


.stat-content > span,
.stat-label {
    color: var(--muted);

    font-size: 9px;

    font-weight: 800;

    letter-spacing: 0.13em;
}


.stat-content strong {
    margin-top: 4px;

    font-size: 34px;

    line-height: 1;
}


.stat-content small,
.stat-card > small {
    margin-top: 8px;

    color: var(--muted);

    font-size: 10px;
}


.stat-content small b {
    color: var(--muted-light);
}


.stat-number {
    margin-top: 8px;

    font-size: 32px;

    font-weight: 800;

    letter-spacing: -0.05em;
}


.mini-progress {
    height: 4px;

    margin-top: 15px;

    overflow: hidden;

    border-radius: 999px;

    background:
        rgba(255, 255, 255, 0.07);
}


.mini-progress div {
    width: 0;
    height: 100%;

    border-radius: inherit;

    background:
        linear-gradient(
            90deg,
            var(--accent),
            var(--accent-two)
        );

    transition: width 0.5s ease;
}


/* =========================================
   CONTROLS
========================================= */

.controls-section {
    margin-top: 70px;

    padding: 20px;

    border: 1px solid var(--border);

    border-radius: 20px;

    background:
        rgba(13, 17, 27, 0.65);
}


.search-wrapper {
    height: 50px;

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 0 14px;

    border: 1px solid var(--border);

    border-radius: 12px;

    background:
        rgba(255, 255, 255, 0.025);
}


.search-wrapper:focus-within {
    border-color:
        rgba(124, 92, 255, 0.45);

    box-shadow:
        0 0 0 4px
        rgba(124, 92, 255, 0.05);
}


.search-icon {
    color: var(--muted);

    font-size: 22px;
}


.search-wrapper input {
    flex: 1;

    min-width: 0;

    border: none;

    outline: none;

    background: transparent;

    color: var(--text);

    font-size: 13px;
}


.search-wrapper input::placeholder {
    color: #5f6678;
}


kbd {
    padding: 4px 7px;

    border: 1px solid var(--border);

    border-radius: 6px;

    color: var(--muted);

    font-size: 10px;
}


.filter-row {
    display: flex;

    flex-wrap: wrap;

    align-items: center;

    gap: 8px;

    margin-top: 12px;
}


.filter-group {
    display: flex;

    gap: 6px;
}


.filter-btn,
.select-filter {
    height: 35px;

    padding: 0 12px;

    border: 1px solid var(--border);

    border-radius: 9px;

    background:
        rgba(255, 255, 255, 0.025);

    color: var(--muted);

    font-size: 11px;

    font-weight: 600;

    transition: 0.18s ease;
}


.filter-btn:hover,
.select-filter:hover {
    color: var(--text);

    border-color: var(--border-hover);
}


.filter-btn.active {
    border-color:
        rgba(124, 92, 255, 0.4);

    background:
        rgba(124, 92, 255, 0.13);

    color: #c0b4ff;
}


.select-filter {
    margin-left: auto;

    outline: none;

    cursor: pointer;
}


.select-filter + .select-filter {
    margin-left: 0;
}


.select-filter option {
    background: #10141f;

    color: white;
}


/* =========================================
   FAMILIES
========================================= */

.family-list {
    display: flex;

    gap: 8px;

    overflow-x: auto;

    padding-bottom: 7px;
}


.family-list::-webkit-scrollbar {
    height: 4px;
}


.family-list::-webkit-scrollbar-thumb {
    background: #252b3b;

    border-radius: 99px;
}


.family-btn {
    flex-shrink: 0;

    padding: 9px 13px;

    border: 1px solid var(--border);

    border-radius: 9px;

    background:
        rgba(255, 255, 255, 0.025);

    color: var(--muted);

    font-size: 10px;

    font-weight: 700;

    transition: 0.18s ease;
}


.family-btn:hover {
    color: var(--text);

    border-color: var(--border-hover);
}


.family-btn.active {
    background:
        rgba(124, 92, 255, 0.12);

    color: #c1b6ff;

    border-color:
        rgba(124, 92, 255, 0.35);
}


.result-count {
    color: var(--muted);

    font-size: 11px;
}


/* =========================================
   SPRITE GRID
========================================= */

.sprites-section {
    margin-top: 24px;
}


.sprites-grid {
    display: grid;

    grid-template-columns:
        repeat(
            auto-fill,
            minmax(190px, 1fr)
        );

    gap: 13px;
}


.sprite-card {
    position: relative;

    min-width: 0;

    overflow: hidden;

    border: 1px solid var(--border);

    border-radius: 17px;

    background:
        linear-gradient(
            150deg,
            rgba(20, 25, 38, 0.92),
            rgba(10, 13, 21, 0.9)
        );

    transition:
        transform 0.22s ease,
        border-color 0.22s ease,
        box-shadow 0.22s ease;
}


.sprite-card:hover {
    transform: translateY(-5px);

    border-color:
        rgba(124, 92, 255, 0.28);

    box-shadow:
        0 22px 50px
        rgba(0, 0, 0, 0.3);
}


.sprite-card.owned {
    border-color:
        rgba(55, 232, 154, 0.25);
}


.sprite-image-container {
    position: relative;

    height: 190px;

    display: grid;

    place-items: center;

    overflow: hidden;

    background:
        radial-gradient(
            circle at 50% 55%,
            rgba(124, 92, 255, 0.13),
            transparent 60%
        );
}


.sprite-image-container::after {
    content: "";

    position: absolute;

    inset: 0;

    background:
        linear-gradient(
            to bottom,
            transparent 60%,
            rgba(8, 10, 16, 0.6)
        );

    pointer-events: none;
}


.sprite-image {
    width: 82%;

    height: 82%;

    object-fit: contain;

    position: relative;

    z-index: 1;

    filter:
        drop-shadow(
            0 15px 18px
            rgba(0, 0, 0, 0.45)
        );

    transition:
        transform 0.3s ease;
}


.sprite-card:hover .sprite-image {
    transform: scale(1.07);
}


.owned-badge {
    position: absolute;

    top: 10px;
    right: 10px;

    z-index: 5;

    width: 27px;
    height: 27px;

    display: grid;

    place-items: center;

    border-radius: 50%;

    background:
        rgba(55, 232, 154, 0.12);

    border: 1px solid
        rgba(55, 232, 154, 0.3);

    color: var(--success);

    font-size: 12px;

    opacity: 0;

    transform: scale(0.8);

    transition: 0.2s ease;
}


.sprite-card.owned .owned-badge {
    opacity: 1;

    transform: scale(1);
}


.sprite-info {
    padding: 15px;
}


.sprite-meta {
    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 8px;
}


.sprite-rarity {
    width: fit-content;

    padding: 4px 7px;

    border-radius: 5px;

    font-size: 8px;

    font-weight: 900;

    letter-spacing: 0.08em;

    text-transform: uppercase;
}


.rarity-mythic {
    background:
        rgba(255, 168, 66, 0.12);

    color: #ffb95f;
}


.rarity-legendary {
    background:
        rgba(255, 125, 67, 0.11);

    color: #ff9b73;
}


.rarity-epic {
    background:
        rgba(184, 92, 255, 0.12);

    color: #c58cff;
}


.rarity-rare {
    background:
        rgba(69, 151, 255, 0.12);

    color: #71aaff;
}


.rarity-special {
    background:
        rgba(55, 232, 154, 0.1);

    color: #5ae9a9;
}


.sprite-id {
    color: #596176;

    font-size: 8px;

    font-weight: 700;
}


.sprite-name {
    margin-top: 9px;

    color: var(--text);

    font-size: 14px;

    font-weight: 800;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
}


.sprite-family {
    margin-top: 3px;

    color: var(--muted);

    font-size: 10px;
}


.sprite-footer {
    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 8px;

    margin-top: 13px;

    padding-top: 11px;

    border-top: 1px solid var(--border);
}


.sprite-variant {
    color: var(--muted-light);

    font-size: 9px;

    font-weight: 600;
}


.sprite-status {
    padding: 6px 9px;

    border: 1px solid var(--border);

    border-radius: 7px;

    background:
        rgba(255, 255, 255, 0.035);

    color: var(--muted);

    font-size: 8px;

    font-weight: 800;
}


.sprite-card.owned .sprite-status {
    border-color:
        rgba(55, 232, 154, 0.22);

    background:
        rgba(55, 232, 154, 0.08);

    color: var(--success);
}


.sprite-status:hover {
    color: var(--text);

    border-color: var(--border-hover);
}


/* =========================================
   LOADING
========================================= */

.loading-state {
    min-height: 280px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    gap: 9px;

    color: var(--muted);
}


.loading-state strong {
    color: var(--text);

    font-size: 13px;
}


.loading-state span {
    font-size: 10px;
}


.loader {
    width: 38px;
    height: 38px;

    margin-bottom: 5px;

    border: 3px solid
        rgba(255, 255, 255, 0.07);

    border-top-color:
        var(--accent);

    border-radius: 50%;

    animation:
        spin 0.8s linear infinite;
}


@keyframes spin {

    to {
        transform: rotate(360deg);
    }

}


/* =========================================
   ERROR
========================================= */

.error-state {
    min-height: 280px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    gap: 8px;

    text-align: center;
}


.error-state > div {
    font-size: 28px;

    color: var(--danger);
}


.error-state strong {
    font-size: 14px;
}


.error-state span {
    color: var(--muted);

    font-size: 11px;
}


.error-state button {
    margin-top: 10px;

    padding: 8px 13px;

    border: 1px solid var(--border);

    border-radius: 8px;

    background: rgba(255, 255, 255, 0.04);

    color: var(--text);

    font-size: 11px;
}


/* =========================================
   EMPTY
========================================= */

.empty-state {
    grid-column: 1 / -1;

    min-height: 250px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    gap: 8px;

    color: var(--muted);

    text-align: center;
}


.empty-state strong {
    color: var(--text);

    font-size: 15px;
}


.empty-state span {
    font-size: 11px;
}


/* =========================================
   FOOTER
========================================= */

footer {
    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 20px;

    margin-top: 100px;

    padding: 28px 0;

    border-top: 1px solid var(--border);
}


.footer-brand {
    display: flex;

    align-items: center;

    gap: 10px;
}


.footer-brand .brand-icon {
    width: 30px;
    height: 30px;

    border-radius: 8px;

    font-size: 13px;
}


.footer-brand > div:last-child {
    display: flex;

    flex-direction: column;
}


.footer-brand strong {
    font-size: 11px;

    letter-spacing: 0.12em;
}


.footer-brand span {
    margin-top: 3px;

    color: var(--muted);

    font-size: 9px;
}


.footer-info {
    display: flex;

    gap: 8px;

    color: var(--muted);

    font-size: 9px;
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 1050px) {

    .hero {
        grid-template-columns: 1fr;
    }


    .hero-content {
        padding-bottom: 0;

        text-align: center;
    }


    .hero-pill {
        margin: auto;
    }


    .hero h1 {
        margin-left: auto;
        margin-right: auto;
    }


    .hero p {
        margin-left: auto;
        margin-right: auto;
    }


    .hero-actions {
        justify-content: center;
    }


    .hero-visual {
        height: 390px;
    }


    .stats-grid {
        grid-template-columns:
            repeat(2, 1fr);
    }

}


@media (max-width: 700px) {

    .navbar {
        padding: 0 4%;
    }


    .nav-center {
        display: none;
    }


    .user-info {
        display: none;
    }


    .page {
        width: 92%;
    }


    .hero {
        min-height: 560px;
    }


    .hero h1 {
        font-size: 49px;
    }


    .hero-actions {
        flex-direction: column;

        align-items: center;
    }


    .hero-visual {
        transform: scale(0.82);
    }


    .stats-grid {
        grid-template-columns: 1fr;
    }


    .filter-row {
        flex-direction: column;

        align-items: stretch;
    }


    .filter-group {
        overflow-x: auto;

        padding-bottom: 2px;
    }


    .select-filter {
        width: 100%;

        margin-left: 0;
    }


    .sprites-grid {
        grid-template-columns:
            repeat(2, minmax(0, 1fr));

        gap: 9px;
    }


    .sprite-image-container {
        height: 145px;
    }


    .sprite-info {
        padding: 11px;
    }


    .sprite-name {
        font-size: 12px;
    }


    .sprite-footer {
        flex-direction: column;

        align-items: stretch;
    }


    .sprite-status {
        width: 100%;
    }


    footer {
        flex-direction: column;

        align-items: flex-start;
    }

}


@media (max-width: 430px) {

    .discord-login {
        padding: 9px 11px;

        font-size: 10px;
    }


    .brand-text {
        display: none;
    }


    .hero h1 {
        font-size: 43px;
    }


    .hero p {
        font-size: 13px;
    }

}

/* =========================================================
   SPRITE VAULT - Fortnite Sprite Collection
   Reparatur: Bild-Proxy, echte Namen, Rarity-Farben,
   Local-Storage-Fallback, deutsche Varianten-Anzeige
   ========================================================= */

// =========================================================
// SUPABASE (Discord Login)
// =========================================================

const SUPABASE_URL = "https://ykbqnxqlbttqzaerqgnb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nHZCz4UMQecRv8WmvIiZ6A_j_aQLRx_";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// =========================================================
// CONFIG
// =========================================================

const SPRITES_SOURCES = [
    "https://cdn.jsdelivr.net/gh/valincius/fn-sprites@main/src/sprites.json",
    "https://raw.githubusercontent.com/valincius/fn-sprites/main/src/sprites.json"
];

const IMAGE_PROXY = "https://images.weserv.nl/?url=";
const REDIRECT_URL = "https://tommmyshelby.github.io/Fortnite/";
const LOCAL_KEY = "spritevault-collection";

const VARIANT_LABELS = {
    base: "Standard",
    gold: "Gold",
    candy: "Candy",
    galaxy: "Galaxy",
    holofoil: "Holofoil",
    cube: "Cube",
    quack: "Quack",
    gem: "Gem",
    cheatmaster: "Schummelmeister"
};

// =========================================================
// STATE
// =========================================================

let currentUser = null;
let sprites = [];
let collectedSprites = loadLocalCollection();

let currentFamily = "all";
let currentSearch = "";
let currentRarity = "all";
let currentVariant = "all";
let currentSort = "default";
let currentCollectionFilter = "all";

// =========================================================
// DOM
// =========================================================

const $ = (selector) => document.querySelector(selector);

const loginBtn = $("#login-btn");
const logoutBtn = $("#logout-btn");
const loggedInView = $("#logged-in-view");
const userAvatar = $("#user-avatar");
const userName = $("#user-name");
const authWarning = $("#auth-warning");
const databaseStatus = $("#database-status");

const collectedCount = $("#collected-count");
const totalCount = $("#total-count");
const progressNumber = $("#progress-number");
const progressBarFill = $("#progress-bar-fill");
const familyCount = $("#family-count");
const variantCount = $("#variant-count");

const searchInput = $("#search-input");
const rarityFilter = $("#rarity-filter");
const variantFilter = $("#variant-filter");
const sortFilter = $("#sort-filter");

const familyList = $("#family-list");
const spritesContainer = $("#sprites-container");
const visibleCount = $("#visible-count");

const loadingState = $("#loading-state");
const errorState = $("#error-state");
const errorMessage = $("#error-message");

// =========================================================
// HELPERS
// =========================================================

function loadLocalCollection() {
    try {
        const raw = localStorage.getItem(LOCAL_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveLocalCollection() {
    try {
        localStorage.setItem(
            LOCAL_KEY,
            JSON.stringify(collectedSprites)
        );
    } catch (error) {
        console.error("Local save failed:", error);
    }
}

function prettyFamily(name) {
    if (!name) {
        return "Unbekannt";
    }
    return String(name)
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim();
}

function variantLabel(variant) {
    if (!variant) {
        return "";
    }
    if (VARIANT_LABELS[variant]) {
        return VARIANT_LABELS[variant];
    }
    return String(variant)
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (c) => c.toUpperCase());
}

function seasonLabel(season) {
    if (!season) {
        return null;
    }
    const match = String(season).match(/^c(\d+)s(\d+)$/i);
    if (match) {
        return "Kapitel " + match[1] + " \u00b7 Season " + match[2];
    }
    return String(season).replace(/_/g, " ").toUpperCase();
}

function capitalize(text) {
    return String(text || "").replace(/^./, (c) => c.toUpperCase());
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function injectRarityStyles() {
    const style = document.createElement("style");
    style.textContent = [
        ".sprite-card { --rarity-color: #8b93a7; }",
        ".sprite-card.rarity-mythic { --rarity-color: #e8b1ff; }",
        ".sprite-card.rarity-legendary { --rarity-color: #ffb84d; }",
        ".sprite-card.rarity-epic { --rarity-color: #c86dff; }",
        ".sprite-card.rarity-rare { --rarity-color: #5ec8ff; }",
        ".sprite-card.rarity-special { --rarity-color: #37e89a; }",
        ".sprite-card .sprite-rarity { color: var(--rarity-color); font-weight: 800; text-transform: capitalize; }",
        ".sprite-card .sprite-family { text-transform: capitalize; }",
        ".sprite-card.collected .sprite-image { box-shadow: 0 0 0 1px var(--rarity-color), 0 10px 30px rgba(0,0,0,0.35); }",
        ".sprite-card .sprite-variant { color: #b8bfd0; }",
        ".sprite-card .sprite-season { color: #8b93a7; font-size: 11px; letter-spacing: 0.06em; }"
    ].join("\n");
    document.head.appendChild(style);
}

// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener("DOMContentLoaded", async () => {
    injectRarityStyles();
    setupControls();
    setupAuthButtons();

    await initializeAuth();
    await loadSprites();
});

// =========================================================
// AUTH
// =========================================================

async function initializeAuth() {
    try {
        const {
            data: { session },
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error("Supabase Session Error:", error);
            handleLoggedOutUser();
            return;
        }

        if (session && session.user) {
            await handleLoggedInUser(session.user);
        } else {
            handleLoggedOutUser();
        }

        supabaseClient.auth.onAuthStateChange(async (_event, session) => {
            if (session && session.user) {
                await handleLoggedInUser(session.user);
            } else {
                handleLoggedOutUser();
            }
        });
    } catch (error) {
        console.error("Auth initialization failed:", error);
        handleLoggedOutUser();
    }
}

function setupAuthButtons() {
    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {
            loginBtn.disabled = true;
            try {
                const { error } = await supabaseClient.auth.signInWithOAuth({
                    provider: "discord",
                    options: { redirectTo: REDIRECT_URL }
                });
                if (error) {
                    console.error("Discord Login Error:", error);
                    showAuthError(error.message);
                }
            } catch (error) {
                console.error("Login Error:", error);
                showAuthError(error.message);
            }
            loginBtn.disabled = false;
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                const { error } = await supabaseClient.auth.signOut();
                if (error) {
                    console.error("Logout Error:", error);
                    return;
                }
                handleLoggedOutUser();
                updateProgress();
                renderSprites();
            } catch (error) {
                console.error("Logout Error:", error);
            }
        });
    }
}

async function handleLoggedInUser(user) {
    currentUser = user;
    updateUserInterface();
    await loadCollection();
}

function handleLoggedOutUser() {
    currentUser = null;
    collectedSprites = loadLocalCollection();
    updateUserInterface();
}

function updateUserInterface() {
    if (currentUser) {
        if (loginBtn) {
            loginBtn.style.display = "none";
        }
        if (loggedInView) {
            loggedInView.style.display = "flex";
        }
        if (authWarning) {
            authWarning.style.display = "none";
        }

        const metadata = currentUser.user_metadata || {};
        const discordName =
            metadata.full_name ||
            metadata.name ||
            metadata.preferred_username ||
            (currentUser.email ? currentUser.email.split("@")[0] : "") ||
            "Discord User";

        if (userName) {
            userName.textContent = discordName;
        }

        const avatar = metadata.avatar_url || metadata.picture || null;
        if (userAvatar) {
            if (avatar) {
                userAvatar.src = avatar;
                userAvatar.style.display = "block";
            } else {
                userAvatar.style.display = "none";
            }
        }

        if (databaseStatus) {
            databaseStatus.textContent = "Verbunden";
        }
    } else {
        if (loginBtn) {
            loginBtn.style.display = "";
        }
        if (loggedInView) {
            loggedInView.style.display = "none";
        }
        if (authWarning) {
            authWarning.style.display = "";
        }
        if (databaseStatus) {
            databaseStatus.textContent = "Nicht angemeldet";
        }
    }

    updateProgress();
}

function showAuthError(message) {
    console.error(message);
    if (!authWarning) {
        return;
    }
    authWarning.style.display = "block";
    authWarning.innerHTML =
        "<strong>Discord Login fehlgeschlagen</strong>" +
        "<br>" +
        "<span>" + escapeHtml(message || "Unbekannter Fehler") + "</span>";
}

// =========================================================
// COLLECTION
// =========================================================

async function loadCollection() {
    if (!currentUser) {
        collectedSprites = loadLocalCollection();
        updateProgress();
        renderSprites();
        return;
    }

    try {
        const metadata = currentUser.user_metadata || {};
        const saved = metadata.collected_sprites;

        if (Array.isArray(saved) && saved.length > 0) {
            collectedSprites = [...saved];
        } else {
            // Migration: lokale Sammlung uebernehmen und hochladen
            collectedSprites = loadLocalCollection();
            if (collectedSprites.length > 0) {
                await saveCollection();
            }
        }

        updateProgress();
        renderSprites();
    } catch (error) {
        console.error("Collection loading failed:", error);
        collectedSprites = loadLocalCollection();
        updateProgress();
        renderSprites();
    }
}

async function saveCollection() {
    saveLocalCollection();

    if (!currentUser) {
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.updateUser({
            data: { collected_sprites: collectedSprites }
        });

        if (error) {
            console.error("Collection save error:", error);
            return;
        }

        if (data && data.user) {
            currentUser = data.user;
        }
    } catch (error) {
        console.error("Collection save failed:", error);
    }
}

// =========================================================
// LOAD SPRITES
// =========================================================

async function fetchFirstAvailableSource() {
    for (const source of SPRITES_SOURCES) {
        try {
            const response = await fetch(source);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn("Source failed:", source);
        }
    }
    return null;
}

async function loadSprites() {
    showLoading();

    try {
        const data = await fetchFirstAvailableSource();

        if (!Array.isArray(data)) {
            throw new Error("Sprite-Daten haben kein gueltiges Format.");
        }

        sprites = data.map((sprite, index) => {
            const spriteId = sprite.spriteId || sprite.id || "sprite-" + index;
            const variant = sprite.variant || "base";
            const family = prettyFamily(sprite.parent || sprite.family);
            const label = variantLabel(variant);

            return {
                id: spriteId + "-" + variant,
                originalId: spriteId,
                name: family + (variant === "base" ? "" : " \u00b7 " + label),
                family: family,
                familyRaw: sprite.parent || sprite.family || "",
                rarity: sprite.rarity || "unbekannt",
                variant: variant,
                image: sprite.url || sprite.image || "",
                season: sprite.season || null
            };
        });

        populateFilters();
        populateFamilies();

        hideLoading();
        updateProgress();
        renderSprites();
    } catch (error) {
        console.error("Sprite loading failed:", error);
        showError("Die Sprite-Daten konnten nicht geladen werden.");
    }
}

// =========================================================
// FILTER SETUP
// =========================================================

function populateFilters() {
    if (rarityFilter) {
        const rarities = [...new Set(
            sprites.map((s) => s.rarity).filter(Boolean)
        )].sort((a, b) => a.localeCompare(b));

        rarityFilter.innerHTML = '<option value="all">Alle Seltenheiten</option>';

        rarities.forEach((rarity) => {
            const option = document.createElement("option");
            option.value = rarity;
            option.textContent = capitalize(rarity);
            rarityFilter.appendChild(option);
        });
    }

    if (variantFilter) {
        const variants = [...new Set(
            sprites.map((s) => s.variant).filter(Boolean)
        )].sort((a, b) => a.localeCompare(b));

        variantFilter.innerHTML = '<option value="all">Alle Varianten</option>';

        variants.forEach((variant) => {
            const option = document.createElement("option");
            option.value = variant;
            option.textContent = variantLabel(variant);
            variantFilter.appendChild(option);
        });
    }
}

// =========================================================
// FAMILY NAVIGATION
// =========================================================

function populateFamilies() {
    if (!familyList) {
        return;
    }

    familyList.innerHTML = "";
    familyList.appendChild(createFamilyButton("all", "Alle"));

    const families = [...new Set(
        sprites.map((s) => s.family).filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    families.forEach((family) => {
        familyList.appendChild(createFamilyButton(family, family));
    });
}

function createFamilyButton(value, label) {
    const button = document.createElement("button");
    button.className = "family-btn" + (value === "all" ? " active" : "");
    button.dataset.family = value;
    button.textContent = label;

    button.addEventListener("click", () => {
        currentFamily = value;
        document
            .querySelectorAll(".family-btn")
            .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        renderSprites();
    });

    return button;
}

// =========================================================
// CONTROLS
// =========================================================

function setupControls() {
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            currentSearch = searchInput.value.trim().toLowerCase();
            renderSprites();
        });
    }

    if (rarityFilter) {
        rarityFilter.addEventListener("change", () => {
            currentRarity = rarityFilter.value;
            renderSprites();
        });
    }

    if (variantFilter) {
        variantFilter.addEventListener("change", () => {
            currentVariant = variantFilter.value;
            renderSprites();
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener("change", () => {
            currentSort = sortFilter.value;
            renderSprites();
        });
    }

    document
        .querySelectorAll(".filter-btn")
        .forEach((button) => {
            button.addEventListener("click", () => {
                currentCollectionFilter = button.dataset.filter || "all";
                document
                    .querySelectorAll(".filter-btn")
                    .forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");
                renderSprites();
            });
        });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "/" &&
            document.activeElement !== searchInput
        ) {
            event.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }

        if (
            event.key === "Escape" &&
            document.activeElement === searchInput
        ) {
            searchInput.value = "";
            currentSearch = "";
            searchInput.blur();
            renderSprites();
        }
    });
}

// =========================================================
// GET VISIBLE SPRITES
// =========================================================

function getVisibleSprites() {
    let result = [...sprites];

    if (currentCollectionFilter === "owned") {
        result = result.filter((s) => collectedSprites.includes(s.id));
    } else if (currentCollectionFilter === "missing") {
        result = result.filter((s) => !collectedSprites.includes(s.id));
    }

    if (currentSearch) {
        result = result.filter((sprite) => {
            const searchableText = [
                sprite.name,
                sprite.family,
                sprite.familyRaw,
                sprite.rarity,
                sprite.variant,
                variantLabel(sprite.variant),
                sprite.originalId
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(currentSearch);
        });
    }

    if (currentFamily !== "all") {
        result = result.filter((s) => s.family === currentFamily);
    }

    if (currentRarity !== "all") {
        result = result.filter((s) => s.rarity === currentRarity);
    }

    if (currentVariant !== "all") {
        result = result.filter((s) => s.variant === currentVariant);
    }

    switch (currentSort) {
        case "name":
            result.sort((a, b) =>
                a.name.localeCompare(b.name, undefined, {
                    numeric: true,
                    sensitivity: "base"
                })
            );
            break;

        case "rarity":
            result.sort((a, b) =>
                a.rarity.localeCompare(b.rarity, undefined, {
                    sensitivity: "base"
                })
            );
            break;

        case "variant":
            result.sort((a, b) =>
                a.variant.localeCompare(b.variant, undefined, {
                    sensitivity: "base"
                })
            );
            break;

        default:
            break;
    }

    return result;
}

// =========================================================
// RENDER SPRITES
// =========================================================

function renderSprites() {
    if (!spritesContainer) {
        return;
    }

    const visibleSprites = getVisibleSprites();

    if (visibleCount) {
        visibleCount.textContent =
            visibleSprites.length + " Ergebnisse";
    }

    spritesContainer.innerHTML = "";

    if (visibleSprites.length === 0) {
        spritesContainer.innerHTML =
            '<div class="empty-state">' +
            '<div class="empty-icon">🔎</div>' +
            "<h3>Keine Sprites gefunden</h3>" +
            "<p>Fuer deine aktuellen Filter wurden keine Sprites gefunden.</p>" +
            "</div>";
        return;
    }

    const fragment = document.createDocumentFragment();

    visibleSprites.forEach((sprite) => {
        fragment.appendChild(createSpriteCard(sprite));
    });

    spritesContainer.appendChild(fragment);
}

function createSpriteCard(sprite) {
    const card = document.createElement("article");
    card.className =
        "sprite-card rarity-" +
        String(sprite.rarity || "unbekannt").toLowerCase();

    const isCollected = collectedSprites.includes(sprite.id);
    if (isCollected) {
        card.classList.add("collected");
    }

    // ------------------- IMAGE -------------------

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "sprite-image";

    if (sprite.image) {
        const image = document.createElement("img");
        image.alt = sprite.name;
        image.loading = "lazy";
        image.decoding = "async";
        image.referrerPolicy = "no-referrer";
        image.src = sprite.image;

        image.addEventListener("error", () => {
            if (!image.dataset.retried) {
                // Hotlink blockiert -> ueber Bild-Proxy neu laden
                image.dataset.retried = "1";
                image.src = IMAGE_PROXY + encodeURIComponent(sprite.image);
                return;
            }

            image.style.display = "none";
            imageWrapper.classList.add("image-error");

            if (!imageWrapper.querySelector(".image-error-text")) {
                const errorText = document.createElement("span");
                errorText.className = "image-error-text";
                errorText.textContent = "Bild nicht verfuegbar";
                imageWrapper.appendChild(errorText);
            }
        });

        imageWrapper.appendChild(image);
    } else {
        imageWrapper.classList.add("image-error");
        imageWrapper.innerHTML =
            '<span class="image-error-text">Kein Bild</span>';
    }

    // ------------------- COLLECT BUTTON -------------------

    const collectButton = document.createElement("button");
    collectButton.className = "collect-button";
    collectButton.type = "button";
    collectButton.title = isCollected
        ? "Aus Sammlung entfernen"
        : "Zur Sammlung hinzufuegen";
    collectButton.textContent = isCollected ? "\u2713" : "+";

    collectButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleSprite(sprite.id);
    });

    // ------------------- INFO -------------------

    const info = document.createElement("div");
    info.className = "sprite-info";

    const name = document.createElement("h3");
    name.className = "sprite-name";
    name.textContent = sprite.name;

    const meta = document.createElement("div");
    meta.className = "sprite-meta";

    const family = document.createElement("span");
    family.className = "sprite-family";
    family.textContent = sprite.family;

    const rarity = document.createElement("span");
    rarity.className = "sprite-rarity";
    rarity.textContent = capitalize(sprite.rarity);

    meta.appendChild(family);
    meta.appendChild(rarity);

    if (sprite.variant && sprite.variant !== "base") {
        const variant = document.createElement("span");
        variant.className = "sprite-variant";
        variant.textContent = variantLabel(sprite.variant);
        meta.appendChild(variant);
    }

    const season = seasonLabel(sprite.season);
    if (season) {
        const seasonEl = document.createElement("div");
        seasonEl.className = "sprite-season";
        seasonEl.textContent = season;
        info.appendChild(seasonEl);
    }

    info.appendChild(name);
    info.appendChild(meta);

    card.appendChild(imageWrapper);
    card.appendChild(collectButton);
    card.appendChild(info);

    card.addEventListener("click", () => {
        toggleSprite(sprite.id);
    });

    return card;
}

// =========================================================
// TOGGLE / PROGRESS
// =========================================================

async function toggleSprite(spriteId) {
    const index = collectedSprites.indexOf(spriteId);

    if (index === -1) {
        collectedSprites.push(spriteId);
    } else {
        collectedSprites.splice(index, 1);
    }

    // Sofort UI aktualisieren
    updateProgress();
    renderSprites();

    // Speichern (immer lokal, zusaetzlich in Supabase wenn eingeloggt)
    await saveCollection();
}

function updateProgress() {
    const total = sprites.length;
    const collected = sprites.filter((s) =>
        collectedSprites.includes(s.id)
    ).length;

    const percentage =
        total > 0 ? Math.round((collected / total) * 100) : 0;

    if (collectedCount) {
        collectedCount.textContent = collected;
    }
    if (totalCount) {
        totalCount.textContent = total;
    }
    if (progressNumber) {
        progressNumber.textContent = percentage + "%";
    }
    if (progressBarFill) {
        progressBarFill.style.width = percentage + "%";
    }

    updateFamilyCount();
    updateVariantCount();
}

function updateFamilyCount() {
    if (!familyCount) {
        return;
    }
    familyCount.textContent = new Set(sprites.map((s) => s.family)).size;
}

function updateVariantCount() {
    if (!variantCount) {
        return;
    }
    variantCount.textContent = new Set(
        sprites.map((s) => s.variant).filter(Boolean)
    ).size;
}

// =========================================================
// STATES
// =========================================================

function showLoading() {
    if (loadingState) {
        loadingState.style.display = "";
    }
    if (errorState) {
        errorState.style.display = "none";
    }
    if (spritesContainer) {
        spritesContainer.style.display = "none";
    }
}

function hideLoading() {
    if (loadingState) {
        loadingState.style.display = "none";
    }
    if (errorState) {
        errorState.style.display = "none";
    }
    if (spritesContainer) {
        spritesContainer.style.display = "";
    }
}

function showError(message) {
    if (loadingState) {
        loadingState.style.display = "none";
    }
    if (spritesContainer) {
        spritesContainer.style.display = "none";
    }
    if (errorState) {
        errorState.style.display = "";
    }
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

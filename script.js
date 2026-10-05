/* =========================================================
   SPRITE VAULT - Fortnite Sprite Collection
   v2: Markup 100% an die vorhandene style.css angepasst
   (.owned, .owned-badge, .sprite-image-container, .sprite-status,
   Rarity-Badges), Bild-Proxy-Fallback, Local-Storage ohne Login
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
let collectedSprites = [];

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

// Zusaetzliche Styles, die in style.css noch fehlen
function injectExtraStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .sprite-image-container .image-error-text {
            position: relative;
            z-index: 1;
            color: #596176;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            padding: 10px;
        }
        .sprite-season {
            color: #596176;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }
        .sprite-card { cursor: pointer; }
        body.collection-locked #collection,
        body.collection-locked .sprites-section {
            position: relative;
        }
        body.collection-locked .sprites-section .sprites-grid,
        body.collection-locked .stats-section {
            filter: blur(7px);
            opacity: 0.48;
            pointer-events: none;
            user-select: none;
        }
        body.collection-locked .collection-lock-overlay {
            display: flex;
        }
        .collection-lock-overlay {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: rgba(4, 6, 12, 0.48);
            backdrop-filter: blur(4px);
        }
        .collection-lock-card {
            width: min(460px, 100%);
            padding: 30px;
            border: 1px solid rgba(255,255,255,.1);
            border-radius: 24px;
            background: rgba(14,18,29,.94);
            box-shadow: 0 30px 80px rgba(0,0,0,.45);
            text-align: center;
        }
        .collection-lock-icon {
            width: 54px;
            height: 54px;
            display: grid;
            place-items: center;
            margin: 0 auto 18px;
            border-radius: 16px;
            background: rgba(124,92,255,.14);
            font-size: 24px;
        }
        .collection-lock-card h2 { margin-bottom: 8px; }
        .collection-lock-card p { color: #9aa3b8; line-height: 1.6; margin-bottom: 20px; }
        .collection-lock-login {
            border: 0;
            border-radius: 12px;
            padding: 12px 18px;
            background: #5865f2;
            color: white;
            font-weight: 800;
        }
    `;
    document.head.appendChild(style);

    if (!document.querySelector(".collection-lock-overlay")) {
        const overlay = document.createElement("div");
        overlay.className = "collection-lock-overlay";
        overlay.innerHTML = `
            <div class="collection-lock-card">
                <div class="collection-lock-icon">🔒</div>
                <h2>Deine Sammlung</h2>
                <p>Melde dich mit Discord an, um deine persönliche Sprite-Sammlung zu sehen und deinen Fortschritt zu speichern.</p>
                <button class="collection-lock-login" type="button">Mit Discord anmelden</button>
            </div>
        `;
        overlay.querySelector("button").addEventListener("click", loginWithDiscord);
        document.body.appendChild(overlay);
    }
}

// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener("DOMContentLoaded", async () => {
    injectExtraStyles();
    setupControls();
    setupAuthButtons();

    await initializeAuth();
    await loadSprites();
});

// Global, damit onclick="loginWithDiscord()" im index.html funktioniert
function loginWithDiscord() {
    if (loginBtn) {
        loginBtn.click();
    }
}

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
    document.body.classList.remove("collection-locked");
    updateUserInterface();
    await loadCollection();
}

function handleLoggedOutUser() {
    currentUser = null;
    collectedSprites = [];
    document.body.classList.add("collection-locked");
    updateUserInterface();
    updateProgress();
    renderSprites();
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
    authWarning.style.display = "flex";
    authWarning.innerHTML =
        '<div class="warning-icon">!</div>' +
        "<div><strong>Discord Login fehlgeschlagen</strong>" +
        "<p>" + escapeHtml(message || "Unbekannter Fehler") + "</p></div>";
}

// =========================================================
// COLLECTION
// =========================================================

async function loadCollection() {
    if (!currentUser) {
        collectedSprites = [];
        updateProgress();
        renderSprites();
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from("user_sprites")
            .select("sprite_id")
            .eq("user_id", currentUser.id)
            .eq("collected", true);

        if (error) {
            throw error;
        }

        collectedSprites = (data || [])
            .map(row => row.sprite_id)
            .filter(Boolean);

        updateProgress();
        renderSprites();
    } catch (error) {
        console.error("Collection loading failed:", error);
        collectedSprites = [];
        updateProgress();
        renderSprites();
        showAuthError("Deine Sammlung konnte nicht geladen werden. Prüfe bitte die Supabase-RLS-Policies.");
    }
}

async function saveCollection() {
    if (!currentUser) {
        return false;
    }

    try {
        const { error } = await supabaseClient
            .rpc("set_sprite_collected", {
                p_sprite_id: pendingSpriteId,
                p_collected: pendingCollectedState
            });

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error("Collection save failed:", error);
        return false;
    }
}

let pendingSpriteId = null;
let pendingCollectedState = false;

async function saveSpriteState(spriteId, collected) {
    if (!currentUser) {
        return false;
    }

    pendingSpriteId = spriteId;
    pendingCollectedState = collected;

    return await saveCollection();
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

            return {
                id: spriteId + "-" + variant,
                originalId: spriteId,
                name: family + (variant === "base" ? "" : " \u00b7 " + variantLabel(variant)),
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
// (Markup exakt passend zur style.css:
//  .sprite-card .owned / .sprite-image-container /
//  .sprite-image / .owned-badge / .sprite-rarity
//  .rarity-* / .sprite-info / .sprite-footer /
//  .sprite-status)
// =========================================================

function renderSprites() {
    if (!spritesContainer) {
        return;
    }

    const visibleSprites = getVisibleSprites();

    if (visibleCount) {
        visibleCount.textContent = visibleSprites.length + " Ergebnisse";
    }

    spritesContainer.innerHTML = "";

    if (visibleSprites.length === 0) {
        spritesContainer.innerHTML =
            '<div class="empty-state">' +
            "<strong>Keine Sprites gefunden</strong>" +
            "<span>Fuer deine aktuellen Filter wurden keine Sprites gefunden.</span>" +
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
    const isCollected = collectedSprites.includes(sprite.id);

    const card = document.createElement("article");
    card.className = "sprite-card" + (isCollected ? " owned" : "");

    // ---------------- BILDCONTAINER ----------------

    const imageContainer = document.createElement("div");
    imageContainer.className = "sprite-image-container";

    if (sprite.image) {
        const image = document.createElement("img");
        image.className = "sprite-image";
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

            image.remove();

            const errorText = document.createElement("span");
            errorText.className = "image-error-text";
            errorText.textContent = "Bild nicht verfuegbar";
            imageContainer.appendChild(errorText);
        });

        imageContainer.appendChild(image);
    } else {
        const errorText = document.createElement("span");
        errorText.className = "image-error-text";
        errorText.textContent = "Kein Bild";
        imageContainer.appendChild(errorText);
    }

    // ---------------- OWNED BADGE ----------------

    const badge = document.createElement("div");
    badge.className = "owned-badge";
    badge.textContent = "\u2713";
    imageContainer.appendChild(badge);

    card.appendChild(imageContainer);

    // ---------------- INFO ----------------

    const info = document.createElement("div");
    info.className = "sprite-info";

    const meta = document.createElement("div");
    meta.className = "sprite-meta";

    const rarityClass =
        "rarity-" + String(sprite.rarity || "unbekannt").toLowerCase();

    const rarity = document.createElement("span");
    rarity.className = "sprite-rarity " + rarityClass;
    rarity.textContent = sprite.rarity;

    const id = document.createElement("span");
    id.className = "sprite-id";
    id.textContent = "#" + sprite.originalId;

    meta.appendChild(rarity);
    meta.appendChild(id);

    const name = document.createElement("h3");
    name.className = "sprite-name";
    name.textContent = sprite.name;

    const family = document.createElement("div");
    family.className = "sprite-family";
    family.textContent = sprite.family;

    const season = seasonLabel(sprite.season);
    if (season) {
        family.textContent = family.textContent + " \u00b7 " + season;
    }

    const footer = document.createElement("div");
    footer.className = "sprite-footer";

    const variant = document.createElement("span");
    variant.className = "sprite-variant";
    variant.textContent = variantLabel(sprite.variant);

    const status = document.createElement("button");
    status.className = "sprite-status";
    status.type = "button";
    status.textContent = !currentUser ? "Anmelden" : (isCollected ? "\u2713 Gesammelt" : "Sammeln");
    status.title = !currentUser
        ? "Mit Discord anmelden"
        : (isCollected ? "Aus Sammlung entfernen" : "Zur Sammlung hinzufuegen");

    status.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleSprite(sprite.id);
    });

    footer.appendChild(variant);
    footer.appendChild(status);

    info.appendChild(meta);
    info.appendChild(name);
    info.appendChild(family);
    info.appendChild(footer);

    card.appendChild(info);

    // Ganze Karte klickbar
    card.addEventListener("click", () => {
        toggleSprite(sprite.id);
    });

    return card;
}

// =========================================================
// TOGGLE / PROGRESS
// =========================================================

async function toggleSprite(spriteId) {
    if (!currentUser) {
        loginWithDiscord();
        return;
    }

    const wasCollected = collectedSprites.includes(spriteId);
    const nextCollected = !wasCollected;

    if (nextCollected) {
        collectedSprites.push(spriteId);
    } else {
        collectedSprites = collectedSprites.filter(id => id !== spriteId);
    }

    updateProgress();
    renderSprites();

    const saved = await saveSpriteState(
        spriteId,
        nextCollected
    );

    if (!saved) {
        if (wasCollected) {
            collectedSprites.push(spriteId);
        } else {
            collectedSprites = collectedSprites.filter(id => id !== spriteId);
        }

        updateProgress();
        renderSprites();
    }
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
        progressNumber.textContent = percentage;
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

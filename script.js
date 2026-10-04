/* =========================================================
   SPRITE VAULT
   Fortnite Sprite Collection
   ========================================================= */

// =========================================================
// SUPABASE
// =========================================================

const SUPABASE_URL = "https://ykbqnxqlbttqzaerqgnb.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_nHZCz4UMQecRv8WmvIiZ6A_j_aQLRx_";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// =========================================================
// CONFIG
// =========================================================

const SPRITES_URL =
    "https://raw.githubusercontent.com/valincius/fn-sprites/main/src/sprites.json";

const REDIRECT_URL =
    "https://tommmyshelby.github.io/Fortnite/";

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

const loadingState = $("#loading-state");
const errorState = $("#error-state");
const errorMessage = $("#error-message");


// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener("DOMContentLoaded", async () => {
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
            return;
        }

        if (session?.user) {
            await handleLoggedInUser(session.user);
        } else {
            handleLoggedOutUser();
        }

        supabaseClient.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await handleLoggedInUser(session.user);
            } else {
                handleLoggedOutUser();
            }
        });

    } catch (error) {
        console.error("Auth initialization failed:", error);
    }
}


// =========================================================
// LOGIN
// =========================================================

function setupAuthButtons() {

    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {

            loginBtn.disabled = true;

            try {

                const { error } =
                    await supabaseClient.auth.signInWithOAuth({
                        provider: "discord",

                        options: {
                            redirectTo: REDIRECT_URL
                        }
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

                const { error } =
                    await supabaseClient.auth.signOut();

                if (error) {
                    console.error("Logout Error:", error);
                    return;
                }

                collectedSprites = [];

                updateUserInterface();
                updateProgress();
                renderSprites();

            } catch (error) {
                console.error("Logout Error:", error);
            }
        });
    }
}


// =========================================================
// HANDLE LOGIN
// =========================================================

async function handleLoggedInUser(user) {

    currentUser = user;

    console.log("Logged in:", user);

    updateUserInterface();

    await loadCollection();
}


// =========================================================
// HANDLE LOGOUT
// =========================================================

function handleLoggedOutUser() {

    currentUser = null;
    collectedSprites = [];

    updateUserInterface();
}


// =========================================================
// USER INTERFACE
// =========================================================

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

        const discordName =
            currentUser.user_metadata?.full_name ||
            currentUser.user_metadata?.name ||
            currentUser.user_metadata?.preferred_username ||
            currentUser.email?.split("@")[0] ||
            "Discord User";

        if (userName) {
            userName.textContent = discordName;
        }


        const avatar =
            currentUser.user_metadata?.avatar_url ||
            currentUser.user_metadata?.picture ||
            null;

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


// =========================================================
// AUTH ERROR
// =========================================================

function showAuthError(message) {

    console.error(message);

    if (!authWarning) {
        return;
    }

    authWarning.style.display = "block";

    authWarning.innerHTML = `
        <strong>Discord Login fehlgeschlagen</strong>
        <br>
        <span>${escapeHtml(message || "Unbekannter Fehler")}</span>
    `;
}


// =========================================================
// LOAD COLLECTION
// =========================================================

async function loadCollection() {

    if (!currentUser) {
        collectedSprites = [];
        updateProgress();
        renderSprites();
        return;
    }

    try {

        const metadata =
            currentUser.user_metadata || {};

        const savedCollection =
            metadata.collected_sprites;

        if (Array.isArray(savedCollection)) {

            collectedSprites = [...savedCollection];

        } else {

            collectedSprites = [];
        }

        console.log(
            "Loaded collection:",
            collectedSprites.length
        );

        updateProgress();
        renderSprites();

    } catch (error) {

        console.error(
            "Collection loading failed:",
            error
        );

        collectedSprites = [];

        updateProgress();
        renderSprites();
    }
}


// =========================================================
// SAVE COLLECTION
// =========================================================

async function saveCollection() {

    if (!currentUser) {
        return;
    }

    try {

        const { data, error } =
            await supabaseClient.auth.updateUser({
                data: {
                    collected_sprites: collectedSprites
                }
            });

        if (error) {
            console.error(
                "Collection save error:",
                error
            );
            return;
        }

        if (data?.user) {
            currentUser = data.user;
        }

        console.log(
            "Collection saved:",
            collectedSprites.length
        );

    } catch (error) {

        console.error(
            "Collection save failed:",
            error
        );
    }
}


// =========================================================
// LOAD SPRITES
// =========================================================

async function loadSprites() {

    showLoading();

    try {

        const response =
            await fetch(SPRITES_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "Sprite-Daten haben kein gültiges Format."
            );
        }

        sprites = data.map((sprite, index) => {

            const spriteId =
                sprite.spriteId ||
                sprite.id ||
                `sprite-${index}`;

            const variant =
                sprite.variant ||
                "Default";

            return {

                id: `${spriteId}-${variant}`,

                originalId: spriteId,

                name:
                    sprite.name ||
                    sprite.displayName ||
                    spriteId,

                family:
                    sprite.parent ||
                    sprite.family ||
                    "Unbekannt",

                rarity:
                    sprite.rarity ||
                    "Unbekannt",

                variant,

                image:
                    sprite.url ||
                    sprite.image ||
                    "",

                season:
                    sprite.season ||
                    null
            };
        });

        console.log(
            `Loaded ${sprites.length} sprites`
        );

        populateFilters();
        populateFamilies();
        updateFamilyCount();
        updateVariantCount();

        hideLoading();

        updateProgress();
        renderSprites();

    } catch (error) {

        console.error(
            "Sprite loading failed:",
            error
        );

        showError(
            "Die Sprite-Daten konnten nicht geladen werden."
        );
    }
}


// =========================================================
// FILTER SETUP
// =========================================================

function populateFilters() {

    // -----------------------------
    // RARITY
    // -----------------------------

    if (rarityFilter) {

        const rarities =
            [...new Set(
                sprites
                    .map(sprite => sprite.rarity)
                    .filter(Boolean)
            )]
            .sort((a, b) =>
                a.localeCompare(b)
            );

        rarityFilter.innerHTML = `
            <option value="all">Alle Seltenheiten</option>
        `;

        rarities.forEach(rarity => {

            const option =
                document.createElement("option");

            option.value = rarity;
            option.textContent = rarity;

            rarityFilter.appendChild(option);
        });
    }


    // -----------------------------
    // VARIANTS
    // -----------------------------

    if (variantFilter) {

        const variants =
            [...new Set(
                sprites
                    .map(sprite => sprite.variant)
                    .filter(Boolean)
            )]
            .sort((a, b) =>
                a.localeCompare(b)
            );

        variantFilter.innerHTML = `
            <option value="all">Alle Varianten</option>
        `;

        variants.forEach(variant => {

            const option =
                document.createElement("option");

            option.value = variant;
            option.textContent = variant;

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

    // -----------------------------
    // ALL
    // -----------------------------

    const allButton =
        createFamilyButton(
            "all",
            "Alle"
        );

    allButton.classList.add("active");

    familyList.appendChild(allButton);


    // -----------------------------
    // FAMILIES
    // -----------------------------

    const families =
        [...new Set(
            sprites
                .map(sprite => sprite.family)
                .filter(Boolean)
        )]
        .sort((a, b) =>
            a.localeCompare(b)
        );

    families.forEach(family => {

        familyList.appendChild(
            createFamilyButton(
                family,
                family
            )
        );
    });
}


// =========================================================
// CREATE FAMILY BUTTON
// =========================================================

function createFamilyButton(value, label) {

    const button =
        document.createElement("button");

    button.className = "family-btn";

    button.dataset.family = value;

    button.textContent = label;

    button.addEventListener("click", () => {

        currentFamily = value;

        document
            .querySelectorAll(".family-btn")
            .forEach(btn => {
                btn.classList.remove("active");
            });

        button.classList.add("active");

        renderSprites();
    });

    return button;
}


// =========================================================
// CONTROLS
// =========================================================

function setupControls() {

    // -----------------------------
    // SEARCH
    // -----------------------------

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                currentSearch =
                    searchInput.value
                        .trim()
                        .toLowerCase();

                renderSprites();
            }
        );
    }


    // -----------------------------
    // RARITY
    // -----------------------------

    if (rarityFilter) {

        rarityFilter.addEventListener(
            "change",
            () => {

                currentRarity =
                    rarityFilter.value;

                renderSprites();
            }
        );
    }


    // -----------------------------
    // VARIANT
    // -----------------------------

    if (variantFilter) {

        variantFilter.addEventListener(
            "change",
            () => {

                currentVariant =
                    variantFilter.value;

                renderSprites();
            }
        );
    }


    // -----------------------------
    // SORT
    // -----------------------------

    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            () => {

                currentSort =
                    sortFilter.value;

                renderSprites();
            }
        );
    }


    // =====================================================
    // COLLECTION FILTER
    // =====================================================

    document
        .querySelectorAll(".filter-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    currentCollectionFilter =
                        button.dataset.filter || "all";

                    document
                        .querySelectorAll(".filter-btn")
                        .forEach(btn => {
                            btn.classList.remove("active");
                        });

                    button.classList.add("active");

                    renderSprites();
                }
            );
        });


    // -----------------------------
    // KEYBOARD SEARCH
    // -----------------------------

    document.addEventListener(
        "keydown",
        event => {

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
        }
    );
}


// =========================================================
// GET VISIBLE SPRITES
// =========================================================

function getVisibleSprites() {

    let result = [...sprites];


    // =====================================================
    // COLLECTION FILTER
    // =====================================================

    if (currentCollectionFilter === "owned") {

        result = result.filter(sprite =>
            collectedSprites.includes(sprite.id)
        );

    } else if (currentCollectionFilter === "missing") {

        result = result.filter(sprite =>
            !collectedSprites.includes(sprite.id)
        );
    }


    // =====================================================
    // SEARCH
    // =====================================================

    if (currentSearch) {

        result = result.filter(sprite => {

            const searchableText = [
                sprite.name,
                sprite.family,
                sprite.rarity,
                sprite.variant,
                sprite.originalId
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
                currentSearch
            );
        });
    }


    // =====================================================
    // FAMILY
    // =====================================================

    if (currentFamily !== "all") {

        result = result.filter(
            sprite =>
                sprite.family === currentFamily
        );
    }


    // =====================================================
    // RARITY
    // =====================================================

    if (currentRarity !== "all") {

        result = result.filter(
            sprite =>
                sprite.rarity === currentRarity
        );
    }


    // =====================================================
    // VARIANT
    // =====================================================

    if (currentVariant !== "all") {

        result = result.filter(
            sprite =>
                sprite.variant === currentVariant
        );
    }


    // =====================================================
    // SORT
    // =====================================================

    switch (currentSort) {

        case "name":

            result.sort((a, b) =>
                a.name.localeCompare(
                    b.name,
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                )
            );

            break;


        case "rarity":

            result.sort((a, b) =>
                a.rarity.localeCompare(
                    b.rarity,
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
            );

            break;


        case "variant":

            result.sort((a, b) =>
                a.variant.localeCompare(
                    b.variant,
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
            );

            break;


        case "owned":

            result.sort((a, b) => {

                const aOwned =
                    collectedSprites.includes(a.id);

                const bOwned =
                    collectedSprites.includes(b.id);

                return (
                    Number(bOwned) -
                    Number(aOwned)
                );
            });

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

    const visibleSprites =
        getVisibleSprites();

    spritesContainer.innerHTML = "";


    // -----------------------------
    // NOTHING FOUND
    // -----------------------------

    if (visibleSprites.length === 0) {

        spritesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔎</div>

                <h3>Keine Sprites gefunden</h3>

                <p>
                    Für deine aktuellen Filter
                    wurden keine Sprites gefunden.
                </p>
            </div>
        `;

        return;
    }




    const fragment =
        document.createDocumentFragment();

    visibleSprites.forEach(sprite => {

        fragment.appendChild(
            createSpriteCard(sprite)
        );
    });

    spritesContainer.appendChild(
        fragment
    );
}




function createSpriteCard(sprite) {

    const card =
        document.createElement("article");

    card.className = "sprite-card";

    const isCollected =
        collectedSprites.includes(sprite.id);

    if (isCollected) {
        card.classList.add("collected");
    }


    // -----------------------------
    // IMAGE
    // -----------------------------

    const imageWrapper =
        document.createElement("div");

    imageWrapper.className =
        "sprite-image";


    if (sprite.image) {

        const image =
            document.createElement("img");

        image.src = sprite.image;

        image.alt = sprite.name;

        image.loading = "lazy";

        image.decoding = "async";

        image.addEventListener(
            "error",
            () => {

                image.style.display =
                    "none";

                imageWrapper.classList.add(
                    "image-error"
                );

                if (
                    !imageWrapper.querySelector(
                        ".image-error-text"
                    )
                ) {

                    const errorText =
                        document.createElement(
                            "span"
                        );

                    errorText.className =
                        "image-error-text";

                    errorText.textContent =
                        "Bild nicht verfügbar";

                    imageWrapper.appendChild(
                        errorText
                    );
                }
            }
        );

        imageWrapper.appendChild(
            image
        );

    } else {

        imageWrapper.classList.add(
            "image-error"
        );

        imageWrapper.innerHTML = `
            <span class="image-error-text">
                Kein Bild
            </span>
        `;
    }


    // -----------------------------
    // COLLECTION BUTTON
    // -----------------------------

    const collectButton =
        document.createElement("button");

    collectButton.className =
        "collect-button";

    collectButton.type = "button";

    collectButton.title =
        isCollected
            ? "Aus Sammlung entfernen"
            : "Zur Sammlung hinzufügen";

    collectButton.innerHTML =
        isCollected
            ? "✓"
            : "+";


    collectButton.addEventListener(
        "click",
        async event => {

            event.stopPropagation();

            await toggleSprite(
                sprite.id
            );
        }
    );


    // -----------------------------
    // INFO
    // -----------------------------

    const info =
        document.createElement("div");

    info.className =
        "sprite-info";


    const name =
        document.createElement("h3");

    name.className =
        "sprite-name";

    name.textContent =
        sprite.name;


    const meta =
        document.createElement("div");

    meta.className =
        "sprite-meta";


    const family =
        document.createElement("span");

    family.className =
        "sprite-family";

    family.textContent =
        sprite.family;


    const rarity =
        document.createElement("span");

    rarity.className =
        "sprite-rarity";

    rarity.textContent =
        sprite.rarity;


    meta.appendChild(family);
    meta.appendChild(rarity);


    // -----------------------------
    // VARIANT
    // -----------------------------

    if (
        sprite.variant &&
        sprite.variant !== "Default"
    ) {

        const variant =
            document.createElement("span");

        variant.className =
            "sprite-variant";

        variant.textContent =
            sprite.variant;

        meta.appendChild(
            variant
        );
    }


    // -----------------------------
    // SEASON
    // -----------------------------

    if (sprite.season) {

        const season =
            document.createElement("div");

        season.className =
            "sprite-season";

        season.textContent =
            `Season ${sprite.season}`;

        info.appendChild(
            season
        );
    }


    info.appendChild(name);
    info.appendChild(meta);


    // -----------------------------
    // CARD
    // -----------------------------

    card.appendChild(
        imageWrapper
    );

    card.appendChild(
        collectButton
    );

    card.appendChild(
        info
    );


    // -----------------------------
    // CLICK CARD
    // -----------------------------

    card.addEventListener(
        "click",
        async () => {

            await toggleSprite(
                sprite.id
            );
        }
    );


    return card;
}



async function toggleSprite(spriteId) {

    if (!currentUser) {

        showAuthError(
            "Bitte melde dich zuerst mit Discord an."
        );

        return;
    }


    const index =
        collectedSprites.indexOf(
            spriteId
        );


    if (index === -1) {

        collectedSprites.push(
            spriteId
        );

    } else {

        collectedSprites.splice(
            index,
            1
        );
    }


    // Sofort UI aktualisieren
    updateProgress();
    renderSprites();


    // Speichern
    await saveCollection();
}



function updateProgress() {

    const total =
        sprites.length;

    const collected =
        sprites.filter(sprite =>
            collectedSprites.includes(
                sprite.id
            )
        ).length;


    const percentage =
        total > 0
            ? Math.round(
                (collected / total) * 100
            )
            : 0;


    if (collectedCount) {
        collectedCount.textContent =
            collected;
    }

    if (totalCount) {
        totalCount.textContent =
            total;
    }

    if (progressNumber) {
        progressNumber.textContent =
            `${percentage}%`;
    }

    if (progressBarFill) {

        progressBarFill.style.width =
            `${percentage}%`;
    }


    updateFamilyCount();
    updateVariantCount();
}



function updateFamilyCount() {

    if (!familyCount) {
        return;
    }

    const families =
        new Set(
            sprites.map(
                sprite => sprite.family
            )
        );

    familyCount.textContent =
        families.size;
}



function updateVariantCount() {

    if (!variantCount) {
        return;
    }

    const variants =
        new Set(
            sprites
                .map(
                    sprite => sprite.variant
                )
                .filter(Boolean)
        );

    variantCount.textContent =
        variants.size;
}




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
        errorMessage.textContent =
            message;
    }
}



function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

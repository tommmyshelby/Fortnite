"use strict";

const SUPABASE_URL =
    "https://ykbqnxqlbttqzaerqgnb.supabase.co";


const SUPABASE_ANON_KEY =
    "sb_publishable_nHZCz4UMQecRv8WmvIiZ6A_j_aQLRx_";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );




const WEBSITE_URL =
    "https://tommmyshelby.github.io/Fortnite/";


const SPRITES_SOURCES = [

    "https://cdn.jsdelivr.net/gh/valincius/fn-sprites@main/src/sprites.json",

    "https://raw.githubusercontent.com/valincius/fn-sprites/main/src/sprites.json"

];


const IMAGE_PROXY =
    "https://images.weserv.nl/?url=";


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

const $ =
    (selector) =>
        document.querySelector(selector);


const loginBtn =
    $("#login-btn");


const warningLoginBtn =
    $("#warning-login-btn");


const collectionLoginBtn =
    $("#collection-login-btn");


const logoutBtn =
    $("#logout-btn");


const loggedInView =
    $("#logged-in-view");


const loggedOutView =
    $("#logged-out-view");


const userAvatar =
    $("#user-avatar");


const userName =
    $("#user-name");


const authWarning =
    $("#auth-warning");


const databaseStatus =
    $("#database-status");


const collectionLock =
    $("#collection-lock");


const collectedCount =
    $("#collected-count");


const totalCount =
    $("#total-count");


const progressNumber =
    $("#progress-number");


const progressBarFill =
    $("#progress-bar-fill");


const familyCount =
    $("#family-count");


const variantCount =
    $("#variant-count");


const searchInput =
    $("#search-input");


const rarityFilter =
    $("#rarity-filter");


const variantFilter =
    $("#variant-filter");


const sortFilter =
    $("#sort-filter");


const familyList =
    $("#family-list");


const spritesContainer =
    $("#sprites-container");


const visibleCount =
    $("#visible-count");


const loadingState =
    $("#loading-state");


const errorState =
    $("#error-state");


const errorMessage =
    $("#error-message");


const retryBtn =
    $("#retry-btn");


const openCollectionBtn =
    $("#open-collection-btn");


// =========================================================
// START
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setupAuthButtons();

        setupControls();

        await initializeAuth();

        await loadSprites();

    }
);


// =========================================================
// AUTH
// =========================================================

async function initializeAuth() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Supabase Session Error:",
                error
            );

            handleLoggedOutUser();

            return;

        }


        const session =
            data?.session;


        if (
            session?.user
        ) {

            await handleLoggedInUser(
                session.user
            );

        } else {

            handleLoggedOutUser();

        }


        supabaseClient.auth.onAuthStateChange(
            async (
                event,
                session
            ) => {

                console.log(
                    "Auth Event:",
                    event
                );


                if (
                    session?.user
                ) {

                    await handleLoggedInUser(
                        session.user
                    );

                } else {

                    handleLoggedOutUser();

                }

            }
        );


    } catch (error) {

        console.error(
            "Auth initialization failed:",
            error
        );

        handleLoggedOutUser();

    }

}


// =========================================================
// LOGIN
// =========================================================

async function loginWithDiscord() {

    try {

        const buttons = [
            loginBtn,
            warningLoginBtn,
            collectionLoginBtn
        ];


        buttons.forEach(
            (button) => {

                if (button) {
                    button.disabled = true;
                }

            }
        );


        const {
            error
        } =
            await supabaseClient.auth.signInWithOAuth({

                provider: "discord",

                options: {

                    redirectTo:
                        WEBSITE_URL

                }

            });


        if (error) {

            console.error(
                "Discord Login Error:",
                error
            );

            showAuthError(
                error.message
            );

        }

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        showAuthError(
            error.message
        );

    } finally {

        const buttons = [
            loginBtn,
            warningLoginBtn,
            collectionLoginBtn
        ];


        buttons.forEach(
            (button) => {

                if (button) {
                    button.disabled = false;
                }

            }
        );

    }

}


// =========================================================
// LOGOUT
// =========================================================

async function logout() {

    if (!logoutBtn) {
        return;
    }


    logoutBtn.disabled = true;


    try {

        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Logout Error:",
                error
            );

            return;

        }


        currentUser = null;

        collectedSprites = [];


        updateUserUI();

        updateProgress();

        renderSprites();


    } finally {

        logoutBtn.disabled = false;

    }

}


// =========================================================
// AUTH BUTTONS
// =========================================================

function setupAuthButtons() {


    if (loginBtn) {

        loginBtn.addEventListener(
            "click",
            loginWithDiscord
        );

    }


    if (warningLoginBtn) {

        warningLoginBtn.addEventListener(
            "click",
            loginWithDiscord
        );

    }


    if (collectionLoginBtn) {

        collectionLoginBtn.addEventListener(
            "click",
            loginWithDiscord
        );

    }


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logout
        );

    }


    if (retryBtn) {

        retryBtn.addEventListener(
            "click",
            () => loadSprites()
        );

    }


    if (openCollectionBtn) {

        openCollectionBtn.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "collection"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }

}


// =========================================================
// LOGGED IN
// =========================================================

async function handleLoggedInUser(
    user
) {

    currentUser =
        user;


    console.log(
        "Eingeloggt:",
        user.id
    );


    updateUserUI();


    await loadCollection();

}


// =========================================================
// LOGGED OUT
// =========================================================

function handleLoggedOutUser() {

    currentUser =
        null;


    collectedSprites =
        [];


    updateUserUI();


    updateProgress();


    renderSprites();

}


// =========================================================
// USER UI
// =========================================================

function updateUserUI() {

    if (currentUser) {

        // ---------------------------------
        // LOGGED IN
        // ---------------------------------

        if (loggedOutView) {

            loggedOutView.classList.add(
                "hidden"
            );

        }


        if (loggedInView) {

            loggedInView.classList.remove(
                "hidden"
            );

        }


        if (authWarning) {

            authWarning.classList.add(
                "hidden"
            );

        }


        if (collectionLock) {

            collectionLock.classList.add(
                "hidden"
            );

        }


        const metadata =
            currentUser.user_metadata ||
            {};


        const name =
            metadata.full_name ||
            metadata.name ||
            metadata.preferred_username ||
            "Discord User";


        if (userName) {

            userName.textContent =
                name;

        }


        const avatar =
            metadata.avatar_url ||
            metadata.picture ||
            "https://cdn.discordapp.com/embed/avatars/0.png";


        if (userAvatar) {

            userAvatar.src =
                avatar;

        }


        setDatabaseStatus(
            "Verbunden",
            true
        );


    } else {

        // ---------------------------------
        // LOGGED OUT
        // ---------------------------------

        if (loggedOutView) {

            loggedOutView.classList.remove(
                "hidden"
            );

        }


        if (loggedInView) {

            loggedInView.classList.add(
                "hidden"
            );

        }


        if (authWarning) {

            authWarning.classList.remove(
                "hidden"
            );

        }


        if (collectionLock) {

            collectionLock.classList.remove(
                "hidden"
            );

        }


        setDatabaseStatus(
            "Anmeldung erforderlich",
            false
        );

    }


    updateProgress();

}


// =========================================================
// DATABASE STATUS
// =========================================================

function setDatabaseStatus(
    text,
    online
) {

    if (!databaseStatus) {
        return;
    }


    databaseStatus.innerHTML = "";


    const indicator =
        document.createElement(
            "i"
        );


    if (online) {

        indicator.classList.add(
            "online"
        );

    }


    databaseStatus.appendChild(
        indicator
    );


    databaseStatus.appendChild(
        document.createTextNode(
            text
        )
    );

}


// =========================================================
// AUTH ERROR
// =========================================================

function showAuthError(
    message
) {

    if (!authWarning) {
        return;
    }


    authWarning.classList.remove(
        "hidden"
    );


    const paragraph =
        authWarning.querySelector(
            "p"
        );


    if (paragraph) {

        paragraph.textContent =
            message ||
            "Der Discord Login ist fehlgeschlagen.";

    }

}


// =========================================================
// LOAD USER COLLECTION
// =========================================================

async function loadCollection() {

    if (!currentUser) {

        collectedSprites =
            [];

        updateProgress();

        renderSprites();

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "user_sprites"
                )
                .select(
                    "sprite_id, collected"
                )
                .eq(
                    "user_id",
                    currentUser.id
                )
                .eq(
                    "collected",
                    true
                );


        if (error) {

            throw error;

        }


        collectedSprites =
            Array.isArray(data)
                ? data
                    .map(
                        row =>
                            row.sprite_id
                    )
                    .filter(Boolean)
                : [];


        console.log(
            "Eigene Sammlung:",
            collectedSprites
        );


        updateProgress();

        renderSprites();


    } catch (error) {

        console.error(
            "Collection Load Error:",
            error
        );


        collectedSprites =
            [];


        setDatabaseStatus(
            "Collection konnte nicht geladen werden",
            false
        );


        updateProgress();

        renderSprites();

    }

}


// =========================================================
// SAVE COLLECTION
// =========================================================

async function saveSprite(
    spriteId,
    collected
) {

    if (!currentUser) {

        await loginWithDiscord();

        return false;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.rpc(
                "set_sprite_collected",
                {
                    p_sprite_id:
                        spriteId,

                    p_collected:
                        collected
                }
            );


        if (error) {

            throw error;

        }


        console.log(
            "Sprite gespeichert:",
            data
        );


        return true;


    } catch (error) {

        console.error(
            "Save Sprite Error:",
            error
        );


        return false;

    }

}


// =========================================================
// TOGGLE SPRITE
// =========================================================

async function toggleSprite(
    sprite
) {

    if (!currentUser) {

        await loginWithDiscord();

        return;

    }


    const spriteId =
        sprite.id;


    const wasCollected =
        collectedSprites.includes(
            spriteId
        );


    // Optimistic UI

    if (wasCollected) {

        collectedSprites =
            collectedSprites.filter(
                id =>
                    id !== spriteId
            );

    } else {

        collectedSprites.push(
            spriteId
        );

    }


    updateProgress();

    renderSprites();


    const success =
        await saveSprite(
            spriteId,
            !wasCollected
        );


    if (!success) {

        // Rollback

        if (wasCollected) {

            collectedSprites.push(
                spriteId
            );

        } else {

            collectedSprites =
                collectedSprites.filter(
                    id =>
                        id !== spriteId
                );

        }


        updateProgress();

        renderSprites();

    }

}


// =========================================================
// SPRITE DATA
// =========================================================

async function fetchSpriteSource() {

    let lastError =
        null;


    for (
        const source
        of SPRITES_SOURCES
    ) {

        try {

            const response =
                await fetch(
                    source,
                    {
                        cache:
                            "no-store"
                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    `${response.status} ${response.statusText}`
                );

            }


            return await response.json();


        } catch (error) {

            console.warn(
                "Sprite Source fehlgeschlagen:",
                source,
                error
            );


            lastError =
                error;

        }

    }


    throw (
        lastError ||
        new Error(
            "Keine Sprite-Quelle verfügbar."
        )
    );

}


// =========================================================
// LOAD SPRITES
// =========================================================

async function loadSprites() {

    showLoading();


    try {

        const data =
            await fetchSpriteSource();


        if (
            !Array.isArray(data)
        ) {

            throw new Error(
                "Die Sprite-Daten sind ungültig."
            );

        }


        sprites =
            data
                .map(
                    normalizeSprite
                )
                .filter(Boolean);


        populateFilters();

        populateFamilies();


        hideLoading();


        updateProgress();

        renderSprites();


    } catch (error) {

        console.error(
            "Sprite loading failed:",
            error
        );


        showError(
            error.message ||
            "Die Sprite-Daten konnten nicht geladen werden."
        );

    }

}


// =========================================================
// NORMALIZE SPRITE
// =========================================================

function normalizeSprite(
    sprite,
    index
) {

    const originalId =
        String(
            sprite.spriteId ||
            sprite.id ||
            sprite.slug ||
            `sprite-${index}`
        );


    const variant =
        String(
            sprite.variant ||
            "base"
        );


    /*
    WICHTIG:

    base:
        bush

    variant:
        bush-gold

    Dadurch passt der Base-Sprite
    exakt zu deinem bereits gespeicherten
    Supabase-Eintrag:

        sprite_id = "bush"
    */

    const databaseId =
        variant === "base"
            ? originalId
            : `${originalId}-${variant}`;


    const family =
        prettyFamily(
            sprite.parent ||
            sprite.family ||
            sprite.name ||
            originalId
        );


    return {

        id:
            databaseId,

        originalId,

        name:
            sprite.name ||
            family,

        family,

        familyRaw:
            sprite.parent ||
            sprite.family ||
            "",

        rarity:
            sprite.rarity ||
            "unbekannt",

        variant,

        image:
            sprite.url ||
            sprite.image ||
            sprite.imageUrl ||
            "",

        season:
            sprite.season ||
            null

    };

}


// =========================================================
// FILTERS
// =========================================================

function populateFilters() {

    if (rarityFilter) {

        const rarities =
            [
                ...new Set(
                    sprites
                        .map(
                            sprite =>
                                sprite.rarity
                        )
                        .filter(Boolean)
                )
            ]
                .sort(
                    (a, b) =>
                        a.localeCompare(b)
                );


        rarityFilter.innerHTML =
            `
                <option value="all">
                    Alle Raritäten
                </option>
            `;


        rarities.forEach(
            rarity => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    rarity;


                option.textContent =
                    capitalize(
                        rarity
                    );


                rarityFilter.appendChild(
                    option
                );

            }
        );

    }


    if (variantFilter) {

        const variants =
            [
                ...new Set(
                    sprites
                        .map(
                            sprite =>
                                sprite.variant
                        )
                        .filter(Boolean)
                )
            ]
                .sort(
                    (a, b) =>
                        a.localeCompare(b)
                );


        variantFilter.innerHTML =
            `
                <option value="all">
                    Alle Varianten
                </option>
            `;


        variants.forEach(
            variant => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    variant;


                option.textContent =
                    variantLabel(
                        variant
                    );


                variantFilter.appendChild(
                    option
                );

            }
        );

    }

}


// =========================================================
// FAMILIES
// =========================================================

function populateFamilies() {

    if (!familyList) {
        return;
    }


    familyList.innerHTML =
        "";


    familyList.appendChild(
        createFamilyButton(
            "all",
            "Alle"
        )
    );


    const families =
        [
            ...new Set(
                sprites
                    .map(
                        sprite =>
                            sprite.family
                    )
                    .filter(Boolean)
            )
        ]
            .sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        undefined,
                        {
                            sensitivity:
                                "base"
                        }
                    )
            );


    families.forEach(
        family => {

            familyList.appendChild(
                createFamilyButton(
                    family,
                    family
                )
            );

        }
    );

}


// =========================================================
// FAMILY BUTTON
// =========================================================

function createFamilyButton(
    value,
    label
) {

    const button =
        document.createElement(
            "button"
        );


    button.className =
        "family-btn" +
        (
            value === "all"
                ? " active"
                : ""
        );


    button.dataset.family =
        value;


    button.type =
        "button";


    button.textContent =
        label;


    button.addEventListener(
        "click",
        () => {

            currentFamily =
                value;


            document
                .querySelectorAll(
                    ".family-btn"
                )
                .forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


            button.classList.add(
                "active"
            );


            renderSprites();

        }
    );


    return button;

}


// =========================================================
// CONTROLS
// =========================================================

function setupControls() {


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


    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        currentCollectionFilter =
                            button.dataset.filter ||
                            "all";


                        document
                            .querySelectorAll(
                                ".filter-btn"
                            )
                            .forEach(
                                btn =>
                                    btn.classList.remove(
                                        "active"
                                    )
                            );


                        button.classList.add(
                            "active"
                        );


                        renderSprites();

                    }
                );

            }
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "/" &&
                document.activeElement !== searchInput
            ) {

                event.preventDefault();


                searchInput?.focus();

            }


            if (
                event.key === "Escape" &&
                document.activeElement === searchInput
            ) {

                searchInput.value =
                    "";


                currentSearch =
                    "";


                searchInput.blur();


                renderSprites();

            }

        }
    );

}


// =========================================================
// FILTER SPRITES
// =========================================================

function getVisibleSprites() {

    let result =
        [...sprites];


    if (
        currentCollectionFilter ===
        "owned"
    ) {

        result =
            result.filter(
                sprite =>
                    collectedSprites.includes(
                        sprite.id
                    )
            );

    }


    if (
        currentCollectionFilter ===
        "missing"
    ) {

        result =
            result.filter(
                sprite =>
                    !collectedSprites.includes(
                        sprite.id
                    )
            );

    }


    if (currentSearch) {

        result =
            result.filter(
                sprite => {

                    const searchable =
                        [
                            sprite.name,
                            sprite.family,
                            sprite.familyRaw,
                            sprite.rarity,
                            sprite.variant,
                            variantLabel(
                                sprite.variant
                            ),
                            sprite.originalId
                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();


                    return searchable.includes(
                        currentSearch
                    );

                }
            );

    }


    if (
        currentFamily !==
        "all"
    ) {

        result =
            result.filter(
                sprite =>
                    sprite.family ===
                    currentFamily
            );

    }


    if (
        currentRarity !==
        "all"
    ) {

        result =
            result.filter(
                sprite =>
                    sprite.rarity ===
                    currentRarity
            );

    }


    if (
        currentVariant !==
        "all"
    ) {

        result =
            result.filter(
                sprite =>
                    sprite.variant ===
                    currentVariant
            );

    }


    switch (
        currentSort
    ) {

        case "name":

            result.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name,
                        undefined,
                        {
                            numeric:
                                true,

                            sensitivity:
                                "base"
                        }
                    )
            );

            break;


        case "rarity":

            result.sort(
                (a, b) =>
                    a.rarity.localeCompare(
                        b.rarity,
                        undefined,
                        {
                            sensitivity:
                                "base"
                        }
                    )
            );

            break;


        case "variant":

            result.sort(
                (a, b) =>
                    a.variant.localeCompare(
                        b.variant
                    )
            );

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


    if (visibleCount) {

        visibleCount.textContent =
            `${visibleSprites.length} Ergebnisse`;

    }


    spritesContainer.innerHTML =
        "";


    if (
        visibleSprites.length ===
        0
    ) {

        spritesContainer.innerHTML = `
            <div class="empty-state">

                <strong>
                    Keine Sprites gefunden
                </strong>

                <span>
                    Für deine aktuellen Filter
                    wurden keine Sprites gefunden.
                </span>

            </div>
        `;


        return;

    }


    const fragment =
        document.createDocumentFragment();


    visibleSprites.forEach(
        sprite => {

            fragment.appendChild(
                createSpriteCard(
                    sprite
                )
            );

        }
    );


    spritesContainer.appendChild(
        fragment
    );

}


// =========================================================
// SPRITE CARD
// =========================================================

function createSpriteCard(
    sprite
) {

    const collected =
        collectedSprites.includes(
            sprite.id
        );


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "sprite-card" +
        (
            collected
                ? " owned"
                : ""
        );


    // IMAGE

    const imageContainer =
        document.createElement(
            "div"
        );


    imageContainer.className =
        "sprite-image-container";


    if (sprite.image) {

        const image =
            document.createElement(
                "img"
            );


        image.className =
            "sprite-image";


        image.alt =
            sprite.name;


        image.loading =
            "lazy";


        image.decoding =
            "async";


        image.referrerPolicy =
            "no-referrer";


        image.src =
            sprite.image;


        image.addEventListener(
            "error",
            () => {

                if (
                    !image.dataset.proxy
                ) {

                    image.dataset.proxy =
                        "true";


                    image.src =
                        IMAGE_PROXY +
                        encodeURIComponent(
                            sprite.image
                        );


                    return;

                }


                image.remove();


                const errorText =
                    document.createElement(
                        "span"
                    );


                errorText.className =
                    "image-error-text";


                errorText.textContent =
                    "Bild nicht verfügbar";


                imageContainer.appendChild(
                    errorText
                );

            }
        );


        imageContainer.appendChild(
            image
        );

    }


    const badge =
        document.createElement(
            "div"
        );


    badge.className =
        "owned-badge";


    badge.textContent =
        "✓";


    imageContainer.appendChild(
        badge
    );


    card.appendChild(
        imageContainer
    );


    // INFO

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "sprite-info";


    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "sprite-meta";


    const rarity =
        document.createElement(
            "span"
        );


    rarity.className =
        "sprite-rarity";


    rarity.textContent =
        capitalize(
            sprite.rarity
        );


    const id =
        document.createElement(
            "span"
        );


    id.className =
        "sprite-id";


    id.textContent =
        "#" +
        sprite.originalId;


    meta.appendChild(
        rarity
    );


    meta.appendChild(
        id
    );


    const name =
        document.createElement(
            "h3"
        );


    name.className =
        "sprite-name";


    name.textContent =
        sprite.name;


    const family =
        document.createElement(
            "div"
        );


    family.className =
        "sprite-family";


    family.textContent =
        sprite.family;


    if (sprite.season) {

        const season =
            seasonLabel(
                sprite.season
            );


        if (season) {

            family.textContent +=
                " · " +
                season;

        }

    }


    const footer =
        document.createElement(
            "div"
        );


    footer.className =
        "sprite-footer";


    const variant =
        document.createElement(
            "span"
        );


    variant.className =
        "sprite-variant";


    variant.textContent =
        variantLabel(
            sprite.variant
        );


    const status =
        document.createElement(
            "button"
        );


    status.className =
        "sprite-status";


    status.type =
        "button";


    status.textContent =
        collected
            ? "✓ Gesammelt"
            : "Sammeln";


    status.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            toggleSprite(
                sprite
            );

        }
    );


    footer.appendChild(
        variant
    );


    footer.appendChild(
        status
    );


    info.appendChild(
        meta
    );


    info.appendChild(
        name
    );


    info.appendChild(
        family
    );


    info.appendChild(
        footer
    );


    card.appendChild(
        info
    );


    card.addEventListener(
        "click",
        () => {

            toggleSprite(
                sprite
            );

        }
    );


    return card;

}


// =========================================================
// PROGRESS
// =========================================================

function updateProgress() {

    const total =
        sprites.length;


    const collected =
        sprites.filter(
            sprite =>
                collectedSprites.includes(
                    sprite.id
                )
        ).length;


    const percentage =
        total > 0
            ? Math.round(
                (collected / total) *
                100
            )
            : 0;


    if (collectedCount) {

        collectedCount.textContent =
            currentUser
                ? collected
                : "—";

    }


    if (totalCount) {

        totalCount.textContent =
            total;

    }


    if (progressNumber) {

        progressNumber.textContent =
            currentUser
                ? percentage
                : "—";

    }


    if (progressBarFill) {

        progressBarFill.style.width =
            currentUser
                ? `${percentage}%`
                : "0%";

    }


    if (familyCount) {

        familyCount.textContent =
            new Set(
                sprites.map(
                    sprite =>
                        sprite.family
                )
            ).size;

    }


    if (variantCount) {

        variantCount.textContent =
            new Set(
                sprites
                    .map(
                        sprite =>
                            sprite.variant
                    )
                    .filter(Boolean)
            ).size;

    }

}


// =========================================================
// LOADING
// =========================================================

function showLoading() {

    loadingState?.classList.remove(
        "hidden"
    );


    errorState?.classList.add(
        "hidden"
    );


    if (spritesContainer) {

        spritesContainer.style.display =
            "none";

    }

}


function hideLoading() {

    loadingState?.classList.add(
        "hidden"
    );


    errorState?.classList.add(
        "hidden"
    );


    if (spritesContainer) {

        spritesContainer.style.display =
            "";

    }

}


function showError(
    message
) {

    loadingState?.classList.add(
        "hidden"
    );


    if (spritesContainer) {

        spritesContainer.style.display =
            "none";

    }


    errorState?.classList.remove(
        "hidden"
    );


    if (errorMessage) {

        errorMessage.textContent =
            message;

    }

}


// =========================================================
// HELPERS
// =========================================================

function prettyFamily(
    value
) {

    if (!value) {
        return "Unbekannt";
    }


    return String(value)
        .replace(
            /_/g,
            " "
        )
        .replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


function variantLabel(
    variant
) {

    if (!variant) {
        return "";

    }


    if (
        VARIANT_LABELS[variant]
    ) {

        return VARIANT_LABELS[
            variant
        ];

    }


    return String(
        variant
    )
        .replace(
            /_/g,
            " "
        )
        .replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
        )
        .replace(
            /^./,
            char =>
                char.toUpperCase()
        );

}


function seasonLabel(
    season
) {

    if (!season) {
        return null;
    }


    const match =
        String(
            season
        ).match(
            /^c(\d+)s(\d+)$/i
        );


    if (match) {

        return (
            "Kapitel " +
            match[1] +
            " · Season " +
            match[2]
        );

    }


    return String(
        season
    )
        .replace(
            /_/g,
            " "
        )
        .toUpperCase();

}


function capitalize(
    value
) {

    return String(
        value || ""
    ).replace(
        /^./,
        char =>
            char.toUpperCase()
    );

}

"use strict";


/* =========================================================
   SUPABASE
   ========================================================= */

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


/* =========================================================
   SPRITE SOURCES
   ========================================================= */

const SPRITES_SOURCES = [

    "https://cdn.jsdelivr.net/gh/valincius/fn-sprites@main/src/sprites.json",

    "https://raw.githubusercontent.com/valincius/fn-sprites/main/src/sprites.json"

];


const IMAGE_PROXY =
    "https://images.weserv.nl/?url=";


/* =========================================================
   VARIANTS
   ========================================================= */

const VARIANT_LABELS = {

    base:
        "Standard",

    gold:
        "Gold",

    candy:
        "Candy",

    galaxy:
        "Galaxy",

    holofoil:
        "Holofoil",

    cube:
        "Cube",

    quack:
        "Quack",

    gem:
        "Gem",

    cheatmaster:
        "Schummelmeister"

};


/* =========================================================
   STATE
   ========================================================= */

let currentUser =
    null;

let sprites =
    [];

let collectedSprites =
    [];


let currentFamily =
    "all";

let currentSearch =
    "";

let currentRarity =
    "all";

let currentVariant =
    "all";

let currentSort =
    "default";

let currentCollectionFilter =
    "all";


/* =========================================================
   DOM
   ========================================================= */

const $ =
    selector =>
        document.querySelector(
            selector
        );


const loginBtn =
    $("#login-btn");


const heroLoginBtn =
    $("#hero-login-btn");


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


const heroProgress =
    $("#hero-progress");


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


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeIcons();

        setupAuthButtons();

        setupControls();

        await initializeAuth();

        await loadSprites();

    }
);


/* =========================================================
   ICONS
   ========================================================= */

function initializeIcons() {

    if (
        window.lucide &&
        typeof window.lucide.createIcons ===
            "function"
    ) {

        window.lucide.createIcons();

    }

}


/* =========================================================
   AUTH INITIALIZATION
   ========================================================= */

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


        if (data?.session?.user) {

            await handleLoggedInUser(
                data.session.user
            );

        } else {

            handleLoggedOutUser();

        }


        supabaseClient.auth.onAuthStateChange(
            (
                event,
                session
            ) => {

                console.log(
                    "Auth Event:",
                    event
                );


                if (session?.user) {

                    void handleLoggedInUser(
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


/* =========================================================
   DISCORD LOGIN
   ========================================================= */

async function loginWithDiscord() {

    const buttons = [

        loginBtn,

        heroLoginBtn,

        warningLoginBtn,

        collectionLoginBtn

    ];


    buttons.forEach(
        button => {

            if (button) {

                button.disabled =
                    true;

            }

        }
    );


    try {

        const {
            error
        } =
            await supabaseClient.auth.signInWithOAuth({

                provider:
                    "discord",

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

        buttons.forEach(
            button => {

                if (button) {

                    button.disabled =
                        false;

                }

            }
        );

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logout() {

    if (!logoutBtn) {
        return;
    }


    logoutBtn.disabled =
        true;


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


        currentUser =
            null;

        collectedSprites =
            [];


        updateUserUI();

        updateProgress();

        renderSprites();


    } catch (error) {

        console.error(
            "Logout failed:",
            error
        );

    } finally {

        logoutBtn.disabled =
            false;

    }

}


/* =========================================================
   AUTH BUTTONS
   ========================================================= */

function setupAuthButtons() {

    loginBtn?.addEventListener(
        "click",
        loginWithDiscord
    );


    heroLoginBtn?.addEventListener(
        "click",
        loginWithDiscord
    );


    warningLoginBtn?.addEventListener(
        "click",
        loginWithDiscord
    );


    collectionLoginBtn?.addEventListener(
        "click",
        loginWithDiscord
    );


    logoutBtn?.addEventListener(
        "click",
        logout
    );


    retryBtn?.addEventListener(
        "click",
        loadSprites
    );


    openCollectionBtn?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "collection"
                )
                ?.scrollIntoView({
                    behavior:
                        "smooth"
                });

        }
    );

}


/* =========================================================
   LOGIN UI
   ========================================================= */

async function handleLoggedInUser(
    user
) {

    currentUser =
        user;


    updateUserUI();

    await loadCollection();

}


function handleLoggedOutUser() {

    currentUser =
        null;

    collectedSprites =
        [];


    updateUserUI();

    updateProgress();

    renderSprites();

}


/* =========================================================
   USER UI
   ========================================================= */

function updateUserUI() {

    if (currentUser) {

        /*
         * EINGELOGGT
         */

        loggedInView?.classList.remove(
            "hidden"
        );


        loggedOutView?.classList.add(
            "hidden"
        );


        authWarning?.classList.add(
            "hidden"
        );


        /*
         * ALLE LOGIN BUTTONS VERSTECKEN
         */

        loginBtn?.classList.add(
            "hidden"
        );

        heroLoginBtn?.classList.add(
            "hidden"
        );

        warningLoginBtn?.classList.add(
            "hidden"
        );

        collectionLoginBtn?.classList.add(
            "hidden"
        );


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

        /*
         * AUSGELOGGT
         */

        loggedInView?.classList.add(
            "hidden"
        );


        loggedOutView?.classList.remove(
            "hidden"
        );


        authWarning?.classList.remove(
            "hidden"
        );


        /*
         * LOGIN BUTTONS WIEDER ZEIGEN
         */

        loginBtn?.classList.remove(
            "hidden"
        );

        heroLoginBtn?.classList.remove(
            "hidden"
        );

        warningLoginBtn?.classList.remove(
            "hidden"
        );

        collectionLoginBtn?.classList.remove(
            "hidden"
        );


        setDatabaseStatus(
            "Anmeldung erforderlich",
            false
        );

    }


    updateProgress();

}


/* =========================================================
   DATABASE STATUS
   ========================================================= */

function setDatabaseStatus(
    text,
    online
) {

    if (!databaseStatus) {
        return;
    }


    databaseStatus.classList.toggle(
        "online",
        online
    );


    databaseStatus.innerHTML = `

        <span class="database-status-dot"></span>

        ${escapeHtml(text)}

    `;

}


/* =========================================================
   AUTH ERROR
   ========================================================= */

function showAuthError(
    message
) {

    if (!authWarning) {
        return;
    }


    authWarning.classList.remove(
        "hidden"
    );


    const text =
        authWarning.querySelector(
            ".warning-text"
        );


    if (text) {

        text.textContent =
            message ||
            "Der Discord Login ist fehlgeschlagen.";

    }

}


/* =========================================================
   LOAD COLLECTION
   ========================================================= */

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


/* =========================================================
   SAVE SPRITE
   ========================================================= */

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


        return true;


    } catch (error) {

        console.error(
            "Save Sprite Error:",
            error
        );


        setDatabaseStatus(
            "Speichern fehlgeschlagen",
            false
        );


        return false;

    }

}


/* =========================================================
   TOGGLE SPRITE
   ========================================================= */

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


    /*
     * OPTIMISTIC UPDATE
     */

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

        /*
         * ROLLBACK
         */

        if (wasCollected) {

            if (
                !collectedSprites.includes(
                    spriteId
                )
            ) {

                collectedSprites.push(
                    spriteId
                );

            }

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


/* =========================================================
   FETCH SPRITE DATA
   ========================================================= */

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


            if (!response.ok) {

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


/* =========================================================
   LOAD SPRITES
   ========================================================= */

async function loadSprites() {

    showLoading();


    try {

        const data =
            await fetchSpriteSource();


        if (!Array.isArray(data)) {

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


/* =========================================================
   NORMALIZE SPRITE
   ========================================================= */

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


/* =========================================================
   FILTER OPTIONS
   ========================================================= */

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
                    (a,b) =>
                        a.localeCompare(
                            b
                        )
                );


        rarityFilter.innerHTML =
            `<option value="all">Alle Raritäten</option>`;


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
                    (a,b) =>
                        variantLabel(a)
                            .localeCompare(
                                variantLabel(b)
                            )
                );


        variantFilter.innerHTML =
            `<option value="all">Alle Varianten</option>`;


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


/* =========================================================
   FAMILIES
   ========================================================= */

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
                (a,b) =>
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


function createFamilyButton(
    value,
    label
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "family-btn";


    if (
        value === currentFamily
    ) {

        button.classList.add(
            "active"
        );

    }


    button.dataset.family =
        value;


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
                    item =>
                        item.classList.remove(
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


/* =========================================================
   CONTROLS
   ========================================================= */

function setupControls() {

    searchInput?.addEventListener(
        "input",
        () => {

            currentSearch =
                searchInput.value
                    .trim()
                    .toLowerCase();


            renderSprites();

        }
    );


    rarityFilter?.addEventListener(
        "change",
        () => {

            currentRarity =
                rarityFilter.value;

            renderSprites();

        }
    );


    variantFilter?.addEventListener(
        "change",
        () => {

            currentVariant =
                variantFilter.value;

            renderSprites();

        }
    );


    sortFilter?.addEventListener(
        "change",
        () => {

            currentSort =
                sortFilter.value;

            renderSprites();

        }
    );


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
                                item =>
                                    item.classList.remove(
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
                document.activeElement !==
                    searchInput
            ) {

                event.preventDefault();

                searchInput?.focus();

            }


            if (
                event.key === "Escape" &&
                document.activeElement ===
                    searchInput
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


/* =========================================================
   FILTER SPRITES
   ========================================================= */

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

                            sprite.originalId,

                            seasonLabel(
                                sprite.season
                            )

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
                (a,b) =>
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
                (a,b) =>
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
                (a,b) =>
                    variantLabel(
                        a.variant
                    ).localeCompare(
                        variantLabel(
                            b.variant
                        )
                    )
            );

            break;


        default:

            result.sort(
                (a,b) => {

                    const familyCompare =
                        a.family.localeCompare(
                            b.family,
                            undefined,
                            {
                                sensitivity:
                                    "base"
                            }
                        );


                    if (
                        familyCompare !==
                        0
                    ) {

                        return familyCompare;

                    }


                    return variantLabel(
                        a.variant
                    ).localeCompare(
                        variantLabel(
                            b.variant
                        )
                    );

                }
            );

            break;

    }


    return result;

}


/* =========================================================
   RENDER
   ========================================================= */

function renderSprites() {

    if (!spritesContainer) {
        return;
    }


    const visible =
        getVisibleSprites();


    visibleCount.textContent =
        `${visible.length} Ergebnisse`;


    spritesContainer.innerHTML =
        "";


    if (!visible.length) {

        spritesContainer.innerHTML = `

            <div class="empty-state">

                <div class="state-icon">

                    <i data-lucide="search-x"></i>

                </div>

                <div class="state-title">

                    Keine Sprites gefunden

                </div>

                <div class="state-description">

                    Für deine aktuellen Filter
                    wurden keine Sprites gefunden.

                </div>

            </div>

        `;


        initializeIcons();

        return;

    }


    /*
     * NACH FAMILIEN GRUPPIEREN
     */

    const groups =
        new Map();


    visible.forEach(
        sprite => {

            if (!groups.has(
                sprite.family
            )) {

                groups.set(
                    sprite.family,
                    []
                );

            }


            groups
                .get(sprite.family)
                .push(sprite);

        }
    );


    const fragment =
        document.createDocumentFragment();


    groups.forEach(
        (
            groupSprites,
            family
        ) => {

            fragment.appendChild(
                createFamilyGroup(
                    family,
                    groupSprites
                )
            );

        }
    );


    spritesContainer.appendChild(
        fragment
    );


    initializeIcons();

}


/* =========================================================
   FAMILY GROUP
   ========================================================= */

function createFamilyGroup(
    family,
    groupSprites
) {

    const section =
        document.createElement(
            "section"
        );


    section.className =
        "family-group";


    const allFamilySprites =
        sprites.filter(
            sprite =>
                sprite.family ===
                family
        );


    const familyCollected =
        allFamilySprites.filter(
            sprite =>
                collectedSprites.includes(
                    sprite.id
                )
        ).length;


    const familyPercentage =
        allFamilySprites.length
            ? Math.round(
                (
                    familyCollected /
                    allFamilySprites.length
                ) * 100
            )
            : 0;


    section.innerHTML = `

        <div class="family-group-header">

            <div class="family-group-title-wrap">

                <div class="family-group-eyebrow">
                    SPRITE-FAMILIE
                </div>

                <div class="family-group-title">
                    ${escapeHtml(family)}
                </div>

                <div class="family-group-info">
                    ${allFamilySprites.length}
                    Varianten ·
                    ${familyCollected}
                    gesammelt
                </div>

            </div>


            <div class="family-group-progress">

                <div class="family-group-progress-text">

                    ${familyPercentage}%

                </div>

                <div class="family-progress-track">

                    <div
                        class="family-progress-fill"
                        style="width:${familyPercentage}%"
                    ></div>

                </div>

            </div>

        </div>


        <div class="family-variant-grid"></div>

    `;


    const grid =
        section.querySelector(
            ".family-variant-grid"
        );


    groupSprites.forEach(
        sprite => {

            grid.appendChild(
                createSpriteCard(
                    sprite
                )
            );

        }
    );


    return section;

}


/* =========================================================
   SPRITE CARD
   ========================================================= */

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
        "family-variant-card" +
        (
            collected
                ? " collected"
                : ""
        );


    /*
     * IMAGE
     */

    const imageWrap =
        document.createElement(
            "div"
        );


    imageWrap.className =
        "family-variant-image-wrap";


    if (sprite.image) {

        const image =
            document.createElement(
                "img"
            );


        image.className =
            "family-variant-image";


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


                const text =
                    document.createElement(
                        "span"
                    );


                text.className =
                    "image-error-text";


                text.textContent =
                    "Bild nicht verfügbar";


                imageWrap.appendChild(
                    text
                );

            }
        );


        imageWrap.appendChild(
            image
        );

    }


    /*
     * STATUS
     */

    const state =
        document.createElement(
            "div"
        );


    state.className =
        "family-variant-state";


    state.innerHTML =
        collected
            ? `<i data-lucide="check"></i>`
            : `<i data-lucide="plus"></i>`;


    imageWrap.appendChild(
        state
    );


    card.appendChild(
        imageWrap
    );


    /*
     * CONTENT
     */

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "family-variant-content";


    const name =
        document.createElement(
            "div"
        );


    name.className =
        "family-variant-name";


    name.textContent =
        sprite.name;


    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "family-variant-meta";


    const rarity =
        document.createElement(
            "span"
        );


    rarity.className =
        "family-variant-rarity";


    rarity.textContent =
        capitalize(
            sprite.rarity
        );


    const variant =
        document.createElement(
            "span"
        );


    variant.className =
        "family-variant-type";


    variant.textContent =
        variantLabel(
            sprite.variant
        );


    meta.appendChild(
        rarity
    );

    meta.appendChild(
        variant
    );


    content.appendChild(
        name
    );

    content.appendChild(
        meta
    );


    card.appendChild(
        content
    );


    /*
     * CLICK
     */

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


/* =========================================================
   PROGRESS
   ========================================================= */

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
                (
                    collected /
                    total
                ) * 100
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
                ? `${percentage}%`
                : "—";

    }


    if (progressBarFill) {

        progressBarFill.style.width =
            currentUser
                ? `${percentage}%`
                : "0%";

    }


    if (heroProgress) {

        heroProgress.textContent =
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
                sprites.map(
                    sprite =>
                        sprite.variant
                )
            ).size;

    }

}


/* =========================================================
   LOADING / ERROR
   ========================================================= */

function showLoading() {

    loadingState?.classList.remove(
        "hidden"
    );


    errorState?.classList.add(
        "hidden"
    );


    spritesContainer.style.display =
        "none";

}


function hideLoading() {

    loadingState?.classList.add(
        "hidden"
    );


    errorState?.classList.add(
        "hidden"
    );


    spritesContainer.style.display =
        "";

}


function showError(
    message
) {

    loadingState?.classList.add(
        "hidden"
    );


    spritesContainer.style.display =
        "none";


    errorState?.classList.remove(
        "hidden"
    );


    if (errorMessage) {

        errorMessage.textContent =
            message;

    }


    initializeIcons();

}


/* =========================================================
   HELPERS
   ========================================================= */

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
        return "";
    }


    const match =
        String(season)
            .match(
                /^c(\d+)s(\d+)$/i
            );


    if (match) {

        return (
            `Kapitel ${match[1]} · Season ${match[2]}`
        );

    }


    return String(season)
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


function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}

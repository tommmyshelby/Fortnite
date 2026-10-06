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


/* =========================================================
   SPRITE SOURCES
   ========================================================= */

const SPRITES_SOURCES = [
    "https://cdn.jsdelivr.net/gh/valincius/fn-sprites@main/src/sprites.json",
    "https://raw.githubusercontent.com/valincius/fn-sprites/main/src/sprites.json"
];


/* =========================================================
   IMAGE PROXY
   ========================================================= */

const IMAGE_PROXY =
    "https://images.weserv.nl/?url=";


/* =========================================================
   VARIANTEN
   ========================================================= */

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


/* =========================================================
   STATE
   ========================================================= */

let currentUser = null;

let sprites = [];

let collectedSprites = [];


/* =========================================================
   FILTER STATE
   ========================================================= */

let currentFamily = "all";

let currentSearch = "";

let currentRarity = "all";

let currentVariant = "all";

let currentSort = "default";

let currentCollectionFilter = "all";


/* =========================================================
   DOM HELPER
   ========================================================= */

const $ = selector =>
    document.querySelector(selector);


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

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
   LUCIDE
   ========================================================= */

function initializeIcons() {

    if (
        window.lucide &&
        typeof window.lucide.createIcons === "function"
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
            async (
                event,
                session
            ) => {

                console.log(
                    "Auth Event:",
                    event
                );


                if (session?.user) {

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


/* =========================================================
   DISCORD LOGIN
   ========================================================= */

async function loginWithDiscord() {

    const buttons = [
        loginBtn,
        warningLoginBtn,
        collectionLoginBtn
    ];


    buttons.forEach(button => {

        if (button) {

            button.disabled = true;

        }

    });


    try {

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

        buttons.forEach(button => {

            if (button) {

                button.disabled = false;

            }

        });

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

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


    } catch (error) {

        console.error(
            "Logout failed:",
            error
        );

    } finally {

        logoutBtn.disabled = false;

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
                .getElementById("collection")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


/* =========================================================
   LOGGED IN USER
   ========================================================= */

async function handleLoggedInUser(user) {

    currentUser = user;


    console.log(
        "Eingeloggt:",
        user.id
    );


    updateUserUI();

    await loadCollection();

}


/* =========================================================
   LOGGED OUT USER
   ========================================================= */

function handleLoggedOutUser() {

    currentUser = null;

    collectedSprites = [];


    updateUserUI();

    updateProgress();

    renderSprites();

}




function updateUserUI() {

    if (currentUser) {

        loggedOutView?.classList.add(
            "hidden"
        );

        loggedInView?.classList.remove(
            "hidden"
        );

        authWarning?.classList.add(
            "hidden"
        );

        collectionLock?.classList.add(
            "hidden"
        );


        const metadata =
            currentUser.user_metadata || {};


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

        loggedOutView?.classList.remove(
            "hidden"
        );

        loggedInView?.classList.add(
            "hidden"
        );

        authWarning?.classList.remove(
            "hidden"
        );

        collectionLock?.classList.remove(
            "hidden"
        );


        setDatabaseStatus(
            "Anmeldung erforderlich",
            false
        );

    }


    updateProgress();

}



function setDatabaseStatus(
    text,
    online
) {

    if (!databaseStatus) {
        return;
    }


    databaseStatus.innerHTML = "";


    const indicator =
        document.createElement("span");


    indicator.className =
        "database-status-dot";


    if (!online) {

        indicator.style.background =
            "var(--muted)";

        indicator.style.boxShadow =
            "none";

    }


    databaseStatus.append(
        indicator,
        document.createTextNode(text)
    );

}




function showAuthError(message) {

    if (!authWarning) {
        return;
    }


    authWarning.classList.remove(
        "hidden"
    );


    const paragraph =
        authWarning.querySelector("p");


    if (paragraph) {

        paragraph.textContent =
            message ||
            "Der Discord Login ist fehlgeschlagen.";

    }

}



async function loadCollection() {

    if (!currentUser) {

        collectedSprites = [];

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
                .from("user_sprites")
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
                    .map(row => row.sprite_id)
                    .filter(Boolean)
                : [];


        console.log(
            "Eigene Sammlung:",
            collectedSprites
        );


        setDatabaseStatus(
            "Sammlung geladen",
            true
        );


        updateProgress();

        renderSprites();


    } catch (error) {

        console.error(
            "Collection Load Error:",
            error
        );


        collectedSprites = [];


        setDatabaseStatus(
            "Sammlung konnte nicht geladen werden",
            false
        );


        updateProgress();

        renderSprites();

    }

}



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


        setDatabaseStatus(
            "Speichern fehlgeschlagen",
            false
        );


        return false;

    }

}




async function toggleSprite(sprite) {

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




async function fetchSpriteSource() {

    let lastError = null;


    for (
        const source
        of SPRITES_SOURCES
    ) {

        try {

            const response =
                await fetch(
                    source,
                    {
                        cache: "no-store"
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

        updateProgress();

        hideLoading();

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




function normalizeSprite(
    sprite,
    index
) {

    if (
        !sprite ||
        typeof sprite !== "object"
    ) {

        return null;

    }


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


    const rawFamily =
        sprite.parent ||
        sprite.family ||
        sprite.name ||
        originalId;


    const family =
        prettyFamily(
            rawFamily
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




function populateFilters() {

    populateRarityFilter();

    populateVariantFilter();

}




function populateRarityFilter() {

    if (!rarityFilter) {
        return;
    }


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
                String(a).localeCompare(
                    String(b)
                )
        );


    rarityFilter.innerHTML = "";


    const allOption =
        document.createElement("option");


    allOption.value =
        "all";

    allOption.textContent =
        "Alle Raritäten";


    rarityFilter.appendChild(
        allOption
    );


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


    rarityFilter.value =
        currentRarity;

}




function populateVariantFilter() {

    if (!variantFilter) {
        return;
    }


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
                String(a).localeCompare(
                    String(b)
                )
        );


    variantFilter.innerHTML = "";


    const allOption =
        document.createElement("option");


    allOption.value =
        "all";

    allOption.textContent =
        "Alle Varianten";


    variantFilter.appendChild(
        allOption
    );


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


    variantFilter.value =
        currentVariant;

}



function populateFamilies() {

    if (!familyList) {
        return;
    }


    familyList.innerHTML = "";


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


    button.dataset.family =
        value;


    if (
        value ===
        currentFamily
    ) {

        button.classList.add(
            "active"
        );

    }


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

                if (searchInput) {

                    searchInput.value =
                        "";

                }


                currentSearch =
                    "";


                searchInput?.blur();

                renderSprites();

            }

        }
    );

}




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


  

    switch (currentSort) {

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
                (a, b) => {

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
                        familyCompare !== 0
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
        visibleSprites.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty-state";


        empty.innerHTML = `
            <div class="state-icon">
                <i data-lucide="search-x"></i>
            </div>

            <div class="state-title">
                Keine Sprites gefunden
            </div>

            <div class="state-description">
                Für deine aktuellen Filter wurden keine Sprites gefunden.
            </div>
        `;


        spritesContainer.appendChild(
            empty
        );


        initializeIcons();

        return;

    }


 

    const groups =
        new Map();


    visibleSprites.forEach(
        sprite => {

            if (
                !groups.has(
                    sprite.family
                )
            ) {

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


    for (
        const [
            family,
            familySprites
        ]
        of groups
    ) {

        fragment.appendChild(
            createFamilyGroup(
                family,
                familySprites
            )
        );

    }


    spritesContainer.appendChild(
        fragment
    );


    initializeIcons();

}




function createFamilyGroup(
    family,
    familySprites
) {

    const group =
        document.createElement(
            "section"
        );


    group.className =
        "family-group";


    group.dataset.family =
        family;



    const allFamilySprites =
        sprites.filter(
            sprite =>
                sprite.family ===
                family
        );


    const collected =
        allFamilySprites.filter(
            sprite =>
                collectedSprites.includes(
                    sprite.id
                )
        ).length;


    const total =
        allFamilySprites.length;


    const percentage =
        total > 0
            ? Math.round(
                (collected / total) *
                100
            )
            : 0;




    const header =
        document.createElement(
            "div"
        );


    header.className =
        "family-group-header";


    const heading =
        document.createElement(
            "div"
        );


    heading.className =
        "family-group-heading";


    const eyebrow =
        document.createElement(
            "div"
        );


    eyebrow.className =
        "family-group-eyebrow";


    eyebrow.textContent =
        "SPRITE FAMILIE";


    const title =
        document.createElement(
            "h3"
        );


    title.className =
        "family-group-title";


    title.textContent =
        family;


    const description =
        document.createElement(
            "div"
        );


    description.className =
        "family-group-description";


    description.textContent =
        `${total} Variante${total === 1 ? "" : "n"}`;


    heading.append(
        eyebrow,
        title,
        description
    );




    const progress =
        document.createElement(
            "div"
        );


    progress.className =
        "family-group-progress";


    const progressText =
        document.createElement(
            "div"
        );


    progressText.className =
        "family-group-progress-text";


    progressText.textContent =
        `${collected} / ${total} gesammelt`;


    const progressTrack =
        document.createElement(
            "div"
        );


    progressTrack.className =
        "family-progress-track";


    const progressFill =
        document.createElement(
            "div"
        );


    progressFill.className =
        "family-progress-fill";


    progressFill.style.width =
        `${percentage}%`;


    progressTrack.appendChild(
        progressFill
    );


    progress.append(
        progressText,
        progressTrack
    );


    header.append(
        heading,
        progress
    );



    const variantGrid =
        document.createElement(
            "div"
        );


    variantGrid.className =
        "family-variant-grid";


    familySprites.forEach(
        sprite => {

            variantGrid.appendChild(
                createVariantCard(
                    sprite
                )
            );

        }
    );


    group.append(
        header,
        variantGrid
    );


    return group;

}




function createVariantCard(
    sprite
) {

    const collected =
        collectedSprites.includes(
            sprite.id
        );


    const card =
        document.createElement(
            "button"
        );


    card.type =
        "button";


    card.className =
        "family-variant-card";


    if (collected) {

        card.classList.add(
            "collected"
        );

    }


    card.title =
        `${sprite.family} – ${variantLabel(sprite.variant)}`;


    
    const imageWrap =
        document.createElement(
            "span"
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
            `${sprite.name} – ${variantLabel(sprite.variant)}`;


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


                const fallback =
                    document.createElement(
                        "span"
                    );


                fallback.className =
                    "image-error-text";


                fallback.textContent =
                    "Bild nicht verfügbar";


                imageWrap.appendChild(
                    fallback
                );

            }
        );


        imageWrap.appendChild(
            image
        );

    }




    const state =
        document.createElement(
            "span"
        );


    state.className =
        "family-variant-state";


    if (collected) {

        state.innerHTML =
            `<i data-lucide="check"></i>`;

    } else {

        state.innerHTML =
            `<i data-lucide="plus"></i>`;

    }


    imageWrap.appendChild(
        state
    );


 

    const content =
        document.createElement(
            "span"
        );


    content.className =
        "family-variant-content";


    const variant =
        document.createElement(
            "span"
        );


    variant.className =
        "family-variant-name";


    variant.textContent =
        variantLabel(
            sprite.variant
        );


    const meta =
        document.createElement(
            "span"
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
            sprite.rarity ||
            "unbekannt"
        );


    const season =
        document.createElement(
            "span"
        );


    season.className =
        "family-variant-type";


    season.textContent =
        seasonLabel(
            sprite.season
        ) ||
        "";


    meta.append(
        rarity,
        season
    );


    content.append(
        variant,
        meta
    );


    card.append(
        imageWrap,
        content
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
        `sprite-card${collected ? " owned" : ""}`;


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
        `#${sprite.id}`;


    meta.append(
        rarity,
        id
    );


    const name =
        document.createElement(
            "div"
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
            "span"
        );


    status.className =
        "sprite-status";


    status.textContent =
        collected
            ? "Gesammelt"
            : "Fehlt";


    footer.append(
        variant,
        status
    );


    info.append(
        meta,
        name,
        family,
        footer
    );


    card.append(
        imageContainer,
        info
    );


    card.addEventListener(
        "click",
        () =>
            toggleSprite(
                sprite
            )
    );


    return card;

}




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
                ? `${percentage}%`
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


    return String(variant)
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
        String(season).match(
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

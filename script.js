

"use strict";



const SUPABASE_URL =
    "https://ykbqnxqlbttqzaerqgnb.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_nHZCz4UMQecRv8WmvIiZ6A_j_aQLRx_";

const WEBSITE_URL =
    "https://tommmyshelby.github.io/Fortnite/";

const SPRITES_DATA_URL =
    "https://raw.githubusercontent.com/valincius/fn-sprites/main/src/sprites.json";



let supabaseClient = null;

if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
} else {
    console.error(
        "Supabase konnte nicht geladen werden."
    );
}



let currentUser = null;

let sprites = [];

let collectedSprites = [];

let currentFamily = "all";

let currentSearch = "";

let currentRarity = "all";

let currentVariant = "all";

let currentSort = "default";




function $(id) {
    return document.getElementById(id);
}


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Sprite Vault wird gestartet..."
        );

        setupControls();

        setupAuth();

        await loadSprites();

    }
);



function setupAuth() {

    if (!supabaseClient) {

        console.error(
            "Supabase Client fehlt."
        );

        return;

    }

    supabaseClient.auth
        .getSession()
        .then(({ data, error }) => {

            if (error) {

                console.error(
                    "Session Fehler:",
                    error
                );

                return;

            }

            if (data && data.session) {

                setCurrentUser(
                    data.session.user
                );

            } else {

                setCurrentUser(
                    null
                );

            }

        });


    /*
       Auth Änderungen überwachen
    */

    supabaseClient.auth.onAuthStateChange(
        async (event, session) => {

            console.log(
                "Auth Event:",
                event
            );


            if (session && session.user) {

                setCurrentUser(
                    session.user
                );

            } else {

                setCurrentUser(
                    null
                );

            }

        }
    );


    /*
       Login Button
    */

    const loginButton =
        $("login-btn");

    if (loginButton) {

        loginButton.addEventListener(
            "click",
            loginWithDiscord
        );

    }


    /*
       Logout Button
    */

    const logoutButton =
        $("logout-btn");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }

}


/* =========================================================
   DISCORD LOGIN
========================================================= */

async function loginWithDiscord() {

    if (!supabaseClient) {

        alert(
            "Supabase konnte nicht geladen werden."
        );

        return;

    }


    const button =
        $("login-btn");


    try {

        if (button) {

            button.disabled = true;

            button.innerHTML =
                "⏳ Discord wird geöffnet...";

        }


        const {
            data,
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
                "Discord Login Fehler:",
                error
            );

            alert(
                "Discord Login fehlgeschlagen:\n\n" +
                error.message
            );

            if (button) {

                button.disabled = false;

                button.innerHTML =
                    '<span class="discord-symbol">◉</span> Mit Discord anmelden';

            }

            return;

        }


        /*
           Supabase übernimmt den Redirect.
        */

        console.log(
            "Discord OAuth gestartet:",
            data
        );

    } catch (error) {

        console.error(
            "Login Exception:",
            error
        );

        alert(
            "Beim Discord Login ist ein Fehler aufgetreten."
        );

        if (button) {

            button.disabled = false;

            button.innerHTML =
                '<span class="discord-symbol">◉</span> Mit Discord anmelden';

        }

    }

}


/* =========================================================
   CURRENT USER
========================================================= */

function setCurrentUser(user) {

    currentUser =
        user || null;


    if (currentUser) {

        console.log(
            "Eingeloggt:",
            currentUser
        );

        loadCollectedSprites();

    } else {

        collectedSprites = [];

    }


    updateUserUI();

    updateProgress();

    renderSprites();

}


/* =========================================================
   USER UI
========================================================= */

function updateUserUI() {

    const loggedOut =
        $("logged-out-view");

    const loggedIn =
        $("logged-in-view");

    const warning =
        $("auth-warning");


    if (!currentUser) {

        if (loggedOut) {

            loggedOut.classList.remove(
                "hidden"
            );

        }

        if (loggedIn) {

            loggedIn.classList.add(
                "hidden"
            );

        }

        if (warning) {

            warning.classList.remove(
                "hidden"
            );

        }

        return;

    }


    if (loggedOut) {

        loggedOut.classList.add(
            "hidden"
        );

    }


    if (loggedIn) {

        loggedIn.classList.remove(
            "hidden"
        );

    }


    if (warning) {

        warning.classList.add(
            "hidden"
        );

    }


    /*
       Name
    */

    const userName =
        $("user-name");


    const metadata =
        currentUser.user_metadata || {};


    const discordName =
        metadata.full_name ||
        metadata.name ||
        metadata.user_name ||
        metadata.preferred_username ||
        "Discord User";


    if (userName) {

        userName.textContent =
            discordName;

    }


    /*
       Avatar
    */

    const avatar =
        $("user-avatar");


    if (avatar) {

        const avatarUrl =
            metadata.avatar_url ||
            metadata.picture ||
            "https://cdn.discordapp.com/embed/avatars/0.png";


        avatar.src =
            avatarUrl;

    }

}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    if (!supabaseClient) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Logout Fehler:",
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
            "Logout Exception:",
            error
        );

    }

}


/* =========================================================
   LOAD USER COLLECTION
========================================================= */

function loadCollectedSprites() {

    if (!currentUser) {

        collectedSprites = [];

        return;

    }


    const metadata =
        currentUser.user_metadata || {};


    const saved =
        metadata.collected_sprites;


    if (Array.isArray(saved)) {

        collectedSprites =
            saved.map(
                String
            );

    } else {

        collectedSprites =
            [];

    }


    console.log(
        "Gesammelte Sprites:",
        collectedSprites.length
    );

}


/* =========================================================
   SAVE USER COLLECTION
========================================================= */

async function saveCollectedSprites() {

    if (!currentUser) {

        return false;

    }


    if (!supabaseClient) {

        return false;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.updateUser({

                data: {

                    collected_sprites:
                        collectedSprites

                }

            });


        if (error) {

            console.error(
                "Speichern fehlgeschlagen:",
                error
            );

            return false;

        }


        /*
           Lokalen User aktualisieren
        */

        if (
            data &&
            data.user
        ) {

            currentUser =
                data.user;

        }


        return true;

    } catch (error) {

        console.error(
            "Speicher Exception:",
            error
        );

        return false;

    }

}


/* =========================================================
   LOAD SPRITES
========================================================= */

async function loadSprites(forceReload = false) {

    showLoading();

    hideError();


    try {

        const separator =
            SPRITES_DATA_URL.includes("?")
                ? "&"
                : "?";


        const url =
            forceReload
                ? `${SPRITES_DATA_URL}${separator}t=${Date.now()}`
                : SPRITES_DATA_URL;


        console.log(
            "Lade Sprite-Daten:",
            url
        );


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Sprite-Daten konnten nicht geladen werden. HTTP ${response.status}`
            );

        }


        const rawData =
            await response.json();


        if (!Array.isArray(rawData)) {

            throw new Error(
                "Die Sprite-Daten haben ein ungültiges Format."
            );

        }


        /*
           Daten normalisieren
        */

        sprites =
            rawData
                .filter(
                    item =>
                        item &&
                        item.url
                )
                .map(
                    item => {

                        return {

                            id:
                                String(
                                    item.spriteId ??
                                    `${item.parent}-${item.variant}`
                                ),

                            name:
                                String(
                                    item.parent ??
                                    "Unknown Sprite"
                                ),

                            family:
                                String(
                                    item.parent ??
                                    "Unknown"
                                ),

                            rarity:
                                normalizeRarity(
                                    item.rarity
                                ),

                            variant:
                                String(
                                    item.variant ??
                                    "base"
                                ),

                            image:
                                String(
                                    item.url
                                ),

                            season:
                                String(
                                    item.season ??
                                    ""
                                )

                        };

                    }
                );


        /*
           Doppelte IDs entfernen
        */

        const unique =
            new Map();


        sprites.forEach(
            sprite => {

                /*
                   Sprite ID + Variant,
                   damit Varianten nicht
                   überschrieben werden.
                */

                const uniqueId =
                    `${sprite.id}-${sprite.variant}`;


                sprite.id =
                    uniqueId;


                unique.set(
                    uniqueId,
                    sprite
                );

            }
        );


        sprites =
            Array.from(
                unique.values()
            );


        console.log(
            `${sprites.length} Sprites geladen.`
        );


        /*
           Datenbank Status
        */

        const databaseStatus =
            $("database-status");


        if (databaseStatus) {

            databaseStatus.textContent =
                `${sprites.length.toLocaleString("de-DE")} Sprites`;

        }


        populateFilters();

        populateFamilies();

        hideLoading();

        renderSprites();

        updateProgress();

        updateVisibleCount();


    } catch (error) {

        console.error(
            "Sprite Ladefehler:",
            error
        );


        showError(
            error.message ||
            "Unbekannter Fehler beim Laden der Sprites."
        );

    }

}


/* =========================================================
   RARITY NORMALIZE
========================================================= */

function normalizeRarity(rarity) {

    if (!rarity) {

        return "Special";

    }


    const value =
        String(
            rarity
        ).toLowerCase();


    switch (value) {

        case "common":
            return "Common";

        case "uncommon":
            return "Uncommon";

        case "rare":
            return "Rare";

        case "epic":
            return "Epic";

        case "legendary":
            return "Legendary";

        case "mythic":
            return "Mythic";

        case "special":
            return "Special";

        default:
            return (
                value.charAt(0).toUpperCase() +
                value.slice(1)
            );

    }

}


/* =========================================================
   FILTERS
========================================================= */

function populateFilters() {

    const raritySelect =
        $("rarity-filter");

    const variantSelect =
        $("variant-filter");


    if (raritySelect) {

        const rarities =
            [
                ...new Set(
                    sprites.map(
                        sprite =>
                            sprite.rarity
                    )
                )
            ].sort();


        raritySelect.innerHTML =
            `<option value="all">Alle Seltenheiten</option>`;


        rarities.forEach(
            rarity => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    rarity.toLowerCase();


                option.textContent =
                    rarity;


                raritySelect.appendChild(
                    option
                );

            }
        );

    }


    if (variantSelect) {

        const variants =
            [
                ...new Set(
                    sprites.map(
                        sprite =>
                            sprite.variant
                    )
                )
            ].sort();


        variantSelect.innerHTML =
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
                    formatVariantName(
                        variant
                    );


                variantSelect.appendChild(
                    option
                );

            }
        );

    }

}


/* =========================================================
   FAMILY FILTER
========================================================= */

function populateFamilies() {

    const familyList =
        $("family-list");


    if (!familyList) {

        return;

    }


    const families =
        [
            ...new Set(
                sprites.map(
                    sprite =>
                        sprite.family
                )
            )
        ].sort(
            (a, b) =>
                a.localeCompare(
                    b
                )
        );


    familyList.innerHTML =
        "";


    /*
       Alle
    */

    const allButton =
        createFamilyButton(
            "all",
            "Alle"
        );


    allButton.classList.add(
        "active"
    );


    familyList.appendChild(
        allButton
    );


    families.forEach(
        family => {

            const button =
                createFamilyButton(
                    family,
                    family
                );


            familyList.appendChild(
                button
            );

        }
    );


    const familyCount =
        $("family-count");


    if (familyCount) {

        familyCount.textContent =
            `${families.length} Familien`;

    }

}


/* =========================================================
   FAMILY BUTTON
========================================================= */

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


    button.textContent =
        label;


    button.addEventListener(
        "click",
        () => {

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


            currentFamily =
                value;


            renderSprites();

        }
    );


    return button;

}


/* =========================================================
   CONTROLS
========================================================= */

function setupControls() {

    const search =
        $("search-input");


    if (search) {

        search.addEventListener(
            "input",
            event => {

                currentSearch =
                    event.target.value
                        .trim()
                        .toLowerCase();


                renderSprites();

            }
        );

    }


    const rarity =
        $("rarity-filter");


    if (rarity) {

        rarity.addEventListener(
            "change",
            event => {

                currentRarity =
                    event.target.value;


                renderSprites();

            }
        );

    }


    const variant =
        $("variant-filter");


    if (variant) {

        variant.addEventListener(
            "change",
            event => {

                currentVariant =
                    event.target.value;


                renderSprites();

            }
        );

    }


    const sort =
        $("sort-filter");


    if (sort) {

        sort.addEventListener(
            "change",
            event => {

                currentSort =
                    event.target.value;


                renderSprites();

            }
        );

    }


    /*
       "/" öffnet Suche
    */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "/" &&
                document.activeElement !== search
            ) {

                event.preventDefault();

                if (search) {

                    search.focus();

                }

            }


            if (
                event.key === "Escape" &&
                search
            ) {

                search.value = "";

                currentSearch =
                    "";

                renderSprites();

                search.blur();

            }

        }
    );

}


/* =========================================================
   GET VISIBLE SPRITES
========================================================= */

function getVisibleSprites() {

    let result =
        sprites.filter(
            sprite => {

                /*
                   Suche
                */

                const searchText =
                    `${sprite.name} ${sprite.family} ${sprite.variant}`
                        .toLowerCase();


                const matchesSearch =
                    !currentSearch ||
                    searchText.includes(
                        currentSearch
                    );


                /*
                   Familie
                */

                const matchesFamily =
                    currentFamily === "all" ||
                    sprite.family === currentFamily;


                /*
                   Rarity
                */

                const matchesRarity =
                    currentRarity === "all" ||
                    sprite.rarity.toLowerCase() ===
                        currentRarity;


                /*
                   Variant
                */

                const matchesVariant =
                    currentVariant === "all" ||
                    sprite.variant === currentVariant;


                return (
                    matchesSearch &&
                    matchesFamily &&
                    matchesRarity &&
                    matchesVariant
                );

            }
        );


    /*
       Sortierung
    */

    switch (currentSort) {

        case "name":

            result.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );

            break;


        case "rarity":

            result.sort(
                (a, b) =>
                    rarityWeight(
                        b.rarity
                    ) -
                    rarityWeight(
                        a.rarity
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


        case "owned":

            result.sort(
                (a, b) => {

                    const aOwned =
                        collectedSprites.includes(
                            a.id
                        );

                    const bOwned =
                        collectedSprites.includes(
                            b.id
                        );


                    return (
                        Number(bOwned) -
                        Number(aOwned)
                    );

                }
            );

            break;


        default:

            break;

    }


    return result;

}


/* =========================================================
   RARITY WEIGHT
========================================================= */

function rarityWeight(rarity) {

    const weights = {

        "Common": 1,

        "Uncommon": 2,

        "Rare": 3,

        "Epic": 4,

        "Legendary": 5,

        "Mythic": 6,

        "Special": 7

    };


    return (
        weights[rarity] ||
        0
    );

}


/* =========================================================
   RENDER SPRITES
========================================================= */

function renderSprites() {

    const container =
        $("sprites-container");


    if (!container) {

        return;

    }


    const visibleSprites =
        getVisibleSprites();


    container.innerHTML =
        "";


    updateVisibleCount(
        visibleSprites.length
    );


    if (
        visibleSprites.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div style="font-size:42px;">
                    🔎
                </div>

                <h3>
                    Keine Sprites gefunden
                </h3>

                <p>
                    Ändere deine Suche oder Filter.
                </p>

            </div>

        `;

        return;

    }


    const fragment =
        document.createDocumentFragment();


    visibleSprites.forEach(
        sprite => {

            const card =
                createSpriteCard(
                    sprite
                );


            fragment.appendChild(
                card
            );

        }
    );


    container.appendChild(
        fragment
    );

}


/* =========================================================
   SPRITE CARD
========================================================= */

function createSpriteCard(
    sprite
) {

    const card =
        document.createElement(
            "article"
        );


    const owned =
        collectedSprites.includes(
            sprite.id
        );


    card.className =
        "sprite-card" +
        (
            owned
                ? " owned"
                : ""
        );


    const rarityClass =
        `rarity-${sprite.rarity.toLowerCase()}`;


    card.innerHTML = `

        <div class="owned-badge">
            ✓
        </div>

        <div class="sprite-image-container">

            <img
                class="sprite-image"
                src="${escapeAttribute(sprite.image)}"
                alt="${escapeAttribute(sprite.name)}"
                loading="lazy"
            >

        </div>

        <div class="sprite-card-content">

            <div class="sprite-meta">

                <span class="sprite-rarity ${rarityClass}">
                    ${escapeHtml(sprite.rarity)}
                </span>

                <span class="sprite-variant">
                    ${escapeHtml(formatVariantName(sprite.variant))}
                </span>

            </div>

            <h3 class="sprite-name">
                ${escapeHtml(sprite.name)}
            </h3>

            <p class="sprite-description">
                ${escapeHtml(sprite.season || "Fortnite Sprite")}
            </p>

            <button
                type="button"
                class="sprite-status"
                data-sprite-id="${escapeAttribute(sprite.id)}"
            >
                ${
                    owned
                        ? "✓ Gesammelt"
                        : "Als gesammelt markieren"
                }
            </button>

        </div>

    `;


    /*
       Bild Fehler
    */

    const image =
        card.querySelector(
            ".sprite-image"
        );


    if (image) {

        image.addEventListener(
            "error",
            () => {

                image.style.display =
                    "none";


                const imageContainer =
                    image.parentElement;


                if (imageContainer) {

                    imageContainer.classList.add(
                        "image-error"
                    );

                    imageContainer.insertAdjacentHTML(
                        "beforeend",
                        `
                            <div class="image-fallback">
                                <span>?</span>
                                <small>Bild nicht verfügbar</small>
                            </div>
                        `
                    );

                }

            }
        );

    }


    /*
       Sammeln Button
    */

    const button =
        card.querySelector(
            ".sprite-status"
        );


    if (button) {

        button.addEventListener(
            "click",
            () => {

                toggleSprite(
                    sprite.id
                );

            }
        );

    }


    return card;

}


/* =========================================================
   TOGGLE SPRITE
========================================================= */

async function toggleSprite(
    spriteId
) {

    if (!currentUser) {

        alert(
            "Bitte melde dich zuerst mit Discord an."
        );

        return;

    }


    const id =
        String(
            spriteId
        );


    const index =
        collectedSprites.indexOf(
            id
        );


    if (index >= 0) {

        collectedSprites.splice(
            index,
            1
        );

    } else {

        collectedSprites.push(
            id
        );

    }


    updateProgress();

    renderSprites();


    /*
       Speichern
    */

    const success =
        await saveCollectedSprites();


    if (!success) {

        /*
           Bei Fehler UI zurücksetzen
        */

        const indexAfter =
            collectedSprites.indexOf(
                id
            );


        if (index >= 0) {

            if (indexAfter === -1) {

                collectedSprites.push(
                    id
                );

            }

        } else {

            if (indexAfter >= 0) {

                collectedSprites.splice(
                    indexAfter,
                    1
                );

            }

        }


        updateProgress();

        renderSprites();


        alert(
            "Die Sammlung konnte nicht gespeichert werden."
        );

    }

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
                ) *
                100
            )
            : 0;


    const collectedCount =
        $("collected-count");


    if (collectedCount) {

        collectedCount.textContent =
            collected.toLocaleString(
                "de-DE"
            );

    }


    const totalCount =
        $("total-count");


    if (totalCount) {

        totalCount.textContent =
            total.toLocaleString(
                "de-DE"
            );

    }


    const progressNumber =
        $("progress-number");


    if (progressNumber) {

        progressNumber.textContent =
            `${percentage}%`;

    }


    const progressBar =
        $("progress-bar-fill");


    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;

    }

}


/* =========================================================
   VISIBLE COUNT
========================================================= */

function updateVisibleCount(
    count = null
) {

    const visibleCount =
        $("visible-count");


    if (!visibleCount) {

        return;

    }


    const amount =
        count === null
            ? sprites.length
            : count;


    visibleCount.textContent =
        `${amount.toLocaleString("de-DE")} Ergebnisse`;

}


/* =========================================================
   VARIANT NAME
========================================================= */

function formatVariantName(
    variant
) {

    if (!variant) {

        return "Base";

    }


    const text =
        String(
            variant
        )
        .replace(
            /[-_]/g,
            " "
        );


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

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


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

    const loading =
        $("loading-state");

    const container =
        $("sprites-container");


    if (loading) {

        loading.classList.remove(
            "hidden"
        );

    }


    if (container) {

        container.innerHTML =
            "";

    }

}


/* =========================================================
   HIDE LOADING
========================================================= */

function hideLoading() {

    const loading =
        $("loading-state");


    if (loading) {

        loading.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   SHOW ERROR
========================================================= */

function showError(
    message
) {

    hideLoading();


    const errorState =
        $("error-state");


    const errorMessage =
        $("error-message");


    if (errorState) {

        errorState.classList.remove(
            "hidden"
        );

    }


    if (errorMessage) {

        errorMessage.textContent =
            message;

    }

}


/* =========================================================
   HIDE ERROR
========================================================= */

function hideError() {

    const errorState =
        $("error-state");


    if (errorState) {

        errorState.classList.add(
            "hidden"
        );

    }

}


window.loginWithDiscord =
    loginWithDiscord;

window.logout =
    logout;

window.loadSprites =
    loadSprites;

window.toggleSprite =
    toggleSprite;

const CLIENT_ID =
    "1556295412757823558";

const REDIRECT_URI =
    "https://ykbqnxqlbttqzaerqgnb.supabase.co/auth/v1/callback";



const SPRITES_DATA = [

    {
        id: "bush",
        name: "Bush Sprite",
        rarity: "Rare",
        description:
            "Erzeugt nach einiger Zeit einen Busch um dich.",
        image: "assets/sprites/bush.png"
    },

    {
        id: "adventure",
        name: "Adventure Sprite",
        rarity: "Rare",
        description:
            "Verbessert beim Leveln zufällig einen Gegenstand in deinem Inventar.",
        image: "assets/sprites/adventure.png"
    },

    {
        id: "jonesy",
        name: "Jonesy Sprite",
        rarity: "Rare",
        description:
            "Stellt nach erlittenem Schaden Gesundheit oder Schild wieder her.",
        image: "assets/sprites/jonesy.png"
    },

    {
        id: "8-bit",
        name: "8-Bit Sprite",
        rarity: "Rare",
        description:
            "Bringt eine 8-Bit-Schrotflinte in deine erste Truhe.",
        image: "assets/sprites/8-bit.png"
    },

    {
        id: "sonic",
        name: "Sonic Sprite",
        rarity: "Epic",
        description:
            "Erhöht deine Sprintgeschwindigkeit.",
        image: "assets/sprites/sonic.png"
    },

    {
        id: "tails",
        name: "Tails Sprite",
        rarity: "Epic",
        description:
            "Ermöglicht dir, in der Luft zu schweben.",
        image: "assets/sprites/tails.png"
    },

    {
        id: "shadow",
        name: "Shadow Sprite",
        rarity: "Epic",
        description:
            "Lädt Waffen automatisch nach, auch wenn sie nicht ausgerüstet sind.",
        image: "assets/sprites/shadow.png"
    },

    {
        id: "killswitch",
        name: "Killswitch Sprite",
        rarity: "Epic",
        description:
            "Aktiviert Hangtime mit verbesserter Genauigkeit.",
        image: "assets/sprites/killswitch.png"
    },

    {
        id: "storm-scout",
        name: "Storm Scout Sprite",
        rarity: "Epic",
        description:
            "Erzeugt Overdrive nach ausreichend Sturmschaden.",
        image: "assets/sprites/storm-scout.png"
    },

    {
        id: "pond",
        name: "Pond Sprite",
        rarity: "Epic",
        description:
            "Ermöglicht nach der Landung einen stärkeren Sprung.",
        image: "assets/sprites/pond.png"
    },

    {
        id: "blinky",
        name: "Blinky Sprite",
        rarity: "Epic",
        description:
            "Kann dich nach erlittenem Schaden tarnen.",
        image: "assets/sprites/blinky.png"
    },

    {
        id: "spooky-dash",
        name: "Spooky Dash Sprite",
        rarity: "Epic",
        description:
            "Verleiht eine besondere Phasen-Dash-Fähigkeit.",
        image: "assets/sprites/spooky-dash.png"
    },

    {
        id: "vampire",
        name: "Vampire Sprite",
        rarity: "Epic",
        description:
            "Verleiht einen Lebensraub-Effekt bei Schaden.",
        image: "assets/sprites/vampire.png"
    },

    {
        id: "the-deer",
        name: "The Deer Sprite",
        rarity: "Epic",
        description:
            "Verstärkt deinen Nahkampfschaden.",
        image: "assets/sprites/deer.png"
    },

    {
        id: "jackrabbit",
        name: "Jackrabbit Sprite",
        rarity: "Legendary",
        description:
            "Ermöglicht einen zusätzlichen Sprung in der Luft.",
        image: "assets/sprites/jackrabbit.png"
    },

    {
        id: "x-ray",
        name: "X-Ray Sprite",
        rarity: "Legendary",
        description:
            "Markiert regelmäßig Gegner in deiner Umgebung.",
        image: "assets/sprites/x-ray.png"
    },

    {
        id: "mega-man",
        name: "Mega Man Sprite",
        rarity: "Rare",
        description:
            "Verändert deine Bewegung beim Rutschen und Schwimmen.",
        image: "assets/sprites/mega-man.png"
    },

    {
        id: "overshield",
        name: "Overshield Sprite",
        rarity: "Legendary",
        description:
            "Verleiht dir einen zusätzlichen Overshield.",
        image: "assets/sprites/overshield.png"
    },

    {
        id: "onigiri",
        name: "Onigiri Sprite",
        rarity: "Epic",
        description:
            "Aktiviert nach dem Konsumieren eines Gegenstands Overdrive.",
        image: "assets/sprites/onigiri.png"
    },

    {
        id: "crash",
        name: "Crash Sprite",
        rarity: "Epic",
        description:
            "Verleiht eine besondere Wirbelwind-Fähigkeit.",
        image: "assets/sprites/crash.png"
    },

    {
        id: "dumpster-dive",
        name: "Dumpster Dive Sprite",
        rarity: "Rare",
        description:
            "Kann Nahrung aus Verstecken erhalten.",
        image: "assets/sprites/dumpster-dive.png"
    },

    {
        id: "klombo",
        name: "Klombo Sprite",
        rarity: "Mythic",
        description:
            "Kann dir beim Leveln zufällige Gegenstände geben.",
        image: "assets/sprites/klombo.png"
    },

    {
        id: "crown",
        name: "Crown Sprite",
        rarity: "Mythic",
        description:
            "Verleiht zusätzliche Crown Wins nach einem Victory Royale.",
        image: "assets/sprites/crown.png"
    },

    {
        id: "morgana",
        name: "Morgana Sprite",
        rarity: "Epic",
        description:
            "Verbessert die Wirkung von Heilgegenständen.",
        image: "assets/sprites/morgana.png"
    },

    {
        id: "birthday",
        name: "Birthday Sprite",
        rarity: "Rare",
        description:
            "Besonderer Geburtstags-Sprite.",
        image: "assets/sprites/birthday.png"
    }

];


/* =========================================
   VARIABLEN
========================================= */

let currentUser = null;

let collectedSprites = [];

let currentFilter = "all";

let searchText = "";


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initAuth();

        setupControls();

        renderSprites();

        updateProgress();

    }
);


/* =========================================
   DISCORD LOGIN
========================================= */

function initAuth() {

    const fragment =
        new URLSearchParams(
            window.location.hash.slice(1)
        );

    const accessToken =
        fragment.get(
            "access_token"
        );


    if (accessToken) {

        fetch(
            "https://discord.com/api/users/@me",
            {
                headers: {
                    authorization:
                        `Bearer ${accessToken}`
                }
            }
        )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Discord Login fehlgeschlagen."
                );

            }

            return response.json();

        })

        .then(user => {

            if (!user.id) {

                throw new Error(
                    "Ungültiger Discord User."
                );

            }

            currentUser = user;

            window.history.replaceState(
                {},
                document.title,
                REDIRECT_URI
            );

            loadUserData();

            updateUI();

            renderSprites();

        })

        .catch(error => {

            console.error(
                "Discord Auth Fehler:",
                error
            );

        });

    } else {

        const savedUser =
            localStorage.getItem(
                "discord_user"
            );


        if (savedUser) {

            try {

                currentUser =
                    JSON.parse(
                        savedUser
                    );

                loadUserData();

                updateUI();

            } catch {

                localStorage.removeItem(
                    "discord_user"
                );

            }

        }

    }


    document
        .getElementById("login-btn")
        .addEventListener(
            "click",
            loginWithDiscord
        );


    document
        .getElementById("logout-btn")
        .addEventListener(
            "click",
            logout
        );

}


/* =========================================
   LOGIN
========================================= */

function loginWithDiscord() {

    const authUrl =
        "https://discord.com/oauth2/authorize" +

        `?client_id=${CLIENT_ID}` +

        `&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}` +

        "&response_type=token" +

        "&scope=identify";


    window.location.href =
        authUrl;

}


/* =========================================
   LOGOUT
========================================= */

function logout() {

    currentUser = null;

    collectedSprites = [];

    localStorage.removeItem(
        "discord_user"
    );

    updateUI();

    renderSprites();

    updateProgress();

}


/* =========================================
   USER DATEN
========================================= */

function loadUserData() {

    if (!currentUser) {
        return;
    }


    localStorage.setItem(
        "discord_user",
        JSON.stringify(
            currentUser
        )
    );


    const saved =
        localStorage.getItem(
            `sprites_${currentUser.id}`
        );


    collectedSprites =
        saved
            ? JSON.parse(saved)
            : [];

}


/* =========================================
   USER DATEN SPEICHERN
========================================= */

function saveUserData() {

    if (!currentUser) {
        return;
    }


    localStorage.setItem(
        `sprites_${currentUser.id}`,
        JSON.stringify(
            collectedSprites
        )
    );

}


/* =========================================
   UI
========================================= */

function updateUI() {

    const loggedOut =
        document.getElementById(
            "logged-out-view"
        );

    const loggedIn =
        document.getElementById(
            "logged-in-view"
        );

    const warning =
        document.getElementById(
            "auth-warning"
        );


    if (currentUser) {

        loggedOut.classList.add(
            "hidden"
        );

        loggedIn.classList.remove(
            "hidden"
        );

        warning.classList.add(
            "hidden"
        );


        document.getElementById(
            "user-name"
        ).textContent =
            currentUser.global_name ||
            currentUser.username;


        const avatar =
            currentUser.avatar

                ? `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png?size=128`

                : "https://cdn.discordapp.com/embed/avatars/0.png";


        document.getElementById(
            "user-avatar"
        ).src =
            avatar;

    } else {

        loggedOut.classList.remove(
            "hidden"
        );

        loggedIn.classList.add(
            "hidden"
        );

        warning.classList.remove(
            "hidden"
        );

    }


    updateProgress();

}


/* =========================================
   CONTROLS
========================================= */

function setupControls() {

    const search =
        document.getElementById(
            "search-input"
        );


    search.addEventListener(
        "input",
        event => {

            searchText =
                event.target.value
                    .trim()
                    .toLowerCase();

            renderSprites();

        }
    );


    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".filter-btn"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter;


                    renderSprites();

                }
            );

        });

}


/* =========================================
   SPRITE TOGGLE
========================================= */

function toggleSprite(
    spriteId
) {

    if (!currentUser) {

        alert(
            "Bitte melde dich zuerst mit Discord an!"
        );

        return;

    }


    const index =
        collectedSprites.indexOf(
            spriteId
        );


    if (index >= 0) {

        collectedSprites.splice(
            index,
            1
        );

    } else {

        collectedSprites.push(
            spriteId
        );

    }


    saveUserData();

    renderSprites();

    updateProgress();

}


/* =========================================
   FILTER
========================================= */

function getVisibleSprites() {

    return SPRITES_DATA.filter(
        sprite => {

            const matchesSearch =
                sprite.name
                    .toLowerCase()
                    .includes(
                        searchText
                    );


            const owned =
                collectedSprites.includes(
                    sprite.id
                );


            let matchesFilter =
                true;


            if (
                currentFilter ===
                "owned"
            ) {

                matchesFilter =
                    owned;

            }


            if (
                currentFilter ===
                "missing"
            ) {

                matchesFilter =
                    !owned;

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        }
    );

}


/* =========================================
   SPRITES RENDERN
========================================= */

function renderSprites() {

    const container =
        document.getElementById(
            "sprites-container"
        );


    const sprites =
        getVisibleSprites();


    container.innerHTML =
        "";


    document.getElementById(
        "sprite-count"
    ).textContent =
        `${sprites.length} Sprites`;


    if (
        sprites.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                🔎

                <h3>
                    Keine Sprites gefunden
                </h3>

                <p>
                    Versuche einen anderen Suchbegriff.
                </p>

            </div>

        `;

        return;

    }


    sprites.forEach(
        sprite => {

            const owned =
                collectedSprites.includes(
                    sprite.id
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                `sprite-card ${
                    owned
                        ? "owned"
                        : ""
                }`;


            const rarityClass =
                `rarity-${sprite.rarity.toLowerCase()}`;


            card.innerHTML = `

                <div class="owned-badge">
                    ✓
                </div>


                <div class="sprite-image-container">

                    <img
                        class="sprite-image"
                        src="${sprite.image}"
                        alt="${sprite.name}"
                        loading="lazy"
                        onerror="this.style.opacity='0.15'"
                    >

                </div>


                <div
                    class="sprite-rarity ${rarityClass}"
                >
                    ${sprite.rarity}
                </div>


                <h3 class="sprite-name">
                    ${sprite.name}
                </h3>


                <p class="sprite-description">
                    ${sprite.description}
                </p>


                <button
                    class="sprite-status"
                    onclick="toggleSprite('${sprite.id}')"
                >
                    ${
                        owned
                            ? "✓ Gesammelt"
                            : "Als gesammelt markieren"
                    }
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   PROGRESS
========================================= */

function updateProgress() {

    const total =
        SPRITES_DATA.length;


    const collected =
        collectedSprites.filter(
            id =>
                SPRITES_DATA.some(
                    sprite =>
                        sprite.id === id
                )
        ).length;


    const percentage =
        total === 0

            ? 0

            : Math.round(
                (
                    collected /
                    total
                ) * 100
            );


    document.getElementById(
        "progress-bar-fill"
    ).style.width =
        `${percentage}%`;


    document.getElementById(
        "progress-number"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "progress-text"
    ).textContent =
        `${collected} von ${total} gesammelt`;

}

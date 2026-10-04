
const SUPABASE_URL =
    "https://ykbqnxqlbttqzaerqgnb.supabase.co";


const SUPABASE_ANON_KEY =
    "sb_publishable_nHZCz4UMQecRv8WmvIiZ6A_j_aQLRx_";



const WEBSITE_URL =
    "https://tommmyshelby.github.io/Fortnite/";




let supabaseClient = null;

if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
} else {
    console.error(
        "Supabase wurde nicht geladen. " +
        "Prüfe, ob supabase-js in deiner index.html eingebunden ist."
    );
}


/* =========================================================
   SPRITES
   ========================================================= */

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



let currentUser = null;

let collectedSprites = [];

let currentFilter = "all";

let searchText = "";



document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setupControls();

        setupAuth();

        renderSprites();

        updateProgress();

    }
);




function setupAuth() {

    const loginButton =
        document.getElementById("login-btn");

    const logoutButton =
        document.getElementById("logout-btn");


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            loginWithDiscord
        );

    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }


    restoreSupabaseSession();



    if (supabaseClient) {

        supabaseClient.auth.onAuthStateChange(
            async (event, session) => {

                console.log(
                    "Supabase Auth:",
                    event
                );


                if (session && session.user) {

                    await setCurrentUser(
                        session.user
                    );

                } else {

                    currentUser = null;

                    collectedSprites = [];

                    updateUI();

                    renderSprites();

                    updateProgress();

                }

            }
        );

    }

}




async function restoreSupabaseSession() {

    if (!supabaseClient) {

        console.error(
            "Supabase Client ist nicht verfügbar."
        );

        updateUI();

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Session Fehler:",
                error
            );

            currentUser = null;

            updateUI();

            return;

        }


        if (
            data &&
            data.session &&
            data.session.user
        ) {

            await setCurrentUser(
                data.session.user
            );

        } else {

            currentUser = null;

            collectedSprites = [];

            updateUI();

            renderSprites();

            updateProgress();

        }

    } catch (error) {

        console.error(
            "Fehler beim Wiederherstellen der Session:",
            error
        );

        currentUser = null;

        updateUI();

    }

}




async function loginWithDiscord() {

    if (!supabaseClient) {

        alert(
            "Supabase wurde nicht geladen."
        );

        return;

    }


    if (
        !SUPABASE_ANON_KEY ||
        SUPABASE_ANON_KEY ===
        "DEIN_SUPABASE_PUBLISHABLE_KEY"
    ) {

        alert(
            "Der Supabase Publishable/Anon Key fehlt noch in der script.js."
        );

        console.error(
            "SUPABASE_ANON_KEY wurde noch nicht gesetzt."
        );

        return;

    }


    try {

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

            return;

        }


        console.log(
            "Discord Login gestartet:",
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

    }

}




async function setCurrentUser(user) {

    if (!user) {

        currentUser = null;

        collectedSprites = [];

        updateUI();

        renderSprites();

        updateProgress();

        return;

    }


    currentUser = user;


    console.log(
        "Discord Benutzer angemeldet:",
        currentUser
    );


    await loadUserData();


    updateUI();

    renderSprites();

    updateProgress();

}


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

            alert(
                "Logout fehlgeschlagen:\n\n" +
                error.message
            );

            return;

        }


        currentUser = null;

        collectedSprites = [];


        updateUI();

        renderSprites();

        updateProgress();


    } catch (error) {

        console.error(
            "Logout Exception:",
            error
        );

    }

}




async function loadUserData() {

    if (!currentUser) {

        collectedSprites = [];

        return;

    }


    try {



        const metadata =
            currentUser.user_metadata || {};


        const savedSprites =
            metadata.collected_sprites;


        if (Array.isArray(savedSprites)) {

            collectedSprites =
                savedSprites.filter(
                    id =>
                        SPRITES_DATA.some(
                            sprite =>
                                sprite.id === id
                        )
                );

        } else {

            collectedSprites = [];

        }


        console.log(
            "Gesammelte Sprites geladen:",
            collectedSprites
        );


    } catch (error) {

        console.error(
            "Fehler beim Laden der User-Daten:",
            error
        );

        collectedSprites = [];

    }

}




async function saveUserData() {

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
                "Sprite-Daten konnten nicht gespeichert werden:",
                error
            );

            alert(
                "Die Sprite-Daten konnten nicht gespeichert werden."
            );

            return false;

        }



        if (
            data &&
            data.user
        ) {

            currentUser =
                data.user;

        }


        console.log(
            "Sprite-Daten gespeichert:",
            collectedSprites
        );


        return true;


    } catch (error) {

        console.error(
            "Speichern Exception:",
            error
        );

        return false;

    }

}




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


    if (!loggedOut || !loggedIn) {

        console.warn(
            "Login UI Elemente fehlen in der index.html."
        );

        return;

    }


    if (currentUser) {

        loggedOut.classList.add(
            "hidden"
        );


        loggedIn.classList.remove(
            "hidden"
        );


        if (warning) {

            warning.classList.add(
                "hidden"
            );

        }


 
        const userName =
            document.getElementById(
                "user-name"
            );


        if (userName) {

            userName.textContent =
                getDiscordUsername(
                    currentUser
                );

        }


        /*
         * Discord Avatar
         */

        const userAvatar =
            document.getElementById(
                "user-avatar"
            );


        if (userAvatar) {

            userAvatar.src =
                getDiscordAvatar(
                    currentUser
                );

            userAvatar.alt =
                getDiscordUsername(
                    currentUser
                );

        }


    } else {

        loggedOut.classList.remove(
            "hidden"
        );


        loggedIn.classList.add(
            "hidden"
        );


        if (warning) {

            warning.classList.remove(
                "hidden"
            );

        }

    }


    updateProgress();

}



function getDiscordUsername(user) {

    if (!user) {

        return "Discord User";

    }


    const metadata =
        user.user_metadata || {};


    return (
        metadata.global_name ||
        metadata.full_name ||
        metadata.name ||
        metadata.user_name ||
        metadata.preferred_username ||
        user.email?.split("@")[0] ||
        "Discord User"
    );

}



function getDiscordAvatar(user) {

    if (!user) {

        return (
            "https://cdn.discordapp.com/embed/avatars/0.png"
        );

    }


    const metadata =
        user.user_metadata || {};




    if (metadata.avatar_url) {

        return metadata.avatar_url;

    }




    const avatar =
        metadata.avatar;


    const discordId =
        metadata.provider_id ||
        metadata.sub ||
        user.user_metadata?.id;


    if (
        avatar &&
        discordId
    ) {

        return (
            `https://cdn.discordapp.com/avatars/` +
            `${discordId}/${avatar}.png?size=128`
        );

    }


    return (
        "https://cdn.discordapp.com/embed/avatars/0.png"
    );

}




function setupControls() {

    const search =
        document.getElementById(
            "search-input"
        );


    if (search) {

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

                        document
                            .querySelectorAll(
                                ".filter-btn"
                            )
                            .forEach(
                                btn => {

                                    btn.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );


                        currentFilter =
                            button.dataset.filter ||
                            "all";


                        renderSprites();

                    }
                );

            }
        );

}




async function toggleSprite(spriteId) {

    if (!currentUser) {

        alert(
            "Bitte melde dich zuerst mit Discord an!"
        );

        return;

    }


    const spriteExists =
        SPRITES_DATA.some(
            sprite =>
                sprite.id === spriteId
        );


    if (!spriteExists) {

        console.error(
            "Unbekannter Sprite:",
            spriteId
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




    const saved =
        await saveUserData();


    if (!saved) {

 
        await loadUserData();

    }


    renderSprites();

    updateProgress();

}



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



function renderSprites() {

    const container =
        document.getElementById(
            "sprites-container"
        );


    if (!container) {

        return;

    }


    const sprites =
        getVisibleSprites();


    container.innerHTML =
        "";


    const spriteCount =
        document.getElementById(
            "sprite-count"
        );


    if (spriteCount) {

        spriteCount.textContent =
            `${sprites.length} Sprites`;

    }


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
                        src="${escapeHtml(sprite.image)}"
                        alt="${escapeHtml(sprite.name)}"
                        loading="lazy"
                        onerror="this.style.opacity='0.15'"
                    >

                </div>


                <div
                    class="sprite-rarity ${rarityClass}"
                >
                    ${escapeHtml(sprite.rarity)}
                </div>


                <h3 class="sprite-name">
                    ${escapeHtml(sprite.name)}
                </h3>


                <p class="sprite-description">
                    ${escapeHtml(sprite.description)}
                </p>


                <button
                    class="sprite-status"
                    type="button"
                    data-sprite-id="${escapeHtml(sprite.id)}"
                >
                    ${
                        owned
                            ? "✓ Gesammelt"
                            : "Als gesammelt markieren"
                    }
                </button>

            `;


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


            container.appendChild(
                card
            );

        }
    );

}




function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}



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


    const progressBar =
        document.getElementById(
            "progress-bar-fill"
        );


    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;

    }


    const progressNumber =
        document.getElementById(
            "progress-number"
        );


    if (progressNumber) {

        progressNumber.textContent =
            `${percentage}%`;

    }


    const progressText =
        document.getElementById(
            "progress-text"
        );


    if (progressText) {

        progressText.textContent =
            `${collected} von ${total} gesammelt`;

    }

}




window.toggleSprite =
    toggleSprite;




window.loginWithDiscord =
    loginWithDiscord;


window.logout =
    logout;

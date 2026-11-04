// =====================================================
// STATO APPLICAZIONE
// =====================================================

let plants = JSON.parse(localStorage.getItem("plants")) || [];
let editingId = null;

// Compatibilità con vecchi dati
plants.forEach((plant, index) => {
    if (!plant.id) {
        plant.id = "old_" + index + "_" + Date.now();
    }
});

// =====================================================
// ELEMENTI DOM
// =====================================================

const totalPlantsEl = document.getElementById("totalPlants");
const plantsToWaterEl = document.getElementById("plantsToWater");
const lastWateredEl = document.getElementById("lastWatered");

const plantListEl = document.getElementById("plantList");
const listTitleEl = document.getElementById("listTitle");

const plantDetailEl = document.getElementById("plantDetail");

const formTitleEl = document.getElementById("formTitle");

const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const purchaseInput = document.getElementById("purchase");
const frequencyInput = document.getElementById("frequency");
const descriptionInput = document.getElementById("description");

// =====================================================
// UTILITY
// =====================================================

function todayStr() {
    return new Date().toISOString().split("T")[0];
}

function saveStorage() {
    localStorage.setItem(
        "plants",
        JSON.stringify(plants)
    );
}

function getPlant(id) {
    return plants.find(
        plant => plant.id === id
    );
}

function escapeHtml(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatDate(date) {
    if (!date) return "-";

    const [y, m, d] = date.split("-");

    return `${d}/${m}/${y}`;
}

function saveAndRefresh() {
    saveStorage();
    renderDashboard();
}

// =====================================================
// IRRIGAZIONE
// =====================================================

function getWateringStatus(plant) {

    const lastDate = new Date(
        plant.lastWateredDate ||
        plant.purchaseDate
    );

    const today = new Date();

    const diffDays = Math.floor(
        (today - lastDate) /
        (1000 * 60 * 60 * 24)
    );

    const daysLeft =
        plant.frequency - diffDays;

    let percent =
        100 -
        ((diffDays / plant.frequency) * 100);

    percent = Math.max(
        0,
        Math.min(100, percent)
    );

    let color = "#2e7d32";

    if (percent <= 20) {
        color = "#d32f2f";
    } else if (percent <= 30) {
        color = "#ed6c02";
    }

    return {
        needsWater: daysLeft <= 0,
        daysLeft,
        percent,
        color
    };
}

// =====================================================
// DASHBOARD
// =====================================================

function renderDashboard() {

    totalPlantsEl.textContent =
        plants.length;

    let daAnnaffiare = 0;
    let latestTimestamp = 0;

    plants.forEach(plant => {

        const status =
            getWateringStatus(plant);

        if (status.needsWater) {
            daAnnaffiare++;
        }

        if (plant.lastWateredDate) {

            const timestamp =
                new Date(
                    plant.lastWateredDate
                ).getTime();

            if (
                timestamp >
                latestTimestamp
            ) {
                latestTimestamp =
                    timestamp;
            }
        }
    });

    plantsToWaterEl.textContent =
        daAnnaffiare;

    if (latestTimestamp > 0) {

        lastWateredEl.textContent =
            new Date(
                latestTimestamp
            ).toLocaleDateString("it-IT");

    } else {

        lastWateredEl.textContent = "-";
    }
}
// =====================================================
// NAVIGAZIONE
// =====================================================

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("attiva");
        });

    const page =
        document.getElementById(pageId);

    if (page) {
        page.classList.add("attiva");
    }

    document
        .querySelectorAll(".bottom-nav a")
        .forEach(link => {
            link.classList.remove("active");
        });

    if (
        pageId === "page-home"
    ) {
        document
            .querySelector('[data-nav="home"]')
            ?.classList.add("active");
    }

    if (
        pageId === "page-list" ||
        pageId === "page-detail"
    ) {
        document
            .querySelector('[data-nav="lista"]')
            ?.classList.add("active");
    }

    if (
        pageId === "page-form"
    ) {
        document
            .querySelector('[data-nav="aggiungi"]')
            ?.classList.add("active");
    }
}

function route() {

    renderDashboard();

    const hash =
        location.hash.replace("#", "");

    if (
        !hash ||
        hash === "home"
    ) {
        showPage("page-home");
        return;
    }

    if (
        hash === "lista-tutte"
    ) {
        renderList("tutte");
        showPage("page-list");
        return;
    }

    if (
        hash === "lista-vaso"
    ) {
        renderList("vaso");
        showPage("page-list");
        return;
    }

    if (
        hash === "lista-terreno"
    ) {
        renderList("terreno");
        showPage("page-list");
        return;
    }

    if (
        hash === "aggiungi"
    ) {
        openForm();
        showPage("page-form");
        return;
    }

    if (
        hash.startsWith("pianta-")
    ) {

        const id =
            hash.replace(
                "pianta-",
                ""
            );

        renderDetail(id);
        showPage("page-detail");
        return;
    }

    if (
        hash.startsWith("modifica-")
    ) {

        const id =
            hash.replace(
                "modifica-",
                ""
            );

        openForm(id);
        showPage("page-form");
        return;
    }

    showPage("page-home");
}

// =====================================================
// LISTA PIANTE
// =====================================================

function renderList(filter) {

    const titoli = {
        tutte: "🌿 Tutte le Piante",
        vaso: "🪴 Piante in Vaso",
        terreno: "🌳 Piante nel Terreno"
    };

    listTitleEl.textContent =
        titoli[filter] ||
        titoli.tutte;

    let list = [...plants];

    if (filter === "vaso") {
        list = list.filter(
            p =>
                p.category === "Vaso"
        );
    }

    if (filter === "terreno") {
        list = list.filter(
            p =>
                p.category === "Terreno"
        );
    }

    plantListEl.innerHTML = "";

    if (list.length === 0) {

        plantListEl.innerHTML = `
            <div class="empty-state">
                Nessuna pianta presente.
            </div>
        `;

        return;
    }

    list.forEach(plant => {

        const status =
            getWateringStatus(
                plant
            );

        const badge =
            status.needsWater
                ? `
                <span class="badge badge-alert">
                    ⚠️ Annaffiare
                </span>
                `
                : `
                <span class="badge badge-ok">
                    💧 ${status.daysLeft}
                    ${status.daysLeft === 1 ? "giorno" : "giorni"}
                </span>
                `;

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "plant-item clickable";

        item.innerHTML = `
            <div class="plant-info">

                <div class="plant-header">

                    <span class="plant-title">
                        ${escapeHtml(plant.name)}
                    </span>

                    <span class="badge badge-category">
                        ${plant.category}
                    </span>

                    ${badge}

                </div>

                <div class="plant-meta">

                    <span>
                        Frequenza:
                        ogni ${plant.frequency} giorni
                    </span>

                    <span>
                        Ultima irrigazione:
                        ${formatDate(
                            plant.lastWateredDate
                        )}
                    </span>

                </div>

                <div class="watering-progress">

                    <div
                        class="watering-progress-fill"
                        style="
                            width:${status.percent}%;
                            background:${status.color};
                        ">
                    </div>

                </div>

            </div>
        `;

        item.onclick = () => {
            location.hash =
                "pianta-" +
                plant.id;
        };

        plantListEl.appendChild(
            item
        );
    });
}
// =====================================================
// DETTAGLIO PIANTA
// =====================================================

function renderDetail(id) {

    const plant = getPlant(id);

    if (!plant) {

        plantDetailEl.innerHTML = `
            <div class="empty-state">
                Pianta non trovata.
            </div>
        `;

        return;
    }

    const status =
        getWateringStatus(plant);

    const icon =
        plant.category === "Vaso"
            ? "🪴"
            : "🌳";

    plantDetailEl.innerHTML = `

        <div class="detail-icon">
            ${icon}
        </div>

        <h2 class="detail-name">
            ${escapeHtml(plant.name)}
        </h2>

        <div class="detail-row">
            <strong>Categoria</strong>
            <span>${plant.category}</span>
        </div>

        <div class="detail-row">
            <strong>Acquistata</strong>
            <span>${formatDate(plant.purchaseDate)}</span>
        </div>

        <div class="detail-row">
            <strong>Frequenza</strong>
            <span>${plant.frequency} giorni</span>
        </div>

        <div class="detail-row">
            <strong>Ultima irrigazione</strong>
            <span>${formatDate(plant.lastWateredDate)}</span>
        </div>

        <div class="detail-row">
            <strong>Prossima irrigazione</strong>
            <span>
                ${
                    status.needsWater
                        ? "⚠️ Da annaffiare"
                        : `${status.daysLeft} giorni`
                }
            </span>
        </div>

        ${
            plant.description
                ? `
                    <div style="margin-top:1rem;">
                        <strong>Descrizione</strong>
                        <p style="margin-top:0.5rem;">
                            ${escapeHtml(plant.description)}
                        </p>
                    </div>
                `
                : ""
        }

        <div class="plant-actions" style="margin-top:1rem;">

            <button
                class="btn-action btn-water"
                onclick="waterPlant('${plant.id}')">

                💧 Annaffia

            </button>

            <button
                class="btn-action btn-edit"
                onclick="location.hash='modifica-${plant.id}'">

                ✏️ Modifica

            </button>

            <button
                class="btn-action btn-delete"
                onclick="deletePlant('${plant.id}')">

                🗑️ Elimina

            </button>

        </div>
    `;
}

// =====================================================
// AZIONI PIANTA
// =====================================================

function waterPlant(id) {

    const plant = getPlant(id);

    if (!plant) return;

    plant.lastWateredDate =
        todayStr();

    saveAndRefresh();

    route();
}

function deletePlant(id) {

    const plant = getPlant(id);

    if (!plant) return;

    if (
        confirm(
            `Eliminare "${plant.name}" ?`
        )
    ) {

        plants = plants.filter(
            p => p.id !== id
        );

        saveAndRefresh();

        location.hash =
            "lista-tutte";
    }
}

// =====================================================
// FORM
// =====================================================

function openForm(id = null) {

    editingId = id;

    purchaseInput.value =
        todayStr();

    nameInput.value = "";
    categoryInput.value = "Vaso";
    frequencyInput.value = "";
    descriptionInput.value = "";

    if (!id) {

        formTitleEl.textContent =
            "➕ Aggiungi Pianta";

        return;
    }

    const plant =
        getPlant(id);

    if (!plant) return;

    formTitleEl.textContent =
        "✏️ Modifica Pianta";

    nameInput.value =
        plant.name || "";

    categoryInput.value =
        plant.category || "Vaso";

    purchaseInput.value =
        plant.purchaseDate ||
        todayStr();

    frequencyInput.value =
        plant.frequency || "";

    descriptionInput.value =
        plant.description || "";
}

function savePlant() {

    const name =
        nameInput.value.trim();

    const category =
        categoryInput.value;

    const purchase =
        purchaseInput.value;

    const frequency =
        parseInt(
            frequencyInput.value,
            10
        );

    const description =
        descriptionInput.value.trim();

    if (!name) {
        alert(
            "Inserisci un nome."
        );
        return;
    }

    if (
        !frequency ||
        frequency <= 0
    ) {
        alert(
            "Inserisci una frequenza valida."
        );
        return;
    }

    if (editingId) {

        const plant =
            getPlant(editingId);

        if (plant) {

            plant.name =
                name;

            plant.category =
                category;

            plant.purchaseDate =
                purchase;

            plant.frequency =
                frequency;

            plant.description =
                description;
        }

    } else {

        plants.unshift({

            id:
                Date.now().toString(),

            name,

            category,

            purchaseDate:
                purchase,

            frequency,

            description,

            lastWateredDate:
                todayStr()
        });
    }

    saveAndRefresh();

    editingId = null;

    location.hash =
        "lista-tutte";
}

function cancelForm() {

    editingId = null;

    location.hash =
        "home";
}

// =====================================================
// AVVIO
// =====================================================

window.addEventListener(
    "hashchange",
    route
);

window.addEventListener(
    "load",
    () => {

        if (
            purchaseInput &&
            !purchaseInput.value
        ) {
            purchaseInput.value =
                todayStr();
        }

        route();
    }
);

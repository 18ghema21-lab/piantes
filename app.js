// =====================================================
// DATI
// =====================================================

let plants = JSON.parse(localStorage.getItem("plants")) || [];
let editingId = null;

// =====================================================
// ELEMENTI DOM
// =====================================================

const totalPlantsEl = document.getElementById("totalPlants");
const plantsToWaterEl = document.getElementById("plantsToWater");
const lastWateredEl = document.getElementById("lastWatered");

const plantListEl = document.getElementById("plantList");
const listTitleEl = document.getElementById("listTitle");

const plantDetailEl = document.getElementById("plantDetail");
const detailBackEl = document.getElementById("detailBack");

const formTitleEl = document.getElementById("formTitle");
const formBackEl = document.getElementById("formBack");

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
    localStorage.setItem("plants", JSON.stringify(plants));
}

function getPlant(id) {
    return plants.find(p => p.id === id);
}

function escapeHtml(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function giorni(n) {
    return n === 1 ? "giorno" : "giorni";
}

function formatDate(date) {

    if (!date) return "-";

    const [y, m, d] = date.split("-");

    return `${d}/${m}/${y}`;
}

// =====================================================
// IRRIGAZIONE
// =====================================================

function getWateringStatus(plant) {

    const lastDate = new Date(
        plant.lastWateredDate || plant.purchaseDate
    );

    const today = new Date();

    const diffDays = Math.floor(
        (today - lastDate) / (1000 * 60 * 60 * 24)
    );

    const daysLeft = plant.frequency - diffDays;

    let percent =
        100 - ((diffDays / plant.frequency) * 100);

    percent = Math.max(
        0,
        Math.min(100, percent)
    );

    let color = "#2e7d32";

    if (percent <= 20) {
        color = "#d32f2f";
    }
    else if (percent <= 30) {
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

    totalPlantsEl.textContent = plants.length;

    let waterCount = 0;
    let latestTime = 0;

    plants.forEach(plant => {

        const status =
            getWateringStatus(plant);

        if (status.needsWater) {
            waterCount++;
        }

        if (plant.lastWateredDate) {

            const time =
                new Date(
                    plant.lastWateredDate
                ).getTime();

            if (time > latestTime) {
                latestTime = time;
            }
        }
    });

    plantsToWaterEl.textContent =
        waterCount;

    if (latestTime > 0) {

        const date =
            new Date(latestTime);

        lastWateredEl.textContent =
            date.toLocaleDateString("it-IT");

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

    document
        .getElementById(pageId)
        .classList.add("attiva");
}

function route() {

    const hash =
        location.hash.replace("#", "");

    renderDashboard();

    if (!hash || hash === "home") {

        showPage("page-home");
        return;
    }

    if (hash === "aggiungi") {

        openForm();
        showPage("page-form");
        return;
    }

    if (hash === "lista-tutte") {

        renderList("tutte");
        showPage("page-list");
        return;
    }

    if (hash === "lista-vaso") {

        renderList("vaso");
        showPage("page-list");
        return;
    }

    if (hash === "lista-terreno") {

        renderList("terreno");
        showPage("page-list");
        return;
    }

    if (hash.startsWith("pianta-")) {

        const id = hash.substring(7);

        renderDetail(id);
        showPage("page-detail");

        return;
    }

    if (hash.startsWith("modifica-")) {

        const id = hash.substring(9);

        openForm(id);
        showPage("page-form");

        return;
    }
}

// =====================================================
// LISTA
// =====================================================

function renderList(filter) {

    let list = plants;

    if (filter === "vaso") {

        list =
            plants.filter(
                p => p.category === "Vaso"
            );
    }

    if (filter === "terreno") {

        list =
            plants.filter(
                p =>

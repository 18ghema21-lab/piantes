let plants = JSON.parse(localStorage.getItem("plants")) || [];

function savePlants() {
    localStorage.setItem("plants", JSON.stringify(plants));
}

// Calculate water level dynamically based on days elapsed vs watering frequency
function calculateWaterLevel(plant) {
    if (!plant.frequency || plant.frequency <= 0) return 100;
    
    const daysSinceWatered = (Date.now() - new Date(plant.lastWatered)) / (1000 * 60 * 60 * 24);
    const remainingPercentage = 100 - (daysSinceWatered / plant.frequency) * 100;
    
    return Math.max(0, Math.min(100, Math.round(remainingPercentage)));
}

function addPlant() {
    const nameInput = document.getElementById("name");
    const categoryInput = document.getElementById("category");
    const purchaseInput = document.getElementById("purchase");
    const frequencyInput = document.getElementById("frequency");
    const descriptionInput = document.getElementById("description");

    const name = nameInput.value.trim();
    const frequency = Number(frequencyInput.value);

    if (!name || frequency <= 0) {
        alert("Inserisci un nome valido e una frequenza di irrigazione in giorni.");
        return;
    }

    const plant = {
        name: name,
        category: categoryInput ? categoryInput.value : "",
        purchase: purchaseInput ? purchaseInput.value : "",
        frequency: frequency,
        description: descriptionInput ? descriptionInput.value : "",
        lastWatered: new Date().toISOString()
    };

    plants.push(plant);
    savePlants();
    renderPlants();
    updateDashboard();

    // Reset form fields
    nameInput.value = "";
    if (frequencyInput) frequencyInput.value = "";
    if (descriptionInput) descriptionInput.value = "";
}

function renderPlants() {
    const list = document.getElementById("plantList");
    if (!list) return;

    if (plants.length === 0) {
        list.innerHTML = "<p>Nessuna pianta presente. Aggiungine una!</p>";
        return;
    }

    list.innerHTML = plants.map((p, index) => {
        const days = Math.floor(
            (Date.now() - new Date(p.lastWatered)) / (1000 * 60 * 60 * 24)
        );

        const currentWaterLevel = calculateWaterLevel(p);

        let color = "water-green";
        if (currentWaterLevel < 70) color = "water-yellow";
        if (currentWaterLevel < 20) color = "water-red";

        // Escape output to prevent HTML injection
        const safeName = escapeHtml(p.name);
        const safeCategory = escapeHtml(p.category || "-");

        return `
            <div class="card">
                <h3>${safeName}</h3>
                <p>Categoria: ${safeCategory}</p>
                <p>Ogni: ${p.frequency} giorni</p>
                <p>Giorni dall'ultima irrigazione: ${days}</p>

                <div class="${color}" style="font-size:60px">
                    🚿
                </div>

                <p>Acqua: <strong>${currentWaterLevel}%</strong></p>

                <button class="primary" onclick="waterPlant(${index})">
                    💧 Ho annaffiato
                </button>
                <button class="secondary" onclick="deletePlant(${index})">
                    Elimina
                </button>
            </div>
        `;
    }).join("");
}

function waterPlant(index) {
    if (!plants[index]) return;

    plants[index].lastWatered = new Date().toISOString();

    savePlants();
    renderPlants();
    updateDashboard();
}

function deletePlant(index) {
    if (!confirm(`Sei sicuro di voler eliminare "${plants[index].name}"?`)) return;

    plants.splice(index, 1);

    savePlants();
    renderPlants();
    updateDashboard();
}

function updateDashboard() {
    const totalEl = document.getElementById("totalPlants");
    const needWaterEl = document.getElementById("plantsToWater");
    const lastWateredEl = document.getElementById("lastWatered");

    if (totalEl) totalEl.innerText = plants.length;

    // Filter plants needing water (< 30%)
    const needWater = plants.filter(p => calculateWaterLevel(p) < 30);
    if (needWaterEl) needWaterEl.innerText = needWater.length;

    // Find the latest watered plant across the entire array
    if (lastWateredEl) {
        if (plants.length > 0) {
            const mostRecentDate = plants.reduce((latest, p) => {
                const date = new Date(p.lastWatered);
                return date > latest ? date : latest;
            }, new Date(0));

            lastWateredEl.innerText = mostRecentDate.toLocaleDateString();
        } else {
            lastWateredEl.innerText = "-";
        }
    }
}

// Simple HTML escaping helper
function escapeHtml(str) {
    const div = document.createElement("div");
    div.innerText = str;
    return div.innerHTML;
}

window.onload = function () {
    renderPlants();
    updateDashboard();
};

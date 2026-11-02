// Stato dell'applicazione
let plants = JSON.parse(localStorage.getItem('plants')) || [];
plants.forEach((plant, index) => {
    if (!plant.id) {
        plant.id = "old_" + index + "_" + Date.now();
    }
});

localStorage.setItem('plants', JSON.stringify(plants));
let activeCategoryFilter = null;

// Elementi DOM
const totalPlantsEl = document.getElementById('totalPlants');
const plantsToWaterEl = document.getElementById('plantsToWater');
const lastWateredEl = document.getElementById('lastWatered');
const plantListEl = document.getElementById('plantList');

const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const purchaseInput = document.getElementById('purchase');
const frequencyInput = document.getElementById('frequency');
const descriptionInput = document.getElementById('description');

// Inizializza data acquisto di default a oggi
if (purchaseInput) {
    purchaseInput.value = new Date().toISOString().split('T')[0];
}

// Inizializza filtri categorie cliccabili
document.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('click', () => {
        const text = card.querySelector('h3').textContent.toLowerCase();
        const selected = text.includes('vaso') ? 'Vaso' : 'Terreno';

        if (activeCategoryFilter === selected) {
            activeCategoryFilter = null;
            card.classList.remove('active');
        } else {
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            activeCategoryFilter = selected;
            card.classList.add('active');
        }
        renderPlants();
    });
});

// Aggiungi nuova pianta
function addPlant() {
    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const purchase = purchaseInput.value;
    const frequency = parseInt(frequencyInput.value, 10);
    const description = descriptionInput.value.trim();

    if (!name) {
        alert('Inserisci un nome per la pianta!');
        nameInput.focus();
        return;
    }

    if (isNaN(frequency) || frequency <= 0) {
        alert("Inserisci una frequenza d'irrigazione valida in giorni (es. 3)!");
        frequencyInput.focus();
        return;
    }

    const newPlant = {
        id: Date.now().toString(),
        name,
        category,
        purchaseDate: purchase || new Date().toISOString().split('T')[0],
        frequency,
        description,
        lastWateredDate: new Date().toISOString().split('T')[0] // Registrata come innaffiata oggi di base
    };

    plants.unshift(newPlant);
    saveAndRender();

    // Reset modulo
    nameInput.value = '';
    frequencyInput.value = '';
    descriptionInput.value = '';
}

// Annaffia una pianta
function waterPlant(id) {
    const plant = plants.find(p => p.id === id);
    if (!plant) return;

    plant.lastWateredDate = new Date().toISOString().split('T')[0];
    saveAndRender();
}

// Elimina una pianta
function deletePlant(id) {
    const plant = plants.find(p => p.id === id);
    if (!plant) return;

    if (confirm(`Sei sicuro di voler eliminare "${plant.name}"?`)) {
        plants = plants.filter(p => p.id !== id);
        saveAndRender();
    }
}

// Calcola se necessita acqua
function getWateringStatus(plant) {
    const lastDate = new Date(plant.lastWateredDate || plant.purchaseDate);
    const today = new Date();

    // Differenza in giorni pieni
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = plant.frequency - diffDays;

    return {
        needsWater: daysLeft <= 0,
        daysLeft: daysLeft
    };
}

// Salva e aggiorna interfaccia
function saveAndRender() {
    localStorage.setItem('plants', JSON.stringify(plants));
    renderDashboard();
    renderPlants();
}

// Render Dashboard
function renderDashboard() {
    totalPlantsEl.textContent = plants.length;

    let toWaterCount = 0;
    let latestWateredTimestamp = 0;

    plants.forEach(plant => {
        const status = getWateringStatus(plant);
        if (status.needsWater) toWaterCount++;

        if (plant.lastWateredDate) {
            const time = new Date(plant.lastWateredDate).getTime();
            if (time > latestWateredTimestamp) {
                latestWateredTimestamp = time;
            }
        }
    });

    plantsToWaterEl.textContent = toWaterCount;

    if (latestWateredTimestamp > 0) {
        const date = new Date(latestWateredTimestamp);
        lastWateredEl.textContent = date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
    } else {
        lastWateredEl.textContent = '-';
    }
}

// Render Elenco Piante
function renderPlants() {
    plantListEl.innerHTML = '';

    const filtered = activeCategoryFilter
        ? plants.filter(p => p.category === activeCategoryFilter)
        : plants;

    if (filtered.length === 0) {
        plantListEl.innerHTML = `
            <div class="empty-state">
                <p>Nessuna pianta trovata ${activeCategoryFilter ? `nella categoria "${activeCategoryFilter}"` : 'nel tuo giardino'}.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(plant => {
        const status = getWateringStatus(plant);
        const icon = plant.category === 'Vaso' ? '🪴' : '🌳';
const lastDate = new Date(
    plant.lastWateredDate || plant.purchaseDate
);

const today = new Date();

const diffDays = Math.floor(
    (today - lastDate) / (1000 * 60 * 60 * 24)
);

let progressPercent =
    100 - ((diffDays / plant.frequency) * 100);

progressPercent = Math.max(0, progressPercent);
        let progressColor = '#2e7d32';

if (progressPercent <= 20) {
    progressColor = '#d32f2f';
}
else if (progressPercent <= 30) {
    progressColor = '#ed6c02';
}
        const daysRemaining =
    Math.max(0, plant.frequency - diffDays);

const wateringMessage =
    progressPercent <= 0
        ? '⚠️ Da annaffiare'
        : `💧 ${daysRemaining} giorni rimanenti`;
        const statusBadge = status.needsWater
            ? `<span class="badge badge-alert">⚠️ Annaffiare oggi!</span>`
            : `<span class="badge badge-ok">💧 Tra ${status.daysLeft} ${status.daysLeft === 1 ? 'giorno' : 'giorni'}</span>`;

        const item = document.createElement('div');
        item.className = 'plant-item';

        item.innerHTML = `
            <div class="plant-info">
                <div class="plant-header">
                    <span style="font-size: 1.3rem;">${icon}</span>
                    <span class="plant-title">${escapeHtml(plant.name)}</span>
                    <span class="badge badge-category">${plant.category}</span>
                    ${statusBadge}
                </div>
                <div class="plant-meta">
                    <span>🗓️ Frequenza: ogni ${plant.frequency} giorni | Ultima irrigazione: ${plant.lastWateredDate || 'Mai'}</span>
                    ${plant.description ? `<p class="plant-desc">${escapeHtml(plant.description)}</p>` : ''}
                </div>
            </div>
            <div class="plant-actions">
    <button class="btn-action btn-water" onclick="waterPlant('${plant.id}')">💧 Annaffia</button>
    <button class="btn-action btn-edit" onclick="editPlant('${plant.id}')">✏️ Modifica</button>
    <button class="btn-action btn-delete" onclick="deletePlant('${plant.id}')">🗑️ Elimina</button>
</div>
        `;

        plantListEl.appendChild(item);
    });
}

// Utility anti XSS
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Avvio iniziale
function editPlant(id) {
    const plant = plants.find(p => p.id === id);

    if (!plant) return;

    const newName = prompt("Nome pianta:", plant.name);
    if (newName === null) return;

    const newFrequency = prompt(
        "Frequenza irrigazione (giorni):",
        plant.frequency
    );

    if (newFrequency === null) return;

    const newDescription = prompt(
        "Descrizione:",
        plant.description || ""
    );

    plant.name = newName.trim();

    plant.frequency = parseInt(newFrequency, 10) || plant.frequency;

    plant.description = newDescription;

    saveAndRender();
}
saveAndRender();

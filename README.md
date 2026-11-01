<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gestione Piante & Annaffiatura</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #e8f5e9;
      min-height: 100vh;
    }
    .screen {
      display: none;
    }
    .screen.active {
      display: block;
    }
    .card {
      background: white;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
    }
    .water-icon {
      font-size: 110px;
      line-height: 1;
      text-align: center;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s;
    }
    .water-icon:hover {
      transform: scale(1.08) rotate(-6deg);
    }
    .btn {
      padding: 14px 18px;
      border-radius: 16px;
      color: white;
      font-weight: 600;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn:active {
      transform: scale(0.97);
    }
    .badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 9999px;
      font-weight: 600;
    }
  </style>
</head>

<body class="py-6 px-4">
  <div class="max-w-md mx-auto">
    <!-- Header App -->
    <header class="text-center mb-6">
      <h1 class="text-3xl font-extrabold text-emerald-900 tracking-tight flex items-center justify-center gap-2">
        <span>🌱</span> GardenCare
      </h1>
      <p class="text-sm text-emerald-700">Guida alla cura e idratazione delle tue piante</p>
    </header>

    <!-- 1. HOME SCREEN -->
    <div id="home" class="screen active">
      <div class="card mb-4">
        <h2 class="text-xl font-bold text-gray-800 mb-1">Cosa vuoi annaffiare?</h2>
        <p class="text-xs text-gray-500 mb-4">Scegli l'ambiente per controllare il livello d'acqua</p>

        <div class="space-y-3">
          <button onclick="openCategory('vaso')" class="btn bg-emerald-600 hover:bg-emerald-700 w-full shadow-md shadow-emerald-600/20">
            <span class="text-2xl">🪴</span>
            <div class="text-left">
              <div class="font-bold">Piante in vaso</div>
              <div class="text-xs opacity-90 font-normal">Ficus, Monstera, Basilico, Pothos...</div>
            </div>
          </button>

          <button onclick="openCategory('terreno')" class="btn bg-amber-800 hover:bg-amber-900 w-full shadow-md shadow-amber-900/20">
            <span class="text-2xl">🌳</span>
            <div class="text-left">
              <div class="font-bold">Piante nel terreno</div>
              <div class="text-xs opacity-90 font-normal">Olivo, Limone, Rosmarino, Lavanda...</div>
            </div>
          </button>
        </div>
      </div>

      <button onclick="showScreen('descrizioni')" class="btn bg-sky-600 hover:bg-sky-700 w-full shadow-md shadow-sky-600/20">
        <span class="text-xl">📖</span> Schede Botaniche & Consigli
      </button>
    </div>

    <!-- 2. ANNAFFIATURA SCREEN -->
    <div id="annaffiatura" class="screen">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <button onclick="showScreen('home')" class="text-emerald-700 font-semibold hover:underline flex items-center gap-1 text-sm">
            ← Torna alla Home
          </button>
          <span id="categoriaLabel" class="badge bg-emerald-100 text-emerald-800 uppercase tracking-wider text-[10px]">
            In vaso
          </span>
        </div>

        <h2 class="text-xl font-bold text-gray-800 mb-2">Seleziona la pianta</h2>
        <div id="plantList" class="flex flex-wrap gap-2 mb-4"></div>

        <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <h3 id="nomePianta" class="font-bold text-center text-lg text-gray-800 mb-1">
            Seleziona una pianta
          </h3>
          <p id="piantaInfo" class="text-center text-xs text-gray-500 mb-3"></p>

          <div id="wateringCan" class="water-icon my-2 text-emerald-500">
            🚿
          </div>

          <!-- Barra di umidità -->
          <div class="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
            <div id="waterProgressBar" class="bg-emerald-500 h-3 rounded-full transition-all duration-300" style="width: 50%;"></div>
          </div>

          <div class="flex justify-between items-center text-xs text-gray-500 mb-2">
            <span>Secca</span>
            <span id="waterPercentage" class="font-bold text-gray-700">Livello: 50%</span>
            <span>Allagata</span>
          </div>

          <p id="waterMessage" class="text-center font-bold text-sm text-emerald-700 py-1 px-2 rounded-lg bg-emerald-50">
            Acqua ottimale
          </p>

          <!-- Controlli acqua -->
          <div class="grid grid-cols-2 gap-3 mt-4">
            <button onclick="removeWater()" class="btn bg-rose-500 hover:bg-rose-600 shadow-sm">
              <span>💧-</span> Riduci
            </button>
            <button onclick="addWater()" class="btn bg-emerald-600 hover:bg-emerald-700 shadow-sm">
              <span>💧+</span> Irriga
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. DESCRIZIONI SCREEN -->
    <div id="descrizioni" class="screen">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <button onclick="showScreen('home')" class="text-emerald-700 font-semibold hover:underline flex items-center gap-1 text-sm">
            ← Indietro
          </button>
          <span class="badge bg-sky-100 text-sky-800">Prontuario</span>
        </div>

        <h2 class="text-2xl font-bold text-gray-800 mb-1">📚 Schede Botaniche</h2>
        <p class="text-xs text-gray-500 mb-4">Consigli pratici per la cura ideale di ogni pianta</p>

        <!-- Filtri rapide per schede -->
        <div class="flex gap-2 mb-4">
          <button onclick="filterCards('all')" class="card-filter-btn px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold active-tab" data-filter="all">Tutte</button>
          <button onclick="filterCards('vaso')" class="card-filter-btn px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold" data-filter="vaso">🪴 Vaso</button>
          <button onclick="filterCards('terreno')" class="card-filter-btn px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold" data-filter="terreno">🌳 Terreno</button>
        </div>

        <div id="schedeContainer" class="space-y-4"></div>
      </div>
    </div>
  </div>

  <script>
    // Dati delle piante e schede botaniche
    const PLANTS_DATA = {
      vaso: [
        {
          id: 'ficus',
          nome: '🌿 Ficus Benjamina',
          luce: 'Luce indiretta luminosa',
          frequenza: '1-2 volte a settimana',
          substrato: 'Drenante con perlite',
          consiglio: 'Teme i colpi d\'aria fredda e i ristagni nel sottovaso.',
          waterLevel: 60
        },
        {
          id: 'monstera',
          nome: '🌱 Monstera Deliciosa',
          luce: 'Mezz\'ombra o luce filtrata',
          frequenza: 'Ogni 7-10 giorni a terreno asciutto',
          substrato: 'Terriccio ricco e poroso',
          consiglio: 'Pulisci regolarmente le foglie con un panno umido per favorire la fotosintesi.',
          waterLevel: 50
        },
        {
          id: 'basilico',
          nome: '🍃 Basilico',
          luce: 'Molto sole (almeno 5-6 ore/die)',
          frequenza: 'Quotidiana in estate',
          substrato: 'Leggero, fertile, mai fradicio',
          consiglio: 'Cima i fiori non appena spuntano per mantenere il fogliame vigoroso e aromatico.',
          waterLevel: 75
        },
        {
          id: 'pothos',
          nome: '🌿 Pothos (Epipremnum)',
          luce: 'Tollera poca luce, ideale luce diffusa',
          frequenza: 'Ogni 8-12 giorni',
          substrato: 'Universale ben areato',
          consiglio: 'Pianta purificatrice d\'aria, perdona anche brevi periodi di siccità.',
          waterLevel: 40
        }
      ],
      terreno: [
        {
          id: 'olivo',
          nome: '🫒 Olivo (Olea europaea)',
          luce: 'Pieno sole costante',
          frequenza: 'Poco esigente, soccorso nei mesi caldi giovani',
          substrato: 'Calcareo, sabbioso, molto drenante',
          consiglio: 'Sopporta bene la siccità estiva, evita terreni argillosi asfittici.',
          waterLevel: 30
        },
        {
          id: 'limone',
          nome: '🍋 Limone',
          luce: 'Pieno sole e posizione riparata dal vento',
          frequenza: 'Regolare ed abbondante in fioritura/frutto',
          substrato: 'Fresco, ricco di sostanza organica, pH subacido',
          consiglio: 'Concima periodicamente con lupini macinati o concime specifico per agrumi.',
          waterLevel: 65
        },
        {
          id: 'rosmarino',
          nome: '🌾 Rosmarino',
          luce: 'Pieno sole diretto',
          frequenza: 'Rada, solo in prolungata siccità',
          substrato: 'Povero, asciutto, ben esposto',
          consiglio: 'I ristagni d\'acqua sono il peggior nemico delle sue radici.',
          waterLevel: 25
        },
        {
          id: 'lavanda',
          nome: '💜 Lavanda',
          luce: 'Sole diretto per l\'intera giornata',
          frequenza: 'Molto moderata',
          substrato: 'Alcalino/neutro, sassoso',
          consiglio: 'Pota gli steli sfioriti a fine estate per stimolare un cespuglio compatto.',
          waterLevel: 20
        }
      ]
    };

    // Stato applicazione
    let currentCategory = 'vaso';
    let currentPlant = null;
    let plantWaterLevels = {};

    // Inizializza da localStorage se disponibile
    function initStorage() {
      const saved = localStorage.getItem('garden_care_water_levels');
      if (saved) {
        try {
          plantWaterLevels = JSON.parse(saved);
        } catch(e) {
          plantWaterLevels = {};
        }
      }
      
      // Imposta i valori di default se non ancora salvati
      ['vaso', 'terreno'].forEach(cat => {
        PLANTS_DATA[cat].forEach(p => {
          if (plantWaterLevels[p.id] === undefined) {
            plantWaterLevels[p.id] = p.waterLevel;
          }
        });
      });
    }

    function saveStorage() {
      localStorage.setItem('garden_care_water_levels', JSON.stringify(plantWaterLevels));
    }

    // Navigazione schermate
    function showScreen(screenId) {
      document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
      const target = document.getElementById(screenId);
      if (target) target.classList.add('active');

      if (screenId === 'descrizioni') {
        renderSchede('all');
      }
    }

    // Apertura categoria annaffiatura
    function openCategory(cat) {
      currentCategory = cat;
      const catLabel = document.getElementById('categoriaLabel');
      catLabel.textContent = cat === 'vaso' ? '🪴 Piante in vaso' : '🌳 Piante nel terreno';
      catLabel.className = `badge ${cat === 'vaso' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`;

      const listContainer = document.getElementById('plantList');
      listContainer.innerHTML = '';

      const plants = PLANTS_DATA[cat];
      plants.forEach((plant, index) => {
        const btn = document.createElement('button');
        btn.className = `plant-btn px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
          index === 0 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
        }`;
        btn.textContent = plant.nome;
        btn.onclick = () => selectPlant(plant.id);
        btn.dataset.id = plant.id;
        listContainer.appendChild(btn);
      });

      // Seleziona la prima pianta di default
      if (plants.length > 0) {
        selectPlant(plants[0].id);
      }

      showScreen('annaffiatura');
    }

    // Selezione pianta attiva
    function selectPlant(plantId) {
      const allCategoryPlants = PLANTS_DATA[currentCategory];
      currentPlant = allCategoryPlants.find(p => p.id === plantId) || allCategoryPlants[0];

      // Aggiorna stile bottoni elenco
      document.querySelectorAll('.plant-btn').forEach(btn => {
        if (btn.dataset.id === plantId) {
          btn.className = 'plant-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white border border-emerald-600 shadow-sm';
        } else {
          btn.className = 'plant-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50';
        }
      });

      document.getElementById('nomePianta').textContent = currentPlant.nome;
      document.getElementById('piantaInfo').textContent = `Consiglio: ${currentPlant.consiglio}`;

      updateWaterUI();
    }

    // Aggiungi acqua (+15%)
    function addWater() {
      if (!currentPlant) return;
      let level = plantWaterLevels[currentPlant.id] || 0;
      level = Math.min(100, level + 15);
      plantWaterLevels[currentPlant.id] = level;
      saveStorage();
      updateWaterUI();
    }

    // Riduci acqua (-15%)
    function removeWater() {
      if (!currentPlant) return;
      let level = plantWaterLevels[currentPlant.id] || 0;
      level = Math.max(0, level - 15);
      plantWaterLevels[currentPlant.id] = level;
      saveStorage();
      updateWaterUI();
    }

    // Aggiornamento grafico del livello acqua
    function updateWaterUI() {
      if (!currentPlant) return;
      const level = plantWaterLevels[currentPlant.id] ?? 50;

      const bar = document.getElementById('waterProgressBar');
      const percentageText = document.getElementById('waterPercentage');
      const msg = document.getElementById('waterMessage');
      const icon = document.getElementById('wateringCan');

      bar.style.width = `${level}%`;
      percentageText.textContent = `Umidità: ${level}%`;

      if (level < 30) {
        // Terreno secco
        icon.className = 'water-icon my-2 text-rose-500';
        bar.className = 'bg-rose-500 h-3 rounded-full transition-all duration-300';
        msg.className = 'text-center font-bold text-sm text-rose-700 py-1 px-2 rounded-lg bg-rose-50';
        msg.textContent = '⚠️ Terreno troppo secco! Annaffia subito.';
      } else if (level <= 75) {
        // Condizione ideale
        icon.className = 'water-icon my-2 text-emerald-500';
        bar.className = 'bg-emerald-500 h-3 rounded-full transition-all duration-300';
        msg.className = 'text-center font-bold text-sm text-emerald-700 py-1 px-2 rounded-lg bg-emerald-50';
        msg.textContent = '✨ Livello d\'idratazione ottimale';
      } else {
        // Eccesso d'acqua
        icon.className = 'water-icon my-2 text-amber-500';
        bar.className = 'bg-amber-500 h-3 rounded-full transition-all duration-300';
        msg.className = 'text-center font-bold text-sm text-amber-700 py-1 px-2 rounded-lg bg-amber-50';
        msg.textContent = '💧 Attenzione: Troppa acqua! Rischio ristagno.';
      }
    }

    // Rendering schede botaniche con filtri
    function renderSchede(filter = 'all') {
      const container = document.getElementById('schedeContainer');
      container.innerHTML = '';

      let list = [];
      if (filter === 'all' || filter === 'vaso') {
        list = list.concat(PLANTS_DATA.vaso.map(p => ({ ...p, categoriaNome: 'Vaso' })));
      }
      if (filter === 'all' || filter === 'terreno') {
        list = list.concat(PLANTS_DATA.terreno.map(p => ({ ...p, categoriaNome: 'Piena terra' })));
      }

      list.forEach(p => {
        const div = document.createElement('div');
        div.className = 'p-4 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:shadow-md transition';
        div.innerHTML = `
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-bold text-base text-gray-900">${p.nome}</h3>
            <span class="badge ${p.categoriaNome === 'Vaso' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${p.categoriaNome}
            </span>
          </div>
          <div class="grid grid-cols-1 gap-1.5 text-xs text-gray-600 mb-2">
            <div><strong class="text-gray-800">☀️ Esposizione:</strong> ${p.luce}</div>
            <div><strong class="text-gray-800">💧 Frequenza:</strong> ${p.frequenza}</div>
            <div><strong class="text-gray-800">🌱 Terriccio:</strong> ${p.substrato}</div>
          </div>
          <p class="text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-100">
            💡 <em>${p.consiglio}</em>
          </p>
        `;
        container.appendChild(div);
      });
    }

    function filterCards(filter) {
      document.querySelectorAll('.card-filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
          btn.className = 'card-filter-btn px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold';
        } else {
          btn.className = 'card-filter-btn px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold hover:bg-gray-200';
        }
      });
      renderSchede(filter);
    }

    // Inizializzazione al caricamento
    initStorage();
  </script>
</body>
</html>
Novità e miglioramenti implementati:
1. 
Logica di navigazione completa ( showScreen ): Passaggio fluido tra Schermata Iniziale, Monitoraggio Annaffiatura e Schede Botaniche con tasti "Indietro" funzionanti.
2. 
Sistema di Annaffiatura interattivo ( + Acqua  /  - Acqua ):
• 
Barra di progressione con feedback cromatico (rosso per terreno secco  < 30% , verde per idratazione ottimale  30-75% , ambra/giallo per allagamento  > 75% ).
• 
Salva automaticamente lo stato d'irrigazione nel browser ( localStorage ).
3. 
Schede Botaniche arricchite:
• 
Dettagli su luce, frequenza di bagnatura, tipologia di terriccio e consigli pratici.
• 
Filtro rapido (Tutte, Vaso, Terreno).
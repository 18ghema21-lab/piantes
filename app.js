let plants =
JSON.parse(localStorage.getItem("plants")) || [];

function savePlants(){
  localStorage.setItem(
    "plants",
    JSON.stringify(plants)
  );
}

function addPlant(){

  const plant={
    name:document.getElementById("name").value,
    category:document.getElementById("category").value,
    purchase:document.getElementById("purchase").value,
    frequency:Number(
      document.getElementById("frequency").value
    ),
    description:
      document.getElementById("description").value,
    lastWatered:new Date().toISOString(),
    waterLevel:100
  };

  plants.push(plant);

  savePlants();

  renderPlants();
}

function renderPlants(){

}

  const list =
    document.getElementById("plantList");

  list.innerHTML="";

  plants.forEach((p,index)=>{

    const days =
      Math.floor(
      (Date.now() -
      new Date(p.lastWatered))
      /(1000*60*60*24));

    let color="water-green";

    if(p.waterLevel<70)
      color="water-yellow";

    if(p.waterLevel<20)
      color="water-red";

    list.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>

        <p>
        Categoria:
        ${p.category}
        </p>

        <p>
        Giorni ultima irrigazione:
        ${days}
        </p>

        <div
        class="${color}"
        style="font-size:60px">
        🚿
        </div>

        <p>
        Acqua:
        ${p.waterLevel}%
        </p>

        <button
        class="primary"
        onclick="waterPlant(${index})">
        💧 Ho annaffiato
        </button>

        <button
        class="secondary"
        onclick="deletePlant(${index})">
        Elimina
        </button>
      </div>
    `;
  });

}

function waterPlant(index){

  plants[index].waterLevel=100;

  plants[index].lastWatered=
    new Date().toISOString();

  savePlants();

  renderPlants();
}

function deletePlant(index){

  plants.splice(index,1);

  savePlants();

  renderPlants();
}

window.onload=renderPlants;
function updateDashboard(){

document.getElementById(
"totalPlants"
).innerText=
plants.length;

const needWater=
plants.filter(
p => p.waterLevel < 30
);

document.getElementById(
"plantsToWater"
).innerText=
needWater.length;

if(plants.length){

document.getElementById(
"lastWatered"
).innerText=
new Date(
plants[0].lastWatered
).toLocaleDateString();

}

}

const oldRender =
renderPlants;

renderPlants = function(){

oldRender();

updateDashboard();

};
function showCategory(category){

    document.getElementById(
        "categoryView"
    ).style.display = "block";

    document.getElementById(
        "categoryTitle"
    ).innerHTML =
        category === "Vaso"
        ? "🪴 Piante in Vaso"
        : "🌳 Piante nel Terreno";

    const container =
        document.getElementById(
            "categoryPlants"
        );

    container.innerHTML = "";

    const filtered =
        plants.filter(
            p => p.category === category
        );

    filtered.forEach(p => {

        container.innerHTML += `

        <div class="card">

            <h3>${p.name}</h3>

            <p>
            Categoria:
            ${p.category}
            </p>

            <p>
            Frequenza:
            ${p.frequency} giorni
            </p>

            <p>
            ${p.description}
            </p>

        </div>

        `;

    });

    window.scrollTo({
        top:
        document.getElementById(
            "categoryView"
        ).offsetTop,
        behavior:"smooth"
    });

}

function closeCategory(){

    document.getElementById(
        "categoryView"
    ).style.display = "none";

}

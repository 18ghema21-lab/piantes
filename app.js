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

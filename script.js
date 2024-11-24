
let input,input1,input2;
let latitude, altitude, altura;

function abrirModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block"; 
}

// Adicione essa função para fechar o modal
function fecharModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function setup() { 
    canvas = createCanvas(windowWidth, windowHeight );
    abrirModal();
    table = createElement("table");
   let play = createImg("./img/play.png");
    play.addClass("button"); // Aplicando a classe "button" ao botão
    play.position(windowWidth - 620, windowHeight - 230);
    play.mouseClicked(chamarFuncoes);

    entrada = createElement();
    entrada.position(windowWidth - 665, windowHeight - 290); 

    input = createInput();
    input.position(windowWidth-665, windowHeight- 265);
    input.attribute('placeholder', 'Digite a latitude em graus');

    input1 = createInput();
    input1.position(windowWidth-489, windowHeight- 265);
    input1.attribute('placeholder', 'Digite a altitude em metros');

    let limpa = createImg("./img/limpa.png");
    limpa.addClass("button")
    limpa.position(windowWidth - 570, windowHeight - 230);
    limpa.mouseClicked(limpar);

    let exporta = createImg("./img/expotar.png");
    exporta.addClass("button")
    exporta.position(windowWidth - 520, windowHeight - 230);
    exporta.mouseClicked(DownloadExcel);
     
    slider = createSlider(0, height, 0);
    slider.position(windowWidth - 475, windowHeight - 220);

 // valores mínimos, máximos e iniciais
} 

var entrada;
function validar() {
    hmax = random(15,35);
    console.log("valor altura "+ hmax);

    latitude = input.value();
    altitude = input1.value();
   
    if (latitude === null && latitude === " ") {
        entrada.html("Digite um valor válido para a latitude.");
        return;
    } 
    else if (isNaN(latitude)) { //Validar a entrada 
        entrada.html("Digite um valor válido para a latitude.");
        return;
    }
    
    if (altitude === null && altitude === " ") {
        entrada.html("Digite um valor válido para a altitude."); 
        return;
    } 
    else if (isNaN(altitude)) { //Validar a entrada 
        entrada.html("Digite um valor válido para a altitude.");
        return;
    }
    
    constanteG =  calculateGravity(latitude,altitude);
    
    entrada.html('Aceleração da gravidade (g):' + constanteG.toFixed(4)+ " m/s²");
   
}

function calculateGravity(latitude, altitude) {
   
    const g0 =  9.7803;
    const radius = 6371000;
    const latitudeInRadians = latitude * Math.PI / 180;
    
    const gLatitude = g0 * (1 + 0.0053024 * Math.pow(Math.sin(latitudeInRadians), 2));
    const gAltitude = gLatitude * (1 - 2 * altitude / radius);
    if(latitude > -90 &&  latitude < 90 && altitude != 0){
       return gAltitude;
    }else{
     entrada.html("Preencha os campos corretamente da latitude entre -90 a 90 e altitude é entre 1 a 8.848 metros.");
    }
    

}

      //função d botão de navegação 
      function toggleDropdown() {
        const dropdown = document.getElementById('dropdown-menu');
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
        }
    }

    // Fecha o dropdown ao clicar fora dele
    window.onclick = function(event) {
        const dropdown = document.getElementById('dropdown-menu');
        const button = document.querySelector('.menu-button');
        if (event.target !== button && !button.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    };
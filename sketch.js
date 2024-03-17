
let start = 0;
let objeto = false;
let pausado = false;
let velocidade_final, velocidade_inicial = 0;//velocidade
let distancia = 0;//distância
let tempo = 0; //tempo
let tabela = [];
let aux = 0;
let constanteG;

let hmax; // altura do canvas
let alturamin, tmax; // altura mínima do canvas, 
let alturamax;
let y, yc, yo;
let vo = 0; // velocidade inicial
let y0 = 0;

function preload() {
  imag1 = loadImage("./img/fundo23.png");
  imag = loadImage("./img/predio1.png");
  base = loadImage("./img/base.png");
  pause = loadImage("./img/pausa.png");
  play = loadImage("./img/play.png");
  limpa = loadImage("./img/limpa.png");
  exporta = loadImage("./img/expotar.png");
}

let globalTableData = [];
function preenncher_tabela() {
  let rowData = [tempo.toFixed(3), y.toFixed(3), velocidade_final.toFixed(3)];
  globalTableData.push(rowData); //Update do array
}


function draw() {
  background(imag1);

  let imgaltura = slider.value();

  if (imgaltura >= 550) {
    imgaltura = slider.value(480);
  }
   image(imag, 20, imgaltura - 1, 254, windowHeight - 0.9);
   image(base, 102, windowHeight - 185, 91);

  if (objeto) {

    if (!pausado)
      // tmax = millis();
      end = millis();
    tempo = (end - start) / 1000;

    tmax = Math.sqrt(2 * hmax) / constanteG; // Mesma fórmula que tempomax
    tempo = tempo + tmax / 10;

    frameRate(15);

    alturamin = 0;//valores da tela em pixel
    alturamax = height;//valores da tela em pixel

    y = y0 + velocidade_inicial + 0.5 * constanteG * tempo ** 2;
    yc = alturamin + y * (alturamax - alturamin) / hmax;

    velocidade_final = constanteG * tempo; // velocidade 

    let posicao_Desejada = 707;

    if (yc + slider.value() + 25 >= posicao_Desejada) {
      objeto = false; // Para parar a simulação do objeto

    } else {
      ellipse(202, yc + slider.value() + 25, 12, 12);
    }

    if (yc > height) {
      objeto = false;
    }

    // adiciona os dados da simulação ao array da tabela
    if (frameCount % 2 == 0 && !pausado) {
      tabela.push([tempo.toFixed(3), y.toFixed(3), velocidade_final.toFixed(3)]);
      preenncher_tabela();
    }
  }

  // desenha a tabela
  textSize(16);
  // Definindo posições x para cada coluna
  let xTempo = 280;
  let xDistancia = 420;
  let xVelocidade = 575;

  // Desenhando os títulos
  text("Tempo (m/s)", xTempo, 40);
  text("Distância (m)", xDistancia, 40);
  text("Velocidade (m/s)", xVelocidade, 40);

  let espacamento = 30;

  for (let i = 0; i < tabela.length; i++) {
    let linha = tabela[i];
    let posY = 60 + i * espacamento; // começando de 60 para deixar um espaço após o título
    // Desenhando os elementos da tabela nas respectivas colunas
    text(linha[0], xTempo, posY);
    text(linha[1], xDistancia, posY);
    text(linha[2], xVelocidade, posY);
  }
  // desenharLinhaVerticalComAltura();
}


function DownloadExcel() {
  function exportToCSV(tableData, filename) {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Cria as linhas do arquivo CSVbh
    tableData.forEach(row => {
      let csvRow = row.join(" , ");
      csvContent += csvRow + "\r\n";
    });

    // Cria o link de download e o adiciona à página
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);

    // Aciona o clique do link para iniciar o download
    link.click();

    // Remove o link da página
    document.body.removeChild(link);
  }
  const filename = "dados.csv"; // Nome do arquivo CSV a ser gerado

  exportToCSV(globalTableData, filename);
}

function limpar() {
  let rows = table.elt.getElementsByTagName("tr"); // Seleciona todas as linhas da tabela
  for (let i = rows.length - 1; i > 0; i--) { // Percorre as linhas, exceto a primeira, e as remove
    table.elt.removeChild(rows[i]);
  }

  // Remove todos os dados do array da tabela
  tabela = [];
  globalTableData = [];
  objeto = false;
  pausado = false

}

function alternarQueda() {
  if (!objeto) {
    objeto = true;
    start = millis();
  }
}

function chamarFuncoes() {
  validar();

  if ((latitude >= -90 && latitude <= 90) || (altitude >= 0 && altitude <= 8.800)) {

    if (objeto == false || pausado != pausado) {
      limpar();

    }
    if (Stop() == pausado) {
      Stop();
    }
    alternarQueda();
  }
}

function Stop() {
  if (!objeto) {

  } else {
    pausado = !pausado;
    if (!pausado) {
      start = millis() - 1000 * tempo;
    } else {
      tabela.push([tempo.toFixed(3), y.toFixed(3), velocidade_final.toFixed(3)]);
      preenncher_tabela();
    }
  }
}

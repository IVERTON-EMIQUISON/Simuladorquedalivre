var myQuestions = [
    {
        question: "1) Qual a função que representa o movimento de queda livre ?",
        pergunta: "ss",
        answers: {
            a: ' h = g . t<br>',
            b: ' h = t/g<br>',
            c: ' h = ½ t . g<sup>2</sup> <br>',
            d: 'h = ½ g . t<sup>2</sup> <br>',
            e: 'h = g</sub> t + ½ g t<sup>2</sup><br>',
        },
        correctAnswer: 'd'
    },

    {
        question: "2)Qual expressão representa um linearização da função horária da altitude ",
        answers: {
            a: ' &radic;<span style="text-decoration:overline">h</span> = &radic;<span style="text-decoration:overline">½ . g</span> . t <br> ',

            b: ' &radic;<span style="text-decoration:overline">h</span> =  &radic;<span style="text-decoration:overline">½ . g </span><br>',

            c: ' &radic;<span style="text-decoration:overline">h</span> = &radic;<span style="text-decoration:overline"> g </span> . t<br>',

            d: ' &radic;<span style="text-decoration:overline">h</span> = g . &radic;<span style="text-decoration:overline"> t </span><br>',

            e: ' &radic;<span style="text-decoration:overline">h</span> = &radic;<span style="text-decoration:overline">g . t</span><br>',
        },
        correctAnswer: 'a'
    },

    {
        question: "3) Encontre o coeficiente de correlação linear (r) e estabeleça se há fraca ou forte correlação entre h e t?",
        input: true, // Adiciona um campo de entrada de texto
        correctAnswer: "533"
    },

    {
        question: "4) Estime a aceleração da gravidade.",
        input: true, // Adiciona um campo de entrada de texto
        correctAnswer: "5"
    },

    {
        question: "5) Em condições ideais, sem resistência do ar, dois corpos de massas diferentes, quando soltos da mesma altura, em queda livre, irão:",
        input: true, // Adiciona um campo de entrada de texto
        correctAnswer: "iverton"
    },

    {
        question: "6) Um corpo em queda livre percorre uma certa distância vertical em 2s; logo, a distância percorrida 6 s será",
        answers: {
            a: ' Dupla. <br>',
            b: ' Tripla. <br>',
            c: ' Seis vezes maior. <br>',
            d: ' Nove vezes maior. <br>',
            e: ' Dez vezes maior. <br>'
        },
        correctAnswer: 'd'
    },
];

var quizContainer = document.getElementById('quiz');
var resultado = document.getElementById('results');
var submitButton = document.getElementById('submit');

// Variável de estado para controlar se o questionário já foi enviado
var questionarioEnviado = false;

// Função modal
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

// Function  modal
function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Função para validar respostas
function validarRespostas(questions) {
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];

        // Valida respostas de entrada de texto
        if (question.input) {
            var inputField = document.getElementById('question-' + i + '-input');
            if (!inputField.value.trim()) {
                alert('Por favor, forneça uma resposta para a pergunta ' + (i + 1));
                return false;
            }
        } else { // Valida respostas de múltipla escolha
            var selectedOption = quizContainer.querySelector('input[name="question' + i + '"]:checked');
            if (!selectedOption) {
                alert('Por favor, selecione uma opção para a pergunta ' + (i + 1));
                return false;
            }
        }
    }
    return true;
}

// Função para mostrar resultados e enviar para o Django
function mostrarResultadosEEnviar(questions, quizContainer, resultado,userId) {
    if (questionarioEnviado) {
        alert('O questionário já foi enviado.');
        return; // Retorna sem fazer mais nada se o questionário já foi enviado
    }

    var numCorrect = 0; // Inicializa o contador de respostas corretas
    var correctAnswers = [];
    var wrongAnswers = [];

    for (var i = 0; i < questions.length; i++) {
        var userAnswer = '';

        // Captura as respostas do usuário
        if (questions[i].input) {
            userAnswer = document.getElementById('question-' + i + '-input').value.trim();
        } else {
            userAnswer = quizContainer.querySelector('input[name="question' + i + '"]:checked').value;
        }

        // Verifica se a resposta está correta
        if (userAnswer.toLowerCase() === questions[i].correctAnswer.toLowerCase()) {
            correctAnswers.push(i); // Armazena o índice da pergunta correta
            var answerContainer = quizContainer.querySelectorAll('.question')[i];
            answerContainer.style.color = 'limegreen';
            answerContainer.setAttribute('id', 'correct-answer-' + i); // Adiciona um id para a resposta correta
            numCorrect++; // Incrementa o contador de respostas corretas
            console.log('Resposta correta:', answerContainer.id);
        } else {
            wrongAnswers.push(i); // Armazena o índice da pergunta incorreta
            var answerContainer = quizContainer.querySelectorAll('.question')[i];
            answerContainer.style.color = 'red';
            answerContainer.setAttribute('id', 'wrong-answer-' + i); // Adiciona um id para a resposta incorreta
            console.log('Resposta incorreta:', answerContainer.id);
        }
    }
    var porcentagem = (numCorrect / questions.length) * 100;
    // Exibe os resultados atualizados
    resultado.innerHTML = 'Você acertou: ' + porcentagem.toFixed(2) + '%' + '<br> Total de questão: ' + questions.length;

    // Desabilita inputs e botões de opção após o envio do questionário
    var inputs = quizContainer.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }

    var radios = quizContainer.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].disabled = true;
    }

    // Atualiza a variável de controle para indicar que o questionário foi enviado
    questionarioEnviado = true;

    // Dados das respostas
    var data = {
      //  userId: userId, // id usúario 
      //  pergunta: questions[i].text, // Texto da pergunta
        correctAnswers: correctAnswers, // Índices das perguntas corretas
        wrongAnswers: wrongAnswers // Índices das perguntas incorretas
    };

    // Configuração da requisição AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/api/enviar_respostas/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Função a ser chamada quando a requisição for concluída
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Respostas enviadas com sucesso!');
        } else {
            console.error('Erro ao enviar as respostas:', xhr.statusText);
        }
    };

    // Envia a solicitação com os dados das respostas em formato JSON
    xhr.send(JSON.stringify(data));

}

// Função principal para gerar o questionário
function gerarQuestionario(questions, quizContainer, resultado, submitButton) {
    function exibirPerguntas(questions, quizContainer) {
        var output = [];

        for (var i = 0; i < questions.length; i++) {
            var question = questions[i];

            output.push('<div class="question">' + question.question + '</div>');

            // Se a pergunta requer uma entrada de texto, adiciona um campo de entrada
            if (question.input) {
                output.push('<input type="text" id="question-' + i + '-input">');
            } else { // Caso contrário, exibe as opções de resposta
                var answers = Object.keys(question.answers);
                for (var j = 0; j < answers.length; j++) {
                    output.push(
                        '<label>'
                        + '<input type="radio" name="question' + i + '" value="' + answers[j] + '">'
                        + question.answers[answers[j]]
                        + '</label>'
                    );
                }
            }

            output.push('<button class="button_modal" onclick="openModal(\'modal' + (i + 1) + '\')">Ver Resposta</button>');
        }

        quizContainer.innerHTML = output.join('');
    }

    exibirPerguntas(questions, quizContainer);

    // Adiciona evento de clique ao botão de submissão
    submitButton.onclick = function () {
        // Valida as respostas antes de mostrar os resultados
        if (validarRespostas(questions)) {
            mostrarResultadosEEnviar(questions, quizContainer, resultado);
        }
    };

    // Adiciona evento ao formulário para tratar a submissão usando a tecla "Enter"
    document.getElementById('quiz-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Previne o comportamento padrão de submissão do formulário
        // Valida as respostas antes de mostrar os resultados
        if (validarRespostas(questions)) {
            mostrarResultadosEEnviar(questions, quizContainer, resultado); // Mostra os resultados
        }
    });
}
// Chama a função principal para gerar o questionário
gerarQuestionario(myQuestions, quizContainer, resultado, submitButton);

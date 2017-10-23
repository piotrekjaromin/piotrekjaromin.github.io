var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
var questions = [];
var questionNumber=0;
var timerInterval;
var idTimeBar;
var numberOfCorrect = 0;
var numberOfIncorrect = 0;
var numberOfNotAnswer = 0;
var choosenCategory;

    

function loadFile(category) {
    $('#buttonOnStart').hide();
    choosenCategory = category
    reader.open('get', 'Questions.json', true);
    reader.onreadystatechange = displayContents;
    reader.send(null);
    $("#insertStartButton").html("<input type='button' id='startButton3' class='btn btn-primary' value='start' onclick='start()'/>")

}

function displayContents() {
    if(reader.readyState==4) {
        questions = JSON.parse(reader.responseText);
        questions = questions[choosenCategory];
        changeOrderOfQuestions();
    }
}

function start() {
$('#startButton3').hide();
    $('#buttonOnStart').hide();
    $('#navigationButtons').show();
    nextQuestion();
}

function finish() {
    checkAnswer("no");
    $('#endButton').hide();
    $('#nextButton').hide();
    $('#main').hide();
    $('#timeToEndBar').hide();
    clearInterval(idTimeBar);
    clearInterval(timerInterval);
    printStatistics();
    return;
}

function printStatistics() {
    var result = "";
    var quizcount;
    result += "Correct: " + numberOfCorrect + "<br>";
    result += "Incorrect: " + numberOfIncorrect + "<br>";
    result += "Not answered: " + numberOfNotAnswer+ "<br>";
    $('#statistics').html(result);


    if (typeof(Storage) !== "undefined") {
      if(typeof(localStorage.quizcount) !== "undefined"){
        quizcount = Number(localStorage.quizcount) + 1;
        numberOfCorrect = Number(localStorage.numberOfCorrect) + numberOfCorrect;
        numberOfIncorrect = Number(localStorage.numberOfIncorrect) + numberOfIncorrect;
        numberOfNotAnswer = Number(localStorage.numberOfNotAnswer) + numberOfNotAnswer;
      } else {
        localStorage.quizcount = 1;
      }

      localStorage.quizcount = quizcount;
      localStorage.numberOfCorrect = numberOfCorrect;
      localStorage.numberOfIncorrect = numberOfIncorrect;
      localStorage.numberOfNotAnswer = numberOfNotAnswer;

      result = "<br> History: ";
      result += "Correct: " + numberOfCorrect + "<br>";
      result += "Incorrect: " + numberOfIncorrect + "<br>";
      result += "Not answered: " + numberOfNotAnswer+ "<br>";
      $('#all-statistics').html(result);

    }
}

function nextQuestion() {
    var result = "";
    var answer;

    if(questionNumber >= questions.length) {
        $("#endButton").show();
        finish();
        return;
    } else if(questionNumber >= questions.length -1) {
        $("#nextButton").hide();
        $("#endButton").show();

    }

    result += "<div><form action='' id='radioForm'>"

    result += questions[questionNumber]["question"] + "<br>";

    for(i = 0; i<4; i++) {
        answer = questions[questionNumber]["answers"][i];
        result += "<input type = 'radio' name='answer' value='" + answer + "'>" + answer + "<br>";
    }

    result += "<input type='hidden' id='correct' value='" + questions[questionNumber]["correct"] + "'>";
    result += "</form></div>";
    $('#main').html(result);
    questionNumber ++;
    timeBar();

    clearInterval(timerInterval);
    timerInterval = setInterval(checkAnswer, 20000);
}

function checkAnswer(isNo) {
    var userAnswer = $('input[name=answer]:checked', '#radioForm').val();
    if(typeof userAnswer === 'undefined') {
        console.log("not selected");
        numberOfNotAnswer++;
        addProgressBar("#c2d6d6");
    } else if(userAnswer == $('#correct').val()) {
        console.log("correct");
        numberOfCorrect++;
        addProgressBar("#33cc33")
    } else {
        console.log("not correct");
        numberOfIncorrect++;
        addProgressBar("#ff3300")
    }
    if(isNo!="no") {
        nextQuestion();
    }
}


function changeOrderOfQuestions() {
    var counter = 1;
    var orderOfQuestions = [];
	var answersTmp = [];    
	var generated;
    var questionsTmp = [];
    orderOfQuestions[0] = Math.floor(Math.random() * (questions.length));
    while (counter < questions.length) {
        generated = Math.floor(Math.random() * (questions.length));
        console.log(generated);
        if ($.inArray(generated, orderOfQuestions) == -1) {
            orderOfQuestions[counter] = generated;
            counter = counter + 1;
        }
    }
    for(i = 0; i<questions.length; i++) {
        questionsTmp[i] = questions[orderOfQuestions[i]]
    }
    questions = questionsTmp;

}



function timeBar() {
    clearInterval(idTimeBar);
    var elem = document.getElementById("timeToEndBar");
    var width = 1;
    idTimeBar = setInterval(frame, 200);
    function frame() {
        if (width >= 100) {
            clearInterval(idTimeBar);
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}

function addProgressBar(color) {
    var width = Math.floor(100/questions.length);
    $('#row').append("<td style='width: " + width + "%; background-color: " + color + "'>" + questionNumber +  "</td>");
}

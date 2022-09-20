let values = [];
let points = new Array(15);
let holds = document.getElementsByClassName("hold");
let button = document.getElementById("button");
let turn = 0;
let turnLbl = document.getElementById("turn-lbl");
let pointGifs = document.getElementsByClassName("point-gif");
let inputScoreElement = document.getElementsByClassName("input-score");
let inputBonusElement = document.getElementsByClassName("input-bonus");
let inputTotalElement = document.getElementsByClassName("input-total");
var audioThrowDice = new Audio("Audio/Dice_throw.mp3");
var soundtrackSpooky = new Audio("Audio/SpookySoundtrack.mp3");
let audioSlider = document.getElementById("audioSlider")

/*
audioSlider.addEventListener("change", function(e){
    soundtrackSpooky.volume = e.currentTarget.value / 100;
})
*/

addEventListener('mousemove', (event) => {
    soundtrackSpooky.play();
    soundtrackSpooky.volume = audioSlider.value / 100;
});


for (let pointGif of pointGifs){
    pointGif.style = "visibility: hidden;"
}

disableHolds();

button.disabled = false;
button.addEventListener("click", roll);

async function roll(){
    if(turn < 3){
        let dices = document.getElementsByClassName("dice");
        audioThrowDice.play();
        turn++;
        if(turn == 3){
            button.disabled = true;
        }
        turnLbl.textContent = turn;
        enableHolds();
        for (let i = 0; i < dices.length; i++){
            if (!holds[i].checked){
                let srcName = "Dices/dicesRolling.gif";
                dices[i].src = srcName;
            }
        }
        disableHolds();
        for (let i = 0; i < dices.length; i++){
            if (!holds[i].checked){
                await sleep(500);
                let value = ((Math.floor(Math.random() * 6)) + 1)
                let srcName = "Dices/Dice" + value + ".png";
                dices[i].src=srcName;
                values[i] = value;
            }
        }
        putResults();
    }
}

function putResults(){
    enableHolds();
    let inputs = document.getElementsByClassName("input");
    let results = getResults();
    for (let i = 0; i < inputs.length; i++){
        if (points[i] == undefined)
            inputs[i].value = results[i];
            inputs[i].addEventListener("click", function(){
            if (turn == 3){
            inputs[i].disabled = true;
            pointGifs[i].style = "visible";
            points[i] = inputs[i].value;
            calculateScores();
            turn = 0;
            turnLbl.textContent = turn;
            button.disabled = false;
            for (let i = 0; i < holds.length; i++){
                holds[i].checked = false;
                disableHolds();
            }
        }})
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function disableHolds(){
    for (let i = 0; i < holds.length; i++){
        holds[i].disabled = true;
    }
}

function enableHolds(){
    for (let i = 0; i < holds.length; i++){
        holds[i].disabled = false;
    }
}

function calculateScores(){
    let sum = 0;
    for (let i = 0; i < 6; i++){
        if (points[i] != undefined){
            sum += Number(points[i]);
        }
    }
    inputScoreElement[0].value = Number(sum);
    if (sum >= 63){
        inputBonusElement[0].value = 50;
        sum += 50;
    }

    for (let i = 6; i < 15; i++){
        if (points[i] != undefined){
            sum += Number(points[i]);
        }
    }
    inputTotalElement[0].value = Number(sum);
}




//---------------------------------------------- Point functions ----------------------------------------------//

function getResults(){
    let results = [];
    for (let i = 0; i <= 5; i++){
        results[i] = sameValuePoints(i + 1);
    }
    results[6] = onepairPoints();
    results[7] = twoPairPoints();
    results[8] = threeSamePoints();
    results[9] = fourSamePoints();
    results[10] = fullHousePoints();
    results[11] = smallStraightPoints();
    results[12] = largeStraightPoints();
    results[13] = chancePoints();
    results[14] = yatzyPoints();

    return results;
}

function calcCounts(){
    let counts = [0,0,0,0,0,0,0];
    for (let i = 0; i < values.length; i++){
        let cast = values[i];
        counts[cast]++;
    }
    return counts;
}

function sameValuePoints(value){
    return calcCounts()[value] * value;
}

function onepairPoints(){
    let points = 0;
    let counts = calcCounts();
    for (let i = 1; i < 7; i++){
        if (counts[i] >= 2){
            points = i * 2;
        }
    }
    return points;
}

function twoPairPoints(){
    let points = 0;
    let counts = calcCounts();
    let first = 0;
    let second = 0;
    for (let i = 1; i < counts.length; i++){
        if(counts[i] >=2){
            if (first == 0){
                first = i * 2;
            } else if (first != 0){
                second = i * 2;
                points = first + second;
            }
        }
    }
    return points;
}

function threeSamePoints(){
    let points = 0;
    let counts = calcCounts();
    for (let i = 1; i < counts.length; i++){
        if (counts[i] >= 3){
            points = i * 3;
        }
    }
    return points;
}

function fourSamePoints(){
    let points = 0;
    let counts = calcCounts();
    for (let i = 1; i < counts.length; i++){
        if (counts[i] >= 4){
            points = i * 4;
        }
    }
    return points;
}

function fullHousePoints(){
    let points = 0;
    if (twoPairPoints() != 0 && threeSamePoints() != 0){
        points = twoPairPoints() + threeSamePoints();
    }
    return points;
}

function smallStraightPoints(){
    let points = 0;
    let counter = 0;
    let counts = calcCounts();
    for (let i = 1; i < counts.length-1; i++){
        if (counts[i] == 1){
            counter++;
        }
        if (counter == 5){
            points = 15;
        }
    }
    return points;
}

function largeStraightPoints(){
    let points = 0;
    let counter = 0;
    let counts = calcCounts();
    for (let i = 2; i < counts.length; i++){
        if (counts[i] == 1){
            counter++;
        }
        if (counter == 5){
            points = 20;
        }
    }
    return points;
}

function chancePoints(){
    let points = 0;
    for (let value of values){
        points += value;
    }
    return points;
}

function yatzyPoints(){
    let points = 0;
    let counts = calcCounts();
    for (let i = 0; i < counts.length; i++){
        if (counts[i] == 5){
            points = 50;
        }
    }
    return points;
}


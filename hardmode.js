let rpsPattern = [], rpslsPattern = [];
let rpsGameCount = 0,rpslsGameCount = 0;
let rpsPatternLength= 13, rpslsPatternLength= 13;

function prepareData(g) {
  if(g === 'rps'){
    rpsPattern = window.localStorage.getItem('rps-pattern') ? window.localStorage.getItem('rps-pattern').split(',').map(Number) : [];
    if (rpsPattern.length < 1) {
      for (let index = 1; index <= rpsPatternLength; index++) {
        rpsPattern.push(Math.floor(Math.random() * 3) + 1)
      }
    }
  } else {
    rpslsPattern = window.localStorage.getItem('rpsls-pattern') ? window.localStorage.getItem('rpsls-pattern').split(',').map(Number) : [];
    if (rpslsPattern.length < 1) {
      for (let index = 1; index <= rpslsPatternLength; index++) {
        rpslsPattern.push(Math.floor(Math.random() * 5) + 1)
      }
    }
  }
}

function updatePattern(userChoice, g) {
  if(g === 'rps'){
    if (rpsGameCount !== 0) {
      rpsPattern.shift()
      rpsPattern.push(userChoice)
      window.localStorage.setItem('rps-pattern', rpsPattern)
    }
  } else {
    if (rpslsGameCount !== 0) {
      rpslsPattern.shift()
      rpslsPattern.push(userChoice)
      window.localStorage.setItem('rpsls-pattern', rpslsPattern)
    }
  }
  
}

async function brainAnswer(userChoice, g) {
  g === "rps" ? rpsGameCount++ : rpslsGameCount++;
  prepareData(g)
  const trainresult = await brainTrain(userChoice, g)
  return trainresult;
}

// rpsls rules
// 1 loses to 2 or 4
// 2 loses to 3 or 5
// 3 loses to 4 or 1
// 4 loses to 5 or 2
// 5 loses to 1 or 3
function brainTrain(userChoice, g){
  return new Promise(resolve => {
    const net = new brain.recurrent.LSTMTimeStep()
    let max, min, chosenByAI;
    max = g === "rps" ? 3 : 5, min = 1;

    g === 'rps' ? net.train([rpsPattern], { iterations: 100, log: true }) : net.train([rpslsPattern], { iterations: 100, log: true })
    const prediction = g === 'rps' ? net.run(rpsPattern) : net.run(rpslsPattern);
    const roundedPrediction = Math.round(prediction);
    chosenByAI = min <= roundedPrediction && roundedPrediction <= max ? (roundedPrediction % max) + min : min;
    if (g === 'rpsls'){
      chosenByAI = userChoice == chosenByAI + 1 ? userChoice + 1 : chosenByAI;
    }
    updatePattern(userChoice, g)
    resolve(chosenByAI);
  });
}


export default brainAnswer;
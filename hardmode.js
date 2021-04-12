let rpsPattern = [];
let rpslsPattern = [];
let rpsGameCount = 0;
let rpslsGameCount = 0;
let rpsPatternLength= 20
let rpslsPatternLength= 20;

function prepareData(userChoice, g) {
  if(g === 'rps'){
    if (rpsPattern.length < 1) {
      for (let index = 1; index <= rpsPatternLength; index++) {
        rpsPattern.push(Math.floor(Math.random() * 3) + 1)
      }
    }
  } else {
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
    }
  } else {
    if (rpslsGameCount !== 0) {
      rpslsPattern.shift()
      rpslsPattern.push(userChoice)
    }
  }
  
}

async function whatShouldAIAnswer(userChoice, g) {
  g === "rps" ? rpsGameCount++ : rpslsGameCount++;
  prepareData(userChoice, g)
  const trainresult = await trainAIData(userChoice, g)
  return trainresult;
}


function trainAIData(userChoice, g){
  return new Promise(resolve => {
    const net = new brain.recurrent.LSTMTimeStep()
    if(g === "rps"){
      net.train([rpsPattern], { iterations: 100, log: true })
      const humanWillChose = net.run(rpsPattern)
      updatePattern(userChoice)
      const roundedHumanWillChose = Math.round(humanWillChose)
      // if 3>= roundedHuman >= 1 then roundedHuman % 3 + 1 else 1
        // if (1-3) else (0)
      let chosenByAI = 1 <= roundedHumanWillChose && roundedHumanWillChose <= 3 ? (roundedHumanWillChose % 3) + 1 : 1;
      resolve(chosenByAI);
    } else {
      // 1 loses to 2 or 4
      // 2 loses to 3 or 5
      // 3 loses to 4 or 1
      // 4 loses to 5 or 2
      // 5 loses to 1 or 3
      net.train([rpslsPattern], { iterations: 100, log: true })
      const humanWillChose = net.run(rpslsPattern)
      updatePattern(userChoice)
      const roundedHumanWillChose = Math.round(humanWillChose)
      let chosenByAI = 1 <= roundedHumanWillChose && roundedHumanWillChose <= 5 ? (roundedHumanWillChose % 5) + 1 : 1;
      resolve(chosenByAI);
    }
  });
}


export default whatShouldAIAnswer;
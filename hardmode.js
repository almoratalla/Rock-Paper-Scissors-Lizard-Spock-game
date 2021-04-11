
// async function tryBrain(){
//     let pattern = [3,2,3,2,3,1,3];
//     let gameCount = 0;
//     let chosenByHuman= 0;
//     let chosenByAI= 0;
//     let patternLength= 10
//     function prepareData() {
//         // console.log(pattern.length, pattern)
//       if (pattern.length < 1) {
//           // console.log('weh')
//         for (let index = 1; index <= patternLength; index++) {
//           pattern.push(Math.floor(Math.random() * 3) + 1)
//         }
//       }
//     }
//     function updatePattern() {
//       if (gameCount !== 0) {
//           // console.log('hey')
//         pattern.shift()
//         pattern.push(chosenByHuman)
//       }
//     }
//     async function whatShouldAIAnswer() {
//       prepareData()
//       const net = new brain.recurrent.LSTMTimeStep()
//       net.train([pattern], { iterations: 100, log: true })
//       const humanWillChose = net.run(pattern)
//       // console.log(humanWillChose)
//       updatePattern()
//       const roundedHumanWillChose = Math.round(humanWillChose)
//       // console.log('human will chose: ' + roundedHumanWillChose)
//       let chosenByAI = 1 <= roundedHumanWillChose && roundedHumanWillChose <= 3 ? (roundedHumanWillChose % 3) + 1 : 1;
//       // if 3>= roundedHuman >= 1 then roundedHuman % 3 + 1 else 1
//       // console.log(chosenByAI)
//     }
//     await whatShouldAIAnswer()
// }
    
// tryBrain()

let pattern = [];
let gameCount = 0;
let chosenByHuman= 0;
let chosenByAI= 0;
let patternLength= 10
console.log(pattern)

function prepareData(userChoice) {
  // console.log(pattern.length, pattern)
  if (pattern.length < 1) {
      // console.log('weh')
      for (let index = 1; index <= patternLength; index++) {
      pattern.push(Math.floor(Math.random() * 3) + 1)
      }
  }
}

function updatePattern(userChoice) {
  
  if (gameCount !== 0) {
      pattern.shift()
      pattern.push(userChoice)
  }
}

async function whatShouldAIAnswer(userChoice) {
  gameCount++
  console.log(userChoice)
  prepareData(userChoice)
  console.log(pattern);
  const trainresult = await trainAIData(userChoice)
  return trainresult;
}


function trainAIData(userChoice){
  return new Promise(resolve => {
    const net = new brain.recurrent.LSTMTimeStep()
    net.train([pattern], { iterations: 100, log: true })
    const humanWillChose = net.run(pattern)
    updatePattern(userChoice)
    const roundedHumanWillChose = Math.round(humanWillChose)
    // if 3>= roundedHuman >= 1 then roundedHuman % 3 + 1 else 1
    let chosenByAI = 1 <= roundedHumanWillChose && roundedHumanWillChose <= 3 ? (roundedHumanWillChose % 3) + 1 : 1;
    resolve(chosenByAI);
  });
}


export default whatShouldAIAnswer;
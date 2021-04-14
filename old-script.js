import brAInAnswer from "./hardmode.js";
let MODE = 'normal';
let GAME = "rps";
function init(){
    // console.log('%c [INIT] - to create start event and update score', "color: yellow; background-color: red;")
    createStartEvents(GAME);
    updateScore(null, MODE, GAME)
}


function createStartEvents(g){
    // console.log('%c [CREATE START EVENTS] - select all ctrl buttons and add event listeners w/ Start Game function', "color: blue; background-color: green; padding: 1em;")
    document.querySelectorAll('div.main>.controls button').forEach((controlButton,idx ) => {
        controlButton.addEventListener('click', startGame.bind(this, g))
    }) 
}

let USER_OPTION;

async function startGame(g, e) {
    let m = MODE;
    console.log('triggered')

    document.querySelector('#mode-toggle').disabled = true;
    document.querySelector('#game-toggle').disabled = true;
    

    // Store the user choice in a variable
    const [ userOption ] = e.target.dataset.option.toString().split("-");
    USER_OPTION = userOption;

    // List computer options
    const rpsls = ['rock', 'paper', 'scissors', 'spock', 'lizard'];
    const opts = g === 'rps'? ['paper', 'scissors', 'rock'] : rpsls;
    let u, computerOption, max, min;
    max = g === "rps" ? 2 : 4, min = 0;
    
    // Normalize data to pass to ai hard mode
    // Normalize rps:[1,2,3]
    rpsls.forEach((t, i) => u = userOption == t ? i + 1 : opts[Math.floor(Math.random() * (max - min + 1) + min)])
    
    
    // Computer choose an action
    if(m === 'normal'){
        // If normal mode, just random answer
        computerOption = opts[Math.floor(Math.random() * (max - min + 1) + min)];
        console.log(m)
    } else {
        // hard mode
        const computerAIAnswer = await brAInAnswer(u, g);
        rpsls.forEach((t,i) => computerAIAnswer == i + 1 ?  t : opts[Math.floor(Math.random() * (max - min + 1) + min)])
    }

    /// Proceed to picking and rendering result
    // proceed to picking
    pickingResultsSection(userOption, computerOption, m, g)    
}

function pickingResultsSection(u, c, m, g){

    // Render results section with picking
    document.querySelector('.controls').remove();
    
    let opts = [u, c];
    let picks = ['user', 'computer']
    let ubtn, cbtn, udiv, cdiv;
    let GAME_RESULT;

    const section = document.createElement('section');
    section.classList = 'results-section';
    section.style.display = 'flex';
    document.querySelector('div.main').prepend(section);

    function renderPicking(o, p){
        const optionDiv = document.createElement('div');
        const optionHeadings3 = document.createElement('h3');
        const optionButton = document.createElement('button');
        const optionSpan = document.createElement('span');
        const optionImage = document.createElement('img');

        optionDiv.classList = `${p}-option`;
        optionHeadings3.textContent = p === 'user' ? 'YOU PICKED' : 'THE HOUSE PICKED';
        optionButton.classList = `${o.toString().toLowerCase().trim()}-option picking-option`
        p === 'user' ? optionButton.classList.add('user-picking') : optionButton.classList.add('picking');
        optionImage.src = `./images/icon-${o.toString().toLowerCase().trim()}.svg`;
        optionImage.alt = o.toString().trim();
        optionImage.classList = `${o.toString().trim().toLowerCase()}-image`

        optionSpan.prepend(optionImage)
        optionButton.prepend(optionSpan)
        optionDiv.append(optionHeadings3);
        optionDiv.append(optionButton);
        section.append(optionDiv);

        p === 'user' ? ubtn = optionButton : cbtn = optionButton;
        p === 'user' ? udiv = optionDiv : cdiv = optionDiv;
    }

    function cbtnTogglePicking(){
        cbtn.classList.toggle("picking");
        section.style.padding = "1em 0"
    }

    function evaluateResult(g){
        function winCondition(g){
            return g === "rps"
				? (u === "rock" && c === "scissors") ||
						(u === "paper" && c === "rock") ||
						(u === "scissors" && c === "paper")
				: (u === "rock" && c === "scissors") ||
						(u === "paper" && c === "rock") ||
						(u === "scissors" && c === "paper") ||
						(u === "rock" && c === "lizard") ||
						(u === "lizard" && c === "spock") ||
						(u === "spock" && c === "scissors") ||
						(u === "scissors" && c === "lizard") ||
						(u === "paper" && c === "spock") ||
						(u === "lizard" && c === "paper") ||
						(u === "spock" && c === "rock");
        }
        
        GAME_RESULT = u === c ? "draw" : winCondition(g) ? "win" : "lose";
    }

    function renderResultsPane(result){
        const resultsPaneDiv = document.createElement('div');
        const resultBannerHeadings2 = document.createElement('h2');
        const resetButton = document.createElement('button');
        resultsPaneDiv.classList = "results-pane";
        resultBannerHeadings2.classList = "result-banner";
        resultBannerHeadings2.textContent = result.toString().toLowerCase().trim() !== "draw" ? `YOU ${result.toString().toUpperCase().trim()}`: "IT'S A TIE";
        resetButton.id = "reset";
        resetButton.textContent = "PLAY AGAIN";
        resetButton.addEventListener('click', resetGame.bind(this, g))

        resultsPaneDiv.prepend(resultBannerHeadings2);
        resultsPaneDiv.append(resetButton);
    
        setTimeout(() => {
            udiv.insertAdjacentElement('afterend', resultsPaneDiv)
            result === 'win' ? ubtn.classList.add("win-option") : result ==='lose' ? cbtn.classList.add("win-option") : null;
            updateScore('add', m, g, result)
        }, 3000);
    }

    opts.forEach((o,i) => renderPicking(o, picks[i]))
    // display option picked by the computer after 1s
    setTimeout(cbtnTogglePicking, 2000)

    // evaluate result
    evaluateResult(g)
    
    // render results pane
    renderResultsPane(GAME_RESULT)
}

// function pickingResultsSection(u, c, m, g){

//     // console.log('%c [PICKING RESULTS SECTION] - Render choices, update picking state, show results and update score', "color: blue; background-color: green; padding: 1em;")
//     // Render results section with picking
//     document.querySelector('.controls').remove();

//     // render user choice
//     const section = document.createElement('section');
//     section.classList = 'results-section';
//     section.style.display = 'flex';
//     const userOptionDiv = document.createElement('div');
//     userOptionDiv.classList = 'user-option';
//     const userOptionHeadings3 = document.createElement('h3');
//     userOptionHeadings3.textContent = 'YOU PICKED'
//     const userOptionButton = document.createElement('button');
//     userOptionButton.classList = `${u.toString().toLowerCase().trim()}-option picking-option user-picking`
//     const userOptionSpan = document.createElement('span');
//     const userOptionImage = document.createElement('img');
//     userOptionImage.src = `./images/icon-${u.toString().toLowerCase().trim()}.svg`;
//     userOptionImage.alt = u.toString().trim();
//     userOptionImage.classList = `${u.toString().trim().toLowerCase()}-image`

//     /// render computer picking
//     const computerOptionDiv = document.createElement('div');
//     computerOptionDiv.classList = 'computer-option';
//     const computerOptionHeadings3 = document.createElement('h3');
//     computerOptionHeadings3.textContent = 'THE HOUSE PICKED'
//     const computerOptionButton = document.createElement('button');
//     computerOptionButton.classList = `${c.toString().toLowerCase().trim()}-option picking-option picking`
//     const computerOptionSpan = document.createElement('span');
//     const computerOptionImage = document.createElement('img');
//     computerOptionImage.src = `./images/icon-${c.toString().toLowerCase().trim()}.svg`;
//     computerOptionImage.alt = c.toString().trim();
//     computerOptionImage.classList = `${c.toString().trim().toLowerCase()}-image`


//     document.querySelector('div.main').prepend(section);
//     section.prepend(userOptionDiv);
//     section.append(computerOptionDiv);
//     userOptionDiv.prepend(userOptionHeadings3);
//     userOptionDiv.append(userOptionButton);
//     userOptionButton.prepend(userOptionSpan);
//     userOptionSpan.prepend(userOptionImage);

//     computerOptionDiv.prepend(computerOptionHeadings3);
//     computerOptionDiv.append(computerOptionButton);
//     computerOptionButton.prepend(computerOptionSpan);
//     computerOptionSpan.prepend(computerOptionImage);

    
//     // display option picked by the computer after 1s
//     setTimeout(() => {
//         computerOptionButton.classList.toggle("picking")
//         section.style.padding = "1em 0"
//     }, 2000)

//     // evaluate result
//     let GAME_RESULT;
//     let GAME_ERROR = '';
//     let user = u, computer = c;
//     if(g === 'rps'){
//         if(user === "rock" && computer === "scissors" || user === "paper" && computer === "rock" || user === "scissors" && computer === "paper"){
//             GAME_RESULT = 'win';
//         } else if(user === "rock" && computer === "paper" || user === "paper" && computer === "scissors" || user === "scissors" && computer === "rock"){
//             GAME_RESULT = 'lose';
//         } else if(user === computer){
//             GAME_RESULT = 'draw';
//         } else {
//             GAME_ERROR = new Error('Something went wrong with the game master');
//         }
//     } 

//     if (g === 'rpsls'){
//         if (
// 			(user === "rock" && computer === "scissors") ||
// 			(user === "paper" && computer === "rock") ||
// 			(user === "scissors" && computer === "paper") ||
// 			(user === "rock" && computer === "lizard") ||
// 			(user === "lizard" && computer === "spock") ||
// 			(user === "spock" && computer === "scissors") ||
// 			(user === "scissors" && computer === "lizard") ||
// 			(user === "paper" && computer === "spock") ||
// 			(user === "lizard" && computer === "paper") ||
// 			(user === "spock" && computer === "rock")
// 		) {
// 			GAME_RESULT = "win";
// 		} else if (
// 			(user === "rock" && computer === "paper") ||
// 			(user === "paper" && computer === "scissors") ||
// 			(user === "scissors" && computer === "rock") ||
// 			(user === "lizard" && computer === "rock") ||
// 			(user === "spock" && computer === "lizard") ||
// 			(user === "scissors" && computer === "spock") ||
// 			(user === "lizard" && computer === "scissors") ||
// 			(user === "spock" && computer === "paper") ||
// 			(user === "paper" && computer === "lizard") ||
// 			(user === "rock" && computer === "spock") 

// 		) {
// 			GAME_RESULT = "lose";
// 		} else if (user === computer) {
// 			GAME_RESULT = "draw";
// 		} else {
// 			GAME_ERROR = new Error("Something went wrong with the game master");
// 		}
//     }
    
//     let result = GAME_RESULT;

//     // render 
    
//     const resultsPaneDiv = document.createElement('div');
//     resultsPaneDiv.classList = "results-pane";
//     const resultBannerHeadings2 = document.createElement('h2');
//     resultBannerHeadings2.classList = "result-banner";
//     resultBannerHeadings2.textContent = result.toString().toLowerCase().trim() !== "draw" ? `YOU ${result.toString().toUpperCase().trim()}`: "IT'S A TIE";
//     const resetButton = document.createElement('button');
//     resetButton.id = "reset";
//     resetButton.textContent = "PLAY AGAIN";
//     resetButton.addEventListener('click', resetGame.bind(this, g))

//     resultsPaneDiv.prepend(resultBannerHeadings2);
//     resultsPaneDiv.append(resetButton);
    

//     setTimeout(() => {
        
//         userOptionDiv.insertAdjacentElement('afterend', resultsPaneDiv)
//         if (result === 'win'){
//             userOptionButton.classList.add("win-option")
//             updateScore('add', m, g, result)
//         } else if (result === "lose"){
//             computerOptionButton.classList.add("win-option")
//             updateScore('add', m, g, result)
//         } else {
//             updateScore('add', m, g, result)
//         }
//     }, 3000);
    
// }


function resetGame(g) {
    // console.log('%c [RESET GAME] - Remove result section, render controls, initialize again', "color: blue; background-color: green; padding: 1em;")
    document.querySelector('.results-section').remove();
    document.querySelector('#mode-toggle').disabled = false;
    document.querySelector('#game-toggle').disabled = false;
    const controlDiv = document.createElement('div');
    let ctrlList;

    if(g === 'rps'){
        ctrlList = renderControls(g);
        controlDiv.classList = 'controls controls__rps';
        ctrlList.forEach(ctrl => {
            controlDiv.append(ctrl);
        })  
    } 
    if(g === 'rpsls'){
        ctrlList = renderControls(g);
        controlDiv.classList = "controls controls__rpsls";
        ctrlList.forEach(ctrl => {
            controlDiv.append(ctrl);
        })
    }
        
    document.querySelector('div.main').prepend(controlDiv);
    init();
}

function toggleModal(e){
    if(e.target.classList[0] === 'close'){
        let body = document.querySelector('body')
        let pageWrap = document.createElement('div');
        let modalDiv = document.createElement('div');
        let rulesHeadings3 = document.createElement('h3');
        let closeButton = document.createElement('button');
        let closeButtonImage = document.createElement('img');
        let rpsRulesImage = document.createElement('img');
        pageWrap.classList = "page-wrap";
        modalDiv.classList = "rules3__modal"
        rulesHeadings3.textContent = "RULES"
        closeButtonImage.classList ="close__modal";
        closeButtonImage.src ="./images/icon-close.svg";
        closeButtonImage.alt ="Close button to close the rules";
        rpsRulesImage.classList ="img__rules";
        rpsRulesImage.src = GAME == "rps" ? "./images/image-rules.svg": "./images/image-rules-bonus.svg"
        rpsRulesImage.alt="Here are the rules: Paper beats rock, Rock beats scissors, Scissors beat paper"

        
        closeButton.append(closeButtonImage);
        modalDiv.append(rulesHeadings3);
        modalDiv.append(closeButton);
        modalDiv.append(rpsRulesImage);
        body.appendChild(pageWrap);
        body.appendChild(modalDiv);

        closeButton.addEventListener('click', closeModal);
        pageWrap.addEventListener('click', closeModal);
        closeButton = null;
        pageWrap = null;
    }
}

document.querySelector('nav.rules>button').addEventListener('click', toggleModal.bind(this));

function closeModal(e){
    document.querySelector('.page-wrap').remove();
    document.querySelector('.rules3__modal').remove();
}


let initialize = false
// document.querySelector('#mode-toggle').addEventListener('click', (e) => {
//     initialize = true;
//     const scoreHeadDiv = document.querySelector('header>div.head__header .score-head');
//     if(MODE === 'normal'){
//         e.target.textContent = 'HARD'
//         // e.target.style.background = 'white';
//         e.target.style.color = 'hsl(237, 49%, 15%)';
//         e.target.style['background-position']= "100%";
//         MODE = 'hard'


//         const aiScoreDiv = document.createElement('div');
//         aiScoreDiv.classList = "ai-score";
//         const aiScoreSpan = document.createElement('span');
//         aiScoreSpan.textContent = "THE HOUSE";
//         const aiScoreP = document.createElement('p');
//         aiScoreP.id = "ai-score";

        
//         const yourScoreHeadings4 = scoreHeadDiv.querySelector('.score h4');
//         yourScoreHeadings4.textContent = 'YOUR SCORE'

//         aiScoreDiv.append(aiScoreSpan)
//         aiScoreDiv.append(aiScoreP);
//         scoreHeadDiv.append(aiScoreDiv);
//         updateScore(null, MODE, GAME)

//         // scoreCardUpdate('hard')
//     } else {
//         e.target.textContent = 'NORMAL';
//         // e.target.style.background = 'initial';
//         e.target.style.color = 'white';
//         e.target.style['background-position']= "0%";
//         MODE = 'normal'

//         document.querySelector('.ai-score').remove()
//         document.querySelector('.score h4').textContent = 'SCORE'

//         updateScore(null, MODE, GAME)

       
//     }
// })
document.querySelector('#mode-toggle').addEventListener('click', (e) => {
    initialize = true;
    const scoreHeadDiv = document.querySelector('header>div.head__header .score-head');

    function toggleModeTo(m, e){
        e.target.textContent = m.toString().toUpperCase();
        e.target.style.color = m === "hard" ? 'hsl(237, 49%, 15%)': "white"
        m === "hard" ? e.target.style['background-position']= "100%" : e.target.style['background-position']= "0%";
        MODE = m
    }

    if(MODE === 'normal'){
        toggleModeTo('hard', e)
        const aiScoreDiv = document.createElement('div');
        const aiScoreSpan = document.createElement('span');
        const aiScoreP = document.createElement('p');
        aiScoreDiv.classList = "ai-score";
        aiScoreSpan.textContent = "THE HOUSE";
        aiScoreP.id = "ai-score";
        const yourScoreHeadings4 = scoreHeadDiv.querySelector('.score h4');
        yourScoreHeadings4.textContent = 'YOUR SCORE'
        aiScoreDiv.append(aiScoreSpan)
        aiScoreDiv.append(aiScoreP);
        scoreHeadDiv.append(aiScoreDiv);
        updateScore(null, MODE, GAME)
    } else {
        toggleModeTo('normal', e)
        document.querySelector('.ai-score').remove()
        document.querySelector('.score h4').textContent = 'SCORE'
        updateScore(null, MODE, GAME)
    }
})


init();

function updateScore(op, m, g, r, prev, curr){
    prev = parseInt(document.querySelector('#score').textContent)
    if(!op && g === "rps"){
        if(m !== "hard"){
            prev = window.localStorage.getItem('rps-score');
            document.querySelector('#score').textContent = prev ? prev: '0';
        } else {
            prev = window.localStorage.getItem('rps-hard-score');
            document.querySelector('#score').textContent = prev ? prev.split(",")[0]: '0';
            document.querySelector('#ai-score').textContent = prev ? prev.split(",")[1]: '0';
        }
    }

    if(!op && g === "rpsls"){
        if(m !== "hard"){
            prev = window.localStorage.getItem('rpsls-score');
            document.querySelector('#score').textContent = prev ? prev: '0';
        } else {
            prev = window.localStorage.getItem('rpsls-hard-score');
            document.querySelector('#score').textContent = prev ? prev.split(",")[0]: '0';
            document.querySelector('#ai-score').textContent = prev ? prev.split(",")[1]: '0';
        }
    }


    if(op === 'add' && r === "win" && m !== "hard" && g === "rps"){
        document.querySelector('#score').textContent = parseInt(document.querySelector('#score').textContent) + 1;
        curr = document.querySelector('#score').textContent
        window.localStorage.setItem('rps-score', curr)
    } else if (op === 'add' && r === "lose" && m !== "hard" && g === "rps") {
        if(parseInt(document.querySelector('#score').textContent) != 0 && parseInt(document.querySelector('#score').textContent) > 0){
            document.querySelector('#score').textContent = parseInt(document.querySelector('#score').textContent) - 1;
        }
        curr = document.querySelector('#score').textContent
        window.localStorage.setItem('rps-score', curr)
    }

    if(op === 'add' && r === "win" && m !== "hard" && g === "rpsls"){
        document.querySelector('#score').textContent = parseInt(document.querySelector('#score').textContent) + 1;
        curr = document.querySelector('#score').textContent
        window.localStorage.setItem('rpsls-score', curr)
    } else if (op === 'add' && r === "lose" && m !== "hard" && g === "rpsls") {
        if(parseInt(document.querySelector('#score').textContent) != 0 && parseInt(document.querySelector('#score').textContent) > 0){
            document.querySelector('#score').textContent = parseInt(document.querySelector('#score').textContent) - 1;
        }
        curr = document.querySelector('#score').textContent
        window.localStorage.setItem('rpsls-score', curr)
    }



    
    if(op === "add" && r === "win" && m === "hard" && g === "rps"){
        document.querySelector('#score').textContent = parseInt(document.querySelector('#score').textContent) + 1;
        curr = ['', '']
        curr[0] = document.querySelector('#score').textContent;
        curr[1] = document.querySelector('#ai-score').textContent;
        window.localStorage.setItem('rps-hard-score', curr)
    }


    if(op === "add" && r === "lose" && m === "hard" && g === "rps"){
        document.querySelector('#ai-score').textContent = parseInt(document.querySelector('#ai-score').textContent) + 1;
        if(parseInt(document.querySelector('#score').textContent) != 0 && parseInt(document.querySelector('#score').textContent) > 0){
            document.querySelector('#score').textContent = parseInt(document.querySelector('#score').textContent) - 1;
        }
        curr = ['', '']
        curr[0] = document.querySelector('#score').textContent;
        curr[1] = document.querySelector('#ai-score').textContent;
        window.localStorage.setItem('rps-hard-score', curr)
    }

    if(op === "add" && r === "win" && m === "hard" && g === "rpsls"){
        document.querySelector('#score').textContent = parseInt(document.querySelector('#score').textContent) + 1;
        curr = ['', '']
        curr[0] = document.querySelector('#score').textContent;
        curr[1] = document.querySelector('#ai-score').textContent;
        window.localStorage.setItem('rpsls-hard-score', curr)
    }


    if(op === "add" && r === "lose" && m === "hard" && g === "rpsls"){
        document.querySelector('#ai-score').textContent = parseInt(document.querySelector('#ai-score').textContent) + 1;
        if(parseInt(document.querySelector('#score').textContent) != 0 && parseInt(document.querySelector('#score').textContent) > 0){
            document.querySelector('#score').textContent = parseInt(document.querySelector('#score').textContent) - 1;
        }
        curr = ['', '']
        curr[0] = document.querySelector('#score').textContent;
        curr[1] = document.querySelector('#ai-score').textContent;
        window.localStorage.setItem('rpsls-hard-score', curr)
    }


    return { op, prev, curr }
}

document.querySelector('#game-toggle').addEventListener('click', (e) => {
    const header = document.querySelector('header>div.head__header');
    const logo = header.querySelector('img');
    const main = document.querySelector('main>div.main');
    const controls = main.querySelector('div.controls');
    let newControls = document.createElement('div');

    function toggleGameTo(g, e){
        logo.class = `logo__${g}`;
        logo.src = g === 'rpsls' ? "./images/logo-bonus.svg": "./images/logo.svg";
        main.classList = `main main__${g}`;
        controls.remove();
        
        newControls.classList = `controls controls__${g}`;
        main.append(newControls);

        const controlList = renderControls(g);
        controlList.forEach(ctrl => newControls.append(ctrl))

        e.target.textContent = g.toString().toUpperCase();
        e.target.style.color = g === 'rpsls' ? 'hsl(237, 49%, 15%)': "white";

        g === 'rpsls' ? e.target.style['background-position']= "100%" : e.target.style['background-position']= "0";
        GAME = g;
        updateScore(null, MODE, g)
    }

    GAME === 'rps' ? toggleGameTo('rpsls', e) : toggleGameTo('rps', e);
    createStartEvents(GAME)
})


// document.querySelector('#game-toggle').addEventListener('click', (e) => {
//     const header = document.querySelector('header>div.head__header');
//     let logo = header.querySelector('img');
//     const main = document.querySelector('main>div.main');
//     const controls = main.querySelector('div.controls')
//     if(GAME === 'rps'){
//         // Change to rpsls
//         logo.class = "logo__rpsls";
//         logo.src = "./images/logo-bonus.svg";
//         main.classList = "main main__rpsls";
//         controls.remove();
//         let newControls = document.createElement('div');

//         newControls.classList = "controls controls__rpsls";
//         main.append(newControls);
        
//         // create rpsls controls
//         const controlList = renderControls('rpsls');
        
//         controlList.forEach(ctrl => {
//             newControls.append(ctrl);
//         })

//         e.target.textContent = 'RPSLS'
//         e.target.style.color = 'hsl(237, 49%, 15%)';
//         e.target.style['background-position']= "100%";
//         GAME = 'rpsls'
//         updateScore(null, MODE, GAME)

//     } else { 
//         // Change to rps
//         logo.class = "logo__rps";
//         logo.src = "./images/logo.svg";
//         main.classList = "main main__rps";
//         controls.remove();
//         let newControls = document.createElement('div');

//         newControls.classList = "controls controls__rps";
//         main.append(newControls);

//         // create rps controls
//         const controlList = renderControls('rps');
//         controlList.forEach(ctrl => {
//             newControls.append(ctrl);
//         })


//         e.target.textContent = 'RPS';
//         e.target.style.color = 'white';
//         e.target.style['background-position']= "0%";
//         GAME = 'rps'
        
//         updateScore(null, MODE, GAME)
//     }

//     createStartEvents(GAME)
// })

function renderControls(g) {
    let opts = g === 'rps'? ['paper', 'scissors', 'rock'] : ['scissors', 'spock', 'paper', 'lizard', 'rock'];
    let controls = [];
    opts.forEach(opt => {
        let a = document.createElement('button'),
        b = document.createElement('span'),
        c = document.createElement('img');
        a.dataset.option = `${opt}-option`;
        b.dataset.option = `${opt}-option`;
        c.dataset.option = `${opt}-option`;
        a.classList = `${opt}-option ${opt}__option__main`;
        // a.addEventListener('click', e => startGame(g,e));
        c.src = `./images/icon-${opt}.svg`;
        c.alt = opt;
        c.classList = `${opt}-image`
        b.append(c);
        a.append(b);
        controls.push(a);
    })

    return controls;
}
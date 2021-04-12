import aiAnswer from "./hardmode.js";
let MODE = 'normal';
let GAME = "rps";
function init(){
    // console.log('%c [INIT] - to create start event and update score', "color: yellow; background-color: red;")
    createStartEvents(GAME);
    updateScore(null, MODE, GAME)
}


function createStartEvents(g){
    // console.log('%c [CREATE START EVENTS] - select all ctrl buttons and add event listeners w/ Start Game function', "color: blue; background-color: green; padding: 1em;")
    document.querySelectorAll('div.main>.controls button').forEach((controlButton,idx )=> {
        controlButton.addEventListener('click', e => startGame(g, e))
    }) 
}

let USER_OPTION;

async function startGame(g, e) {
    // console.log('%c [START GAME] - U & C choice then render picking results section', "color: blue; background-color: green; padding: 1em;")
    let m = MODE;

    document.querySelector('#mode-toggle').disabled = true;
    document.querySelector('#game-toggle').disabled = true;

    // Store the user choice in a variable
    const [ userOption ] = e.target.dataset.option.toString().split("-");
    USER_OPTION = userOption;

    // List computer options
    const opts = g === 'rps'? ['paper', 'scissors', 'rock'] : ['rock', 'paper', 'scissors', 'spock', 'lizard'];
    let uOption, computerOption, max, min;
    max = g === "rps" ? 2 : 4;
    min = 0;
    
    // Normalize data to pass to ai hard mode
    // Normalize rps:[1,2,3]
    if (userOption == 'rock') {
        uOption = 1;
    } else if (userOption == 'paper'){
        uOption = 2;
    } else if (userOption == 'scissors'){
        uOption = 3;
    } else if (userOption == 'spock'){
        uOption = 4;
    } else if (userOption == 'lizard'){
        uOption = 5;
    } else {
        uOption = opts[Math.floor(Math.random() * (max - min + 1) + min)];
    }
    
    
    // Computer choose an action
    if(m === 'normal' && g === "rps"){
        // If normal mode, just random answer
        max = 2, min = 0;
        computerOption = opts[Math.floor(Math.random() * (max - min + 1) + min)];
    } else if (m === "normal" && g === "rpsls"){
        max = 4, min = 0;
        computerOption = opts[Math.floor(Math.random() * (max - min + 1) + min)];
    } else {
        // hard mode
    
        const cOption = await aiAnswer(uOption, g);
        console.log(cOption)
        if (cOption == 1) {
            computerOption = 'rock';
        } else if (cOption == 2){
            computerOption = 'paper';
        } else if (cOption == 3){
            computerOption = 'scissors';
        } else if (cOption == 4){
            computerOption = 'spock';
        } else if (cOption == 5){
            computerOption = 'lizard';
        } else {
            computerOption = opts[Math.floor(Math.random() * (max - min + 1) + min)];
        }
            
    }

    /// Proceed to picking and rendering result
    // proceed to picking
    await pickingResultsSection(userOption, computerOption, m, g)    
}



function pickingResultsSection(u, c, m, g){

    // console.log('%c [PICKING RESULTS SECTION] - Render choices, update picking state, show results and update score', "color: blue; background-color: green; padding: 1em;")
    // Render results section with picking
    document.querySelector('.controls').remove();

    // render user choice
    const section = document.createElement('section');
    section.classList = 'results-section';
    section.style.display = 'flex';
    const userOptionDiv = document.createElement('div');
    userOptionDiv.classList = 'user-option';
    const userOptionHeadings3 = document.createElement('h3');
    userOptionHeadings3.textContent = 'YOU PICKED'
    const userOptionButton = document.createElement('button');
    userOptionButton.classList = `${u.toString().toLowerCase().trim()}-option picking-option user-picking`
    const userOptionSpan = document.createElement('span');
    const userOptionImage = document.createElement('img');
    userOptionImage.src = `./images/icon-${u.toString().toLowerCase().trim()}.svg`;
    userOptionImage.alt = u.toString().trim();
    userOptionImage.classList = `${u.toString().trim().toLowerCase()}-image`

    /// render computer picking
    const computerOptionDiv = document.createElement('div');
    computerOptionDiv.classList = 'computer-option';
    const computerOptionHeadings3 = document.createElement('h3');
    computerOptionHeadings3.textContent = 'THE HOUSE PICKED'
    const computerOptionButton = document.createElement('button');
    computerOptionButton.classList = `${c.toString().toLowerCase().trim()}-option picking-option picking`
    const computerOptionSpan = document.createElement('span');
    const computerOptionImage = document.createElement('img');
    computerOptionImage.src = `./images/icon-${c.toString().toLowerCase().trim()}.svg`;
    computerOptionImage.alt = c.toString().trim();
    computerOptionImage.classList = `${c.toString().trim().toLowerCase()}-image`


    document.querySelector('div.main').prepend(section);
    section.prepend(userOptionDiv);
    section.append(computerOptionDiv);
    userOptionDiv.prepend(userOptionHeadings3);
    userOptionDiv.append(userOptionButton);
    userOptionButton.prepend(userOptionSpan);
    userOptionSpan.prepend(userOptionImage);

    computerOptionDiv.prepend(computerOptionHeadings3);
    computerOptionDiv.append(computerOptionButton);
    computerOptionButton.prepend(computerOptionSpan);
    computerOptionSpan.prepend(computerOptionImage);

    
    // display option picked by the computer after 1s
    setTimeout(() => {
        computerOptionButton.classList.toggle("picking")
        section.style.padding = "1em 0"
    }, 2000)

    // evaluate result
    let GAME_RESULT;
    let GAME_ERROR = '';
    let user = u, computer = c;
    if(g === 'rps'){
        if(user === "rock" && computer === "scissors" || user === "paper" && computer === "rock" || user === "scissors" && computer === "paper"){
            GAME_RESULT = 'win';
        } else if(user === "rock" && computer === "paper" || user === "paper" && computer === "scissors" || user === "scissors" && computer === "rock"){
            GAME_RESULT = 'lose';
        } else if(user === computer){
            GAME_RESULT = 'draw';
        } else {
            GAME_ERROR = new Error('Something went wrong with the game master');
        }
    } 

    if (g === 'rpsls'){
        if (
			(user === "rock" && computer === "scissors") ||
			(user === "paper" && computer === "rock") ||
			(user === "scissors" && computer === "paper") ||
			(user === "rock" && computer === "lizard") ||
			(user === "lizard" && computer === "spock") ||
			(user === "spock" && computer === "scissors") ||
			(user === "scissors" && computer === "lizard") ||
			(user === "paper" && computer === "spock") ||
			(user === "lizard" && computer === "paper") ||
			(user === "spock" && computer === "rock")
		) {
			GAME_RESULT = "win";
		} else if (
			(user === "rock" && computer === "paper") ||
			(user === "paper" && computer === "scissors") ||
			(user === "scissors" && computer === "rock") ||
			(user === "lizard" && computer === "rock") ||
			(user === "spock" && computer === "lizard") ||
			(user === "scissors" && computer === "spock") ||
			(user === "lizard" && computer === "scissors") ||
			(user === "spock" && computer === "paper") ||
			(user === "paper" && computer === "lizard") ||
			(user === "rock" && computer === "spock") 

		) {
			GAME_RESULT = "lose";
		} else if (user === computer) {
			GAME_RESULT = "draw";
		} else {
			GAME_ERROR = new Error("Something went wrong with the game master");
		}
    }
    
    let result = GAME_RESULT;

    // render 
    
    const resultsPaneDiv = document.createElement('div');
    resultsPaneDiv.classList = "results-pane";
    const resultBannerHeadings2 = document.createElement('h2');
    resultBannerHeadings2.classList = "result-banner";
    resultBannerHeadings2.textContent = result.toString().toLowerCase().trim() !== "draw" ? `YOU ${result.toString().toUpperCase().trim()}`: "IT'S A TIE";
    const resetButton = document.createElement('button');
    resetButton.id = "reset";
    resetButton.textContent = "PLAY AGAIN";
    resetButton.addEventListener('click', resetGame.bind(this, g))

    resultsPaneDiv.prepend(resultBannerHeadings2);
    resultsPaneDiv.append(resetButton);
    

    setTimeout(() => {
        
        userOptionDiv.insertAdjacentElement('afterend', resultsPaneDiv)
        if (result === 'win'){
            userOptionButton.classList.add("win-option")
            updateScore('add', m, g, result)
        } else if (result === "lose"){
            computerOptionButton.classList.add("win-option")
            updateScore('add', m, g, result)
        } else {
            updateScore('add', m, g, result)
        }
    }, 3000);
    
}


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
        pageWrap.classList = "page-wrap";
        let modalDiv = document.createElement('div');
        modalDiv.classList = "rules3__modal"
        let rulesHeadings3 = document.createElement('h3');
        rulesHeadings3.textContent = "RULES"
        let closeButton = document.createElement('button');
        let closeButtonImage = document.createElement('img');
        closeButtonImage.classList ="close__modal";
        closeButtonImage.src ="./images/icon-close.svg";
        closeButtonImage.alt ="Close button to close the rules";
        let rpsRulesImage = document.createElement('img');
        rpsRulesImage.classList ="img__rules";
        rpsRulesImage.src = GAME == "rps" ? "./images/image-rules.svg": "./images/image-rules-bonus.svg"
        rpsRulesImage.alt="Here are the rules: Paper beats rock, Rock beats scissors, Scissors beat paper"

        modalDiv.append(rulesHeadings3);
        modalDiv.append(closeButton);
        closeButton.append(closeButtonImage);
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
document.querySelector('#mode-toggle').addEventListener('click', (e) => {
    initialize = true;
    const scoreHeadDiv = document.querySelector('header>div.head__header .score-head');
    if(MODE === 'normal'){
        e.target.textContent = 'HARD'
        // e.target.style.background = 'white';
        e.target.style.color = 'hsl(237, 49%, 15%)';
        e.target.style['background-position']= "100%";
        MODE = 'hard'


        const aiScoreDiv = document.createElement('div');
        aiScoreDiv.classList = "ai-score";
        const aiScoreSpan = document.createElement('span');
        aiScoreSpan.textContent = "THE HOUSE";
        const aiScoreP = document.createElement('p');
        aiScoreP.id = "ai-score";

        
        const yourScoreHeadings4 = scoreHeadDiv.querySelector('.score h4');
        yourScoreHeadings4.textContent = 'YOUR SCORE'

        aiScoreDiv.append(aiScoreSpan)
        aiScoreDiv.append(aiScoreP);
        scoreHeadDiv.append(aiScoreDiv);
        updateScore(null, MODE, GAME)

        // scoreCardUpdate('hard')
    } else {
        e.target.textContent = 'NORMAL';
        // e.target.style.background = 'initial';
        e.target.style.color = 'white';
        e.target.style['background-position']= "0%";
        MODE = 'normal'

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
    let logo = header.querySelector('img');
    const main = document.querySelector('main>div.main');
    const controls = main.querySelector('div.controls')
    if(GAME === 'rps'){
        // Change to rpsls
        logo.class = "logo__rpsls";
        logo.src = "./images/logo-bonus.svg";
        main.classList = "main main__rpsls";
        controls.remove();
        let newControls = document.createElement('div');

        newControls.classList = "controls controls__rpsls";
        main.append(newControls);
        
        // create rpsls controls
        const controlList = renderControls('rpsls');
        
        controlList.forEach(ctrl => {
            newControls.append(ctrl);
        })

        e.target.textContent = 'RPSLS'
        e.target.style.color = 'hsl(237, 49%, 15%)';
        e.target.style['background-position']= "100%";
        GAME = 'rpsls'
        updateScore(null, MODE, GAME)

    } else { 
        // Change to rps
        logo.class = "logo__rps";
        logo.src = "./images/logo.svg";
        main.classList = "main main__rps";
        controls.remove();
        let newControls = document.createElement('div');

        newControls.classList = "controls controls__rps";
        main.append(newControls);

        // create rps controls
        const controlList = renderControls('rps');
        controlList.forEach(ctrl => {
            newControls.append(ctrl);
        })


        e.target.textContent = 'RPS';
        e.target.style.color = 'white';
        e.target.style['background-position']= "0%";
        GAME = 'rps'
        
        updateScore(null, MODE, GAME)
    }

    createStartEvents(GAME)
})

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
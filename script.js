function init(){
    document.querySelectorAll('div.main>.controls button').forEach(controlButton => {
        controlButton.addEventListener('click', startGame.bind(this))
    })
    
    updateScore()
}

init();

function startGame(e) {

    // Store the user choice in a variable
    const [ userOption ] = e.target.dataset.option.toString().split("-");
    USER_OPTION = userOption;

    // Computer choose an action
    const opts = ['rock', 'paper', 'scissors']
    const computerOption = opts[Math.floor(Math.random() * 2)]

    /// Proceed to picking and rendering result
    // proceed to picking
    pickingResultsSection(userOption, computerOption)

    // Restart the game
    
}

function updateScore(op, prev, curr){
    prev = parseInt(document.querySelector('#score').textContent)
    if(!op){
        prev = window.localStorage.getItem('rps-score');
        document.querySelector('#score').textContent = prev ? prev: '0';
    }

    if(op === 'add'){
        document.querySelector('#score').textContent = parseInt(document.querySelector('#score').textContent) + 1;
    }
    curr = document.querySelector('#score').textContent
    window.localStorage.setItem('rps-score', curr)
    return { op, prev, curr }
}

function pickingResultsSection(u, c){

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
    if(user === "rock" && computer === "scissors" || user === "paper" && computer === "rock" || user === "scissors" && computer === "paper"){
        GAME_RESULT = 'win';
    } else if(user === "rock" && computer === "paper" || user === "paper" && computer === "scissors" || user === "scissors" && computer === "rock"){
        GAME_RESULT = 'lose';
    } else if(user === computer){
        GAME_RESULT = 'draw';
    } else {
        GAME_ERROR = new Error('Something went wrong with the game master');
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
    resetButton.addEventListener('click', resetGame)

    resultsPaneDiv.prepend(resultBannerHeadings2);
    resultsPaneDiv.append(resetButton);
    

    setTimeout(() => {
        
        userOptionDiv.insertAdjacentElement('afterend', resultsPaneDiv)
        if (result === 'win'){
            updateScore('add')
        }
    }, 3000);
    
}


function resetGame() {
    document.querySelector('.results-section').remove();

    const controlDiv = document.createElement('div');
    const paperButton = document.createElement('button');
    const scissorsButton = document.createElement('button');
    const rockButton = document.createElement('button');
    const paperOptionSpan = document.createElement('span');
    const scissorsOptionSpan = document.createElement('span');
    const rockOptionSpan = document.createElement('span');
    const paperOptionImage = document.createElement('img');
    const scissorsOptionImage = document.createElement('img');
    const rockOptionImage = document.createElement('img');

    controlDiv.classList = 'controls'

    paperButton.classList = "paper-option paper__option__main"
    paperButton.dataset.option = "paper-option"
    paperOptionSpan.dataset.option = "paper-option"
    paperOptionImage.dataset.option = "paper-option"
    paperOptionImage.src = "./images/icon-paper.svg"
    paperOptionImage.alt = "paper"

    scissorsButton.classList = "scissors-option scissors__option__main"
    scissorsButton.dataset.option = "scissors-option"
    scissorsOptionSpan.dataset.option = "scissors-option"
    scissorsOptionImage.dataset.option = "scissors-option"
    scissorsOptionImage.src = "./images/icon-scissors.svg"
    scissorsOptionImage.alt = "scissors"

    rockButton.classList = "rock-option rock__option__main"
    rockButton.dataset.option = "rock-option"
    rockOptionSpan.dataset.option = "rock-option"
    rockOptionImage.dataset.option = "rock-option"
    rockOptionImage.src = "./images/icon-rock.svg"
    rockOptionImage.alt = "rock"
    rockOptionImage.classList = "rock-image"

    document.querySelector('div.main').prepend(controlDiv);
    controlDiv.prepend(paperButton);
    controlDiv.append(scissorsButton);
    controlDiv.append(rockButton);
    paperButton.prepend(paperOptionSpan);
    paperOptionSpan.prepend(paperOptionImage);
    scissorsButton.prepend(scissorsOptionSpan);
    scissorsOptionSpan.prepend(scissorsOptionImage);
    rockButton.prepend(rockOptionSpan);
    rockOptionSpan.prepend(rockOptionImage);

    init();
}

function toggleModal(e){
    if(e.target.className === 'close'){
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
        rpsRulesImage.src ="./images/image-rules.svg";
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
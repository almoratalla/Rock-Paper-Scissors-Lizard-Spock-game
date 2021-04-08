console.log(document.querySelectorAll('div.main>.controls button'))

let USER_OPTION;

const resetGame = ()=> {
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

const renderPickingSection = ( user, computer ) => {
    // remove from DOM the controls area
    document.querySelector('.controls').remove()
    
    /// render the picking section
    // render user choice
    const section = document.createElement('section');
    section.classList = 'picking-section';
    section.style.display = 'flex';
    const userOptionDiv = document.createElement('div');
    userOptionDiv.classList = 'user-option';
    const userOptionHeadings3 = document.createElement('h3');
    userOptionHeadings3.textContent = 'YOU PICKED'
    const userOptionButton = document.createElement('button');
    userOptionButton.classList = `${user.toString().toLowerCase().trim()}-option picking-option`
    const userOptionSpan = document.createElement('span');
    const userOptionImage = document.createElement('img');
    userOptionImage.src = `./images/icon-${user.toString().toLowerCase().trim()}.svg`;
    userOptionImage.alt = user.toString().trim();
    userOptionImage.classList = `${user.toString().trim().toLowerCase()}-image`

    /// render computer picking
    const computerOptionDiv = document.createElement('div');
    computerOptionDiv.classList = 'computer-option';
    const computerOptionHeadings3 = document.createElement('h3');
    computerOptionHeadings3.textContent = 'THE HOUSE PICKED'
    const computerOptionButton = document.createElement('button');
    computerOptionButton.classList = `${computer.toString().toLowerCase().trim()}-option picking-option picking`
    const computerOptionSpan = document.createElement('span');
    const computerOptionImage = document.createElement('img');
    computerOptionImage.src = `./images/icon-${computer.toString().toLowerCase().trim()}.svg`;
    computerOptionImage.alt = computer.toString().trim();
    computerOptionImage.classList = `${computer.toString().trim().toLowerCase()}-image`

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
    setTimeout(() => computerOptionButton.classList.toggle("picking"), 1000)

    // evaluate result
    let GAME_RESULT;
    let GAME_ERROR = '';
    if(user === "rock" && computer === "scissors" || user === "paper" && computer === "rock" || user === "scissors" && computer === "paper"){
        GAME_RESULT = 'win';
    } else if(user === "rock" && computer === "paper" || user === "paper" && computer === "scissors" || user === "scissors" && computer === "rock"){
        GAME_RESULT = 'lose';
    } else if(user === computer){
        GAME_RESULT = 'draw';
    } else {
        GAME_ERROR = new Error('Something went wrong with the game master');
    }


    // return result
    console.log(`You ${GAME_RESULT.toUpperCase()}!!`)
    return { result: GAME_RESULT, user, computer}
}

const renderResultsSection = ( result, u, c ) => {
    // remove picking section
    document.querySelector('.picking-section').remove();

    /// render the picking section
    // render user choice
    const section = document.createElement('section');
    section.classList = 'results-section';
    section.style.display = 'flex';
    const userOptionDiv = document.createElement('div');
    userOptionDiv.classList = 'user-option';
    const userOptionHeadings3 = document.createElement('h3');
    userOptionHeadings3.textContent = 'YOU PICKED'
    const userOptionButton = document.createElement('button');
    userOptionButton.classList = `${u.toString().toLowerCase().trim()}-option picking-option`
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
    }, 1000);
}

const startGame = (e) => {
    console.dir(e.target)
    console.log(e.target.dataset.option)

    // Store the user choice in a variable
    const [ userOption ] = e.target.dataset.option.toString().split("-");
    USER_OPTION = userOption;
    console.log(USER_OPTION)

    // Computer choose an action
    const opts = ['rock', 'paper', 'scissors']
    const computerOption = opts[Math.floor(Math.random() * 2)]

    // Proceed to next UI (render)
    const { result, user, computer } = renderPickingSection(userOption, computerOption);
    console.log(result)

    /// Display result
    // render result screen
    setTimeout(() => renderResultsSection(result, user, computer), 2000)
    

    // Restart the game
    
}

const updateScore = (op, prev, curr) => {
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

function init(){
    document.querySelectorAll('div.main>.controls button').forEach(controlButton => {
        controlButton.addEventListener('click', startGame.bind(this))
    })
    updateScore()
}

init();



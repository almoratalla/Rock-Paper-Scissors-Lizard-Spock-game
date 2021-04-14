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

function closeModal(e){
    document.querySelector('.page-wrap').remove();
    document.querySelector('.rules3__modal').remove();
}

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
        c.src = `./images/icon-${opt}.svg`;
        c.alt = opt;
        c.classList = `${opt}-image`
        b.append(c);
        a.append(b);
        controls.push(a);
    })
    return controls;
}
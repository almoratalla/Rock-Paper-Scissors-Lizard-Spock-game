// GLOBALS
let MODE = "normal";
let GAME = "rps";
let initialize = false;
let rpsPattern = [],
	rpslsPattern = [];
let rpsGameCount = 0,
	rpslsGameCount = 0;
let rpsPatternLength = 13,
	rpslsPatternLength = 13;

// @desc- Initialize to create start events and to update score
const init = () => {
	createStartEvents(GAME);
	updateScore(null, MODE, GAME);
};

/**
 * @desc - Creates start events by adding event listeners to each control buttons
 * @param { string } [g='rps']     - The game value, either in rps or rpsls.
 */
const createStartEvents = (g) => {
	document
		.querySelectorAll("div.main>.controls button")
		.forEach((cbtn) =>
			cbtn.addEventListener("click", startGame.bind(this, g))
		);
};

/**
 * @desc - Updates the score board according to the result and mode
 * @param { string } [op='add']    - The operation value. Will pass initial value, null if created on instance.
 * @param { string } [m="normal"]  - Determines game mode. Defaults to normal. Either normal or hard.
 * @param { string } [g='rps']     - The game value. Either in rps or rpsls.
 * @param { string } [r]           - The game result. Either in 'win', 'lose' or 'draw'
 * @return { op, prev, curr }      - Returns the operation, prev and current values
 */
const updateScore = (op, m, g, r) => {
	const score = document.querySelector("#score");
	const aiscore = document.querySelector("#ai-score");

	function updateInitRpsModeScores(m, g) {
		if (m !== "hard") {
			score.textContent = window.localStorage.getItem(`${g}-score`)
				? window.localStorage.getItem(`${g}-score`)
				: "0";
		} else {
			score.textContent = window.localStorage.getItem(`${g}-hard-score`)
				? window.localStorage.getItem(`${g}-hard-score`).split(",")[0]
				: "0";
			aiscore.textContent = window.localStorage.getItem(`${g}-hard-score`)
				? window.localStorage.getItem(`${g}-hard-score`).split(",")[1]
				: "0";
		}
	}

	function normalModeScoreUpdate(g, r) {
		score.textContent =
			r === "win"
				? parseInt(score.textContent) + 1 // if 'win', add 1 to score
				: r === "lose" // else if 'lose',
				? parseInt(score.textContent) != 0 && // check if score is greater than 0
				  parseInt(score.textContent) > 0 // then subtract 1 from the score
					? parseInt(score.textContent) - 1 // if score is already 0, don't allow negative values
					: 0
				: score.textContent;
		window.localStorage.setItem(`${g}-score`, score.textContent);
	}

	function hardModeScoreUpdate(g, r) {
		const score = document.querySelector("#score");
		const aiscore = document.querySelector("#ai-score");
		r === "win"
			? (score.textContent = parseInt(score.textContent) + 1)
			: r === "lose"
			? parseInt(score.textContent) != 0 &&
			  parseInt(score.textContent) > 0
				? (score.textContent = parseInt(score.textContent) - 1)
				: 0
			: score.textContent;
		aiscore.textContent =
			r === "lose"
				? parseInt(aiscore.textContent) + 1
				: aiscore.textContent;
		window.localStorage.setItem(`${g}-hard-score`, [
			score.textContent,
			aiscore.textContent,
		]);
	}

	if (!op && g) {
		updateInitRpsModeScores(m, g);
	}
	if (op && m === "hard") {
		hardModeScoreUpdate(g, r);
	}
	if (op && m !== "hard") {
		normalModeScoreUpdate(g, r);
	}
	const prev = parseInt(score.textContent);
	const curr = [score.textContent, aiscore ? aiscore.textContent : null];
	return { op, prev, curr };
};

/**
 * @desc - Render the control options
 * @param { string } [g='rps']     - The game value. Either in rps or rpsls.
 * @return { controls }            - Returns an array of controls
 */
const renderControls = (g) => {
	let opts =
		g === "rps"
			? ["paper", "scissors", "rock"]
			: ["scissors", "spock", "paper", "lizard", "rock"];
	let controls = [];
	opts.forEach((opt) => {
		let a = document.createElement("button"),
			b = document.createElement("span"),
			c = document.createElement("img");
		a.dataset.option = `${opt}-option`;
		b.dataset.option = `${opt}-option`;
		c.dataset.option = `${opt}-option`;
		a.classList = `${opt}-option ${opt}__option__main`;
		c.src = `./images/icon-${opt}.svg`;
		c.alt = opt;
		c.classList = `${opt}-image`;
		b.append(c);
		a.append(b);
		controls.push(a);
	});
	return controls;
};

/**
 * @desc - Function attached to events to start the game
 * @param { string } [g='rps']     - The game value. Either in rps or rpsls.
 * @param { object } [e]           - The event element binded to this function
 */
const startGame = async (g, e) => {
	let m = MODE;

	document.querySelector("#mode-toggle").disabled = true;
	document.querySelector("#game-toggle").disabled = true;

	// Store the user choice in a variable
	const [userOption] = e.target.dataset.option.toString().split("-");

	// List computer options
	const rpsls = ["rock", "paper", "scissors", "spock", "lizard"];
	const opts = g === "rps" ? ["paper", "scissors", "rock"] : rpsls;
	let u, computerOption, max, min;
	(max = g === "rps" ? 2 : 4), (min = 0);

	// Normalize data to pass to ai hard mode
	// Normalize rps:[1,2,3]
	u = rpsls.findIndex((el) => el == userOption) + 1;

	// Computer choose an action
	if (m === "normal") {
		// If normal mode, just random answer
		computerOption =
			opts[Math.floor(Math.random() * (max - min + 1) + min)];
	} else {
		// hard mode
		const computerAIAnswer = await brainAnswer(u, g);
		computerOption =
			rpsls[rpsls.findIndex((_, i) => computerAIAnswer == i + 1)];
	}

	/// Proceed to picking and rendering result
	// proceed to picking
	pickingResultsSection(userOption, computerOption, m, g);
};

/**
 * @desc - Renders the picking stage and the results section
 * @param { string | string } [uc] - Holds the user/computer choice from the ff: rpsls
 * @param { string } [m="normal"]  - Determines game mode. Defaults to normal. Either normal or hard.
 * @param { string } [g='rps']     - The game value. Either in rps or rpsls.
 */
const pickingResultsSection = (u, c, m, g) => {
	// Render results section with picking
	document.querySelector(".controls").remove();

	let opts = [u, c];
	let picks = ["user", "computer"];
	let ubtn, cbtn, udiv, cdiv;
	let GAME_RESULT;

	const section = document.createElement("section");
	section.classList = "results-section";
	section.style.display = "flex";
	document.querySelector("div.main").prepend(section);

	function renderPicking(o, p) {
		const optionDiv = document.createElement("div");
		const optionHeadings3 = document.createElement("h3");
		const optionButton = document.createElement("button");
		const optionSpan = document.createElement("span");
		const optionImage = document.createElement("img");

		optionDiv.classList = `${p}-option`;
		optionHeadings3.textContent =
			p === "user" ? "YOU PICKED" : "THE HOUSE PICKED";
		optionButton.classList = `${o
			.toString()
			.toLowerCase()
			.trim()}-option picking-option`;
		p === "user"
			? optionButton.classList.add("user-picking")
			: optionButton.classList.add("picking");
		optionImage.src = `./images/icon-${o
			.toString()
			.toLowerCase()
			.trim()}.svg`;
		optionImage.alt = o.toString().trim();
		optionImage.classList = `${o.toString().trim().toLowerCase()}-image`;

		optionSpan.prepend(optionImage);
		optionButton.prepend(optionSpan);
		optionDiv.append(optionHeadings3);
		optionDiv.append(optionButton);
		section.append(optionDiv);

		p === "user" ? (ubtn = optionButton) : (cbtn = optionButton);
		p === "user" ? (udiv = optionDiv) : (cdiv = optionDiv);
	}

	function cbtnTogglePicking() {
		cbtn.classList.toggle("picking");
		section.style.padding = "1em 0";
	}

	function evaluateResult(g) {
		function winCondition(g) {
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

	function renderResultsPane(result) {
		const resultsPaneDiv = document.createElement("div");
		const resultBannerHeadings2 = document.createElement("h2");
		const resetButton = document.createElement("button");
		resultsPaneDiv.classList = "results-pane";
		resultBannerHeadings2.classList = "result-banner";
		resultBannerHeadings2.textContent =
			result.toString().toLowerCase().trim() !== "draw"
				? `YOU ${result.toString().toUpperCase().trim()}`
				: "IT'S A TIE";
		resetButton.id = "reset";
		resetButton.textContent = "PLAY AGAIN";
		resetButton.addEventListener("click", resetGame.bind(this, g));

		resultsPaneDiv.prepend(resultBannerHeadings2);
		resultsPaneDiv.append(resetButton);

		setTimeout(() => {
			udiv.insertAdjacentElement("afterend", resultsPaneDiv);
			result === "win"
				? ubtn.classList.add("win-option")
				: result === "lose"
				? cbtn.classList.add("win-option")
				: null;
			updateScore("add", m, g, result);
		}, 3000);
	}

	opts.forEach((o, i) => renderPicking(o, picks[i]));
	// display option picked by the computer after 1s
	setTimeout(cbtnTogglePicking, 2000);

	// evaluate result
	evaluateResult(g);

	// render results pane
	renderResultsPane(GAME_RESULT);
};

/**
 * @desc - Renders the rules modal
 * @param { object } [e]           - The event element binded to this function, spec. the rules button.
 */
const toggleModal = (e) => {
	if (e.target.classList[0] === "close") {
		let body = document.querySelector("body");
		let pageWrap = document.createElement("div");
		let modalDiv = document.createElement("div");
		let rulesHeadings3 = document.createElement("h3");
		let closeButton = document.createElement("button");
		let closeButtonImage = document.createElement("img");
		let rpsRulesImage = document.createElement("img");
		pageWrap.classList = "page-wrap";
		modalDiv.classList = "rules3__modal";
		rulesHeadings3.textContent = "RULES";
		closeButtonImage.classList = "close__modal";
		closeButtonImage.src = "./images/icon-close.svg";
		closeButtonImage.alt = "Close button to close the rules";
		rpsRulesImage.classList = "img__rules";
		rpsRulesImage.src =
			GAME == "rps"
				? "./images/image-rules.svg"
				: "./images/image-rules-bonus.svg";
		rpsRulesImage.alt =
			"Here are the rules: Paper beats rock, Rock beats scissors, Scissors beat paper";

		closeButton.append(closeButtonImage);
		modalDiv.append(rulesHeadings3);
		modalDiv.append(closeButton);
		modalDiv.append(rpsRulesImage);
		body.appendChild(pageWrap);
		body.appendChild(modalDiv);

		closeButton.addEventListener("click", closeModal);
		pageWrap.addEventListener("click", closeModal);
		closeButton = null;
		pageWrap = null;
	}
};

/**
 * @desc - Closes the rules modal
 */
const closeModal = () => {
	document.querySelector(".page-wrap").remove();
	document.querySelector(".rules3__modal").remove();
};

/**
 * @desc - Restarts and reinitializes the game;
 * @param { string } [g='rps']     - The game value. Either in rps or rpsls.
 */
const resetGame = (g) => {
	document.querySelector(".results-section").remove();
	document.querySelector("#mode-toggle").disabled = false;
	document.querySelector("#game-toggle").disabled = false;
	const controlDiv = document.createElement("div");
	const ctrlList = renderControls(g);
	controlDiv.classList = `controls controls__${g}`;
	ctrlList.forEach((ctrl) => controlDiv.append(ctrl));
	document.querySelector("div.main").prepend(controlDiv);
	init();
};

/**
 * @desc - Retrieves pattern to be used in training. If there's none in the browser, will generate random.
 * @param { string } [g='rps']     - The game value. Either in rps or rpsls.
 */
const prepareData = (g) => {
	if (g === "rps") {
		rpsPattern = window.localStorage.getItem("rps-pattern")
			? window.localStorage.getItem("rps-pattern").split(",").map(Number)
			: [];
		if (rpsPattern.length < 1) {
			for (let index = 1; index <= rpsPatternLength; index++) {
				rpsPattern.push(Math.floor(Math.random() * 3) + 1);
			}
		}
	} else {
		rpslsPattern = window.localStorage.getItem("rpsls-pattern")
			? window.localStorage
					.getItem("rpsls-pattern")
					.split(",")
					.map(Number)
			: [];
		if (rpslsPattern.length < 1) {
			for (let index = 1; index <= rpslsPatternLength; index++) {
				rpslsPattern.push(Math.floor(Math.random() * 5) + 1);
			}
		}
	}
};


/**
 * @desc - Updates the array of pattern in ref to its max length
 * @param { number } [userChoice]  - The user choice in its equiv. number.
 * @param { string } [g='rps']     - The game value. Either in rps or rpsls.
 */
const updatePattern = (userChoice, g) => {
	if (g === "rps") {
		if (rpsGameCount !== 0) {
			rpsPattern.shift();
			rpsPattern.push(userChoice);
			window.localStorage.setItem("rps-pattern", rpsPattern);
		}
	} else {
		if (rpslsGameCount !== 0) {
			rpslsPattern.shift();
			rpslsPattern.push(userChoice);
			window.localStorage.setItem("rpsls-pattern", rpslsPattern);
		}
	}
};

/**
 * @desc - Prepares the data from the pattern, train and get its result
 * @param { number } [userChoice]  - The user choice in its equiv. number.
 * @param { string } [g='rps']     - The game value. Either in rps or rpsls.
 */
const brainAnswer = async (userChoice, g) => {
	g === "rps" ? rpsGameCount++ : rpslsGameCount++;
	prepareData(g);
	const trainresult = await brainTrain(userChoice, g);
	return trainresult;
};

// rpsls rules
// 1 loses to 2 or 4
// 2 loses to 3 or 5
// 3 loses to 4 or 1
// 4 loses to 5 or 2
// 5 loses to 1 or 3
/**
 * @desc - Trains NN by LSTM time step using the array of numbers from the user's pattern
 * @param { number } [userChoice]  - The user choice in its equiv. number.
 * @param { string } [g='rps']     - The game value. Either in rps or rpsls.
 */
const brainTrain = (userChoice, g) => {
	return new Promise((resolve) => {
		const net = new brain.recurrent.LSTMTimeStep();
		let max, min, chosenByAI;
		(max = g === "rps" ? 3 : 5), (min = 1);

		g === "rps"
			? net.train([rpsPattern], { iterations: 100, log: false })
			: net.train([rpslsPattern], { iterations: 100, log: false });
		const prediction =
			g === "rps" ? net.run(rpsPattern) : net.run(rpslsPattern);
		const roundedPrediction = Math.round(prediction);
		chosenByAI =
			min <= roundedPrediction && roundedPrediction <= max
				? (roundedPrediction % max) + min
				: min;
		if (g === "rpsls") {
			chosenByAI =
				userChoice == chosenByAI + 1 ? userChoice + 1 : chosenByAI;
		}
		updatePattern(userChoice, g);
		resolve(chosenByAI);
	});
};

document
	.querySelector("nav.rules>button")
	.addEventListener("click", toggleModal.bind(this));

document.querySelector("#game-toggle").addEventListener("click", (e) => {
	const header = document.querySelector("header>div.head__header");
	const logo = header.querySelector("img");
	const main = document.querySelector("main>div.main");
	const controls = main.querySelector("div.controls");
	let newControls = document.createElement("div");

	function toggleGameTo(g, e) {
		logo.class = `logo__${g}`;
		logo.src =
			g === "rpsls" ? "./images/logo-bonus.svg" : "./images/logo.svg";
		main.classList = `main main__${g}`;
		controls.remove();

		newControls.classList = `controls controls__${g}`;
		main.append(newControls);

		const controlList = renderControls(g);
		controlList.forEach((ctrl) => newControls.append(ctrl));

		e.target.textContent = g.toString().toUpperCase();
		e.target.style.color = g === "rpsls" ? "hsl(237, 49%, 15%)" : "white";

		g === "rpsls"
			? (e.target.style["background-position"] = "100%")
			: (e.target.style["background-position"] = "0");
		GAME = g;
		updateScore(null, MODE, g);
	}

	GAME === "rps" ? toggleGameTo("rpsls", e) : toggleGameTo("rps", e);
	createStartEvents(GAME);
});

document.querySelector("#mode-toggle").addEventListener("click", (e) => {
	initialize = true;
	const scoreHeadDiv = document.querySelector(
		"header>div.head__header .score-head"
	);

	function toggleModeTo(m, e) {
		e.target.textContent = m.toString().toUpperCase();
		e.target.style.color = m === "hard" ? "hsl(237, 49%, 15%)" : "white";
		m === "hard"
			? (e.target.style["background-position"] = "100%")
			: (e.target.style["background-position"] = "0%");
		MODE = m;
	}

	if (MODE === "normal") {
		toggleModeTo("hard", e);
		const aiScoreDiv = document.createElement("div");
		const aiScoreSpan = document.createElement("span");
		const aiScoreP = document.createElement("p");
		aiScoreDiv.classList = "ai-score";
		aiScoreSpan.textContent = "THE HOUSE";
		aiScoreP.id = "ai-score";
		const yourScoreHeadings4 = scoreHeadDiv.querySelector(".score h4");
		yourScoreHeadings4.textContent = "YOUR SCORE";
		aiScoreDiv.append(aiScoreSpan);
		aiScoreDiv.append(aiScoreP);
		scoreHeadDiv.append(aiScoreDiv);
		updateScore(null, MODE, GAME);
	} else {
		toggleModeTo("normal", e);
		document.querySelector(".ai-score").remove();
		document.querySelector(".score h4").textContent = "SCORE";
		updateScore(null, MODE, GAME);
	}
});

init();

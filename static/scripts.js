
document.addEventListener('DOMContentLoaded', function () {
    // get the grid container and word list elements
    const gridContainer = document.getElementById('grid-container');
    const wordList = document.getElementById('word-list');
    const win = document.getElementById('win');
    const mainContent = document.getElementById('main-content')


    
    

    // check if gridContainer and wordList are found
    if (!gridContainer || !wordList || !win || !mainContent) {
        console.error('gridContainer, wordList, win or mainContent not found');
        return;
    }

    // render the grid
    function renderGrid() {
        gridContainer.innerHTML = '';
        window.gridData.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const button = document.createElement('input');
                button.type = 'button';
                button.value = cell;
                button.className = 'buttons';
                button.id = `cell-${rowIndex}-${colIndex}`;
                gridContainer.appendChild(button);
            });
        });
    }

    // render the word list with animation
    function renderWordList() {
        wordList.innerHTML = '';
        window.words.forEach((word, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            listItem.style.animationDelay = `${index * 0.3}s`; // Delay animation for each word
            listItem.classList.add('word-item');
            listItem.id = word
            wordList.appendChild(listItem);
            console.log(listItem.id)
        });
    }



        

    // check if two buttons are adjacent
    function isAdjacent(button1, button2) {
        const id1 = button1.id.split('-').slice(1).map(Number);
        const id2 = button2.id.split('-').slice(1).map(Number);
        const rowDiff = Math.abs(id1[0] - id2[0]);
        const colDiff = Math.abs(id1[1] - id2[1]);

        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 1);
    }

    
    let isFirstClick = true;
    let lastClickedButton = null;
    let wordWasFound = false;
    let numberOfWordsFound = 0;
    let clickedButtonsValue = [];
    let clickedButtonsId = [];

    function checkIfWordWasFound(clicked, gameWords){
        if (gameWords.indexOf(clicked) > -1 ) {
            console.log('Você achou a palavra: ', clicked)
            let wordOnList = document.getElementById(clicked)
            wordOnList.classList.add('cross-word')
            wordWasFound = true;
            isFirstClick = true
            numberOfWordsFound += 1
            if (numberOfWordsFound == 8) {
                winGame();
            }
        }
        else {
            wordWasFound = false
        }
    }

    function winGame(){
        win.innerHTML = '';
        mainContent.style.filter = "blur(2px)";
        const popup = document.createElement('p')
        const popupButton = document.createElement('input')
        popup.textContent = 'Você venceu! Parabéns!'
        popupButton.type = 'button'
        popupButton.value = 'Clique aqui para começar um novo jogo!'
        popupButton.id = 'popup-button'
        popup.id = 'pop-up'
        popup.classList.add('pop-up')
        win.appendChild(popup)
        popup.appendChild(popupButton)
        fireworks({
            speed: {min: 1, max:25},
            rate: {min: 10, max:25},
            gravity: {min: 2, max:5},
            sounds: false,
        });
        popupButton.addEventListener('click', function () {
            window.location.reload();
        })
    }

    // add click event listener to each button after the grid is rendered
    function addClickListeners() {
        const buttons = document.querySelectorAll('.buttons');
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                if (isFirstClick) {
                    button.classList.toggle('clicked');
                    lastClickedButton = button;
                    isFirstClick = false;
                    clickedButtonsValue.push(button.value)
                    clickedButtonsId.push(button.id)
                    let searchingWord = clickedButtonsValue.join('')
                    console.log(searchingWord)
                    checkIfWordWasFound(searchingWord, window.words)
                    if (wordWasFound) {
                        clickedButtonsId.forEach(buttonId => {
                            let foundButtons = document.getElementById(buttonId)
                            foundButtons.classList.add('found-word')
                        clickedButtonsValue = [];
                        clickedButtonsId = [];
                    })
                    }
                } else if (lastClickedButton && isAdjacent(lastClickedButton, button)) {
                    button.classList.toggle('clicked');
                    lastClickedButton = button;
                    clickedButtonsValue.push(button.value)
                    clickedButtonsId.push(button.id)
                    let searchingWord = clickedButtonsValue.join('')
                    console.log(searchingWord)
                    checkIfWordWasFound(searchingWord, window.words)
                    if (wordWasFound) {
                        clickedButtonsId.forEach(buttonId => {
                            let foundButtons = document.getElementById(buttonId)
                            foundButtons.classList.add('found-word')
                        clickedButtonsValue = [];
                        clickedButtonsId = [];
                    })
                    }
                } else {
                    clickedButtonsValue = [];
                    clickedButtonsId = [];
                    resetGameState();
                }
            });
        });
    }

    // reset game state
    function resetGameState() {
        document.querySelectorAll('.buttons.clicked').forEach(button => {
            button.classList.remove('clicked');
        });
        wordWasFound = false;
        isFirstClick = true;
        lastClickedButton = null;
    }

    // render the grid and word list
    renderGrid();
    renderWordList();
    addClickListeners();

    // function to animate word list appearance
    function animateWordList() {
        const wordItems = document.querySelectorAll('.word-item');
        wordItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 1}s`;
            item.classList.add('show');
        });
    }

    animateWordList();
});

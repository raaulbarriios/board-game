export class UIView {
    constructor() {
        this.rollDiceBtn = document.getElementById('roll-dice-btn');
        this.diceResult = document.getElementById('dice-result');
        this.currentPlayerDisplay = document.getElementById('current-player-display');
        this.logList = document.getElementById('log-list');
        this.playersContainer = document.getElementById('players-container');
        
        this.newPlayerName = document.getElementById('new-player-name');
        this.newPlayerColor = document.getElementById('new-player-color');
        this.addPlayerBtn = document.getElementById('add-player-btn');
        this.startGameBtn = document.getElementById('start-game-btn');
        
        this.randomizePlayerColor();
    }

    randomizePlayerColor() {
        this.newPlayerColor.value = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }

    bindAddPlayer(handler) {
        this.addPlayerBtn.addEventListener('click', () => {
            const name = this.newPlayerName.value.trim();
            const color = this.newPlayerColor.value;
            if (name) {
                handler(name, color);
                this.newPlayerName.value = '';
                this.randomizePlayerColor();
            }
        });
    }

    bindStartGame(handler) {
        this.startGameBtn.addEventListener('click', () => {
            handler();
        });
    }
    
    bindRollDice(handler) {
        this.rollDiceBtn.addEventListener('click', () => {
            handler();
        });
    }

    updatePlayersList(players) {
        this.playersContainer.innerHTML = '';
        players.forEach(p => {
            const div = document.createElement('div');
            div.className = 'player-list-item';
            div.innerHTML = `
                <div class="player-color-dot" style="background-color: ${p.color}"></div>
                <span>${p.name}</span>
            `;
            this.playersContainer.appendChild(div);
        });
    }

    updateTurnDisplay(player, canRoll) {
        if (player) {
            this.currentPlayerDisplay.textContent = player.name;
            this.currentPlayerDisplay.style.backgroundColor = player.color;
            this.currentPlayerDisplay.style.color = '#fff';
            this.currentPlayerDisplay.style.textShadow = '0 1px 2px rgba(0,0,0,0.5)';
            
            if (canRoll) {
                this.enableDice();
            } else {
                this.disableDice();
            }
        }
    }

    enableDice() {
        this.rollDiceBtn.disabled = false;
        this.diceResult.textContent = '-';
    }

    disableDice() {
        this.rollDiceBtn.disabled = true;
    }

    animateDiceResult(finalValue, callback) {
        this.diceResult.classList.add('rolling');
        let counter = 0;
        const interval = setInterval(() => {
            this.diceResult.textContent = Math.floor(Math.random() * 6) + 1;
            counter++;
            if (counter > 15) {
                clearInterval(interval);
                this.diceResult.classList.remove('rolling');
                this.diceResult.textContent = finalValue;
                if (callback) callback();
            }
        }, 50);
    }

    hideSetupUI() {
        document.querySelector('.add-player-form').style.display = 'none';
        this.startGameBtn.style.display = 'none';
        document.getElementById('event-log').style.display = 'flex';
    }

    logEvent(message) {
        const li = document.createElement('li');
        li.textContent = message;
        this.logList.appendChild(li);
        this.logList.scrollTop = this.logList.scrollHeight;
    }
}

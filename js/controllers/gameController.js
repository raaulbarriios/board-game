import { Player } from '../types/player.js';
import { getSpaceData, BOARD_SIZE } from '../database/boardData.js';

export class GameController {
    constructor(boardView, uiView) {
        this.boardView = boardView;
        this.uiView = uiView;
        
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameState = 'SETUP'; 
        this.currentRoll = 0;
        this.validTargetSpace = 0;

        this.bindEvents();
    }

    bindEvents() {
        this.uiView.bindAddPlayer(this.handleAddPlayer.bind(this));
        this.uiView.bindStartGame(this.handleStartGame.bind(this));
        this.uiView.bindRollDice(this.handleRollDice.bind(this));
    }

    handleAddPlayer(name, color) {
        if (this.gameState !== 'SETUP') return;
        const newPlayer = new Player(this.players.length + 1, name, color);
        this.players.push(newPlayer);
        this.uiView.updatePlayersList(this.players);
        this.uiView.logEvent(`Jugador ${name} añadido.`);
    }

    handleStartGame() {
        if (this.players.length === 0) {
            alert('Añade al menos un jugador para empezar.');
            return;
        }
        this.uiView.hideSetupUI();
        this.boardView.renderBoard();
        
        this.players.forEach(p => {
            p.moveTo(1);
            this.boardView.placeTokenOnSpace(p, 1);
        });

        this.uiView.logEvent('¡Comienza el juego!');
        this.gameState = 'WAITING_ROLL';
        this.startTurn();
    }

    startTurn() {
        const player = this.players[this.currentPlayerIndex];
        
        if (player.decrementSkipTurn()) {
            this.uiView.logEvent(`${player.name} pierde el turno (Quedan ${player.skipTurns}).`);
            this.nextTurn();
            return;
        }

        this.gameState = 'WAITING_ROLL';
        this.uiView.updateTurnDisplay(player, true);
        this.uiView.logEvent(`Turno de ${player.name}. Pulsa Tirar Dado.`);
    }

    handleRollDice() {
        if (this.gameState !== 'WAITING_ROLL') return;
        this.gameState = 'ROLLING';
        
        this.uiView.disableDice();
        this.currentRoll = Math.floor(Math.random() * 6) + 1;
        
        this.uiView.animateDiceResult(this.currentRoll, () => {
            const player = this.players[this.currentPlayerIndex];
            this.uiView.logEvent(`${player.name} ha sacado un ${this.currentRoll}.`);
            
            this.validTargetSpace = player.currentSpace + this.currentRoll;
            
            if (this.validTargetSpace > BOARD_SIZE) {
                const bounce = this.validTargetSpace - BOARD_SIZE;
                this.validTargetSpace = BOARD_SIZE - bounce;
                this.uiView.logEvent('¡Rebote! Tienes que llegar con la puntuación exacta.');
            }

            this.gameState = 'WAITING_MOVE';
            this.uiView.logEvent(`Arrastra tu ficha a la casilla ${this.validTargetSpace}.`);
            
            player.element.setAttribute('draggable', 'true');
            player.element.classList.remove('disabled');
            this.boardView.highlightValidDropZones(this.validTargetSpace);
            
            document.dispatchEvent(new CustomEvent('enableDragDrop', { 
                detail: { 
                    playerId: player.id, 
                    validSpace: this.validTargetSpace 
                } 
            }));
        });
    }

    processValidMove(playerId, spaceIndex) {
        if (this.gameState !== 'WAITING_MOVE') return;
        
        const player = this.players.find(p => p.id === playerId);
        if (!player) return;

        player.element.setAttribute('draggable', 'false');
        this.boardView.highlightValidDropZones(null);

        player.moveTo(spaceIndex);
        this.boardView.placeTokenOnSpace(player, spaceIndex);
        
        this.evaluateSpace(player, spaceIndex);
    }

    evaluateSpace(player, spaceIndex) {
        const spaceData = getSpaceData(spaceIndex);
        if (!spaceData) {
            this.nextTurn();
            return;
        }

        if (spaceIndex === BOARD_SIZE) {
            this.uiView.logEvent(`¡${player.name} HA GANADO EL JUEGO! ${spaceData.actionMessage || ''}`);
            this.gameState = 'GameOver';
            this.uiView.updateTurnDisplay(player, false);
            return;
        }

        if (spaceData.type !== 'normal') {
            this.uiView.logEvent(spaceData.actionMessage);
            
            if (spaceData.targetSpace) {
                this.uiView.logEvent(`Moviendo a la casilla ${spaceData.targetSpace}...`);
                setTimeout(() => {
                    player.moveTo(spaceData.targetSpace);
                    this.boardView.placeTokenOnSpace(player, spaceData.targetSpace);
                    
                    if (spaceData.type === 'oca' || spaceData.type === 'puente') {
                        this.uiView.logEvent('¡Tiras de nuevo!');
                        this.startTurn(); 
                    } else {
                        this.nextTurn();
                    }
                }, 1000);
            } else if (spaceData.skipTurns > 0) {
                player.addSkipTurns(spaceData.skipTurns);
                this.nextTurn();
            } else {
                this.nextTurn();
            }
        } else {
            this.nextTurn();
        }
    }

    nextTurn() {
        if (this.gameState === 'GameOver') return;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.startTurn();
    }
}

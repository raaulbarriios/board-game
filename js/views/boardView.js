import { BOARD_DATA, BOARD_SIZE } from '../database/boardData.js';
import { Space } from '../types/space.js';

export class BoardView {
    constructor() {
        this.boardElement = document.getElementById('game-board');
        this.spaces = [];
    }

    renderBoard() {
        if (!this.boardElement) return;
        this.boardElement.innerHTML = '';
        
        BOARD_DATA.forEach(data => {
            const space = new Space(data);
            this.spaces.push(space);
            const el = space.createDOMElement();
            this.boardElement.appendChild(el);
        });

        this.arrangeSnakePattern();
    }

    arrangeSnakePattern() {
        const cols = 10;
        let row = 7;
        let col = 10;
        let direction = -1;

        for (let i = 0; i < BOARD_SIZE; i++) {
            const spaceEl = document.getElementById(`space-${i + 1}`);
            if (spaceEl) {
                spaceEl.style.gridRow = row;
                spaceEl.style.gridColumn = col;
            }

            col += direction;
            if (col < 1) {
                col = 1;
                row--;
                direction = 1;
            } else if (col > cols) {
                col = cols;
                row--;
                direction = -1;
            }
        }
    }

    placeTokenOnSpace(player, spaceIndex) {
        if (spaceIndex < 1 || spaceIndex > BOARD_SIZE) return;
        const targetContainer = document.getElementById(`tokens-container-${spaceIndex}`);
        if (targetContainer) {
            targetContainer.appendChild(player.createTokenElement());
        }
    }

    highlightValidDropZones(targetSpaceIndex) {
        document.querySelectorAll('.space').forEach(el => {
            el.classList.remove('drop-target');
        });

        if (targetSpaceIndex && targetSpaceIndex <= BOARD_SIZE) {
            const el = document.getElementById(`space-${targetSpaceIndex}`);
            if (el) el.classList.add('drop-target');
        }
    }
}

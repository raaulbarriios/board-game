export class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.currentSpace = 1;
        this.skipTurns = 0;
        this.element = null;
    }

    moveTo(spaceIndex) {
        this.currentSpace = spaceIndex;
    }

    addSkipTurns(turns) {
        this.skipTurns += turns;
    }

    decrementSkipTurn() {
        if (this.skipTurns > 0) {
            this.skipTurns--;
            return true;
        }
        return false;
    }

    createTokenElement() {
        if (!this.element) {
            const token = document.createElement('div');
            token.classList.add('player-token');
            token.id = `token-${this.id}`;
            token.style.backgroundColor = this.color;
            token.style.borderColor = '#ffffff';
            token.title = this.name;
            token.setAttribute('draggable', 'false');
            this.element = token;
        }
        return this.element;
    }
}

export class Space {
    constructor(data) {
        this.index = data.index;
        this.type = data.type;
        this.name = data.name;
        this.actionMessage = data.actionMessage;
        this.targetSpace = data.targetSpace;
        this.skipTurns = data.skipTurns;
    }

    createDOMElement() {
        const spaceDiv = document.createElement('div');
        spaceDiv.classList.add('space');
        if (this.type !== 'normal') {
            spaceDiv.classList.add(this.type);
        }
        spaceDiv.id = `space-${this.index}`;
        spaceDiv.dataset.index = this.index; 

        const numberSpan = document.createElement('span');
        numberSpan.classList.add('space-number');
        numberSpan.textContent = this.index;

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('space-name');
        nameSpan.textContent = this.name !== `Casilla ${this.index}` ? this.name : '';

        const tokensContainer = document.createElement('div');
        tokensContainer.classList.add('tokens-container');
        tokensContainer.id = `tokens-container-${this.index}`;

        spaceDiv.appendChild(numberSpan);
        if (this.type !== 'normal') {
            const iconSpan = document.createElement('div');
            iconSpan.classList.add('space-icon');
            const typeEmojiMap = {
                oca: '🦢', puente: '🌉', posada: '🏨', pozo: '🕳️',
                laberinto: '🌀', carcel: '⛓️', calavera: '💀', meta: '🏆'
            };
            if (typeEmojiMap[this.type]) {
                iconSpan.textContent = typeEmojiMap[this.type];
                spaceDiv.appendChild(iconSpan);
            }
        }

        spaceDiv.appendChild(nameSpan);
        spaceDiv.appendChild(tokensContainer);

        return spaceDiv;
    }
}

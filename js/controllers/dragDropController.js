export class DragDropController {
    constructor(gameController) {
        this.gameController = gameController;
        this.currentPlayerId = null;
        this.validSpace = null;

        this.init();
    }

    init() {
        document.addEventListener('enableDragDrop', (e) => {
            this.currentPlayerId = e.detail.playerId;
            this.validSpace = e.detail.validSpace;
        });

        const boardArea = document.getElementById('game-board');
        if (!boardArea) return;

        boardArea.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('player-token')) {
                const tokenId = parseInt(e.target.id.replace('token-', ''));
                if (tokenId !== this.currentPlayerId) {
                    e.preventDefault();
                    return;
                }
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', `token-${tokenId}`);
            }
        });

        boardArea.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('player-token')) {
                e.target.classList.remove('dragging');
            }
            document.querySelectorAll('.space').forEach(el => el.classList.remove('path-hover'));
        });

        boardArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            if (this.currentPlayerId) {
                const space = e.target.closest('.space');
                if (space) {
                    const spaceIndex = parseInt(space.dataset.index);
                    const player = this.gameController.players.find(p => p.id === this.currentPlayerId);
                    
                    if (player && spaceIndex > player.currentSpace && spaceIndex < this.validSpace) {
                        space.classList.add('path-hover');
                    }
                }
            }
        });

        boardArea.addEventListener('dragleave', (e) => {
            if (this.currentPlayerId) {
                const space = e.target.closest('.space');
                if (space) {
                    space.classList.remove('path-hover');
                }
            }
        });

        boardArea.addEventListener('drop', (e) => {
            e.preventDefault();
            document.querySelectorAll('.space').forEach(el => el.classList.remove('path-hover'));
            
            const data = e.dataTransfer.getData('text/plain');
            
            if (data.startsWith('token-') && this.currentPlayerId) {
                const space = e.target.closest('.space');
                if (!space) return;

                const spaceIndex = parseInt(space.dataset.index);
                const tokenId = parseInt(data.replace('token-', ''));
                
                if (spaceIndex === this.validSpace && tokenId === this.currentPlayerId) {
                    this.gameController.processValidMove(tokenId, spaceIndex);
                    this.currentPlayerId = null;
                    this.validSpace = null;
                }
            }
        });
    }
}

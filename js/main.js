import { BoardView } from './views/boardView.js';
import { UIView } from './views/uiView.js';
import { GameController } from './controllers/gameController.js';
import { DragDropController } from './controllers/dragDropController.js';

document.addEventListener('DOMContentLoaded', () => {
    const boardView = new BoardView();
    const uiView = new UIView();

    const gameController = new GameController(boardView, uiView);
    const dragDropController = new DragDropController(gameController);
});

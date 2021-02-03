import Phaser from "phaser"

export default class BoardScene extends Phaser.Scene {

    constructor() {
        super("boardScene")
    }

    preload() {
        this.load.image("board", "images/board.png");
    }

    create() {
        const x = this.scale.width - this.scale.height/2;
        const y = this.scale.height/2;

        this.tacBoard = this.add.image(x, y, "board");
        const length = this.tacBoard.width;
        this.tacBoard.setScale(this.scale.height/length);

        this.scene.launch("cardScene", {
            boardX : x,
            boardY : y,
            boardLength : length
        });

        this.scene.launch("marbelScene", {
            boardX : x,
            boardY : y,
            boardLength : length
        });
    }
}
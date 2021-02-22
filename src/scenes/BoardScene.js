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
        const length = this.scale.height - 50;

        this.tacBoard = this.add.image(x, y, "board");
        this.tacBoard.setSize(length, length).setDisplaySize(length, length);

        this.scene.launch("cardScene", {
            boardX : x,
            boardY : y,
            boardLength : length,
        });

        this.scene.launch("marbelScene", {
            boardX : x,
            boardY : y,
            boardLength : length
        });
    }
}
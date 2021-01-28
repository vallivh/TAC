import Phaser from "phaser"

export default class BoardScene extends Phaser.Scene {

    constructor() {
        super("board")
    }

    preload() {
        this.load.image("board", "images/board.png");
    }

    create() {
        let x = this.scale.width - this.scale.height/2;
        let y = this.scale.height/2;

        let tacBoard = this.add.image(x, y, "board");
        tacBoard.setScale(this.scale.height/tacBoard.width);
    }
}
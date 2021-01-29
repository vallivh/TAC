import Phaser from "phaser"
import CardScene from "./CardScene";

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

        this.tacBoard = this.add.image(x, y, "board");
        this.tacBoard.setScale(this.scale.height/this.tacBoard.width);

        this.scene.add("cardScene", CardScene, true, {
            boardX : x,
            boardY : y,
            length : this.tacBoard.width});
    }
}
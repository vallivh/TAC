import Phaser from "phaser"

// eslint-disable-next-line no-unused-vars
import Card from "../gameObjects/Card";

export default class CardScene extends Phaser.Scene {

    constructor() {
        super({ key: "card", active: true });
    }

    preload() {
        this.load.image("acht", "images/cards/acht.png");
        this.load.atlas("eight", "images/cards/eight.png", "images/cards/eight.json");
    }

    create(data) {
        let x = this.scale.width - this.scale.height/2;
        let y = this.scale.height/2;
        let centerCircle = this.scale.height * 0.14;

        let graphics = this.add.graphics();

        let cardZone = this.add.zone(data.boardX, data.boardY).setCircleDropZone(centerCircle);
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeCircle(cardZone.x, cardZone.y, cardZone.input.hitArea.radius);

        //let eight = this.add.card(x - 700, y - 200, "acht");
        let eight = this.add.sprite(x - 700, y - 200, "eight", "front");
        eight.setInteractive().setScale(0.23);
        this.input.setDraggable(eight);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            //gameObject.input.enabled = false;
        });

        this.input.on("gameobjectup", function (pointer, gameObject) {
            let frameName = eight.frame.name === "back" ? "front" : "back";
            this.tweens.add({
                targets: gameObject,
                scaleX: 0,
                scaleY : 0.25,
                angle : 5,
                duration : 150,
                yoyo : true,
                onYoyo : function () {
                    gameObject.setFrame(frameName);
                },
            });

        }, this)
    }
}
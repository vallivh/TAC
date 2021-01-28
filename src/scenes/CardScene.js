import Phaser from "phaser"

export default class CardScene extends Phaser.Scene {

    constructor() {
        super({ key: "card", active: true });
    }

    preload() {
        this.load.image("acht", "images/cards/acht.png");
    }

    create() {
        let x = this.scale.width - this.scale.height/2;
        let y = this.scale.height/2;
        let centerCircle = this.scale.height * 0.14;

        let graphics = this.add.graphics();

        let cardZone = this.add.zone(x, y).setCircleDropZone(centerCircle);
        cardZone.setName("cardzone");
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeCircle(cardZone.x, cardZone.y, cardZone.input.hitArea.radius);

        let eight = this.add.card(x - 700, y - 200, "acht");

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            gameObject.input.enabled = false;
        });
    }
}
import Phaser from "phaser"

import Card from "../gameObjects/Card";

export default class MarbelScene extends Phaser.Scene {

    constructor() {
        super("marbelScene");
    }

    preload() {
        this.load.image("red", "images/marbels/plain/red.png");
        this.load.image("green", "images/marbels/plain/green.png");
        this.load.image("black", "images/marbels/plain/black.png");
        this.load.image("blue", "images/marbels/plain/blue.png");
    }

    create(data) {

        // const settings = this.sys.game.settings;
        let graphics = this.add.graphics();

        const boardX = data.boardX;
        const boardY = data.boardY;

        // create 4 pockets in the corners of the board
        let pockets = [];
        let pocketDistance = data.boardLength * 0.595;
        let pocketRadius = data.boardLength * 0.06;

        for (let i = 0; i < 4; i++) {
            let angle = 90 * i + 45;
            let radian = Math.PI / 180 * angle;
            let x = pocketDistance * Math.cos(radian) + boardX;
            let y = pocketDistance * Math.sin(radian) + boardY;

            pockets[i] = this.add.zone(x, y).setCircleDropZone(pocketRadius).setName(i);
        }

        // create 64 fields around the ring of the board
        let fields = this.add.container();
        const fieldDistance = data.boardLength * 0.451;
        const fieldRadius = data.boardLength * 0.018;

        for (let j = 0; j < 64; j++) {
            let angle = 360/64 * j + 90;
            let radian = Math.PI / 180 * angle;
            let x = fieldDistance * Math.cos(radian) + boardX;
            let y = fieldDistance * Math.sin(radian) + boardY;

            fields.add(this.add.zone(x, y).setCircleDropZone(fieldRadius).setName(j).disableInteractive());
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeCircle(x, y, fieldRadius);
        }

        // create 4 marbels per pocket, different color for each pocket
        let colors = ["red", "green", "black", "blue"];

        for (let m = 0; m < 4; m++) {
            for (let n = 0; n < 4; n++) {
                let angle = 90 * n + 45;
                let radian = Math.PI / 180 * angle;
                let x = pocketRadius * 0.55 * Math.cos(radian) + pockets[m].x;
                let y = pocketRadius * 0.55 * Math.sin(radian) + pockets[m].y;

                let marbel = this.add.image(x, y, colors[m]);
                marbel.setDisplaySize(fieldRadius * 2, fieldRadius * 2).setInteractive();
                this.input.setDraggable(marbel);
            }
        }

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            if (!(gameObject instanceof Card)) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });

        this.input.on('dragenter', function (pointer, gameObject, dropZone) {
            if (!(gameObject instanceof Card)) {
                graphics.lineStyle(2, 0x00ffff);
                graphics.strokeCircle(dropZone.x, dropZone.y, dropZone.input.hitArea.radius);
            }
        });

        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            if (!(gameObject instanceof Card)) {
                graphics.lineStyle(2, 0xffff00);
                graphics.strokeCircle(dropZone.x, dropZone.y, dropZone.input.hitArea.radius);
            }
        });

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            if (!(gameObject instanceof Card)) {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                graphics.lineStyle(2, 0x00ffff);
                graphics.strokeCircle(dropZone.x, dropZone.y, dropZone.input.hitArea.radius);
                //gameObject.input.enabled = false;
            }
        });

        this.input.on("gameobjectout", function (pointer, gameObject) {
            gameObject.clearTint();
        });
    }
}
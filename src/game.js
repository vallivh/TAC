import Phaser from 'phaser'

import BoardScene from "./scenes/BoardScene";

const config = {
    type: Phaser.AUTO,
    backgroundColor: 0xEEEEEE,
    scale : {
        mode : Phaser.Scale.FIT,
        autoCenter : Phaser.Scale.CENTER_HORIZONTALLY,
        width: 2000,
        height: 1200,
    },
    scene: [BoardScene]
};

let game = new Phaser.Game(config)

let graphics;

function preload()
{
    this.load.image("red", "images/marbels/plain/red.png");
    this.load.image("green", "images/marbels/plain/green.png");
    this.load.image("black", "images/marbels/plain/black.png");
    this.load.image("blue", "images/marbels/plain/blue.png");
}

function create()
{
    graphics = this.add.graphics();

    let tacBoardDistance ={
        center : tacBoard.height * 0.13,
        pocket : tacBoard.height * 0.595,
        field : tacBoard.height * 0.45,
    };

    let pockets = [];
    let fields = [];
    let colors = ["red", "green", "black", "blue"];

    for (let i = 0; i < 4; i++) {
        let angle = 90 * i + 45;
        let radian = Math.PI / 180 * angle;
        let x = tacBoardDistance.pocket * Math.cos(radian) + tacBoard.x;
        let y = tacBoardDistance.pocket * Math.sin(radian) + tacBoard.y;

        pockets[i] = this.add.zone(x, y).setCircleDropZone(squareLength * 0.05).setName(i);
    }

    for (let j = 0; j < 64; j++) {
        let angle = 360/64 * j + 90;
        let radian = Math.PI / 180 * angle;
        let x = tacBoardDistance.field * Math.cos(radian) + tacBoard.x;
        let y = tacBoardDistance.field * Math.sin(radian) + tacBoard.y;

        fields[j] = this.add.zone(x, y).setCircleDropZone(squareLength * 0.019).setName(j);
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeCircle(fields[j].x, fields[j].y, fields[j].input.hitArea.radius);
    }

    for (let m = 0; m < 4; m++) {
        for (let n = 0; n < 4; n++) {
            let angle = 90 * n + 45;
            let radian = Math.PI / 180 * angle;
            let x = pockets[m].input.hitArea.radius * 0.6 * Math.cos(radian) + pockets[m].x;
            let y = pockets[m].input.hitArea.radius * 0.6 * Math.sin(radian) + pockets[m].y;

            let marbel = this.add.image(x, y, colors[m]);
            marbel.setDisplaySize(squareLength * 0.038, squareLength * 0.038).setInteractive();
            this.input.setDraggable(marbel);
        }
    }

    this.input.on('dragenter', function (pointer, gameObject, dropZone) {
        if (dropZone.name === "cardzone" && gameObject instanceof Card) {
            graphics.lineStyle(2, 0x00ffff);
            graphics.strokeCircle(dropZone.x, dropZone.y, dropZone.input.hitArea.radius);
        }
    });

    this.input.on('dragleave', function (pointer, gameObject, dropZone) {
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeCircle(dropZone.x, dropZone.y, dropZone.input.hitArea.radius);
    });

    this.input.on('drop', function (pointer, gameObject, dropZone) {
        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeCircle(dropZone.x, dropZone.y, dropZone.input.hitArea.radius);
        //gameObject.input.enabled = false;
    });
}

function update()
{
    /*this.input.on("gameobjectover", function (pointer, gameObject) {
        gameObject.setTint(0xd1d5d6);
    });*/

    this.input.on("gameobjectout", function (pointer, gameObject) {
        gameObject.clearTint();
    });

    /*this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });*/

    this.input.on("dragend", function (pointer, gameObject, dropped) {
        if (!dropped) {
        }
        gameObject.clearTint();
    });
}
import Phaser from "phaser"

// eslint-disable-next-line no-unused-vars
import Card from "../gameObjects/Card";

export default class CardScene extends Phaser.Scene {

    constructor() {
        super("cardScene");
    }

    preload() {
        this.load.atlas("cards", "images/cards.png", "images/cards.json");
    }

    create(data) {

        const settings = this.sys.game.settings;
        let graphics = this.add.graphics();

        // get center coordinates of the board (from BoardScene)
        let boardX = data.boardX;
        let boardY = data.boardY;
        let cardZoneRadius = data.boardLength * 0.16;

        // create a dropzone in the center of the board
        this.add.zone(boardX, boardY).setCircleDropZone(cardZoneRadius);
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeCircle(boardX, boardY, cardZoneRadius);

        // for all card types create a single card each and put it on a "deck" (exclude "back")
        let cardTypes = this.textures.get("cards").getFrameNames();
        cardTypes = cardTypes.filter(frame => frame !== "back");

        let deckX = boardX - 750;
        let deckY = boardY - 200;

        for (let cardType of cardTypes) {
            for (let i = 0; i < settings.cardCount[cardType]; i++) {
                this.add.card(deckX, deckY, cardType);
                deckX += 0.25;
                deckY += 0.25;
            }
        }

        // pointer has to move a bit to register a drag
        this.input.dragDistanceThreshold = 3;

        // on dragstart, bring the card to the top
        this.input.on('dragstart', function (pointer, gameObject) {
            this.children.bringToTop(gameObject);
        }, this);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        // when inside the dropzone, snap card to center of dropzone and disable
        this.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            this.flipCard (gameObject);
            gameObject.dropped = true;
        }, this);


        // flip card on double tap/click
        let lastTime = 0;

        this.input.on("gameobjectup", function (pointer, gameObject) {
            let clickDelay = this.time.now - lastTime;
            lastTime = this.time.now;
            if(clickDelay < 350 && !gameObject.dropped) {
                this.flipCard (gameObject);
            }
        }, this)
    }

    // reusable function to animate flipping a card
    flipCard (gameObject) {
        this.tweens.add({
            targets: gameObject,
            scaleX: 0,
            scaleY : 0.52,
            angle : gameObject.angle + 5,
            duration : 150,
            yoyo : true,
            onYoyo : function () {
                let frameName = gameObject.frame.name === "back" ? gameObject.name : "back";
                gameObject.setFrame(frameName);
            },
        });
    }
}
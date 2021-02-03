import Phaser from 'phaser'

import BoardScene from "./scenes/BoardScene";
import Settings from "./Settings";
import CardScene from "./scenes/CardScene";
import MarbelScene from "./scenes/MarbelScene";

const config = {
    type: Phaser.AUTO,
    backgroundColor: 0xEEEEEE,
    scale : {
        mode : Phaser.Scale.FIT,
        autoCenter : Phaser.Scale.CENTER_HORIZONTALLY,
        width: 2000,
        height: 1200,
    },
    scene: [BoardScene, CardScene, MarbelScene]
};

class Tac extends Phaser.Game {
    constructor(config) {
        super(config);

        this.settings = new Settings();
    }
}

window.tac = new Tac(config);
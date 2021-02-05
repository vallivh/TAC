import Phaser from 'phaser'

import { Client } from 'boardgame.io/client';
import { Tac } from './Game';

import BoardScene from "./scenes/BoardScene";
import Settings from "./Settings";
import CardScene from "./scenes/CardScene";
import MarbelScene from "./scenes/MarbelScene";

export const config = {
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

class TacUI extends Phaser.Game {
    constructor(config) {
        super(config);

        this.settings = new Settings();
    }
}

class TacClient {
    constructor() {
        this.client = Client({
            game: Tac,
            numPlayers : 4,
        });
        this.client.start();
        this.tac = new TacUI(config);
        this.attachListeners();
        this.client.subscribe(state => this.update(state));
    }

    attachListeners() {
        this.tac.events.on("card_dropped", this.client.moves["playCard"]);
    }

    update(state) {
        let emit = (event, args) => this.tac.events.emit(event, args);
        if (state.G.deck.length === 103) {
            emit("new_deck", state.G.deck);
        }
    }
}

const app = new TacClient();
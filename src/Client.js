import Phaser from 'phaser'

import { Client } from 'boardgame.io/client';
import { Tac } from './Game';

import BoardScene from "./scenes/BoardScene";
import CardScene from "./scenes/CardScene";
import MarbelScene from "./scenes/MarbelScene";

export const config = {
    type: Phaser.AUTO,
    backgroundColor: 0xEEEEEE,
    scale : {
        mode : Phaser.Scale.FIT,
        // autoCenter : Phaser.Scale.CENTER_HORIZONTALLY,
        width: 2000,
        height: 1300,
    },
    scene: [BoardScene, CardScene, MarbelScene]
};

class TacUI extends Phaser.Game {
    constructor(config, playerID) {
        super(config);
        this.playerID = playerID;
    }
}

class TacClient {
    constructor() {
        this.client = Client({
            game: Tac,
            numPlayers : 4,
        });
        this.tac = new TacUI(config, 0);
        this.client.start();
        this.attachListeners();
        this.client.subscribe(state => this.update(state));
    }

    attachListeners() {
        this.tac.events.on("card_played", (card) => this.client.moves.playCard(card));
    }

    update(state) {
        let emit = (event, args) => this.tac.events.emit(event, args);
        if (state.ctx.phase === "exchanging") {
            emit("new_deck", state.G.deck);
        }
    }
}

export const tacClient = new TacClient();
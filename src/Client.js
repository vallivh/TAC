import Phaser from 'phaser'

import { Client } from 'boardgame.io/client';
import { SocketIO } from "boardgame.io/multiplayer";
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
    constructor({ playerID } = {}) {
        this.client = Client({
            game: Tac,
            numPlayers : 4,
            multiplayer: SocketIO({server: "localhost:80"}),
            playerID,
        });
        this.tac = new TacUI(config, playerID);
        this.client.start();
        this.attachListeners();
        this.client.subscribe(state => this.update(state));
    }

    attachListeners() {
        this.tac.events.on("card_played", (card) => this.client.moves.playCard(card));
    }

    update(state) {
        if (state === null) return;

        let emit = (event, args) => this.tac.events.emit(event, args);
        if (state.G.deck.length === 83) {
            emit("new_deck", state.G.deck);
        }
    }
}

let playerID = prompt("Which player do you want to be?", "0");

export const tacClient = new TacClient({ playerID });
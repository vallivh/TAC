export default class Settings {

    constructor() {
        this._master = true;
        this._players = 4;
        this._teams = 2;
        this._fields = 64;
        this._cardCount = {};
        this.setCardCount(this.master, this.players);
    }

    get master() {
        return this._master;
    }

    set master(bool) {
        this._master = bool;
        this.setCardCount(this.master, this.players);
    }

    get players() {
        return this._players;
    }

    set players(count) {
        switch (count) {
            case 4:
                this._fields = 64;
                break;
            case 6:
                this._fields = 66;
                break;
            default:
                throw `player count ${count} not allowed`;
        }
        this._players = count;
        this.setCardCount(this.master, this.players);
    }


    get cardCount() {
        return this._cardCount;
    }

    setCardCount(master, players) {
        this._cardCount = {
            "eins" : 9,
            "zwei" : 7,
            "drei" : 7,
            "vier" : 7,
            "fünf" : 7,
            "sechs" : 7,
            "sieben" : 8,
            "acht" : 7,
            "neun" : (players === 6 && !master) ? 6 : 7,
            "zehn" : (players === 6 && !master) ? 6 : 7,
            "zwölf" : (players === 6) ? 5 : 7,
            "dreizehn" : 9,
            "trickser" : 7,
            "tac" : 4,
            "narr" : master ? 1 : 0,
            "engel" : master ? 1 : 0,
            "krieger" : master ? 1 : 0,
            "teufel" : master ? 1 : 0,
        };
    }
}
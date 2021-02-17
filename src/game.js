import { INVALID_MOVE } from 'boardgame.io/core';

export const Tac = {
    setup: (ctx) => ({
        players: createPlayers(ctx),
        deck: createDeck(ctx, true),
        fields: Array(64).fill(null),
        currentDraw: 0,
        drawOrder: createDealer(ctx, true),
    }),

    turn: {
    },

    phases: {

        exchanging: {
            start: true,
            next: "playing",

            onBegin: (G, ctx) => {
                if (G.deck.length === 0) {
                    G.deck = createDeck(ctx, true);
                }
                for (let i = 0; i < G.drawOrder[G.currentDraw]; i++) {
                    for (let player in G.players) {
                        drawCard(G, ctx, player);
                        announce(G, ctx, player);
                    }
                }
                G.currentDraw = (G.currentDraw + 1) % (G.drawOrder.length);
            },

            moves: {
                dropCard: (G, ctx, card) => {
                    let exCard = playCard(G, ctx, card);
                    if (exCard !== "INVALID_MOVE") {
                        G.players[ctx.currentPlayer].exchangeCard = exCard;
                        ctx.events.endTurn();
                    }
                },
                pickUpCard: (G, ctx) => {
                    let player = G.players[ctx.currentPlayer];
                    let partner = G.players[player.partner];

                    if (partner.exchangeCard == null) {
                        return INVALID_MOVE;
                    }

                    let card = partner.exchangeCard;
                    player.hand.push(card);
                    partner.exchangeCard = null;
                    ctx.events.endTurn();
                },
                drawCard,
                announce,
            },
        },

        playing: {
            moves: {
                playCard,
            },
            next: "exchanging",
        }
    },
};

function createDeck (ctx, master) {
    let players = ctx.numPlayers;
    let cardCounts = {
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
    let deck = [];
    for (let cardType in cardCounts) {
        for (let i = 0; i < cardCounts[cardType]; i++) {
            deck.push(cardType);
        }
    }
    return ctx.random.Shuffle(deck);
}

function createDealer (ctx, master) {
    let drawOrder;
    switch (ctx.numPlayers) {
        case 4:
            drawOrder = master ? [5,5,5,5,6] : [5,5,5,5,5];
            break;
        case 6:
            drawOrder = master ? [6,5,6] : [5,5,6];
            break;
    }
    return drawOrder;
}

function createPlayers (ctx) {
    const players = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        players.push({
            can: false,
            exchangeCard: null, //"test" + i,
            partner: (i + 2) % ctx.numPlayers,
            hand: [],
            marbels: createMarbels(i),
        })
    }
    return players;
}

function createMarbels (i) {
    const marbels = [];
    for (let j = 0; j < 4; j++) {
        marbels.push({
            id: i * 4 + j,
            state: "pocket",
        })
    }
    return marbels;
}

function drawCard (G, ctx, player) {
    const card = G.deck.pop();
    const dealTo = player ? player : ctx.currentPlayer;
    G.players[dealTo].hand.push(card);
}

function announce (G, ctx, player) {
    const announceFor = player ? player : ctx.currentPlayer;
    let currentPlayer = G.players[announceFor]
    currentPlayer.can = currentPlayer.hand.some(card => card === "eins" || card === "dreizehn")
}

function playCard (G, ctx, card) {
    let hand = G.players[ctx.currentPlayer].hand;
    if ( !(hand.includes(card)) ) {
        return INVALID_MOVE;
    }
    let index = hand.indexOf(card);
    if ( index >= 0 ) {
        hand.splice( index, 1 );
    }
    return card;
}
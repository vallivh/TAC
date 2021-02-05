import { INVALID_MOVE } from 'boardgame.io/core';

export const Tac = {
    setup: (ctx) => ({
        hands: Array(ctx.numPlayers).fill([]),
        marbels: Array(ctx.numPlayers).fill(Array(4).fill({state: "pocket"})),
        deck: createDeck(ctx, true),
        fields: Array(64).fill(null),
    }),

    turn: {
    },

    phases: {
        exchanging: {
            onBegin: (G, ctx) => {
                for (let i = 0; i < 5; i++) {
                    drawCard(G, ctx);
                }
            },
            moves: {
                drawCard,
                announce: (G, ctx) => {
                    let hand = G.hands[ctx.currentPlayer]
                    hand.some(card => card === "eins" || card === "dreizehn")
                }
            },
            start: true,
            next: "playing",
        },
        playing: {
            moves: {
                playCard: (G, ctx, card) => {
                    let hand = G.hands[ctx.currentPlayer]
                    if ( !(hand.includes(card)) ) {
                        return INVALID_MOVE;
                    }
                    let index = hand.indexOf(card);
                    if ( index >= 0 ) {
                        hand.splice( index, 1 );
                    }
                }
            }
        }
    },
};

function createDeck(ctx, master) {
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

function drawCard(G, ctx) {
    let card = G.deck.pop();
    G.hands[ctx.currentPlayer].push(card);
    ctx.events.endTurn();
}
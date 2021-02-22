// eslint-disable-next-line no-undef
const { Server } = require('boardgame.io/server');
// eslint-disable-next-line no-undef
const { Tac } = require('./Game');

const server = Server({ games: [Tac] });

server.run(80);
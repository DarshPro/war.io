var application_root = __dirname,
    express = require("express"),
    path = require("path")

var app = module.exports = express();
var server = app.listen(6969);
var io = require('socket.io').listen(server);
//removes debug logs
io.set('log level', 1);

//config 
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.static(__dirname + '/public'));
});


//console color
var colors = require('colors');
colors.setTheme({
  error: 'red',
  api: 'cyan',
  success: 'green',
  info: 'yellow',
  debug: 'grey'
});

//database
var db = require('./db')(app);

//load packages
require('./daos')(app);
require('./front')(app);
require('./services')(app);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.on('close', db.close); // Close open DB connection when server exits


//get the game engine
eval(require('fs').readFileSync('./public/js/game/engine/engine.js', 'utf8'));


var games = [];

io.sockets.on('connection', function (socket) {

  socket.emit('askUserData', null);

  socket.on('userData', function (data) {
    dispatchPlayer(socket, data.playerId);
  });

  socket.on('disconnect', function() {
      for (var i in games) {
        var n = games[i].sockets.indexOf(socket);
        if(n >= 0) {
          games[i].sockets[n] = null;
          break;
        }
      }

  });

});

function startGame(game) {
  engineManager.createNewGame(game.map, game.players);

  var gameInfo = {};
  gameInfo.map = game.map;
  gameInfo.players = game.players;
  
  for (var i in game.players) {
    gameInfo.myArmy = game.players[i].o;
    if(game.sockets[i] != null) {
      game.sockets[i].emit('gameStart', gameInfo);  
    }
  }

  setInterval(function () {

    gameLoop.update();
    var gameData = {};
    gameData.players = gameLogic.players;
    gameData.gameElements = gameLogic.gameElements;
    for (var i in game.players) {
      if(game.sockets[i] != null) {
        game.sockets[i].emit('gameData', gameData);
      }
    }

  }, 1000 / gameLoop.FREQUENCY);

  for (var i in game.players) {
    if(game.sockets[i] != null) {
      game.sockets[i].on('order', function (data) {
        order.dispatchReceivedOrder(data[0], data[1]);
      });
    }
  }

  game.hasStarted = true;
}

function dispatchPlayer (socket, playerId) {
  for (var i in games) {
    for (var j in games[i].players) {
      if(games[i].players[j].pid == playerId) {
        games[i].sockets[j] = socket;
        if(games[i].hasStarted) {
          var gameInfo = {};
          gameInfo.map = games[i].map;
          gameInfo.players = games[i].players;
          gameInfo.myArmy = games[i].players[j].o;
          socket.emit('gameStart', gameInfo);
          socket.on('order', function (data) {
            order.dispatchReceivedOrder(data[0], data[1]);
          });
        }
        return;
      }
    }
  }

  //no room available, create a new one
  if (games.length == 0 || games[games.length - 1].players.length == games[games.length - 1].nbPlayers) {
    createNewGame();
  }

  addPlayerToGame(socket, games[games.length - 1], playerId);
}

function createNewGame () {
  var game = {};
  game.id = Math.random();
  game.nbPlayers = 2;
  game.players = [];
  game.sockets = [];
  var map = new gameData.Map(gameData.MAP_TYPES.random,
                    gameData.MAP_SIZES.small,
                    gameData.VEGETATION_TYPES.standard,
                    gameData.INITIAL_RESOURCES.standard);
  game.map = map;
  games.push(game);
}

function addPlayerToGame(socket, game, playerId) {
  var player = new gameData.Player(playerId, game.players.length, 0);

  game.players.push(player);

  game.sockets.push(socket);

  if (game.players.length == game.nbPlayers) {
    startGame(game);
  }
}
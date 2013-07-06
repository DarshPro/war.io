// init player's info
$('input', '#playerName').val(gameManager.getPlayerName());
$('input', '#playerName').change(function () {
	gameManager.updatePlayerName($(this).val());
});
$('input', '#playerName').click(function () {
	$(this).select();
});
$('input', '#playerName').keydown(function (e) {
	if (e.which == 13) {
		$(this).blur();
	}
});
gameManager.playerId = gameManager.getPlayerId();
gameManager.playerName = gameManager.getPlayerName();

// center main buttons
centerElement($('#mainButtons'));

// init the sound manager
soundManager.init();

// init music button
if(utils.readCookie('rts_music_enabled') == 'true') {
	gameManager.musicEnabled = true;
	$('#music').addClass('musicEnabled').html('On');
	soundManager.playMusic();
}
$('#music').click(function () {
	gameManager.musicEnabled = !gameManager.musicEnabled;
	if(!gameManager.musicEnabled) {
		$('#music').removeClass('musicEnabled').html('Off');
		soundManager.stopMusic();
	} else {
		$('#music').addClass('musicEnabled').html('On');
		soundManager.playMusic();
	}
	utils.createCookie('rts_music_enabled', gameManager.musicEnabled);
});

// init armies buttons
initArmyButtons();
$('div', '#armies').first().addClass('checked');

// init map configurations
initMapSizes();
initVegetations();
initMapInitialResources();
initVictoryConditions();
$('.description', '#tabVictory').html(gameData.VICTORY_CONDITIONS.annihilation.description);
$('#vc1').change(function () {
	$('.description', '#tabVictory').html(gameData.VICTORY_CONDITIONS[Object.keys(gameData.VICTORY_CONDITIONS)[$(this).val()]].description);
});

// init players choosers
initPlayers();
$('.customRadio', '#players').click(function () {
	if ($(this).attr('data-value') == 1) {
		// if AI player, show armies selector
		$('.aiArmy', $(this).parent()).removeClass('hide');
	} else {
		$('.aiArmy', $(this).parent()).addClass('hide');
	}
});
$('#nbPlayers').change(function () {
	updatePlayers($(this).val());
});

// check if webGL is supported
if (!isWebGLEnabled()) {
	// Browser has no idea what WebGL is. Suggest they
	// get a new browser by presenting the user with link to
	// http://get.webgl.org
	$('#errorWebGL').modal('show');
}

// preload necessary image files
preloadImages();

// cancel buttons
$('.cancelButton').click(function () {
	soundManager.playSound(soundManager.SOUNDS_LIST.mainButton);
	$('.modal').modal('hide');
});

// open new game dialog
$('#createGameButton').click(function () {
	soundManager.playSound(soundManager.SOUNDS_LIST.mainButton);
	$('#newGame').modal('show');
});

// tutorial button
$('#tutorialButton').click(function () {
	soundManager.playSound(soundManager.SOUNDS_LIST.mainButton);
	$(this).unbind('click');
	showLoadingScreen('Loading');

	var armyId = parseInt($('.checked', '#armies').attr('data-army'));
	var mapType = gameData.MAP_TYPES.random.id;
	var mapSize = gameData.MAP_SIZES.small.id;
	var initialResources = gameData.INITIAL_RESOURCES.standard.id;
	var vegetation = gameData.VEGETATION_TYPES.standard.id;
	var victoryCondition = $('#vc1').val();
	var nbPlayers = 2;
	var aiPlayers = [gameData.RACES.tomatoes.id];
	var game = gameManager.createGameObject(gameManager.playerId, gameManager.playerName, armyId, mapType, 
								  				mapSize, initialResources, vegetation, victoryCondition, nbPlayers, aiPlayers);
 
	// launch tutorial
	gameManager.startOfflineGame(game);

	removeWebsiteDom();
});

// create new game !
$('#confirmGameCreation').click(function () {
	soundManager.playSound(soundManager.SOUNDS_LIST.mainButton);
	$(this).unbind('click');
	$('.modal').modal('hide');
	showLoadingScreen('Waiting for opponents');
	
	var armyId = parseInt($('.checked', '#armies').attr('data-army'));
	var mapType = gameData.MAP_TYPES.random.id;
	var mapSize = $('#mapSize').val();
	var initialResources = $('#initialResources').val();
	var vegetation = $('#vegetation').val();
	var victoryCondition = $('#vc1').val();
	var nbPlayers = $('#nbPlayers').val();
	var aiPlayers = [];
	$.each($('.player', '#players'), function () {
		if (!$(this).hasClass('hideI') && $('.checked', this).attr('data-value') == 1) {
			aiPlayers.push($('.aiArmy', $(this)).val());
		}
	});
	var game = gameManager.createGameObject(gameManager.playerId, gameManager.playerName, armyId, mapType, 
								  				mapSize, initialResources, vegetation, victoryCondition, nbPlayers, aiPlayers);

	if (nbPlayers - 1 == aiPlayers.length) {
		// only AI opponents : play offline
		gameManager.startOfflineGame(game);
	} else {
		socketManager.createNewGame(game);	
	}

	removeWebsiteDom();
});

// enter salon
$('#joinGameButton').click(function () {
	soundManager.playSound(soundManager.SOUNDS_LIST.mainButton);
	$('#joinGame').modal('show');
	$('.noResult', '#joinGame').removeClass('hide');
	$('table', '#joinGame').addClass('hide');
	socketManager.enterSalon();
});

// leave salon
$('#joinGame').on('hidden', function () {
	socketManager.leaveSalon();
})


function initArmyButtons () {
	for (var i in gameData.RACES) {
		var army = gameData.RACES[i];
		$('#armies').append('<div class="customRadio" data-name="armies" data-army="' + army.id + '">' + army.name + '</div>');
	}
}

function initMapSizes () {
	for (var i in gameData.MAP_SIZES) {
		var mapSize = gameData.MAP_SIZES[i];
		$('#mapSize').append('<option value="' + mapSize.id + '" ' + (i == 'medium' ? 'selected' : '') + '>'
			+ mapSize.name + '</option>');
	}
}

function initVegetations () {
	for (var i in gameData.VEGETATION_TYPES) {
		var vegetation = gameData.VEGETATION_TYPES[i];
		$('#vegetation').append('<option value="' + vegetation.id + '" ' + (i == 'standard' ? 'selected' : '') + '>'
			+ vegetation.name + '</option>');
	}
}

function initMapInitialResources () {
	for (var i in gameData.INITIAL_RESOURCES) {
		var initialResources = gameData.INITIAL_RESOURCES[i];
		$('#initialResources').append('<option value="' + initialResources.id + '" ' + (i == 'standard' ? 'selected' : '') + '>'
			+ initialResources.name + '</option>');
	}
}

function initVictoryConditions () {
	for (var i in gameData.VICTORY_CONDITIONS) {
		var vc = gameData.VICTORY_CONDITIONS[i];
		$('#vc1').append('<option value="' + vc.id + '" ' + (i == 'annihilation' ? 'selected' : '') + '>'
			+ vc.name + '</option>');
	}
}

function preloadImages() {
	var images = new Array();
	function preload() {

		for (i = 0; i < preload.arguments.length; i++) {
			images[i] = new Image()
			images[i].src = preload.arguments[i]
			$('#imagesPreload').append(images[i]);
		}
	}
	preload(
		GUI.IMAGES_PATH + 'sprite.png',
		GUI.IMAGES_PATH + 'cursor.png',
		GUI.IMAGES_PATH + 'cursor_hover.png',
		GUI.IMAGES_PATH + 'cursor_attack.png'
	)
}

function isWebGLEnabled() {
	try { 
		return !! window.WebGLRenderingContext && !! document.createElement('canvas').getContext('experimental-webgl');
	} catch(e) { 
		return false; 
	}
}

function centerElement(element) {
	element.css('top', (window.innerHeight - element.height()) / 2);
	element.css('left', (window.innerWidth - element.width()) / 2);
}


function removeWebsiteDom() {
	$('#website').remove();
}

function showLoadingScreen(text) {
	$('#labelLoading').html(text);
	$('#loadingScreen').removeClass('hide');
	$('#loadingProgress').css('left', (window.innerWidth - $('#loadingProgress').width()) / 2);
}

function initPlayers() {
	// AI armies selector
	var armies = '';
	for (var i in gameData.RACES) {
		var army = gameData.RACES[i];
		armies += '<option value="' + army.id + '">' + army.name + '</option>';
	}

	for (var i = 0; i < 6; i++) {
		if (i > 0) {
			$('#players').append('<div class="player ' + (i > 3 ? 'hideI' : '') + '">Player ' + (i+1) + '<div class="customRadio checked" data-name="player' + i + '" data-value="0">Human</div>'
			 + '<div class="customRadio" data-name="player' + i + '" data-value="1">AI</div><select class="aiArmy hide">' + armies + '</select></div>');
		} else {
			$('#players').append('<div class="player">Player 1<div class="checked">Me</div></div>');
		}
	}
}

function updatePlayers(nbPlayers) {
	for (var i = 1; i < 7; i++) {
		if (i <= nbPlayers) {
			$('.player:nth-child(' + i + ')', '#players').removeClass('hideI');
		} else {
			$('.player:nth-child(' + i + ')', '#players').addClass('hideI');
		}
	}
	$('#newGame').css({
		background: '#3b423c', /* Old browsers */
	    background: '-moz-radial-gradient(center, ellipse cover, #3b423c 1%, #000000 100%)', /* FF3.6+ */
	    background: '-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(1%,#3b423c), color-stop(100%,#000000))', /* Chrome,Safari4+ */
	    background: '-webkit-radial-gradient(center, ellipse cover, #3b423c 1%,#000000 100%)' /* Chrome10+,Safari5.1+ */
	});
}

// custom radio buttons
$('.customRadio').click(function () {
	$('.customRadio[data-name="' + $(this).attr('data-name') + '"]').removeClass('checked');
	$(this).addClass('checked');
});

// bug gradiant background when resizing
$('a[data-toggle="tab"]').on('shown', function (e) {
	$('#newGame').css({
		background: '#3b423c', /* Old browsers */
	    background: '-moz-radial-gradient(center, ellipse cover, #3b423c 1%, #000000 100%)', /* FF3.6+ */
	    background: '-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(1%,#3b423c), color-stop(100%,#000000))', /* Chrome,Safari4+ */
	    background: '-webkit-radial-gradient(center, ellipse cover, #3b423c 1%,#000000 100%)' /* Chrome10+,Safari5.1+ */
	});
});
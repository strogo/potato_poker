/*
Functions for controlling drawing functions and console/chat
*/

var socket = io();

var showdown = false;

var newRoundTimer = 15000;

//Check name before joining
function tryJoin(name) {
    if(name !== "" && name !== "Your name") {
	fadeToStartGame();
	chat($('#nameInput').val());
	console.log("valid name: " + name);
    } else {
	alert("invalid name");
    }
}

//Bind hitting send-button to sending chat message
$('form').submit(function(){
    chat($('#m').val());
    $('#m').val('');
    return false;
});

//Handle incoming chat messages
socket.on('chat message', function(msg){
    appendMessage(msg);
});

//Handle incoming server messages
socket.on('server message', function(split){
    console.log('Reveived server message: ' + split); //TODO Remove
    switch(msg = split.shift()) {
    case 'waiting':
        appendMessage('Still waiting for ' + split[0] + ' more players');
        break;
    case 'in_room':
	//Inform which players are already in the room
        var in_room = (split.length>0) ? split.join(', ') : 'No one ';
        appendMessage(in_room + (split.length>1 ? ' are ' : ' is ') + ' waiting in the room.');
        break;
    case 'starting':
        appendMessage('Starting game.');
        appendMessage('The order is ' + split);
	//Put all players in list in the right order
	PKR.players = [];
	var playerNames = split[0].split(', ');
	for(var i = 0; i < playerNames.length; i++) {
	    var turn = false;
	    if(i === 0)
		turn = true;
	    PKR.players.push(new player(i, playerNames[i], [], 1000, turn, false));
	    console.log("Added " + i + ": " + playerNames[i]);
	}

	//Draw table, game on!
	PKR.animateCircle = 0;
	drawTable();

	animateAnte();

        break;
    case 'flop':
	PKR.communityCards = []; //reset cards
	//add cards
	for(var i = 0; i < split.length; i++) {
	    PKR.communityCards.push(split[i]);
	    console.log("adding + " + split[i] + " to community cards");
	}
	appendMessage('Flop: ' + split[0] + ' ' + split[1] + ' ' + split[2]);

     	drawCommunityCards();
       	break;
    case 'turn_card':
	PKR.communityCards.push(split[0]);
	drawCommunityCards();
	appendMessage('Turn card: ' + split[0]);
	break;
    case 'river':
	PKR.communityCards.push(split[0]);
	drawCommunityCards();
	appendMessage('River: ' + split[0]);
	break;
    case 'showdown':
	appendMessage('Showdown!');
	showdown = true;
	//Flip all cards, ppl who havent folded
	//showDown();
	break;
    case 'hand':
	
	var isInCommunityCards = function(card) {
	    for(var i = 0; i < PKR.communityCards.length; i++) {
		if(PKR.communityCards[i] === card)
		    return true;
	    }
	    return false;
	}

	for(var n = 2; n < 7; n++) {
	    if(!isInCommunityCards(split[n]))
		getPlayerByName(split[0]).cards.push(split[n]);
	}

	drawTable();
	
	appendMessage(split[0] + '\'s hand: ' + split[1] + ": " + split[2] + " " + split[3] + " " + split[4] + " " + split[5] + " " + split[6]);

	break;
    case 'takes':
	if(split[0] === getMe().name) {
	    //Play winner sound
	    var winnerSound = new Audio('assets/sounds/winner.mp3');
	    winnerSound.play();
	}
	appendMessage(split[0] + " wins " + split[1] + " chips!");
	animateChips("pot", split[0], parseInt(split[1]));
	getPlayerByName(split[0]).chips += parseInt(split[1]);
	//TODO: update pot and player person
	break;
    case 'new_round':
	appendMessage('Restarting game in ' + 15 + ' seconds!');
	drawTable(); //showdown
	setTimeout(function() {
	    appendMessage('New round!');
	    //Reset all players cards
	    for(var i = 0; i < PKR.players.length; i++) {
		if(i !== getMe().id)
		    PKR.players[i].cards = [];
	    }

	    //Restart game
	    showdown = false;
	    PKR.animateCircle = 0;
	    undrawCommunityCards();
	    unfoldAll();
	    drawTable();

	    animateAnte();
	    
	}, newRoundTimer);
	
	break;
    case 'only_one_left':
        appendMessage('Only one player left, the game is over. Restarting in 10 seconds');
	showdown = true;
	setTimeout(function() {

	    //Reset all players cards
	    for(var i = 0; i < PKR.players.length; i++) {
		if(i !== getMe().id)
		    PKR.players[i].cards = [];
	    }

	    //Restart game
	    showdown = false;
	    PKR.animateCircle = 0;
	    undrawCommunityCards();
	    unfoldAll();
	    drawTable();
	    updatePot();
	    animateAnte();

	    
	}, newRoundTimer);
        break;
    case 'raise':
        PKR.pot += PKR.betAmount*2;
	if(!split[0]) {//in case it's me
	    animateBet(getMe().name, PKR.betAmount);
	    appendMessage('You raise');
	} else {
	    animateBet(split[0], PKR.betAmount*2);
	    appendMessage(split[0] + ' raises'); }
        break;
    case 'bet':

	PKR.pot += PKR.betAmount;
	if(!split[0]) {//in case it's me
	    animateBet(getMe().name, PKR.betAmount);
	    appendMessage('You bet ' + split[1]);
	} else {  
	    animateBet(split[0], PKR.betAmount);
            appendMessage(split[0] + ' bets' + ' ' + split[1]);
	}
	
        break;
    case 'call':
	PKR.pot += PKR.betAmount;
	if(!split[0]) {//in case it's me
	    animateBet(getMe().name, PKR.betAmount);
	    appendMessage('You call');
	} else { 
	    animateBet(split[0], PKR.betAmount);
            appendMessage(split[0] + ' calls');
	}

        break;
    case 'all_in':
	if(!split[0]) {//in case it's me
	    animateBet(getMe().name, getMe().chips);
	    PKR.pot += getMe().chips;
	    appendMessage('You go all in!');
	} else { 
	    var playerAllIn = getPlayerByName(split[0]);
	    animateBet(split[0], playerAllIn.chips);
	    PKR.pot += playerAllIn.chips;
            appendMessage(split[0] + ' goes all in!');
	}
	break;
    case 'check':
	if(!split[0])
	    appendMessage('You check');		
	else
	    appendMessage(split[0] + ' checks');
        break;
    case 'fold':
	if(!split[0]) { //in case it's me
	    getMe().fold = true;
	    animateFold(getMe().name);
	} else {
	    animateFold(split[0]); //Set lower transparency
	    getPlayerByName(split[0]).fold = true;
            appendMessage(split[0] + ' folds');
	}
        break;
    case 'broke':
	if(!split[0]) { //in case it's me
	    getMe().fold = true;
	    animateFold(getMe().name);
	    appendMessage("You are broke!");
	} else {
	    animateFold(split[0]); //Set lower transparency
	    getPlayerByName(split[0]).fold = true;
            appendMessage(split[0] + ' is broke');
	}
	break;
    case 'hole_cards':

	var addHoleCards = function(card1, card2) {
            //TODO split[0] and split[1] contains the strings corresponding to the cards
            appendMessage('Your hole cards are ' + card1 + ' and ' + card2);
            //number 0 in array is active player
            getMe().cards = [card1, card2];
	    console.log(getMe().name + " (you) have now cards: " + card1 + " and " + card2);
	};

	if(showdown) {
	    setTimeout(addHoleCards, newRoundTimer/2, split[0], split[1]);
	} else {
	    addHoleCards(split[0], split[1]);
	}

        break;
    case 'joined':
        //You joined. Cool.
//        PKR.players.push(new player(1, $('#nameInput').val(), [], 0, false, false));
	//	    drawTable();
        break;
    case 'rooms':
        break;
    case 'turn':
	var cmdPlayerTurn = function(name) {
	    playerTurn(name);
            
            drawTable();
            appendMessage(name + '\'s turn');
	}

        if(showdown)
	    setTimeout(cmdPlayerTurn, newRoundTimer, split[0]);
	else
	    cmdPlayerTurn(split[0]);

        break;
    case 'your_turn':
        //Enable buttons
	var cmdYourTurn = function() {
	    playerTurn(getMe().name);
      	    drawTable();
            appendMessage('It is your turn!');
	}
	if(showdown)
	    setTimeout(cmdYourTurn, newRoundTimer);
	else
	    cmdYourTurn();
	
        break;
    case 'illegal':
        switch (req_action = split[0]) {
        case 'match_bet':
            appendMessage('You need to match the current bet.');
            break;
        default:
            appendMessage('Illegal action.');
        }
        break;
    case 'error':
	appendMessage('Invalid command');
	break;
    case 'not_recognized':
	appendMessage('Invalid command');
	break;
    default:
        appendMessage('NOT IMPLEMENTED' + msg + ' ' + split.toString());
    }
});

function command(cmd) {
    socket.emit('command', cmd);
}

function playerTurn(name) {
    for(var i = 0; i < PKR.players.length; i++) {
	if(PKR.players[i].name === name) {
	    PKR.players[i].turn = true;
	} else {
	    PKR.players[i].turn = false;
	}
    }
}

function chat(msg) {
    if(msg !== "")
	socket.emit('chat message', msg);
}

function getPlayerByName(name) {
    for(var i = 0; i < PKR.players.length; i++) {
	if(PKR.players[i].name === name)
	    return PKR.players[i];
    }
}

function getMe() {
    return getPlayerByName($('#nameInput').val());
}

//window.onbeforeunload = function() {
//  console.log("disconnect connections, quit poker room");
//return "TODO - disconnect connections when quit";
//};

function appendMessage(msg) {

    if(msg !== "") {
	$('#messages').append($('<li>').text(msg));
	//Automatically scroll to bottom of div
	$('#console').scrollTop($('#console')[0].scrollHeight);
    }
}

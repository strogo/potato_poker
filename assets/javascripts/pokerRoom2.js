/*
Functions for drawing the poker table
*/

var PKR = {};

//PKR.animateCircle = 0;

PKR.cards = {
    cardWidth: null,
    cardHeight: null,
    cardMargin: null,
    cardRadius: null,
    backImg: 'assets/images/potato_back.svg'
}

PKR.pot = 0;

PKR.betAmount = 250;

PKR.communityCards = [];

PKR.players = [];

PKR.radius = null;
PKR.centerX = null;
PKR.centerY = null;

PKR.consoleWidth = 0;

function player(id, name, cards, chips, turn, dealer) {
    this.id = id;
    this.name = name;
    this.cards = cards;
    this.chips = chips;
    this.turn = turn;
    this.dealer = dealer;
    this.fold = false;
}

function animateAnte() {
    PKR.pot = 0;
    var activePlayers = 0;
    for(var i = 0; i < PKR.players.length; i++) {
	console.log(i + " ante add: + " + PKR.players[i].name);
	if(PKR.players[i].chips >= 0) {
	    animateBet(PKR.players[i].name, PKR.betAmount);
	    activePlayers++;
	}
    }
    PKR.pot += PKR.betAmount*activePlayers;
    updatePot();
}

function animateBet(name, betAmount) {
    var player = getPlayerByName(name);
    player.chips -= betAmount;
    drawTable();
    animateChips("player_" + player.id, "pot", betAmount);
}

//Transfer money from a player to pot
function animateChips(from, to, amount) {
    var frompos = document.getElementById(from).getBoundingClientRect();

    var topos = document.getElementById(to).getBoundingClientRect();


    var chips = document.createElement('div');
    chips.style.zIndex = "99";
    chips.style.position = "absolute";
    chips.style.top = frompos.top + "px";
    chips.style.left = frompos.left + "px";
    chips.style.display = "none";
    chips.innerHTML = "<img src=\"assets/images/spinningpotato.gif\"><br>" + amount;
    document.getElementsByTagName('body')[0].appendChild(chips);
    
    var animate = function() {
    var crispy = new Audio('assets/sounds/crisp.mp3');

	var potatospeed = "slow";
	if(from === "pot")
	    potatospeed = PKR.newRoundTimer/2;

	$(chips).animate({
	    left: topos.left+'px', 
	    top: topos.top+'px'
	}), potatospeed, $(chips).fadeOut(500, function(){
	    crispy.play();2
	    $(chips).remove();
	    updatePot();
	})};

    //Fade in, animate, fade out and delete chips
    $(chips).fadeIn(500, animate);
    //Play crispy sound

}

function unfoldAll() {
   //Get player div
    for(i = 0; i < PKR.players.length; i++) {
	var playerdiv = $("#player_" + i);
	//Tone dark
	playerdiv.fadeTo(600, 1);
    }
}

function animateFold(name) {
    //Get player div
    var playerdiv = $("#player_" + getPlayerByName(name).id);
    //Tone dark
    playerdiv.fadeTo(600, 0.33);
}

function leaveRoom() {
    //TODO implement send notification to server to leave room
    alert("bye");
}

//PKR.players.push(new player(2, "Elif", ["3H", "KS"], 150, false, true));
//PKR.players.push(new player(3, "Max", ["3H", "KS"], 550));
//PKR.players.push(new player(4, "Sverrir", ["3H", "KS"], 650));
//PKR.players.push(new player(4, "Sverrir", ["3H", "KS"], 650));

function undrawCommunityCards() {
    for(i = 0; i < PKR.communityCards.length; i++)
	$("#community_card_" + i).remove();
    PKR.communityCards = [];
}

function drawCommunityCards() {
    var community_cards_div = document.getElementById("community_cards");

    //Draw the cards
    for(i = 0; i < PKR.communityCards.length; i++) {
        //Card i is not drawn yet - draw card
        if(!document.getElementById("community_card_" + i)) {
            //Create card
            var card_div = document.createElement("div");
            card_div.id = "community_card_" + i;
            card_div.className = "cardBox communityCardBox";
            card_div.style.backgroundImage = "url(assets/images/" + PKR.communityCards[i].toLowerCase() + ".png)"; //write value of card here
        } else {
            //Update card
            var card_div = document.getElementById("community_card_" + i);
        }

        card_div.style.backgroundSize = PKR.cards.cardWidth + "px " + PKR.cards.cardHeight + "px";
        card_div.style.width = (i !== 4) ? PKR.cards.cardWidth  + PKR.cards.cardMargin + "px" : PKR.cards.cardWidth + "px";
        card_div.style.height = PKR.cards.cardHeight + "px";

        if(!document.getElementById("community_card_" + i)) {
            community_cards_div.appendChild(card_div);
            $("#community_card_" + i).hide();
        }
    }


    //Show one card at the time
    var i = 0;

    var fadeInCommunityCards = function(num) {
        if(i < PKR.communityCards.length) {
	    if($("#community_card_" + i).css('display') === 'none' ) {
		$("#community_card_" + i).fadeIn(1000, function() {
                    i++;
                    fadeInCommunityCards(i);
		});
	    } else {
		i++;
                fadeInCommunityCards(i);
	    }
        }
    }
    fadeInCommunityCards(0);

}

function updatePot() {
    var pot_div = document.getElementById("pot");
    pot_div.innerHTML = "<img src=\"assets/images/potato_chips.svg\" id=\"potchips\"><br>" + PKR.pot + " chips";
    
    var potDiv = document.getElementById("pot");
    
    document.getElementById("potchips").width = potDiv.offsetWidth*0.5;
}

function drawPlayerCards(player_id) {

    if (document.getElementById("player_" + player_id + "_card1")) {
        var card_div = document.getElementById("player_" + player_id + "_card1");
        var new_div = false;
    } else {
        var card_div = document.createElement("div");
        var new_div = true;
    }

    card_div.id = "player_" + player_id + "_card1";
    card_div.className = "cardBox";

    card_div.style.backgroundSize = PKR.cards.cardWidth + "px " + PKR.cards.cardHeight + "px";
    card_div.style.width = PKR.cards.cardWidth + "px";
    card_div.style.height = PKR.cards.cardHeight + "px";

    //Make copy of card 1
    if(!document.getElementById("player_" + player_id + "_card2"))
        var card_div2 = card_div.cloneNode(true);
    else
        var card_div2 = document.getElementById("player_" + player_id + "_card2");

    //Draw player cards
    var hand = PKR.players[player_id].cards;
    if(hand.length >= 2) {
	card_div.style.backgroundImage = "url(assets/images/" + hand[0].toLowerCase() + ".png)";
	card_div2.style.backgroundImage = "url(assets/images/" + hand[1].toLowerCase() + ".png)";
    } else {
	card_div.style.backgroundImage = "url(" + PKR.cards.backImg + ")";
	card_div2.style.backgroundImage = "url(" + PKR.cards.backImg + ")";
    }

    card_div2.id = "player_" + player_id + "_card2";
    card_div2.style.backgroundSize = PKR.cards.cardWidth + "px " + PKR.cards.cardHeight + "px";
    card_div2.style.width = PKR.cards.cardWidth + "px";
    card_div2.style.height = PKR.cards.cardHeight + "px";

    card_div.style.width = PKR.cards.cardWidth + PKR.cards.cardMargin + "px";

    if(new_div)
        document.getElementById("player_" + player_id).appendChild(card_div);
    if(new_div)
        document.getElementById("player_" + player_id).appendChild(card_div2);
}

function drawTableDivs() {
    //Set global variables
    PKR.consoleWidth = document.getElementById("consoleContainer").offsetWidth;

    PKR.radius = (window.innerHeight < (window.innerWidth - PKR.consoleWidth)) ? window.innerHeight/3.8 : (window.innerWidth - PKR.consoleWidth)/3.8;
    PKR.centerX = ((window.innerWidth + PKR.consoleWidth)/2);
    PKR.centerY = window.innerHeight/2 - PKR.radius*0.2;

    //Card sizes
    PKR.cards.cardWidth = PKR.radius/3;
    PKR.cards.cardHeight = PKR.cards.cardWidth*1.4;
    PKR.cards.cardMargin = PKR.cards.cardWidth/10;
    PKR.cards.cardRadius = PKR.radius * 1; //distance from center to draw the cards

    //Set button positions
    var commands = document.getElementById("commands");
    commands.style.width = PKR.radius*3 + "px";
    commands.style.height = PKR.radius/4 + "px";
    commands.style.position = "absolute";
    commands.style.top = (PKR.centerY + PKR.radius*1.75) + "px";
    commands.style.left = (PKR.centerX - (commands.offsetWidth/2)) + "px";

    //Draw circle
    var circle = document.getElementById("circle");
    circle.style.border = (PKR.radius/15) + "px solid white";
    circle.style.width = PKR.radius*2 + "px";
    circle.style.height = PKR.radius*2 + "px";
    circle.style.position = "absolute";
    circle.style.top = (PKR.centerY - PKR.radius - (PKR.radius/15)) + "px";
    circle.style.left = (PKR.centerX - PKR.radius - (PKR.radius/15)) + "px";

    //Draw community card div
    var community_cards = document.getElementById("community_cards");
    community_cards.style.width = 5*PKR.cards.cardWidth + 4*PKR.cards.cardMargin + "px";
    community_cards.style.height = PKR.cards.cardHeight + "px";
    community_cards.style.position = "absolute";
    community_cards.style.top = (PKR.radius - PKR.cards.cardHeight/2) + "px";
    community_cards.style.left = (PKR.radius - (5*PKR.cards.cardWidth + 4*PKR.cards.cardMargin)/2) + "px";

    //Draw pot div
    var pot = document.getElementById("pot");
    pot.style.width = 2*PKR.cards.cardWidth + "px";
    pot.style.height = PKR.cards.cardHeight + "px";
    pot.style.position = "absolute";
    pot.style.borderWidth = PKR.cards.cardMargin/2 + "px";
    pot.style.top = PKR.radius*1.3 + "px";
    pot.style.left = PKR.radius - (PKR.cards.cardWidth) + "px"; //minus width/2 of this div to get it centered
}

function drawTable() {
    drawTableDivs();
    //Draw players boxes
    var i, x, y, ang;
    var box_size = PKR.cards.cardWidth*2 + PKR.cards.cardMargin;

    for (i = 0; i < PKR.players.length; i++) {
        if (document.getElementById("player_" + i)) {
            var player_div = document.getElementById("player_" + i);
            var player_info_div = document.getElementById("player_info_" + i);
            var new_div = false;
        } else {
            var player_div = document.createElement("div");
            var player_info_div = document.createElement("div");
            player_info_div.style.position = "absolute";
            player_info_div.style.bottom = "0px";
            player_info_div.id = "player_info_" + i;
            var new_div = true;
        }


        ang = PKR.animateCircle * ((i * Math.PI / PKR.players.length*2) + Math.PI/2);
        x = PKR.centerX + PKR.radius*1.3 * Math.cos(ang) - (box_size/2);
        y = PKR.centerY + PKR.radius*1.3 * Math.sin(ang) - (box_size*0.9/2);


        player_div.id = "player_" + i;
        player_div.className = "playerBox";
        player_div.style.width = box_size + "px";
        player_div.style.height = box_size*0.9 + "px";
        player_div.style.borderRadius = "5%";

        player_div.style.left = x + "px"; //x pos
        player_div.style.top = y + "px"; //y pos
        if (new_div) {
            document.getElementsByTagName('body')[0].appendChild(player_div);
            document.getElementById("player_" + i).appendChild(player_info_div);
        }

        //Update player info box
        player_info_div.innerHTML = "";
        player_info_div.innerHTML += PKR.players[i].name;
        if(PKR.players[i].dealer)
            player_info_div.innerHTML += " is <font color=yellow>dealer</font> ";
        if(PKR.players[i].turn)
            player_info_div.innerHTML += "'s <font color=lime>turn</font>";
        player_info_div.innerHTML += "<br>" + PKR.players[i].chips + " chips";

        drawPlayerCards(i);
    }


    if(PKR.animateCircle < 1) {
        setTimeout(function() {
            PKR.animateCircle += 0.01;
	    if(PKR.animateCircle > 0.98)
		PKR.animateCircle = 1;
            drawTable();
        }, 10);
    } else {
	PKR.animateCircle = 1;
    }
}

function startGame() {

    //Play silly blop sound
    var audio = new Audio('assets/sounds/blop.mp3');
    setTimeout(function(){
        updatePot();

        audio.play();
    }, 800);
}

//Fade out welcome screen and start game
function fadeToStartGame() {
    drawTableDivs();
    $("#cover").fadeOut(1500, function() { startGame() });
}

window.onresize = function() {
    drawTable();
    drawCommunityCards();
    updatePot();
}

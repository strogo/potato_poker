// JavaScript Document

var imgArray = [];

imgArray[0] = new Image();
imgArray[0].src = 'assets/images/tutorial1.png';

imgArray[1] = new Image();
imgArray[1].src = 'assets/images/tutorial2.png';

imgArray[2] = new Image();
imgArray[2].src = 'assets/images/tutorial3.png';

imgArray[3] = new Image();
imgArray[3].src = 'assets/images/tutorial4.png';

imgArray[4] = new Image();
imgArray[4].src = 'assets/images/tutorial5.png';

imgArray[5] = new Image();
imgArray[5].src = 'assets/images/tutorial6.png';

imgArray[6] = new Image();
imgArray[6].src = 'assets/images/tutorial7.png';

imgArray[7] = new Image();
imgArray[7].src = 'assets/images/tutorial8.png';

imgArray[8] = new Image();
imgArray[8].src = 'assets/images/tutorial9.png';


var imagenumber1 = Math.floor(Math.random()*imgArray.length + 1);
var RandomImage1 = imgArray[imagenumber1];

RandomImage1.onload= function() {
    draw1(this);
};

function draw1() {
    var canvas = document.getElementById('tutorialcanvascards1');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(RandomImage1, 20, 5);
	img2.style.display = 'none';
    var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    var data = imageData.data; 
    }



var imagenumber2 = Math.floor(Math.random()*imgArray.length + 1);
var RandomImage2 = imgArray[imagenumber2];

RandomImage2.onload= function() {
    draw2(this);
};

function draw2() {
    var canvas = document.getElementById('tutorialcanvascards2');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(RandomImage2, 20, 4);
	img2.style.display = 'none';
    var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    var data = imageData.data; 
    }



var text=document.getElementById("tutorialcanvas0");
var ctx=text.getContext("2d");

ctx.font="20px Georgia";
ctx.fillText("Can you tell which one is higher?",20,20);



function tutorialclick1() {
	
	if (imagenumber1 < imagenumber2)
	
	{
var text=document.getElementById("tutorialcanvas0");
var ctx=text.getContext("2d");

ctx.font="20px Georgia";
ctx.fillText("- Wrong... You can practice more!",40,60);
  
   }
   
   if (imagenumber1 > imagenumber2)
   
   {
var text=document.getElementById("tutorialcanvas0");
var ctx=text.getContext("2d");

ctx.font="20px Georgia";
ctx.fillText("- Right!",40,60);
  
   }
   
    setInterval( function() {location.reload();},1000 );

}







function tutorialclick2() {
	
	if (imagenumber1 < imagenumber2)
	
	{	
var text=document.getElementById("tutorialcanvas0");
var ctx=text.getContext("2d");

ctx.font="20px Georgia";
ctx.fillText("- Right!",40,60);
   }
   
   if (imagenumber1 > imagenumber2)
   
   {
		
var text=document.getElementById("tutorialcanvas0");
var ctx=text.getContext("2d");

ctx.font="20px Georgia";
ctx.fillText("- Wrong... You can practice more!",40,60);

   }
   
    setInterval( function() {location.reload();},1000 );

}



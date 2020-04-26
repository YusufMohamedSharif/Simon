var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var speed;
var baseSpeed = 1000;
var blink;
var baseBlink = 250;
var highscore = 0;

//User selected button ID
$("div.btn").on("click", function() {
  var userChosenColor = this.id;
  userClickedPattern.push(userChosenColor);


  //Checking user clikcs aginst game rules
  if (level === 0) {
    speed = 1000;
    blink = 150;
    startingAnimation();
    setTimeout(nextSequance, 1500);
    userClickedPattern = [];
  } else if (userClickedPattern.length === gamePattern.length) {
    if (checkAnswer()) {
      userClickedPattern = [];
      makeSound(userChosenColor);
      animatePress(userChosenColor);
      setTimeout(redoFullSequance(gamePattern.length), speed);
    } else {
      resetGmae();
    }
  } else {
    if (checkAnswer() === false) {
      resetGmae();
    }
    makeSound(userChosenColor);
    animatePress(userChosenColor);
  }

});

function nextSequance() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  //Animate and sound
  $("#" + randomChosenColor).fadeOut(blink).fadeIn(blink).fadeOut(blink).fadeIn(blink);
  makeSound(randomChosenColor);



  //Increas difficulty on level 5 and 10
  if(level >= 10) {
    speed = baseSpeed/4;
    blink = baseBlink/4;
  }
  else if (level >= 5) {
    speed = baseSpeed/2;
    blink = baseBlink/2;
  }
  else if (level === 0) {
    level++;
    $("#level-title").text("Level " + level);
  }

}

function redoFullSequance (count) {
  level++;
  $("#level-title").text("Level " + level);

  //highscore update
  if(level > highscore){
    highscore = level;
    $(".highscore").text("Highscore: " + highscore);
  }



  //Easy & Normal mode show all sequance, Hard only new ellement.
  for (var i=0; i<count; i++){
    setTimeout("$('#' + gamePattern["+i+"]).fadeOut(blink).fadeIn(blink).fadeOut(blink).fadeIn(blink); makeSound(gamePattern["+i+"]);" , (speed*(i+1)));
  }
  setTimeout(nextSequance, (count+1) * speed);
}

function makeSound(name) {
  //The beeps sound code
  var currentSound = new Audio("sounds/" + name + ".mp3");
  currentSound.play();
}

function animatePress(name) {
  //The blinking effect code
  $("#" + name).addClass("pressed");
  setTimeout(function() {
    $("#" + name).removeClass("pressed");
  }, 100);
}

function startingAnimation() {
  var currentSound = new Audio("sounds/newGame.mp3");
  currentSound.play();

  $("div.btn").addClass("pressed");
  setTimeout(function() {
    $("div.btn").removeClass("pressed");
  }, blink);

  setTimeout(function() {
    $("div.btn").addClass("pressed");
  }, 400);

  setTimeout(function() {
    $("div.btn").removeClass("pressed");
  }, 600);
}

function checkAnswer() {
  for (var i = 0; i < userClickedPattern.length; i++) {
    if (userClickedPattern[i] !== gamePattern[i]) {
      return false;
    }
  }
  return true;
}

function resetGmae() {
  gamePattern = [];
  userClickedPattern = [];
  level = 0;
  //Wrong sound and flash red
  var currentSound = new Audio("sounds/wrong.mp3");
  currentSound.play();
  $("body").addClass("game-over");
  setTimeout("$('body').removeClass('game-over')", blink);
  $("#level-title").text("Game Over!");
}

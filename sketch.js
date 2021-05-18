var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  backgroundimg=loadImage("background.png")
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  //groundImage = loadImage("ground2.png");
  
  //cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameover.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
 
  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,height-150,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.7;

  gameOver = createSprite(windowWidth/2,windowHeight/2-20);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.4;

  restart = createSprite(windowWidth/2-10,windowHeight/2+60);
  restart.addImage(restartImg);
  restart.scale=0.2
 
 
 
  
  invisibleGround = createSprite(width/2,height-150,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
 
  
  trex.setCollider("rectangle",0,0,50,50);
 // trex.debug = true
  
  score = 0;
  
}

function draw() {
 // background("black")
  background(backgroundimg);
  fill("blue")
  textSize(30)
  text("press space bar to jump",windowWidth/2-350,30)
  text("----------------------------------",windowWidth/2-360,50)
  
   //displaying score
   fill("red")
   textSize(30)
   text("Score: "+ score, windowWidth/2,windowHeight/2-320);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
 
    score++;
    if(score>0 && score%300 === 0){
       checkPointSound.play() 
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= windowHeight-200) {
        trex.velocityY = -12;
        
        jumpSound.play();
        
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8

  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
    
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
  if(score>500){
    //youwin.play();
    fill("black");
    textSize(30);
    text("GAME IS ENDED YOU WIN!!",windowWidth/2-200,windowHeight/2);
    fill("brown");
    text("-------------------------------------------",windowWidth/2-220,windowHeight/2+30);
    fill("magenta");
    text("-------------------------------------------",windowWidth/2-220,windowHeight/2-30);
    console.log("GAME IS ENDED YOU WIN!!")
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    gameState=END;
    
  }
   else if (gameState === END) {
   
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
      if(mousePressedOver(restart)) {
      reset();
    }
     
      //ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1); //cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
      
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
 


  drawSprites();
}

function reset(){
  gameOver.visible=false;
restart.visible=false;
  gameState=PLAY;
  obstaclesGroup.destroyEach();
trex.changeAnimation("running",trex_running);
score=0}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth,windowHeight-180,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.6;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}


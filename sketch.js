var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var enemigoGroup;

var score = 0;
var life = 3;
var bullets = 70;

var heart1, heart2, heart3

var gameState = "fight"

var lose, winning, explosionSound;


function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  bulletImg = loadImage("assets/bullet.png")


  osoImg = loadImage("assets/oso-1.png")
  oso_escupiendo = loadImage("assets/Oso-2.png")

  rocaImg = loadImage("assets/Enemigo.png")

  bgImg = loadImage("assets/bg.jpg")
  explosionSound = loadSound("assets/explosion.mp3");
  lose = loadSound("assets/lose.mp3");
  winning = loadSound("assets/win.mp3");

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  // Agregando una imagen de fondo
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 0.3
  

// Creando el sprite del jugador
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(osoImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)


   // Creando sprites para representar la vida restante
   heart1 = createSprite(displayWidth-150,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-100,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4
   

    // Creando grupos para zombis y balas
    bulletGroup = new Group()
    //zombieGroup = new Group()

    enemigoGroup =  new Group();



}

function draw() {
  background(0); 


if(gameState === "fight"){

  // Mostrar la imagen apropiada segun la vida restante 
  if(life===3){
    heart3.visible = true
    heart1.visible = false
    heart2.visible = false
  }
  if(life===2){
    heart2.visible = true
    heart1.visible = false
    heart3.visible = false
  }
  if(life===1){
    heart1.visible = true
    heart3.visible = false
    heart2.visible = false
  }

  // Ir al estado de juego (gameState) "lost" cuando quedan 0 vidas
  if(life===0){
    gameState = "lost"
    
  }


  // Ir al estado "won" si la puntuación es 100
  if(score==100){
    gameState = "won"
    winning.play();
  }

  // Moviendo al jugador arriba y abajo. Haciendo el juego móvil y compatible con entrada táctil
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


// Liberar las balas y cambiar la imagen del tirador a la posición de disparo cuando la barra espaciadora es presionada
if(keyWentDown("space")){
  bullet = createSprite(displayWidth-1100,player.y-48,20,10)
  bullet.velocityX = 20
  bullet.addImage(bulletImg)
  
  bulletGroup.add(bullet)
  player.depth = bullet.depth
  player.depth = player.depth+2
  player.addImage(oso_escupiendo)
  bullets = bullets-1
  explosionSound.play();
}

// Eñ jugador regresa a la posición original una vez que se deja de presionar la barra espaciadora
else if(keyWentUp("space")){
  player.addImage(oso_escupiendo)
}

// Ir al estado de juego "bullet" cuando el jugador se queda sin balas
if(bullets==0){
  gameState = "bullet"
  lose.play();
    
}

// Destruir al zombi cuando una bala lo toca e incrementar la puntuación
if(enemigoGroup.isTouching(bulletGroup)){
  for(var i=0;i<enemigoGroup.length;i++){     
      
   if(enemigoGroup[i].isTouching(bulletGroup)){
        enemigoGroup[i].destroy()
        bulletGroup.destroyEach()
        explosionSound.play();
 
        score = score+2
        } 
  
  }
}

// Reducir la vida y destruir al zombi cuando el jugador lo toca
if(enemigoGroup.isTouching(player)){
 
   lose.play();
 

 for(var i=0;i<enemigoGroup.length;i++){     
      
  if(enemigoGroup[i].isTouching(player)){
       enemigoGroup[i].destroy()
      
      life=life-1
       } 
 
 }
}

// Llamar la función para generar zombis
enemy();
}




drawSprites();

// Mostrar la puntuación, las vidas y balas restantes 
textSize(20)
fill("white")
text("Balas = " + bullets,displayWidth-200,displayHeight/2-250)
text("Puntuación = " + score,displayWidth-200,displayHeight/2-220)
text("Vidas = " + life,displayWidth-200,displayHeight/2-280)

// Destruir al zombi y al jugador y mostrar el mensaje en el estado de juego "lost"
if(gameState == "lost"){
  
  textSize(100)
  fill("red")
  text("Perdiste",displayWidth/2,displayHeight/2)
  enemigoGroup.destroyEach();
  player.destroy();

}

// Destruir al zombi y al jugador y mostrar el mensaje del estado de juego "won"
else if(gameState == "won"){
 
  textSize(100)
  fill("yellow")
  text("Ganaste",displayWidth/2,displayHeight/2)
  enemigoGroup.destroyEach();
  player.destroy();

}

// Destruir al zombi, jugador y balas y mostrar el mensaje en el estado de juego "bullet"
else if(gameState == "bullet"){
 
  textSize(50)
  fill("yellow")
  text("¡Te quedaste sin balas!",displayWidth/2,displayHeight/2)
  enemigoGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();

}

}


// Creando la función para generar zombis
function enemy(){
  if(frameCount%50===0){

    // Dando posiciones "x" e "y" aleatorias cuando aparecen los zombis
    zombie = createSprite(random(width+110,width+200),random(height/2-10,500),40,40)

    zombie.addImage(rocaImg)
    zombie.scale = 0.09
    zombie.velocityX = -3
    zombie.debug= true
    zombie.setCollider("rectangle",0,0,400,400)
   
    zombie.lifetime = 400
   enemigoGroup.add(zombie)
  }

}

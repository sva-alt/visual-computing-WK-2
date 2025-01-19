const {Engine,
  World,
  Bodies,
  Body,
  Constraint,
  MouseConstraint,
  Mouse
} = Matter;

let engine,
world,
ground,
bird,
birdTrajectory = [],
slingShot,
boxes = [],
pigs = [],
mc,
score=0,
birdLaunched = false,
redImg,
crateImg,
grassImg,
pigImg,
bgImg,
startFlag = true,
isGameOver = false,
gameSound,
slingshotSound,
gameOverSound,
gameOverSoundPlayed = false,
launchSounds = [],
pigSounds = [],
lives = 3,
stars= 0,
customFont,
cajas=0,
ButtonEL,
endLevel=false,
ButtonR;


function preload(){
  startImg = loadImage("img/start.png")
  redImg = loadImage("img/RedBird.png")
  crateImg = loadImage("img/crate.png")
  grassImg = loadImage("img/grass.png")
  slingImg = loadImage("img/slingshot.png")
  pigImg = loadImage("img/pig.png");
  bgImg = loadImage("img/bg.png");
  starImg = loadImage("img/stars.png")
  customFont = loadFont("font/AG-font.ttf");

  gameSound = loadSound("sound/background.mp3");
  slingshotSound = loadSound("sound/slingshot.mp3");
  gameOverSound = loadSound("sound/game_over.mp3");

  launchSounds.push(loadSound("sound/bird_launch1.mp3"));
  launchSounds.push(loadSound("sound/bird_launch2.mp3"));
  launchSounds.push(loadSound("sound/bird_launch3.mp3"));

  pigSounds.push(loadSound("sound/hit_pig.mp3"));
  pigSounds.push(loadSound("sound/hit_pig1.mp3"));
  pigSounds.push(loadSound("sound/hit_pig2.mp3"));

}
function allPigsEliminated() {
  return pigs.length === 0;
}
function setup() {
  const canvas = createCanvas(640, 480);

  startFlag = true;



  ButtonEL = createImg("img/buttonEL.png");
  ButtonEL.position(width - 120, 10); // Ajusta la posición según sea necesario
  ButtonEL.size(100, 50); // Ajusta el tamaño según sea necesario
  ButtonEL.hide();
  ButtonEL.mousePressed(handleButtonPress);

  ButtonR = createImg("img/buttonR.png");
  ButtonR.position(width - 200, 10); // Ajusta la posición según sea necesario
  ButtonR.size(50, 50); // Ajusta el tamaño según sea necesario
  ButtonR.hide();
  ButtonR.mousePressed(resetGame);


  function resetGame() {
    // Reiniciar variables del juego
    endLevel = false;
    birds = [];
    pigs = [];
    boxes = [],
    score = 0;
    lives = 3;
    stars= 0;
    ButtonR.hide();
    ButtonEL.hide();

    // Detener y reiniciar el sonido del juego
    if (gameSound.isPlaying()) {
        gameSound.stop();
    }
    gameSound.loop();

    // Reiniciar el motor de física
    Engine.clear(engine);
    engine = Engine.create();
    world = engine.world;

    // Volver a generar los objetos del juego
    setup();
}



  engine = Engine.create();
  world = engine.world;

  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();

  mc = MouseConstraint.create(
    engine, {
      mouse: mouse,
      collisionFilter:{
        mask: 2
      }
  });

  World.add(world, mc);

  ground = new Ground(width/2, height-10, width, 20, grassImg);
  const birdLifetime = 300; // Vida útil del pájaro en frames

 for (let j = 0; j<3; j++){
    for (let i=0; i<3; i++){
      const box = new Box(
        400 + 100*j, height - 40*i, 40, 40, crateImg,100
      );
      boxes.push(box);
    }
  }
  
  const box = new Box(
        500 ,380 , 280, 10, crateImg,100
      );
      boxes.push(box);
    
   for (let j = 0; j<2; j++){
    for (let i=0; i<2; i++){
      const box = new Box(
        450 + 100*j, 280, 40, 40, crateImg,100
      );
      boxes.push(box);
    }
  }
  

   const box1 = new Box(
        500 ,140, 200, 10, crateImg,100
      );
      boxes.push(box1);
  
  
     for (let j = 0; j<2; j++){
    for (let i=0; i<1; i++){
      const box = new Box(
        450 + 100*j, 280, 40, 40, crateImg,100
      );
      boxes.push(box);
    }
  }
  bird = new Bird(120, 380, 20, 2, redImg,birdLifetime);
  slingShot = new SlingShot(bird,slingImg);
  pigs.push(new Pig(500, 300, 20, pigImg, 100));
  pigs.push(new Pig(550, 100, 20, pigImg, 100));

  Matter.Events.on(engine, 'collisionStart', function(event) {
    if (!birdLaunched) return; // No reducir durabilidad si el pájaro no ha sido lanzado

    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const { bodyA, bodyB } = pair;

        for (let j = boxes.length - 1; j >= 0; j--) {
            const box = boxes[j];
            if (box.body === bodyA || box.body === bodyB) {
                if (bodyA === bird.body || bodyB === bird.body) {
                  box.reduceDurability(70);
                  bird.hasCollided = true; // Marcar el pájaro como chocado
                }
                if (bodyA === ground.body || bodyB === ground.body) {
                    box.reduceDurability(50);
                }
                if (box.durability <= 0) {
                    boxes.splice(j, 1); // Eliminar la caja del arreglo
                }
            }
        }

        for (let j = pigs.length - 1; j >= 0; j--) {
            const pig = pigs[j];
            if (pig.body === bodyA || pig.body === bodyB) {
                if (bodyA === bird.body || bodyB === bird.body || bodyA === ground.body || bodyB === ground.body) {
                    pig.reduceDurability(70);
                    bird.hasCollided = true; // Marcar el pájaro como chocado
                }
                if (pig.durability <= 0 && pig.isRemoved) {
                    pigs.splice(j, 1); // Eliminar el cerdo del arreglo
                }
            }
        }
    }
});
  }

function draw() {
  if (startFlag == true)
  {
    image(startImg, 0, 0, width, height, 0, 0, startImg.width, startImg.height, CONTAIN);
    console.log(width, height);
  }
  else
  {
    background(0, 181, 226);
    background(bgImg);
    fill(255);
    textSize(24);
    textFont(customFont);
    text(`Score: ${score}`, 10, 30);
    text(`Birds:`, 10, 70);
    for (let i = 0; i < lives; i++) {
      image(redImg, 80 + i * 30, 50, 30, 30); // Ajusta la posición y tamaño de las imágenes según sea necesario
  }

        // Dibujar estrellas
        for (let i = 0; i < stars; i++) {
          image(starImg, 10 + i * 30, 90, 20, 20); // Ajusta la posición y tamaño de las estrellas según sea necesario
        }

    Engine.update(engine);
    if (!isGameOver) {
      slingShot.fly(mc);
      if (!birdLaunched && bird.body.velocity.x !== 0 && bird.body.velocity.y !== 0) {
        birdLaunched = true; // Actualizar la bandera cuando el pájaro sea lanzado
      }
    }
    ground.show();
    ButtonR.show();
    for(const box of boxes) {
      box.show();
    }
    slingShot.show();
    bird.show();

    for (let i = pigs.length - 1; i >= 0; i--) {
      const pig = pigs[i];
      pig.show();
      // Verificar si el cerdo está fuera de la pantalla
      if (pig.body.position.x < 0 || pig.body.position.x > width || pig.body.position.y < 0 || pig.body.position.y > height) {
          pig.reduceDurability(pig.durability); // Reducir la durabilidad a 0
      }
      // Eliminar el cerdo del arreglo si está marcado como eliminado
      if (pig.isRemoved) {
          pigs.splice(i, 1);
        if (pigSounds.length > 0) {
                      const randomSound = random(pigSounds);
                      randomSound.play();
                    }
      }
    }

        // Incrementar estrellas cada 8000 puntos, máximo 3 estrellas
        if (score >= 6500 * (stars + 1) && stars < 3) {
          stars++;
        }

    if (bird.lifetime <= 0 && lives <= 0 || endLevel==true)
    {

      if (!gameOverSoundPlayed) {
        if (gameOverSound) {
          gameSound.stop()
          gameOverSound.play();
        }
        gameOverSoundPlayed = true;
        isGameOver = true;

        World.remove(world, mc); //mouse constraint
        mc = null;

      }
      push();
      filter(BLUR, 3);
      textAlign(CENTER);
      textSize(24);
      textFont(customFont);

     // Calcular la posición inicial para centrar las estrellas
    const starWidth = 60;
    const totalStarsWidth = stars * starWidth;
    const startX = width / 2 - totalStarsWidth / 2;

    // Mostrar el número de estrellas
    for (let i = 0; i < stars; i++) {
      image(starImg, startX + i * starWidth, height / 2 - 120, starWidth, starWidth); // Ajusta la posición y tamaño de las estrellas según sea necesario
    }

    text(`Game Over \nScore: ${score}`, width / 2, height / 2);
    pop();
    }

  }

  if (allPigsEliminated()) {
    ButtonEL.show();
  } else {
    ButtonEL.hide();
  }


}
  function resetGame() {

    endLevel = false;
    startFlag = false;

  }

function handleButtonPress() {
  endLevel = true;
}

function keyPressed(){
  while (startFlag == true)
  {
    startFlag = false;
    if (!gameSound.isPlaying()) {
      gameSound.loop();
    }


  }

  if (key == ' ' && startFlag == false) {
    if (lives > 0 && birdLaunched)
    {
      World.remove(world, bird.body);
      bird = new Bird(120, 380, 20, 2, redImg, 300);
      slingShot.attach(bird);
      birdLaunched = false;
      lives -= 1;
    }
  }
}

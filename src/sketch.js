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
gameOverSound;
gameOverSoundPlayed = false,
launchSounds = [],
pigSounds = [],
lives = 3;


function preload(){
  startImg = loadImage("img/start.png")
  redImg = loadImage("img/RedBird.png")
  crateImg = loadImage("img/crate.png")
  grassImg = loadImage("img/grass.jpg")
  slingImg = loadImage("img/slingshot.png")
  pigImg = loadImage("img/pig.png");
  bgImg = loadImage("img/bg.png");

  
  
  launchSounds.push(loadSound("sound/bird_launch1.mp3"));
  launchSounds.push(loadSound("sound/bird_launch2.mp3"));
  launchSounds.push(loadSound("sound/bird_launch3.mp3"));
  
  pigSounds.push(loadSound("sound/hit_pig.mp3"));
  pigSounds.push(loadSound("sound/hit_pig1.mp3"));
  pigSounds.push(loadSound("sound/hit_pig2.mp3"));
  
  gameSound = loadSound("sound/background.mp3");
  slingshotSound = loadSound("sound/slingshot.mp3");
  gameOverSound = loadSound("sound/game_over.mp3");
}

function setup() {
  const canvas = createCanvas(640, 480);
  if (gameSound) {
    gameSound.loop();
  }
  startFlag = true;
  

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

  for (let j = 0; j<4; j++){
    for (let i=0; i<10; i++){
      const box = new Box(
        400 + 50*j, height - 40*i, 40, 40, crateImg,100
      );
      boxes.push(box);
    }
  }
  bird = new Bird(120, 380, 20, 2, redImg,birdLifetime);
  slingShot = new SlingShot(bird,slingImg);
  pigs.push(new Pig(500, 300, 20, pigImg, 100));
  pigs.push(new Pig(550, 300, 20, pigImg, 100));
  Matter.Events.on(engine, 'collisionStart', function(event) {
    if (!birdLaunched) return; // No reducir durabilidad si el pájaro no ha sido lanzado

    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const { bodyA, bodyB } = pair;

        boxes.forEach(box => {
            if (box.body === bodyA || box.body === bodyB) {
                if (bodyA === bird.body || bodyB === bird.body) {
                    box.reduceDurability(70);
                    bird.hasCollided = true; // Marcar el pájaro como chocado
                }
                if (bodyA === ground.body || bodyB === ground.body) {
                    box.reduceDurability(50);
                }
            }
        });

        pigs.forEach(pig => {
            if (pig.body === bodyA || pig.body === bodyB) {
                if (bodyA === bird.body || bodyB === bird.body) {
                    pig.reduceDurability(70);
                    bird.hasCollided = true; // Marcar el pájaro como chocado
                    
                }
                if (bodyA === ground.body || bodyB === ground.body) {
                    pig.reduceDurability(70);
                }
            }
        });
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
    text(`Score: ${score}`, 10, 30);
    text(`Lives: ${lives}`, 10, 60);

    Engine.update(engine);
    if (!isGameOver) {
    slingShot.fly(mc);
    if (!birdLaunched && bird.body.velocity.x !== 0 && bird.body.velocity.y !== 0) {
      birdLaunched = true; // Actualizar la bandera cuando el pájaro sea lanzado
    }
    }
    ground.show();
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

    if (bird.lifetime <= 0 && lives <= 0 || pigs.length === 0)
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
      text(`Game Over \nScore: ${score}`, width/2, height/2);
      pop();
    }

  }
}



function keyPressed(){
  while (startFlag == true)
  {
    startFlag = false;
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

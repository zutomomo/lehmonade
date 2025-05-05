var mode = 0;
let t = 0, noiseLFO = 0, nextCrackle = 0;
let gameOver = false;

let spriteSheet, sprite = {
  x: 200, y: 200,
  w: 32, h: 32, frames: 11,
  dir: 'down', frame: 0, speed: 2, animSpeed: 10
};

let audio = {};
let catImg, purrSound;
let catX, catY, catW = 64, catH = 64;
let gameOverSound;

function preload() {
  spriteSheet = loadImage('PC Computer - Omori - Omori.png');
  catImg    = loadImage('cat.png');
  purrSound = loadSound('purr.mp3');
   gameOverSound  = loadSound('theend.mp3');
}

function setup() {
  createCanvas(800,600);
    splash = new Splash();
  

  audio.ambient = new p5.Oscillator('triangle');
  audio.ambient.freq(100);
  audio.ambient.start();
  audio.ambient.amp(0.03, 2);

  audio.noise = new p5.Noise('pink');
  audio.noise.start();
  audio.noise.amp(0.02);

  audio.pop = new p5.Noise('white');
  audio.pop.start();
  audio.pop.amp(0);

  audio.env = new p5.Envelope();
  audio.env.setADSR(0.001, 0.01, 0, 0);
  audio.env.setRange(0.1, 0);


  catX = width - catW - 200;
  catY = height / 2 - catH / 200;
  
  vinylX = width / 3;
  vinylY = height / 2;
}

function draw() {
  

  
  if (mouseIsPressed == true && splash.update() == true) {
    mode = 1;
  }
  
  if (mode == 1) {
    splash.hide();
      if (gameOver) {
  
    background(0);
    return;
  }
  background(255);
  t += 0.01;
    translate(sin(t)*2, cos(t)*2);
    drawRoom();

  if      (keyIsDown(LEFT_ARROW))  sprite.x -= sprite.speed, sprite.dir = 'left';
  else if (keyIsDown(RIGHT_ARROW)) sprite.x += sprite.speed, sprite.dir = 'right';
  else if (keyIsDown(UP_ARROW))    sprite.y -= sprite.speed, sprite.dir = 'up';
  else if (keyIsDown(DOWN_ARROW))  sprite.y += sprite.speed, sprite.dir = 'down';

  if (frameCount % sprite.animSpeed === 0) {
    sprite.frame = (sprite.frame + 1) % sprite.frames;
  }

  const fx = sprite.frame * sprite.w;
  const fy = { down:0, left: sprite.h, right:2*sprite.h, up:3*sprite.h }[sprite.dir];
  image(spriteSheet, sprite.x, sprite.y, sprite.w, sprite.h, fx, fy, sprite.w, sprite.h);

  image(catImg, catX, catY, catW, catH);
  if (
    sprite.x + sprite.w  > catX &&
    sprite.x             < catX + catW &&
    sprite.y + sprite.h  > catY &&
    sprite.y             < catY + catH
  ) {
    if (!purrSound.isPlaying()) purrSound.loop();
  } else if (purrSound.isPlaying()) {
    purrSound.stop();
  }
  

  audio.noise.amp(0.015 + sin(noiseLFO)*0.01, 0.1);
  noiseLFO += 0.004;
  if (millis() > nextCrackle) {
    audio.env.play(audio.pop);
    nextCrackle = millis() + random(100, 800);
  }

  drawGrainOverlay();
  maybeGlitch();
}
}

function keyPressed() {
  if (key === 'x' || key === 'X') {
    let resp = prompt("Have you had enough?");
    if (resp && resp.toLowerCase().startsWith('y')) {
      gameOver = true;
      if (!gameOverSound.isPlaying()) {
        gameOverSound.loop(); 
      }
    }
  }
}

function drawRoom() {
  noFill(); stroke(0); strokeWeight(2);
  rect(200, 200, 400, 300, 12);         

  noStroke(); fill(0);
  rect(width/2 - 16, height/2 - 8, 32, 16, 3); 

  stroke(120,60,0); strokeWeight(2);
  line(width/2 - 5, height/2 - 8, width/2 - 5, height/2 + 8);
  line(width/2 + 5, height/2 - 8, width/2 + 5, height/2 + 8);

  noStroke();                          
  const lx = width/2 + 26, ly = height/3;
  rect(lx - 8, ly + 6, 16, 6, 2);
  rect(lx - 2, ly - 24, 4, 24, 2);
  triangle(lx - 16, ly - 24, lx + 16, ly - 24, lx, ly - 80);
}

function drawGrainOverlay() {
  noStroke();
  for (let i = 0; i < 1000; i++) {
    fill(random(230,255), 20);
    rect(random(width), random(height), 1, 1);
  }
}

function maybeGlitch() {
  if (random() < 0.005) {
    fill(0, 30);
    rect(0, random(height), width, random(5,20));
  }
}


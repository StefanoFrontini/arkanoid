class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Ball {
  constructor() {
    this.randomNumberBetween = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    this.heading = this.randomNumberBetween(0, 2 * Math.PI);
    // this.size = new Vec(10, 10);
    this.r = 5;
    this.pos = new Vec(canvas.width / 2, canvas.height / 2);
    this.dir = new Vec(Math.cos(this.heading), Math.sin(this.heading));
    this.vel = new Vec(0.2, 0.2);
  }
  draw(ctx) {
    // ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }
  // drawDir(ctx) {
  //   ctx.beginPath();
  //   ctx.moveTo(this.pos.x, this.pos.y);
  //   ctx.lineTo(this.pos.x + this.dir.x * 200, this.pos.y + this.dir.y * 200);
  //   ctx.stroke();
  // }
  update(deltaTime) {
    this.pos.x += this.dir.x * this.vel.x * deltaTime;
    this.pos.y += this.dir.y * this.vel.y * deltaTime;

    (this.pos.x + this.r > canvas.width || this.pos.x - this.r < 0) &&
      (this.dir.x = -this.dir.x);

    (this.pos.y + this.r > canvas.height || this.pos.y - this.r < 0) &&
      (this.dir.y = -this.dir.y);
  }
}

class Paddle {
  constructor() {
    this.size = new Vec(150, 20);
    this.pos = new Vec(
      canvas.width / 2 - this.size.x / 2,
      canvas.height - this.size.y - 10
    );
    this.dir = new Vec();
    this.paddleSpeed = 0.4;
    this.vel = new Vec(this.paddleSpeed, 0);
  }
  draw(ctx) {
    ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
  moveLeft() {
    this.vel.x = this.paddleSpeed;
    this.dir.x = -1;
  }
  moveRight() {
    this.vel.x = this.paddleSpeed;
    this.dir.x = 1;
  }
  stop() {
    this.vel.x = 0;
  }
  update(deltaTime) {
    this.pos.x += this.dir.x * this.vel.x * deltaTime;
    this.pos.x < 0 && (this.pos.x = 0);
    this.pos.x + this.size.x > canvas.width &&
      (this.pos.x = canvas.width - this.size.x);
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.ball = new Ball();
    this.paddle = new Paddle();
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);

    // game loop
    let lastTime = 0;
    this.gameLoop = (timestamp) => {
      let deltaTime = timestamp - lastTime;

      if (lastTime) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.update(deltaTime);
        this.ball.draw(this.ctx);
        // ball.drawDir(ctx);
        this.paddle.update(deltaTime);
        this.paddle.draw(this.ctx);
      }

      lastTime = timestamp;

      requestAnimationFrame(this.gameLoop);
    };
  }
  start() {
    requestAnimationFrame(this.gameLoop);
  }
}

const canvas = document.getElementById("canvas");
const game = new Game(canvas);
console.log(game);

window.addEventListener("keydown", (e) => {
  if (e.defaultPrevented) {
    return;
  }
  switch (e.code) {
    case "ArrowLeft":
    case "KeyA":
      game.paddle.moveLeft();
      break;
    case "ArrowRight":
    case "KeyD":
      game.paddle.moveRight();
      break;
  }
  e.preventDefault();
});

window.addEventListener("keyup", (e) => {
  if (e.defaultPrevented) {
    return; // Do nothing if event already handled
  }
  switch (e.code) {
    case "ArrowLeft":
    case "KeyA":
      game.paddle.dir.x < 0 && game.paddle.stop();
      break;
    case "ArrowRight":
    case "KeyD":
      game.paddle.dir.x > 0 && game.paddle.stop();
      break;
  }
  // Consume the event so it doesn't get handled twice
  e.preventDefault();
});

canvas.addEventListener("click", () => {
  game.start();
});

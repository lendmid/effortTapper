console.group();

const RAD = Math.PI / 180;
const scrn = document.getElementById("canvas");
const sctx = scrn.getContext("2d");
scrn.tabIndex = 1;

const sceneHeight = 500;
const sceneWidth = 1000;
const pointRadius = 35;

const drawPoint = (x, y) => {
  sctx.beginPath();
  sctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
  sctx.fillStyle = "#E7E7E7";
  sctx.fill();
  sctx.save();
};

const drawDashedLine = (height) => {
  sctx.beginPath();
  sctx.setLineDash([15, 15]);
  sctx.moveTo(0, height);
  sctx.lineTo(1000, height);
  sctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  sctx.stroke();

  sctx.save();
};

scrn.addEventListener("click", () => {
  switch (state.curr) {
    case state.getReady:
      state.curr = state.Play;
      break;
    case state.Play:
      point.flap();
      break;
    case state.gameOver:
      state.curr = state.getReady;
      point.speed = 0;
      point.y = 100;
      // pipe.pipes = [];
      UI.score.curr = 0;
      break;
  }
});

let frames = 0;
let dx = 2;
const state = {
  curr: 0,
  getReady: 0,
  Play: 1,
  gameOver: 2,
};

const sibling = {
  // sprite: new Image(),
  x: 0,
  y: 100,
  draw: function () {
    // sctx.save();
    drawDashedLine(this.y);
    // console.log("scrn.height - this.sprite.height: ", scrn.height - this.sprite.height)
    // this.y = parseFloat(scrn.height - this.sprite.height);
    // sctx.drawImage(this.sprite, this.x, this.y);
    // const fixTaxLevel = sceneHeight * 0.3;
    // sctx.beginPath();
    // this.y = sceneHeight - fixTaxLevel
    // sctx.save();
    // sctx.fillStyle = "#FF000020";
    // sctx.fillRect(0, sceneHeight - fixTaxLevel, sceneWidth, fixTaxLevel);
    // sctx.stroke();
  },
  // update: function () {
  //   if (state.curr !== state.Play) return;
  //   debugger
  //   this.x -= dx;
  //   this.x = this.x % (this.sprite.width / 2);
  // },
};

const floor = {
  // sprite: new Image(),
  x: 0,
  y: 600,
  draw: function () {
    drawDashedLine(this.y);
  },
};

const point = {
  x: 250,
  y: 350,
  speed: 0,
  gravity: 0.125, //0.05
  thrust: 3.6,
  frame: 0,
  draw: function () {
    const isFloorIntersection = this.y + pointRadius > floor.y;
    // sctx.save();
    drawPoint(this.x, this.y);
    if (!isFloorIntersection) {
      this.speed += this.gravity;
    }
    this.y += this.speed;
    // this.y += this.speed;
    // sctx.restore();
    console.log("point: ", this);
    // let h = this.animations[this.frame].sprite.height;
    // let w = this.animations[this.frame].sprite.width;
    // sctx.save();
    // sctx.translate(this.x, this.y);
    // sctx.rotate(this.rotatation * RAD);
    // sctx.drawImage(this.animations[this.frame].sprite, -w / 2, -h / 2);
    // sctx.restore();
  },
  flap: function () {
    if (this.y > 0) {
      this.speed = -this.thrust;
    }
  },
};

const UI = {
  getReady: { sprite: new Image() },
  gameOver: { sprite: new Image() },
  tap: [{ sprite: new Image() }, { sprite: new Image() }],
  score: {
    curr: 0,
    best: 0,
  },
  x: 0,
  y: 0,
  tx: 0,
  ty: 0,
  frame: 0,
  draw: function () {
    switch (state.curr) {
      case state.getReady:
        this.y = parseFloat(scrn.height - this.getReady.sprite.height) / 2;
        this.x = parseFloat(scrn.width - this.getReady.sprite.width) / 2;
        this.tx = parseFloat(scrn.width - this.tap[0].sprite.width) / 2;
        this.ty =
          this.y + this.getReady.sprite.height - this.tap[0].sprite.height;
        sctx.drawImage(this.getReady.sprite, this.x, this.y);
        sctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
        break;
      case state.gameOver:
        this.y = parseFloat(scrn.height - this.gameOver.sprite.height) / 2;
        this.x = parseFloat(scrn.width - this.gameOver.sprite.width) / 2;
        this.tx = parseFloat(scrn.width - this.tap[0].sprite.width) / 2;
        this.ty =
          this.y + this.gameOver.sprite.height - this.tap[0].sprite.height;
        sctx.drawImage(this.gameOver.sprite, this.x, this.y);
        sctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
        break;
    }
    this.drawScore();
  },
  drawScore: function () {
    sctx.fillStyle = "#FFFFFF";
    sctx.strokeStyle = "#000000";
    switch (state.curr) {
      case state.Play:
        sctx.lineWidth = "2";
        sctx.font = "35px Squada One";
        sctx.fillText(this.score.curr, scrn.width / 2 - 5, 50);
        sctx.strokeText(this.score.curr, scrn.width / 2 - 5, 50);
        break;
      case state.gameOver:
        sctx.lineWidth = "2";
        sctx.font = "40px Squada One";
        let sc = `SCORE :     ${this.score.curr}`;
        try {
          this.score.best = Math.max(
            this.score.curr,
            localStorage.getItem("best")
          );
          localStorage.setItem("best", this.score.best);
          let bs = `BEST  :     ${this.score.best}`;
          sctx.fillText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
          sctx.strokeText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
          sctx.fillText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);
          sctx.strokeText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);
        } catch (e) {
          sctx.fillText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);
          sctx.strokeText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);
        }

        break;
    }
  },
  update: function () {
    if (state.curr == state.Play) return;
    this.frame += frames % 10 == 0 ? 1 : 0;
    this.frame = this.frame % this.tap.length;
  },
};

UI.gameOver.sprite.src = "img/go.png";
UI.getReady.sprite.src = "img/getready.png";
UI.tap[0].sprite.src = "img/tap/t0.png";
UI.tap[1].sprite.src = "img/tap/t1.png";

function draw() {
  sctx.fillStyle = "#fff";
  sctx.fillRect(0, 0, scrn.width, scrn.height);

  sibling.draw();
  floor.draw();
  point.draw();
  UI.draw();
}

function gameLoop() {
  draw();
  frames++;
  // console.log("state: ", state);
}

setInterval(gameLoop, 20);

console.groupEnd();

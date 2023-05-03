const RAD = Math.PI / 180;
const scrn = document.getElementById("canvas");
const sctx = scrn.getContext("2d");
scrn.tabIndex = 1;

const frmaeHeight = 700;
const sceneHeight = 500;
const sceneWidth = 1000;
const siblingHeight = 100;
const floorHeight = 600;

const pointRadius = 35;
const pointXCoord = 350;

const maxSceneHeght = siblingHeight + pointRadius; // 135
const minSceneHeight = floorHeight - pointRadius; // 565
const minSceneMaxHeight = minSceneHeight - maxSceneHeght; // 440

const dx = 2;

const throttle = (callback, delay) => {
  let shouldWait = false;
  return (...args) => {
    if (shouldWait) return;
    callback(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
};

let frames = 0;
let sceneX = 0;
let coordsHistory = [];
const state = {
  curr: 0,
  getReady: 0,
  Play: 1,
  gameOver: 2,
  scorePerSecond: 0,
  scoreEarned: 0,
  scoreScored: 0,
  scoreTaxed: 0,
};
const pointColor = "#DCDCDC";
const borderColor = "#CCCCCC";
const lineWidth_0_5 = 0.5;
const lineWidth_1 = 1;
const lineWidth_2 = 2;
const lineWidth_8 = 8;
const h1Font = "700 28px courier";
const h2Font = "400 22px Tahoma";

const setTextStyles = (h1 = true) => {
  sctx.font = h1 ? h1Font : h2Font;
  sctx.setLineDash([]);
  sctx.fillStyle = "black";
  sctx.strokeStyle = "black";
};

const drawPoint = (x, y) => {
  sctx.fillStyle = pointColor;
  sctx.beginPath();
  sctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
  sctx.fill();
};

const getScorePerSecondByY = (y) => {
  const result = Math.abs(
    Math.floor((100 * (y - minSceneHeight)) / minSceneMaxHeight)
  );
  return result;
};

const getYByScorePerSecond = (score) => {
  const minSceneMaxHeight = floorHeight - siblingHeight;
  return Math.abs(Math.floor((minSceneMaxHeight * score) / 100 - floorHeight));
};

const drawScorePerSecond = (x, y) => {
  setTextStyles(true);

  let scorePerSecond = getScorePerSecondByY(y);
  sctx.textAlign = "left";
  sctx.fillText(scorePerSecond + " $/s", x + 45, y - 10);

  state.scorePerSecond = scorePerSecond;
};

const increaseScoreEarned = throttle(
  () => (state.scoreEarned += state.scorePerSecond),
  1000
);
const decreaseScoreTaxed = throttle(
  () => (state.scoreTaxed -= 30),
  1000
);

const drawEarnedScore = () => {
  setTextStyles(false);
  sctx.textAlign = "right";
  sctx.fillText(state.scoreEarned + "$", scrn.width - 100, 40);
  sctx.textAlign = "left";
  sctx.fillStyle = "#A2A2A2";
  sctx.fillText("earned", scrn.width - 90, 40);
  increaseScoreEarned();
};
const drawTaxed = () => {
  setTextStyles(false);
  sctx.textAlign = "right";
  sctx.fillStyle = "red";
  sctx.fillText(state.scoreTaxed + "$", scrn.width - 100, 70);
  sctx.textAlign = "left";
  sctx.fillText("taxed", scrn.width - 90, 70);
};

const drawScoredScore = () => {
  setTextStyles();
  sctx.textAlign = "right";
  sctx.fillText(state.scoreEarned - state.scoreTaxed + "$", 150, 60);
  sctx.textAlign = "left";
  sctx.fillStyle = "#A2A2A2";
  sctx.fillText("scored", 160, 60);
};

const drawLine = (last200Coords) => {
  sctx.setLineDash([]);
  sctx.lineWidth = lineWidth_2;
  sctx.beginPath();
  if (last200Coords.length < 2) return;
  for (let i = 0; i < last200Coords.length - 1; i++) {
    const lastPoint = last200Coords[i];
    const firstPoint = last200Coords[i + 1];

    const x_mid = (lastPoint.x + firstPoint.x) / 2;
    const y_mid = (lastPoint.y + firstPoint.y) / 2;
    const cp_x = (x_mid + lastPoint.x) / 2;
    const cp_y = (y_mid + lastPoint.y) / 2;

    sctx.quadraticCurveTo(cp_x, cp_y, x_mid, y_mid);
  }
  // const isTaxIntersection = firstPoint.x < tax.taxes[0].x && firstPoint.y > tax.taxes[0].y;
  // sctx.strokeStyle = isTaxIntersection ? "red" : "black";

  // const gradient = sctx.createLinearGradient(tax.taxes[0].x, siblingHeight, floorHeight, 500);
  // gradient.addColorStop(0, "black");
  // gradient.addColorStop(0.6, "black");
  // gradient.addColorStop(0.8, "red");
  // gradient.addColorStop(1, "red");

  // sctx.strokeStyle = pointXCoord < tax.taxes[0].x ? "black" : gradient;
  sctx.strokeStyle = "black";
  sctx.stroke();
  // sctx.save();
};

const drawDashedLine = (y, x) => {
  sctx.lineDashOffset = -x;
  sctx.lineWidth = lineWidth_1;
  sctx.beginPath();
  sctx.setLineDash([15, 15]);
  sctx.moveTo(0, y);
  sctx.lineTo(sceneWidth, y);
  sctx.strokeStyle = borderColor;
  sctx.stroke();
  // sctx.save();
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
      UI.score.curr = 0;
      break;
  }
});

const tax = {
  // gap: 85,
  moving: true,
  taxes: [],
  draw: function () {
    for (let tax of this.taxes) {
      sctx.fillStyle = "#E9AAAA";
      const taxWidth = sceneWidth - tax.x;
      const taxHeight = getYByScorePerSecond(0) - getYByScorePerSecond(30);
      sctx.fillRect(tax.x, tax.y, taxWidth, taxHeight);
      if (tax.x < 900) {
        sctx.fillStyle = "red";
        sctx.fillText("-30 $/s", 920, tax.y + 30);
      }
    }
    if (state.curr != state.Play) return;

    if (frames > 200 == 0 && this.taxes.length === 0) {
      this.taxes.push({
        x: sceneWidth,
        y: getYByScorePerSecond(30),
      });
    }
    this.taxes.forEach((taxe) => {
      taxe.x -= dx;
    });
  },
};

const point = {
  x: pointXCoord,
  y: 350,
  speed: 0,
  gravity: 0.125,
  frame: 0,
  draw: function () {
    if (state.curr !== state.Play) {
      drawPoint(this.x, this.y);
      return;
    }

    const bottomOfThePoint = this.y + pointRadius;
    const floorPointIntersection = bottomOfThePoint > floorHeight;
    const topOfThePoint = this.y - pointRadius;

    this.speed += this.gravity;

    if (!floorPointIntersection) {
      const isNextYLowerThenFloor = bottomOfThePoint + this.speed > floorHeight;
      const isNextYHigherThenSibbling =
        topOfThePoint + this.speed < siblingHeight;
      if (isNextYLowerThenFloor) {
        this.y = floorHeight - pointRadius;
      } else if (isNextYHigherThenSibbling) {
        this.y = siblingHeight + pointRadius;
      } else {
        this.y += this.speed;
      }
    }

    const start =
      coordsHistory.length - 199 > 0 ? coordsHistory.length - 199 : 0;
    const last200Coords = coordsHistory.slice(start);
    coordsHistory = last200Coords.map((coords) => {
      return { x: coords.x - dx, y: coords.y, date: coords.date };
    });
    const data = { x: this.x, y: this.y, date: Date.now() };
    coordsHistory.push(data);
    // throtle(coordsHistory.push(data), 1000);
    this.drawDashedCrosshair();

    drawPoint(this.x, this.y);
    drawLine(coordsHistory);

    drawScorePerSecond(this.x, this.y);
    this.checkIsTaxIntersection()
    // console.log("coordsHistory: ", coordsHistory);
  },
  flap: function () {
    if (this.y < 0) return;
    let thrust = 5 - Math.log1p(state.scorePerSecond / 1.5 || 1);
    this.speed = -thrust;
  },
  drawDashedCrosshair: function (y, x) {
    sctx.lineDashOffset = 0;
    sctx.lineWidth = lineWidth_0_5;
    sctx.beginPath();
    sctx.setLineDash([15, 15]);

    sctx.moveTo(this.x, 0);
    sctx.lineTo(this.x, frmaeHeight);

    sctx.moveTo(0, this.y);
    sctx.lineTo(sceneWidth, this.y);

    sctx.strokeStyle = borderColor;
    sctx.stroke();
    // sctx.save();
  },
  checkIsTaxIntersection: function () {
      const isTaxIntersection = this.x > tax.taxes[0].x && this.y > tax.taxes[0].y;
      if (isTaxIntersection) decreaseScoreTaxed()
  }
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
    setTextStyles();
    switch (state.curr) {
      case state.Play:
        drawEarnedScore();
        drawScoredScore();
        drawTaxed();
        break;
      case state.gameOver:
        let sc = `SCORE :     ${this.score.curr}`;
        try {
          this.score.best = Math.max(
            this.score.curr,
            localStorage.getItem("best")
          );
          localStorage.setItem("best", this.score.best);
          let bs = `BEST  :     ${this.score.best}`;
          sctx.fillText(sc, scrn.width / 2 - 80, scrn.height / 2);
          sctx.strokeText(sc, scrn.width / 2 - 80, scrn.height / 2);
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
    if (state.curr === state.Play) return;
    this.frame += frames % 10 === 0 ? 1 : 0;
    this.frame = this.frame % this.tap.length;
  },
};

function draw() {
  sctx.fillStyle = "white";
  sctx.fillRect(0, 0, scrn.width, scrn.height);

  // drawDashedLine(siblingHeight, sceneX);
  tax.draw();
  drawDashedLine(floorHeight, sceneX);

  point.draw();
  UI.draw();
}

function update() {
  // sibling.update();
  // floor.update();
  UI.update();

  if (state.curr !== state.Play) return;
  sceneX -= dx;
}

function gameLoop() {
  draw();
  update();
  frames++;

  // window.requestAnimationFrame(gameLoop);
  // console.log("state: ", state);
}
const runGame = () => {
  UI.gameOver.sprite.src = "img/gameOver.png";
  UI.getReady.sprite.src = "img/getReady.png";
  UI.tap[0].sprite.src = "img/tap1.png";
  UI.tap[1].sprite.src = "img/tap2.png";

  setInterval(gameLoop, 20);
  // window.requestAnimationFrame(gameLoop);
};

runGame();

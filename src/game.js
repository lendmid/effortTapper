import {dx, floorHeight, pointRadius, pointXCoord, siblingHeight} from "./constst"
import {coordsHistory, frames, sceneX, state,} from "./state"
import {drawDashedLine, drawLine, drawPoint, drawScene} from "./draw"
import {UI} from "./UI"


const scrn = document.getElementById("canvas");
const sctx = scrn.getContext("2d");
scrn.tabIndex = 1;

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
const sibling = {
    y: siblingHeight,
    draw: function () {
        drawDashedLine(this.y, sceneX);

        if (state.curr !== state.Play) return;
        sceneX -= dx;
    },
};

const floor = {
    y: floorHeight,
    draw: function () {
        drawDashedLine(this.y, sceneX);
    },
};

const point = {
    x: pointXCoord,
    y: 350,
    speed: 0,
    // gravity: 0.125,
    gravity: 0.5,
    acceleration: 3,
    thrust: 10,
    // thrust: 3.6,
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
        drawPoint(this.x, this.y);

        coordsHistory = coordsHistory.map((coords, i, arr) => {
            return {x: coords.x - dx, y: coords.y};
        });
        coordsHistory.push({x: this.x, y: this.y});

        console.log("this.coordsHistory", coordsHistory);
        drawLine(coordsHistory);
    },
    flap: function () {
        if (this.y < 0) return;
        this.speed = -this.thrust;
    },
};

function update() {
    // sibling.update();
    // floor.update();
    UI.update();
}

function gameLoop() {
    update();
    drawScene();
    frames++;
    // console.log("state: ", state);
}

setInterval(gameLoop, 20);

export {
    scrn,
    sctx
}
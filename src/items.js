import {dx, floorHeight, pointRadius, pointXCoord, siblingHeight} from "./constst"
import {coordsHistory, sceneX, state,} from "./state"
import {drawDashedLine, drawLine, drawPoint} from "./draw"

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
            const isNextYHigherThenSibling = topOfThePoint + this.speed < siblingHeight;
            if (isNextYLowerThenFloor) {
                this.y = floorHeight - pointRadius;
            } else if (isNextYHigherThenSibling) {
                this.y = siblingHeight + pointRadius;
            } else {
                this.y += this.speed;
            }
        }
        drawPoint(this.x, this.y);

        coordsHistory = coordsHistory.map((coords) => {
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

export {
    sibling,
    floor,
    point
}
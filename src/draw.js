import {scrn, sctx} from "./game"
import {UI} from "./UI";
import {bottomColor, pointColor, pointRadius} from "./constst";
import {floor, point, sibling} from "./items";

const drawPoint = (x, y) => {
    sctx.beginPath();
    sctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
    sctx.fillStyle = pointColor;
    sctx.fill();
    sctx.save();
};

const drawLine = (coordsHistory) => {
    sctx.beginPath();
    sctx.setLineDash([]);
    sctx.lineWidth = 2;

    for (const coord of coordsHistory.slice(coordsHistory.length - 250, 0)) {
        sctx.lineTo(coord.x, coord.y);
    }
    sctx.strokeStyle = "black";
    sctx.stroke();
    sctx.save();
};

const drawDashedLine = (y, x) => {
    sctx.beginPath();
    sctx.setLineDash([15, 15]);
    sctx.moveTo(0, y);
    sctx.lineTo(1000, y);
    sctx.strokeStyle = bottomColor;
    sctx.lineDashOffset = -x;
    sctx.stroke();
    sctx.save();
};

function drawScene() {
    sctx.fillStyle = "white";
    sctx.fillRect(0, 0, scrn.width, scrn.height);

    sibling.draw();
    floor.draw();
    point.draw();
    // historyLine.draw();
    UI.draw();
}

export {drawPoint, drawLine, drawDashedLine, drawScene}
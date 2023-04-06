import { scrn, sctx } from "..";
import { UI } from "../entities/UI";
import { bottomColor, pointColor, pointRadius } from "../state/constst";
import { floor, point, sibling } from "../entities/entities";

const drawPoint = (x, y) => {
  sctx.beginPath();
  sctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
  sctx.fillStyle = pointColor;
  sctx.fill();
  sctx.save();
};

// let start = { x: 0, y: 0 };
// let cp1 = { x: 180, y: 10 };
// let cp2 = { x: 100, y: 60 };
// let end = { x: 200, y: 80 };

const drawLine = (coordsHistory) => {
  sctx.beginPath();
  sctx.setLineDash([]);
  sctx.lineWidth = 2;

  const last250Coords = coordsHistory.slice(coordsHistory.length - 250, 0);
  // const last2Points = [];
  for (const coords of last250Coords) {
    // const startPoint = last2Points[0];
    // const endPoint = last2Points[1];

    // const cp1 = {
    //   x: (startPoint.x - endPoint.x) * 0.33,
    //   y: (startPoint.y - endPoint.y) * 0.33,
    // };
    // const cp2 = {
    //   x: (startPoint.x - endPoint.x) * 0.66,
    //   y: (startPoint.y - endPoint.y) * 0.66,
    // };
    // if (last2Points.length === 1) {
    //   sctx.bezierCurveTo(
    //     startPoint.x,
    //     startPoint.y,
    //     endPoint.x,
    //     endPoint.y,
    //     end.x,
    //     end.y
    //   );
    //   sctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, endPoint.x, endPoint.y);

    //   sctx.lineTo(coords.x, coords.y);
    // } else {
    //   last2Points.push(coords);
    // }

    sctx.lineTo(coords.x, coords.y);
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

export { drawPoint, drawLine, drawDashedLine, drawScene };

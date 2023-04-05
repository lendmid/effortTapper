import {frames, state,} from "./state"
import {drawScene} from "./draw"
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

function updateScene() {
    // sibling.update();
    // floor.update();
    UI.update();
}

function gameLoop() {
    updateScene();
    drawScene();
    frames++;
    // console.log("state: ", state);
}

setInterval(gameLoop, 20);

export {
    scrn,
    sctx
}
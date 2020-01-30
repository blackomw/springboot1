import { Blocks } from './blocks.js';
import { StartPanel } from './panel.js';

const canvasW = 600, canvasH = 600;
const canvas = document.getElementById("canvas");
canvas.width = canvasW, canvas.height = canvasH;
const ctx = canvas.getContext("2d");

let roomIdDiv = document.getElementById('roomId');
let playerIdxDiv = document.getElementById('playerIdx');
let scoreDiv = document.getElementById('score');
// canvas.addEventListener("touchstart", (e) => touchHandler(e), false);
// canvas.addEventListener("touchend", (e) => touchHandler(e), false);
// canvas.addEventListener("mousedown", (e) => touchHandler(e), false);
// canvas.addEventListener("mouseup", (e) => touchHandler(e), false);
canvas.addEventListener("click", (e) => touchHandler(e), false);

function log(msg) {
    const p = document.getElementById('log');
    p.innerHTML = msg + "\n" + p.innerHTML;
}

function touchHandler(e) {
    send("1");
}

let playerIdx = 0, frameIdx = 0, roomId = 0;
let playerIdxes = []; // [playerIdx]
let frameData = []; // frameIdx=>[{playerIdx=>op}]

let stop = false;
let playerPoses = {}; // playerIdx=>[x,y]
let playerScores = {}; // playerIdx=>score
const playerW = 20, playerH = 20, playerSpeed = 6, clickOffset = -46;
let playerX = 100, playerY = 300, playerXOffset = 100;

const blocksSpeed = 4, blockInitOffsetX = 300, blockWidth = 80, blankWidth = 120;
let blocksOffsetX = 0;
let blocks = new Blocks(blockInitOffsetX, canvasW, canvasH, blockWidth, blankWidth);
blocks.genBlocks();
blocks.drawBlocks(ctx, blocksOffsetX);

let startPanel = new StartPanel(canvasW, canvasH);
startPanel.drawPanel();

function drawPlayer(pIdx, x, y) {
    ctx.fillStyle = pIdx % 2 == 0 ? "rgba(0,0,255,1)" : "rgba(255,0,0,1)";
    ctx.beginPath();
    ctx.rect(x, y, playerW, playerH);
    ctx.fill();
}

function calcScore(px) {
    return Math.max(0, Math.floor(-(blockInitOffsetX - blankWidth + blocksOffsetX - px) / (blockWidth + blankWidth)));
}

function updateScoreDiv() {
    let text = "";
    for (let pIdx in playerScores) {
        text += "<div>player" + pIdx + ": " + playerScores[pIdx] + "</div>";
    }
    scoreDiv.innerHTML = text;
}

function onFrameData(f) {
    if (stop) {
        return;
    }
    ctx.clearRect(0, 0, canvasW, canvasH);

    blocksOffsetX -= blocksSpeed;
    // check x axis collision
    for (let pIdx in playerPoses) {
        let x = playerPoses[pIdx][0], y = playerPoses[pIdx][1];
        if (blocks.checkCollision(blocksOffsetX, x, y, playerW, playerH)) {
            stop = true;
            break;
        }
    }
    blocks.drawBlocks(ctx, blocksOffsetX);
    if (stop) {
        for (let pIdx in playerPoses) {
            drawPlayer(pIdx, playerPoses[pIdx][0], playerPoses[pIdx][1]);
        }
        return;
    }
    // check y axis collision
    for (let pIdx in f) {
        let x = playerPoses[pIdx][0], y = playerPoses[pIdx][1];
        let op = f[pIdx];
        if (op == '1')
            y += clickOffset;
        else
            y += playerSpeed;

        if (y <= 0) { // collision with ceiling
            y = 0;
            stop = true;
        } else if (y >= canvasH - playerH) { // collision with floor
            y = canvasH - playerH;
            stop = true;
        } else {
            let by = blocks.checkCollision(blocksOffsetX, x, y, playerW, playerH);
            if (by > 0) { // collision with upper block
                y = by;
                stop = true;
            } else if (by < 0) { // collison with bottom block
                y = -by - playerH;
                stop = true;
            }
        }

        drawPlayer(pIdx, playerPoses[pIdx][0], y);
        playerPoses[pIdx][1] = y;
    }

    if (stop) {
        return;
    }

    let updateScore = false;
    for (let pIdx in playerPoses) {
        let score = calcScore(playerPoses[pIdx][0]);
        if (playerScores[pIdx] != score) {
            playerScores[pIdx] = score;
            updateScore = true;
        }
    }
    if (updateScore) {
        updateScoreDiv();
    }

    blocks.updateBlocks(blocksOffsetX);
}

// function getMousePos(canvas, event) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: event.clientX - rect.left,
//         y: event.clientY - rect.top
//     };
// }

function onUpdateRoomData() {
    playerIdxes.sort();
    for (let i = 0, n = playerIdxes.length; i < n; ++i) {
        let x = playerX + playerXOffset * i;
        let pIdx = playerIdxes[i];
        drawPlayer(pIdx, x, playerY);
        playerPoses[pIdx] = [x, playerY];
        playerScores[pIdx] = 0;
    }
    updateScoreDiv();
    console.log(playerPoses);
}

function handleMsg(msg) {
    let type = msg.charAt(0);
    if (type == 'r') { // room data
        let msgArr = msg.split(',');
        roomId = msgArr[1];
        playerIdx = msgArr[msgArr.length - 1];
        roomIdDiv.innerText = roomId;
        playerIdxDiv.innerText = playerIdx;
        playerIdxes = [];
        for (let i = 2; i < msgArr.length - 1; ++i) {
            playerIdxes.push(msgArr[i]);
        }
        onUpdateRoomData();
    } else if (type == 'f') { // frame data
        // TODO 多player更新显示
        // TODO 将消息放入队列，按一定频率更新显示（平滑网络延迟）
        let msgArr = msg.split(';');
        frameIdx = msgArr[0].substring(1);
        frameData[frameIdx] = {};
        for (let i = 1, len = msgArr.length - 1; i < len; ++i) {
            let opArr = msgArr[i].split(',');
            let pIdx = opArr[0];
            let op = opArr[1];
            frameData[frameIdx][pIdx] = op;
        }

        onFrameData(frameData[frameIdx]);
    }
}

let websocket = null;
connectWebSocket();

function connectWebSocket() { //建立WebSocket连接
    console.log("start ws...");
    websocket = new WebSocket("ws://127.0.0.1:80/wsdemo"); //建立webSocket连接

    websocket.onopen = function () { //打开webSokcet连接时，回调该函数
        console.log("on open");
        send("0");
    }

    websocket.onclose = function (e) { //关闭webSocket连接时，回调该函数
        console.log("on close:", e.code, e.reason, e.data);
    }

    websocket.onerror = function (e) { //错误处理
        console.log("on error:", e.code, e.reason, e.data);
    }

    websocket.onmessage = function (msg) { //接收信息
        handleMsg(msg.data);
    }
}

//发送消息
function send(msg) {
    websocket.send(msg);
}

//关闭连接
function closeWebSocket() {
    if (websocket != null) {
        websocket.close();
    }
}
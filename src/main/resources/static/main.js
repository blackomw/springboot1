import { Blocks } from './blocks.js';
import { StartPanel } from './panel.js';

const canvasW = 600, canvasH = 600;
const canvas = document.getElementById("canvas");
canvas.width = canvasW, canvas.height = canvasH;
const ctx = canvas.getContext("2d");
// canvas.addEventListener("touchstart", (e) => touchHandler(e), false);
// canvas.addEventListener("touchend", (e) => touchHandler(e), false);
// canvas.addEventListener("mousedown", (e) => touchHandler(e), false);
// canvas.addEventListener("mouseup", (e) => touchHandler(e), false);
canvas.addEventListener("click", (e) => touchHandler(e), false);

const canvasPanel = document.getElementById("canvasPanel");
canvasPanel.width = canvasW, canvasPanel.height = canvasH;
const ctxPanel = canvasPanel.getContext("2d");
canvasPanel.addEventListener("click", (e) => panelTouchHandler(e), false);
// canvasPanel.addEventListener("touchstart", (e) => panelTouchHandler(e, true), false);
// canvasPanel.addEventListener("touchend", (e) => panelTouchHandler(e), false);
// canvasPanel.addEventListener("mousedown", (e) => panelTouchHandler(e, true), false);
// canvasPanel.addEventListener("mouseup", (e) => panelTouchHandler(e), false);

let playerIdx = 0, frameIdx = -1, roomSeed = 0;
let playerIdxes = []; // [playerIdx]
let frameData = []; // frameIdx=>[{playerIdx=>op}]

let stop = false;
let playerPoses = {}; // playerIdx=>[x,y]
let playerScores = {}; // playerIdx=>score
const playerW = 20, playerH = 20, playerSpeed = 6, clickOffset = -46;
let playerX = 100, playerY = 300, playerXOffset = 100;

const blocksSpeed = 4, blockInitOffsetX = 300, blockWidth = 80, blankWidth = 120;
let blocksOffsetX = 0;
let blocks = null;

// const State = { Matching: 0, Matched: 1, Playing: 2, End: 3 };
const PlayerOp = { Ready: '0', Start: '1', Click: '2', End: '3' };
let startPanel = new StartPanel(ctxPanel, canvasPanel.width, canvasPanel.height);


function panelTouchHandler(e) {
    console.log("panelTouchHandler");
    if (startPanel.touchHandler(e)) {
        onReady();
    }
}

function touchHandler(e) {
    console.log("touchHandler");
    send(PlayerOp.Click);
}

function drawPlayer(isRed, x, y) {
    ctx.fillStyle = isRed ? "rgba(255,0,0,1)" : "rgba(0,0,255,1)";
    ctx.beginPath();
    ctx.rect(x, y, playerW, playerH);
    ctx.fill();
}

function drawPlayers() {
    for (let pIdx in playerPoses) {
        drawPlayer(playerIdx == pIdx, playerPoses[pIdx][0], playerPoses[pIdx][1]);
    }
}

function resetBlocks() {
    blocksOffsetX = 0;
    blocks = new Blocks(roomSeed, blockInitOffsetX, canvasW, canvasH, blockWidth, blankWidth);
    blocks.genBlocks();
    blocks.drawBlocks(ctx, blocksOffsetX);
}

function onReady() {
    startPanel.drawMatching();
    send(PlayerOp.Ready);
}

function isWin() {
    let myScore = playerScores[playerIdx];
    if (!myScore) {
        return false;
    }
    for (let pIdx in playerScores) {
        if (pIdx != playerIdx && myScore <= playerScores[pIdx]) {
            return false;
        }
    }
    return true;
}

function onPlaying() {
    canvasPanel.width = 120, canvasPanel.height = 56;
    canvasPanel.style.border = "0";
    startPanel.drawPlaying(Object.values(playerScores));
}

function onEnd() {
    send(PlayerOp.End);

    canvasPanel.width = canvasW, canvasPanel.height = canvasH;
    canvasPanel.style.border = "";
    startPanel.drawPlaying(Object.values(playerScores));
    startPanel.drawEnd(isWin());
}

function onRestart() {
    stop = false;
    frameIdx = -1;
    frameData = [];
    ctx.clearRect(0, 0, canvasW, canvasH);
    drawPlayers();
    resetBlocks();
    startPanel.drawMatched(() => {
        console.log('start');
        send(PlayerOp.Start);
    });
}

function calcScore(px) {
    return Math.max(0, Math.floor(-(blockInitOffsetX - blankWidth + blocksOffsetX - px) / (blockWidth + blankWidth)));
}

function updateScore() {
    startPanel.drawPlaying(Object.values(playerScores));
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
        drawPlayers();
        return;
    }
    // check y axis collision
    for (let pIdx in f) {
        let x = playerPoses[pIdx][0], y = playerPoses[pIdx][1];
        let op = f[pIdx];
        if (op == PlayerOp.Click)
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
        playerPoses[pIdx][1] = y;
    }
    drawPlayers();

    if (stop) {
        return;
    }

    let isUpdateScore = false;
    for (let pIdx in playerPoses) {
        let score = calcScore(playerPoses[pIdx][0]);
        if (playerScores[pIdx] != score) {
            playerScores[pIdx] = score;
            isUpdateScore = true;
        }
    }
    if (isUpdateScore) {
        updateScore();
    }

    blocks.updateBlocks(blocksOffsetX);
}

function onUpdateRoomData() {
    playerPoses = {};
    playerScores = {};
    playerIdxes.sort();
    for (let i = 0, n = playerIdxes.length; i < n; ++i) {
        let x = playerX + playerXOffset * i;
        let pIdx = playerIdxes[i];
        playerPoses[pIdx] = [x, playerY];
        playerScores[pIdx] = 0;
    }
    if (playerIdxes.length == 2) {
        onRestart();
    }
    console.log(playerPoses);
}

function handleMsg(msg) {
    console.log(msg);
    let type = msg.charAt(0);
    if (type == 'r') { // room data
        let msgArr = msg.split(',');
        roomSeed = msgArr[1];
        playerIdx = msgArr[msgArr.length - 1];
        playerIdxes = [];
        for (let i = 2; i < msgArr.length - 1; ++i) {
            playerIdxes.push(msgArr[i]);
        }
        onUpdateRoomData();
    } else if (type == 'f') { // frame data
        // TODO 将消息放入队列，按一定频率更新显示（平滑网络延迟）
        let msgArr = msg.split(';');
        frameIdx = Number(msgArr[0].substring(1));
        frameData[frameIdx] = {};
        for (let i = 1, len = msgArr.length - 1; i < len; ++i) {
            let opArr = msgArr[i].split(',');
            let pIdx = opArr[0];
            let op = opArr[1];
            frameData[frameIdx][pIdx] = op;
        }
        if (frameIdx == 0) {
            onPlaying();
        }
        onFrameData(frameData[frameIdx]);
        if (stop) {
            onEnd();
        }
    }
}

let websocket = null;
connectWebSocket();

function connectWebSocket() { //建立WebSocket连接
    console.log("start ws...");
    websocket = new WebSocket("ws://127.0.0.1:80/wsdemo"); //建立webSocket连接

    websocket.onopen = function () { //打开webSokcet连接时，回调该函数
        console.log("on open");
        onReady();
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
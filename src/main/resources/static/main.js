
// import { firstName, lastName, year, f } from './a.js';
// console.log("main js loaded", firstName, lastName, year, f);

import { Blocks } from './blocks.js';

const canvasW = 600, canvasH = 600;
const canvas = document.getElementById("canvas");
canvas.width = canvasW, canvas.height = canvasH;
const ctx = canvas.getContext("2d");

let roomIdDiv = document.getElementById('roomId');
let playerIdxDiv = document.getElementById('playerIdx');

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
const playerW = 20, playerH = 20, playerSpeed = 2, clickOffset = -40;
let playerX = 100, playerY = 300, playerXOffset = 100;

const blocksSpeed = 4;
let blocksOffsetX = 0;
let blocks = new Blocks(300, canvasW, canvasH, 80, 100);
blocks.genBlocks();
blocks.drawBlocks(ctx, blocksOffsetX);

function drawPlayer(pIdx, x, y) {
    ctx.fillStyle = pIdx % 2 == 0 ? "rgba(0,0,255,1)" : "rgba(255,0,0,1)";
    ctx.beginPath();
    ctx.rect(x, y, playerW, playerH);
    ctx.fill();
}

function onFrameData(f) {
    if (stop)
        return;
    ctx.clearRect(0, 0, canvasW, canvasH);

    blocksOffsetX -= blocksSpeed;
    blocks.drawBlocks(ctx, blocksOffsetX);

    for (let pIdx in f) {
        let y = playerPoses[pIdx][1];
        let op = f[pIdx];
        if (op == '1')
            y += clickOffset;
        else
            y += playerSpeed;
        drawPlayer(pIdx, playerPoses[pIdx][0], y);
        playerPoses[pIdx][1] = y;
    }

    // FIXME 由于是先移动后检测冲突，会导致穿到上面的障碍物里面(clickOffset较大)

    for (let pIdx in playerPoses) {
        let x = playerPoses[pIdx][0], y = playerPoses[pIdx][1];
        if (y <= 0 || y >= canvasH || blocks.checkCollision(blocksOffsetX, x, y, playerW, playerH)) {
            stop = true;
            return;
        }
    }

    blocks.updateBlocks(blocksOffsetX);
}

function onUpdateRoomData() {
    playerIdxes.sort();
    for (let i = 0, n = playerIdxes.length; i < n; ++i) {
        let x = playerX + playerXOffset * i;
        drawPlayer(playerIdxes[i], x, playerY);
        playerPoses[playerIdxes[i]] = [x, playerY];
    }
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
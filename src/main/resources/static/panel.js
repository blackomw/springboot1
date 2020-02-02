
// 第一个玩家新建房间后，显示匹配中
// 第二个玩家进入已有房间时，显示匹配成功；同时第一个玩家也显示匹配成功
// 显示匹配成功后，进入5秒倒计时
// 倒计时结束，开始游戏
// 游戏中任意一方死亡游戏结束，重新进入匹配成功5秒倒计时阶段
// 5秒倒计时阶段可选择更换房间

class StartPanel {
    constructor(ctx, canvasW, canvasH) {
        this.ctxPanel = ctx;

        this.width = 200;
        this.height = 200;
        this.x = Math.floor((canvasW - this.width) / 2);
        this.y = Math.floor((canvasH - this.height) / 2);

        this.startBtnW = 60, this.startBtnH = 30;
        this.startBtnX = this.x + Math.floor((this.width - this.startBtnW) / 2);
        this.startBtnY = this.y + this.height - this.startBtnH - 30;
    }

    drawPanel() {

        // this.drawMatching();
        // let count = 0;
        // let ir = setInterval(() => {
        //     this.drawMatching(++count);
        // }, 1000);
        // clearInterval(ir);

        // let delay = 5;
        // this.drawMatched(delay);
        // let di = setInterval(() => {
        //     --delay;
        //     if (!delay) {
        //         clearInterval(di);
        //     } else {
        //         this.drawMatched(delay);
        //     }
        // }, 1000);

        // this.drawEnd(1);

        this.drawPlaying({ 0: 99, 1: 123 });
    }

    drawBackground() {
        this.ctxPanel.clearRect(this.x, this.y, this.width, this.height);

        this.ctxPanel.fillStyle = "rgba(127,127,127,1)";
        this.ctxPanel.beginPath();
        this.ctxPanel.rect(this.x, this.y, this.width, this.height);
        this.ctxPanel.fill();
    }

    drawMatching(count) {
        this.drawBackground();
        let x = this.x + Math.floor(this.width / 2);
        let y0 = Math.floor(this.height / 3);
        let y = this.y + y0;
        this.ctxPanel.fillStyle = "rgba(127,0,0,1)";
        this.ctxPanel.font = "bold 20px '微软雅黑'";
        this.ctxPanel.textBaseline = 'middle';
        this.ctxPanel.textAlign = "center";
        this.ctxPanel.fillText('Matching', x, y);

        if (count) {
            this.ctxPanel.fillText(count, x, y + y0);
        }
    }

    drawMatched(count) {
        this.drawBackground();
        let x = this.x + Math.floor(this.width / 2);
        let y = this.y + Math.floor(this.height / 2);
        this.ctxPanel.fillStyle = "rgba(0,0,127,1)";
        this.ctxPanel.font = "bold 40px '微软雅黑'";
        this.ctxPanel.textBaseline = 'middle';
        this.ctxPanel.textAlign = "center";
        this.ctxPanel.fillText(count, x, y);
    }

    drawPlaying(scores) {

        this.ctxPanel.fillStyle = "rgba(255,0,0,1)";
        this.ctxPanel.beginPath();
        this.ctxPanel.rect(5, 5, 20, 20);
        this.ctxPanel.fill();

        this.ctxPanel.font = "18px '微软雅黑'";
        this.ctxPanel.textBaseline = 'top';
        this.ctxPanel.textAlign = "left";
        this.ctxPanel.fillText(scores[0], 40, 5);

        this.ctxPanel.fillStyle = "rgba(0,0,255,1)";
        this.ctxPanel.beginPath();
        this.ctxPanel.rect(5, 30, 20, 20);
        this.ctxPanel.fill();

        this.ctxPanel.fillText(scores[1], 40, 30);
    }

    drawEnd(isWin) {
        this.drawBackground();
        let x = this.x + Math.floor(this.width / 2);
        let y = this.y + Math.floor(this.height / 3);
        let text = isWin ? "Win!" : "Lose";
        this.ctxPanel.fillStyle = isWin ? "rgba(127,0,0,1)" : "rgba(0,0,127,1)";
        this.ctxPanel.font = "bold 40px '微软雅黑'";
        this.ctxPanel.textBaseline = 'middle';
        this.ctxPanel.textAlign = "center";
        this.ctxPanel.fillText(text, x, y);

        this.drawStartBtn();
    }

    drawStartBtn(isDown) {
        this.ctxPanel.clearRect(this.startBtnX, this.startBtnY, this.startBtnW, this.startBtnH);

        let color = isDown ? 127 : 255;
        this.ctxPanel.fillStyle = "rgba(0," + color + "," + color + ",1)";
        this.ctxPanel.beginPath();
        this.ctxPanel.rect(this.startBtnX, this.startBtnY, this.startBtnW, this.startBtnH);
        this.ctxPanel.fill();

        this.ctxPanel.strokeStyle = "rgba(0,0," + color + ",1)";
        this.ctxPanel.lineWidth = '2';
        this.ctxPanel.beginPath();
        this.ctxPanel.rect(this.startBtnX, this.startBtnY, this.startBtnW, this.startBtnH);
        this.ctxPanel.stroke();

        this.ctxPanel.fillStyle = "rgba(127,0,0,1)";
        this.ctxPanel.font = "bold 20px '微软雅黑'";
        this.ctxPanel.textBaseline = 'middle';
        this.ctxPanel.textAlign = "center";
        this.ctxPanel.fillText('Start', this.startBtnX + Math.floor(this.startBtnW / 2), this.startBtnY + Math.floor(this.startBtnH / 2));
    }

    touchHandler(e) {
        let clickX = e.offsetX, clickY = e.offsetY;
        if (clickX >= this.startBtnX && clickX <= this.startBtnX + this.startBtnW
            && clickY >= this.startBtnY && clickY <= this.startBtnY + this.startBtnH) {
            this.drawStartBtn(true);
            setTimeout(() => {
                this.drawStartBtn();
            }, 100);
            return true;
        }
        return false;
    }
}

// function getMousePos(canvas, event) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: event.clientX - rect.left,
//         y: event.clientY - rect.top
//     };
// }

export { StartPanel }
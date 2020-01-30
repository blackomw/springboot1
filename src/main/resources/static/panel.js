
const canvasPanel = document.getElementById("canvasPanel");
const ctxPanel = canvasPanel.getContext("2d");
canvasPanel.addEventListener("click", (e) => panelTouchHandler(e), false);

class StartPanel {
    constructor(canvasW, canvasH) {
        canvasPanel.width = canvasW, canvasPanel.height = canvasH;

        this.width = 200;
        this.height = 200;
        this.x = Math.floor((canvasW - this.width) / 2);
        this.y = Math.floor((canvasH - this.height) / 2);
    }

    drawPanel() {
        // TODO
        ctxPanel.fillStyle = "rgba(127,127,127,1)";
        ctxPanel.beginPath();
        ctxPanel.rect(this.x, this.y, this.width, this.height);
        ctxPanel.fill();

        this.drawStartBtn(1);

    }

    drawStartBtn(alpha) {
        let startBtnW = 60, startBtnH = 30;
        let startBtnX = this.x + Math.floor((this.width - startBtnW) / 2);
        let startBtnY = this.y + this.height - startBtnH - 30;

        ctxPanel.clearRect(startBtnX, startBtnY, startBtnW, startBtnH);

        ctxPanel.fillStyle = "rgba(0,127,127," + alpha + ")";
        ctxPanel.beginPath();
        ctxPanel.rect(startBtnX, startBtnY, startBtnW, startBtnH);
        ctxPanel.fill();

        ctxPanel.strokeStyle = "rgba(0,0,127," + alpha + ")";
        ctxPanel.lineWidth = '2';
        ctxPanel.beginPath();
        ctxPanel.rect(startBtnX, startBtnY, startBtnW, startBtnH);
        ctxPanel.stroke();

        ctxPanel.fillStyle = "rgba(127,0,0,1)";
        ctxPanel.font = "bold 20px '微软雅黑'";
        ctxPanel.textBaseline = 'middle';
        ctxPanel.textAlign = "center"
        ctxPanel.fillText('Start', startBtnX + Math.floor(startBtnW / 2), startBtnY + Math.floor(startBtnH / 2));
    }
}

function panelTouchHandler(e) {
    // TODO
    console.log("StartPanel event", e);
    drawStartBtn(0.5); // FIXME
    setTimeout(() => {
        drawStartBtn(1);
    }, 500);
}

export { StartPanel }
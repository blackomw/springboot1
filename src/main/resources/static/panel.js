
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
        // TODO
        this.ctxPanel.fillStyle = "rgba(127,127,127,1)";
        this.ctxPanel.beginPath();
        this.ctxPanel.rect(this.x, this.y, this.width, this.height);
        this.ctxPanel.fill();

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
        this.ctxPanel.textAlign = "center"
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

export { StartPanel }
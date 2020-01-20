// import { bb } from './b.js'
// var firstName = 'Michael';
// var lastName = 'Jackson';
// var year = 1958;
// console.log(bb);
// export { firstName, lastName, year };
// var f = 'ffff';
// export { f };

const SpaceHeight = 80; // 中间缺口处的高度
const BlockMinHeight = 50; // 障碍物最小高度
let blocksY = [];

class Blocks {
    constructor(startX, canvasWidth, canvasHeight, blockWidth, blankWidth) {
        this.startX = startX;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.blockWidth = blockWidth;
        this.blankWidth = blankWidth;
        this.rndHeight = canvasHeight - SpaceHeight;
        this.preOffsetX = null;
        console.log('call constructor', startX, canvasWidth, canvasHeight, blockWidth, blankWidth);
    }

    genBlocks() {
        let wUnit = this.blockWidth + this.blankWidth;
        let count = Math.ceil(this.canvasWidth * 1 / wUnit);
        for (let i = 0; i < count; ++i) {
            let h = rand(BlockMinHeight, this.rndHeight - BlockMinHeight);
            blocksY.push(h);
        }
        console.log(blocksY);
    }

    drawBlocks(canvasCtx, offsetX) {
        let wUnit = this.blockWidth + this.blankWidth;
        for (let i = 0, n = blocksY.length; i < n; ++i) {
            let h = blocksY[i];
            let x = this.startX + offsetX + wUnit * i;

            if (this.preOffsetX != null) {
                let preX = this.startX + this.preOffsetX + wUnit * i;
                canvasCtx.clearRect(preX, 0, this.blockWidth, h);
                canvasCtx.clearRect(preX, h + SpaceHeight, this.blockWidth, this.canvasHeight - (h + SpaceHeight));
            }

            canvasCtx.beginPath();
            canvasCtx.rect(x, 0, this.blockWidth, h);
            canvasCtx.fill();

            canvasCtx.beginPath();
            canvasCtx.rect(x, h + SpaceHeight, this.blockWidth, this.canvasHeight - (h + SpaceHeight));
            canvasCtx.fill();
        }
        this.preOffsetX = offsetX;
    }

}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { Blocks }
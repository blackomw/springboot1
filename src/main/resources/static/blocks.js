const SpaceHeight = 160; // 中间缺口处的高度
const BlockMinHeight = 80; // 障碍物最小高度

class Blocks {
    constructor(seed, startX, canvasWidth, canvasHeight, blockWidth, blankWidth) {
        this.startX = startX;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.blockWidth = blockWidth;
        this.blankWidth = blankWidth;
        this.rndHeight = canvasHeight - SpaceHeight;
        this.rmCount = 0;
        this.seed = seed;
        this.blocksY = []; // 障碍物高度数组，由于间隙固定，所以可根据一个高度值分别算出上下障碍物高度
        console.log('call constructor', seed, startX, canvasWidth, canvasHeight, blockWidth, blankWidth);
    }

    genBlocks() {
        let wUnit = this.blockWidth + this.blankWidth;
        let count = Math.ceil(this.canvasWidth / wUnit) + 2;
        for (let i = 0; i < count; ++i) {
            this.blocksY.push(this.rand(BlockMinHeight, this.rndHeight - BlockMinHeight));
        }
        console.log(this.blocksY);
    }

    drawBlocks(canvasCtx, offsetX) {
        canvasCtx.fillStyle = "rgba(0,0,0,1)";

        let headX = this.startX + offsetX;
        let wUnit = this.blockWidth + this.blankWidth;
        for (let i = 0, n = this.blocksY.length; i < n; ++i) {
            let h = this.blocksY[i];
            let x = headX + wUnit * (i + this.rmCount);

            canvasCtx.beginPath();
            canvasCtx.rect(x, 0, this.blockWidth, h);
            canvasCtx.fill();

            canvasCtx.beginPath();
            canvasCtx.rect(x, h + SpaceHeight, this.blockWidth, this.canvasHeight - (h + SpaceHeight));
            canvasCtx.fill();
        }
    }

    updateBlocks(offsetX) {
        let headX = this.startX + offsetX;
        let wUnit = this.blockWidth + this.blankWidth;
        if (headX + wUnit * (this.rmCount + 1) < 0) {
            this.blocksY.shift();
            this.blocksY.push(this.rand(BlockMinHeight, this.rndHeight - BlockMinHeight));
            ++this.rmCount;
        }
    }

    checkCollision(offsetX, tx, ty, tw, th) {
        let tx1 = tx + tw;
        let ty1 = ty + th;

        let headX = this.startX + offsetX;
        let wUnit = this.blockWidth + this.blankWidth;
        for (let i = 0, n = this.blocksY.length; i < n; ++i) {
            let x = headX + wUnit * (i + this.rmCount);
            let x1 = x + this.blockWidth;
            if (tx1 < x || tx > x1)
                continue;

            let h = this.blocksY[i];
            if ((ty >= 0 && ty <= h) || (ty1 >= 0 && ty1 <= h))
                return h;
            let downY = h + SpaceHeight, downY1 = this.canvasHeight;
            if ((ty >= downY && ty <= downY1) || (ty1 >= downY && ty1 <= downY1))
                return -downY;
        }
        return 0;
    }

    _rnd() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / (233280.0);
    };

    rand(min, max) {
        return min + Math.floor(this._rnd() * (max - min + 1));
    };
}

export { Blocks }
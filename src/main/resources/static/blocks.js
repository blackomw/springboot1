// import { bb } from './b.js'
// var firstName = 'Michael';
// var lastName = 'Jackson';
// var year = 1958;
// console.log(bb);
// export { firstName, lastName, year };
// var f = 'ffff';
// export { f };

let SpaceHeight = 80, BlockMinHeight = 50;
let blocksPoses = [];

class Blocks {
    constructor(startX, canvasWidth, canvasHeight, blockWidth, blankWidth) {
        this.startX = startX;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.blockWidth = blockWidth;
        this.blankWidth = blankWidth;
        this.rndHeight = canvasHeight - SpaceHeight;
        console.log('call constructor', startX, canvasWidth, canvasHeight, blockWidth, blankWidth);
    }

    genBlock(canvasCtx) {
        let h = rand(BlockMinHeight, this.rndHeight);

        canvasCtx.beginPath();
        canvasCtx.rect(this.startX, 0, this.blockWidth, h);
        canvasCtx.fill();

        canvasCtx.beginPath();
        canvasCtx.rect(this.startX, h + SpaceHeight, this.blockWidth, this.canvasHeight - (h + SpaceHeight));
        canvasCtx.fill();
    }

}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export { Blocks }
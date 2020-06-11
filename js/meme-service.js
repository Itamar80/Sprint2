'use strict'
const SAVED_MEME = 'Saved meme'
var savedMemes = [];
var idx = 0;

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [{
        id: idx,
        txt: 'Write your text here',
        size: 40,
        align: 'left',
        color: 'red',
        border: 'black solid 1px',
        x: 250,
        y: 70,
        draggable: true
    }]
}
var gCostume = [{
        id: idx + 1,
        x: 20,
        y: 20,
        size: 20,
        align: 'left',
        url: "/icons/present.jpg"
    },
    {
        id: idx + 1,
        x: 20,
        y: 20,
        size: 20,
        align: 'left',
        url: "/icons//nice-hat.png "
    },
    {
        id: idx + 1,
        x: 20,
        y: 20,
        size: 20,
        align: 'left',
        url: "/icons/glasses.jpg"
    }
]

var gKeywords = {
    'happy': 0,
    'funny puk': 0,
    'funny': 0,
    'comics': 0,
    'dogs': 0,
    'drinks': 0,
    'books': 0,
    'baby': 0,

}

function getKeywords() {
    return gKeywords
}


function getMemes() {
    return gMeme
}

function getImgs() {
    return gImgs
}

function drawTxt(text, x, y, idx) {
    gCtx.fillStyle = gMeme.lines[idx].color;
    gCtx.font = gMeme.lines[idx].size + 'px sans serif';
    gCtx.textAlign = gMeme.lines[idx].align;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}

function drawCostume(img, idx) {
    idx++
    gCtx.drawImage(img, 10, 10);
    gCtx.font = gCostume[idx].size + 'px sans serif';
    gCtx.textAlign = gCostume[idx].align;
}

function changeTxt() {
    var memeText = document.querySelector('.meme-input');
    gMeme.lines[idx].txt = memeText.value;
    drawImgFromlocal()
}

function findPic(pic) {
    picId = pic.id;
    drawImgFromlocal()
}

function increaseDecrease(diff) {
    gMeme.lines[idx].size += diff
    drawImgFromlocal()
}

function textPosition(diff) {
    gMeme.lines[idx].y += diff
    drawImgFromlocal()
}

function addLine() {
    gMeme.lines.push({
        id: idx + 1,
        txt: 'Write your text here',
        size: 40,
        align: 'left',
        color: 'green',
        x: 250,
        y: 500,
        draggable: true

    })
    idx++
    drawImgFromlocal()
    var elInput = document.querySelector('.meme-input');
    elInput.value = '';
    elInput.focus();

}



var gStartPx = 40;

function switchInput() {

    var cordinates = {
        offsetX: gMeme.lines[idx].x,
        offsetY: gMeme.lines[idx].y
    }
    if (idx === 0 && gMeme.lines.length !== 1) {
        console.log('equal then 0');
        idx++

        return cordinates
    }
    if (idx === gMeme.lines.length - 1) {
        console.log('equal to length');
        idx = 0

        return cordinates
    }
    if (idx >= 0) {
        console.log('bigger then 0');
        idx++

        return cordinates
    }

}


function saveMeme(memeToDataUrl) {
    savedMemes.push(memeToDataUrl)
    saveToStorage(SAVED_MEME, savedMemes)
}


function canvasClicked(ev) {
    // const xEvent = ev.offsetX
    // const yEvent = ev.offsetY
    const { offsetX: xEvent, offsetY: yEvent } = ev;

    var clickedLine = gMeme.lines.findIndex(line => {
            let startX = line.x;
            let startY = line.y;
            let endX = startX + (gCtx.measureText(line.txt).width);
            let endY = startY - line.size;
            // console.log('endX:', endX, 'endY:', endY, 'startX:', startX, 'startY:', startY, xEvent, yEvent);
            return (xEvent >= startX && xEvent <= endX && yEvent <= startY && yEvent >= endY);
        })
        // console.log(clickedLine);
    return clickedLine
}

function moveLine(x, y) {
    gCtx.beginPath();
    gCtx.moveTo(x, y);
    gCtx.stroke();
    gCtx.closePath();
}

// function mouseMove(ev) {
//     moveLine(ev.offsetX, ev.offsetY)
// }
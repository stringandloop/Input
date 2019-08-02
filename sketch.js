let sketch;
let pixels = [];
let visit = [];
let count = 0;
let tool = 1; //standard brush

let cellW, cellH;
let startX, startY;

let preview = false;
let dither = false;

let swatch1, swatch2, swatch3, swatch4, swatch5, swatch6, bg;

let undoState = 0;
let maxUndo = 100;
let savedGrids = [];

let rowLen = 24; // cells
let colLen = 34; // cells

let brushSize = 2;
let activeColor;

let filename;
let modal = false;

let cursor = true;


function setup() {
  

  color1 = [201, 33, 33]; // red
  color2 = [33, 33, 201]; // blue
  color3 = [255, 255, 255]; // white
  color4 = [120, 120, 120]; // grey
  color5 = [251, 190, 44]; // gold
  color6 = [0, 0, 0]; // black
  bg = [0, 0, 0];

  swatches = [color1, color2, color3, color4, color5, color6];
  activeColor = color1;

  noStroke();
  background(bg);

  sketch = document.getElementById('sketch-holder');

  cellW = sketch.offsetWidth / (rowLen);
  cellH = cellW * 0.7;

  let canvas = createCanvas(sketch.offsetWidth, cellH * colLen);

  loadSavedPixels();

  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  gridImg = createGraphics(rowLen, colLen);


  sketchListeners();
  select('#sketch-holder').style('padding-top: 0%;')

  createPalette();
  brushButtons();
  controlButtons();
  noLoop();
}

function draw() {
  noStroke();

  let pushCursorX = 0;
  let pushCursorY = 0;

  if (brushSize == 2) {
    pushCursorX = .5 * cellW;
    pushCursorY = .5 * cellH;
  } else if (brushSize == 3) {
    pushCursorX = .5 * cellW;
    pushCursorY = 1 * cellH;
  } else if (brushSize == 4) {
    pushCursorY = -.5 * cellH;
  }



  let cellX = (floor((mouseX + pushCursorX) / cellW));
  let cellY = (floor((mouseY + pushCursorY) / cellH));
  //let cellX = floor(map(mouseX + pushCursorX, 0, cellW * rowLen, 0, rowLen));
  //let cellY = floor(map(mouseY + pushCursorY, 0, cellH * colLen, 0, colLen));

  if (mouseIsPressed && gridCheck() && (tool == 1 || tool == 3)) {
    brushTool(cellX, cellY, pushCursorX, pushCursorY);
  }

  // run 2x with inversed x values to mirror the brush
  if (mouseIsPressed && gridCheck() && tool == 3) {
    mirrorTool(cellX, cellY, pushCursorX, pushCursorY);
  }

  drawPixels();

  if (mouseIsPressed && gridCheck() && startX && startY && tool == 2) {

    lineTool(cellX, cellY, startX, startY, pushCursorX, pushCursorY, preview);
  }

  fill(255, 100);
  if (gridCheck() && cursor == true) {

    //take new cell values without pushCursorY that can take rgb values from
    //within the pixel color values from within the array bounds
    let colorCellX = (floor((mouseX) / cellW));
    let colorCellY = (floor((mouseY) / cellH));

    //assuming getting the array value directly is faster than p5.js's
    //red, green and blue functions.
    let r = pixels[index(colorCellX, colorCellY)][0];
    let g = pixels[index(colorCellX, colorCellY)][1];
    let b = pixels[index(colorCellX, colorCellY)][2];

    if ((r + g + b) / 3 > 200) {
      fill(55, 100);
    } else {
      fill(200, 100);
    }
    if (brushSize == 1) {
      //fill(red(activeColor), green(activeColor), blue(activeColor), 150);
      // rect(mouseX - cellW * .5, mouseY - cellH * .5, cellW, cellH);
      rect(cellX * cellW, cellY * cellH, cellW, cellH);
    } else if (brushSize == 2) {
      // rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 2, cellH * 2);
      rect((cellX - 1) * cellW, (cellY - 1) * cellH, cellW * 2, cellH * 2);
    } else if (brushSize == 3) {
      // rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 2, cellH * 2);
      rect((cellX - 1) * cellW, (cellY - 2) * cellH, cellW * 2, cellH * 3);
    } else if (brushSize == 4) {
      //rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 3, cellH * 4);
      rect((cellX - 1) * cellW, (cellY - 1) * cellH, cellW * 3, cellH * 4);
    }
  }

  noStroke();

  drawGrid();

  // Invoiking loop results in smoother framerate than using redraw
  // with mouse move.
  count++;
  if (count > 1) {
    noLoop();
  }
}


function windowResized() {
  sketch = document.getElementById('sketch-holder')
  cellW = sketch.offsetWidth / (rowLen);
  cellH = cellW * 0.7;
  resizeCanvas(sketch.offsetWidth, cellW * .7 * colLen);
}

function canvasPressed() {
  saveGrid();
  redraw();

  pmouseX = mouseX;
  pmouseY = mouseY;

  if (mouseIsPressed) {
    preview = true;
    startX = mouseX;
    startY = mouseY;
  }



  loop();
}


function canvasReleased() {
  preview = false;
  redraw();

  startX = null;
  startY = null;
  sendImage();
  localStorage.setItem("pixels", JSON.stringify(pixels));
  noLoop();
}


function cursorMoved() {

  // update startX and startY after cursor movement for touch screens
  // mouseX and mouseY only update on the drawing cycle so the same method
  // used for mouse interactions with canvasPressed will not work.

  if (preview == false) {
    startX = mouseX;
    startY = mouseY;
    preview = true;
  }

  count = 0;
  loop();
}


function drawPixels() {
  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      let pixel = pixels[index(i, j)];
      fill(pixel[0], pixel[1], pixel[2]);
      rect(cellW * i, cellH * j, cellW, cellH);
    }
  }
}


function drawGrid() {
  stroke(255, 100);
  for (let i = 0; i <= rowLen; i++) {
    line(i * cellW, 0, i * cellW, height);
  }

  for (let i = 0; i <= colLen; i++) {
    line(0, i * cellH, width, i * cellH);
  }
  line(0, height - 1, width, height - 1);
  noStroke();
}

function placePixel(x, y) {

  if (x >= 0 && x < rowLen && y >= 0 && y < colLen) {
    if (dither == false) {
      if (preview == false || tool == 1 || tool == 3) {
        pixels[index(x, y)] = [activeColor[0], activeColor[1], activeColor[2]];
      } else {
        fill(activeColor);
        rect(x * cellW, y * cellH, cellW, cellH);
      }
    } else if (dither == true) {
      if (x % 2 == 0 && (y % 4 == 0 || y % 4 == 1)) {
        if (preview == false || tool == 1 || tool == 3) {
          pixels[index(x, y)] = [activeColor[0], activeColor[1], activeColor[2]];
        } else {
          fill(activeColor);
          rect(x * cellW, y * cellH, cellW, cellH);
        }
      }
      if (x % 2 == 1 && (y % 4 == 2 || y % 4 == 3)) {
        if (preview == false) {
          pixels[index(x, y)] = [activeColor[0], activeColor[1], activeColor[2]];
        } else {
          fill(activeColor);
          rect(x * cellW, y * cellH, cellW, cellH);
        }
      }
    }
  }
}


function loadSavedPixels() {
  for (let i = 0; i < rowLen * colLen; i++) {
    pixels[i] = [bg[0], bg[1], bg[2]];
  }

  if (localStorage.getItem("pixels")) {
    let storedPixels = JSON.parse(localStorage.getItem("pixels"));
    if (storedPixels.length == pixels.length) {
      for (let i = 0; i < pixels.length; i++) {
        let r = storedPixels[i][0];
        let g = storedPixels[i][1];
        let b = storedPixels[i][2];
        let pixelColor = [r, g, b];
        pixels[i] = pixelColor;
      }
    } else {
      // clear old data if it's not compatible
      removeItem('pixels');
    }
    sendImage();
  }
}

function cursorOn() {
  cursor = true;
}

function cursorOff() {
  cursor = false;
  noLoop();
}


function sketchListeners() {
  // Prevent scrolling on touch screens when over the Canvas
  sketch.addEventListener('touchstart', function(event) {
    event.preventDefault()
    cursor = false;
  });

  /*mouseDragged is not an equivilent method for p5js, so use touchMoved
  to achiveve the same effect.
  */
  select('#sketch-holder').touchMoved(cursorMoved); // Support touch devices
  select('#sketch-holder').mouseMoved(cursorMoved);

  // Hides cursor when mouse is not on the canvas
  select('#sketch-holder').mouseOver(cursorOn);
  select('#sketch-holder').mouseOut(cursorOff);

  select('#sketch-holder').touchStarted(canvasPressed); // Support touch devices
  select('#sketch-holder').mousePressed(canvasPressed);

  select('#sketch-holder').touchEnded(canvasReleased); // Support touch devices
  select('#sketch-holder').mouseReleased(canvasReleased);
}

function index(x, y) {
  return (rowLen * y + x);
}

function keyPressed() {
  floodFill();
}

function gridCheck() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    return true;
  }
}

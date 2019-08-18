let sketch;
let pixels = [];
let compressedPixels;

let rowLen = 28; // cells
let colLen = 40; // cells

let tool = 0;
const myBrush = 0;
const myLine = 1;
const myFill = 2;
let brushSize = 2;

let dither = false;
let mirrorX = false;
let mirrorY = false;
let showGrid = true;
let preview = false;

let modal = false;
let cursor = true;

// a custom mouseIsPressed boolean for keeping track of mouseIsPressed only
// on the canvas.
let toolIsActive = false;

let cellW, cellH;
let startX, startY;
let color1, color2, color3, color4, color5, color6, bg;
let activeColor;

let undoState = 0;
let maxUndo = 100;
let savedGrids = [];
let count = 0;


function setup() {

  color1 = [201, 33, 33]; // red
  color2 = [33, 33, 201]; // blue
  color3 = [255, 255, 255]; // white
  color4 = [120, 120, 120]; // grey
  color5 = [251, 190, 44]; // gold
  color6 = [0, 0, 0]; // black
  bg = [0, 0, 0]; //black

  swatches = [color1, color2, color3, color4, color5, color6];
  activeColor = color1;

  background(bg);

  sketch = document.getElementById('sketch-holder');

  cellW = sketch.offsetWidth / (rowLen);
  cellH = cellW * 0.7;

  let canvas = createCanvas(sketch.offsetWidth, cellH * colLen);

  loadSavedPixels();
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  gridImg = createGraphics(rowLen * 7, colLen * 5);

  sketchListeners();
  //remove placeholder padding when sketch is loaded
  select('#sketch-holder').style('padding-top: 0%;')
  createPalette();
  createUsername();
  brushButtons();
  controlButtons();
  toolButtons();
  noLoop();
}


function draw() {
  background(bg);

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

  drawPixels();

  if (toolIsActive && gridCheck()) {

    if (tool == myBrush) {
      brushTool(cellX, cellY, pushCursorX, pushCursorY);

      if (mirrorX == true) {
        brushTool(cellX, cellY, pushCursorX, pushCursorY, 'x');
      }
      if (mirrorY == true) {
        brushTool(cellX, cellY, pushCursorX, pushCursorY, 'y');
      }
      if (mirrorX == true && mirrorY == true) {
        brushTool(cellX, cellY, pushCursorX, pushCursorY, 'x', 'y');
      }
    }

    if (tool == myLine && startX && startY) {
      mirrorX = false;
      mirrorY = false;
      dither = false;
      lineTool(cellX, cellY, startX, startY, pushCursorX, pushCursorY, preview);
    }

    if (tool == myFill) {
      floodFill();
    }
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




    placeCursor(cellX, cellY);

    if (mirrorX == true) {
      placeCursor(rowLen - cellX, cellY, 'x');
    }
    if (mirrorY == true) {
      placeCursor(cellX, colLen - cellY, 'y');
    }
    if (mirrorX == true && mirrorY == true) {
      placeCursor(rowLen - cellX, colLen - cellY, 'x', 'y');
    }

  }


  drawGrid(showGrid);

  // Invoiking loop results in smoother framerate than using redraw with mouse move.
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
  toolIsActive = true;

  saveGrid();
  redraw();
  pmouseX = mouseX;
  pmouseY = mouseY;

  if (toolIsActive && tool == myLine) {
    preview = true;
    startX = mouseX;
    startY = mouseY;
  }
  loop();
}


function canvasReleased() {
  preview = false;
  redraw(); // redraw and save pixels now that preview = false
  startX = null;
  startY = null;
  sendImage();
  localStorage.setItem("pixels", JSON.stringify(compress(pixels)));
  // redraw one more time since the canvas likes to freak out a bit
  // after everything before. draw one more time to smooth it out and settle
  // into the appearance once noLoop is invoked.
  redraw();
  noLoop();
  toolIsActive = false;
}


function cursorMoved() {
  // update startX and startY after cursor movement for touch screens
  // mouseX and mouseY only update on the drawing cycle so the same method
  // used for mouse interactions with canvasPressed will not work.
  if (preview == false && tool == myLine) {
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
      stroke(pixel[0], pixel[1], pixel[2]);
      rect(cellW * i, cellH * j, cellW, cellH);
    }
  }
}


function drawGrid(grid) {
  if (grid == true) {
    stroke(225, 100);
    noFill();
    for (let i = 0; i <= rowLen; i++) {
      line(i * cellW, 0, i * cellW, height);
    }
    for (let i = 0; i <= colLen; i++) {
      line(0, i * cellH, width, i * cellH);
    }
    strokeWeight(2);
    stroke(60, 255, 255, 100);
    rect(cellW * 2, cellH * 3, width - cellW * 4, height - cellH * 6);
    strokeWeight(1);
  }
}


function loadSavedPixels() {
  for (let i = 0; i < rowLen * colLen; i++) {
    pixels[i] = [bg[0], bg[1], bg[2]];
  }
  if (localStorage.getItem("pixels")) {
    // if pixels exist in storage, retrieve and parse them
    let storedPixels = localStorage.getItem("pixels");
    // initialize condensedpixels with data from local storage
    compressedPixels = storedPixels;
    // expand the string and begin assigning values to the larger array
    storedPixels = decompress(storedPixels);
    if (storedPixels.length == pixels.length) {
      updateLoadedPixels(storedPixels);
    }
  } else {
    //clear old data if it 's not compatible
    removeItem('pixels');
  }
  sendImage();
}

// assign loaded
function updateLoadedPixels(storedPixels) {
    for (let i = 0; i < pixels.length; i++) {
      let r = decode(storedPixels.charAt(i))[0];
      let g = decode(storedPixels.charAt(i))[1];
      let b = decode(storedPixels.charAt(i))[2];
      let pixelColor = [r, g, b];
      pixels[i] = pixelColor;
    }
}


function cursorOn() {
  // dont show cursor when using the fill tool
  if (tool != 2) {
    cursor = true;
  }
}


function cursorOff() {
  cursor = false;
  noLoop();
  redraw();
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
  select('#sketch-border').touchMoved(cursorMoved); // Support touch devices
  select('#sketch-border').mouseMoved(cursorMoved);

  // Hides cursor when mouse is not on the canvas
  select('#sketch-border').mouseOver(cursorOn);
  select('#sketch-border').mouseOut(cursorOff);
  // Records line drawn on screen to pixel array and increases undo state
  select('#sketch-border').touchStarted(canvasPressed); // Support touch devices
  select('#sketch-border').mousePressed(canvasPressed);
  // Ends recording line drawn on screen to pixel array
  select('#sketch-border').touchEnded(canvasReleased); // Support touch devices
  select('#sketch-border').mouseReleased(canvasReleased);
}


function index(x, y) {
  return (rowLen * y + x);
}


function gridCheck() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    return true;
  }
}


function placeCursor(cellX, cellY, reflect1, reflect2) {
  if (reflect1 != undefined) {
    if (reflect2 == undefined) {
      reflect2 = ' ';
    }

    if (reflect1.toLowerCase() == 'x' || reflect2.toLowerCase() == 'x') {
      if (brushSize == 1 || brushSize == 4) {
        cellX = cellX - 1;
      }
    }

    if (reflect1.toLowerCase() == 'y' || reflect2.toLowerCase() == 'y') {
      if (brushSize == 1) {
        cellY = cellY - 1;
      } else if (brushSize == 3) {
        cellY = cellY + 1;
      } else if (brushSize == 4) {
        cellY = cellY - 2;
      }
    }
  }

  noStroke();
  if (brushSize == 1) {
    //fill(red(activeColor), green(activeColor), blue(activeColor), 150);
    rect(cellX * cellW, cellY * cellH, cellW, cellH);
  } else if (brushSize == 2) {
    rect((cellX - 1) * cellW, (cellY - 1) * cellH, cellW * 2, cellH * 2);
  } else if (brushSize == 3) {
    rect((cellX - 1) * cellW, (cellY - 2) * cellH, cellW * 2, cellH * 3);
  } else if (brushSize == 4) {
    rect((cellX - 1) * cellW, (cellY - 1) * cellH, cellW * 3, cellH * 4);
  }
}


function createUsername() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var email_id = firebase.auth().currentUser.email;
      var uid = firebase.auth().currentUser.uid;
      select('#header').html('Logged In As: ' + str(email_id) + ' | ' + '<a href="./preview.html" onclick="logout()">Logout</a>');
      select('#load-button').style('opacity', '1');
    } else {
      select('#header').html('<a href="./preview.html">Login</a>');
    }
  });
}


function logout() {
  firebase.auth().signOut();
}

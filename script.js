let cellW = 14; // pixels
let cellH = 10; // pixels

let rows = 20; // cells
let cols = 28; // cells

// padding area to detect lines slightly outside of the grid
let workspace = 100;

let gridW, gridH, gridX, gridY; // pixels

let brush = 1; //Starting weight to draw with

let gridImg;

let pixels = [];
let color1, color2, color3, color4, color5, activeColor;

let img;


let coordX, coordY;
let pcoordX, pcoordY;

let cellCoordX = 0;
let cellCoordY = 0;
let pcellCoordX = 0;
let pcellCoordY = 0;

let undos = [];
let swatches = [];


let undoState = 0;
let maxUndo = 100;

let fontSize;

function setup() {
  noCursor();
  //colors
  color1 = color(0); // pink
  color2 = color(255); // white
  color3 = color(120, 120, 120); // grey
  color4 = color(201, 33, 33); // red
  color5 = color(33, 33, 201); // blue
  color6 = color(251, 190, 44); // gold


  swatches = [color1, color2, color3, color4, color5, color6];

  activeColor = color2;

  //h = 500;
  //responsive();

  //gridX = cellW;
  //gridY = cellW * 2.5;

  //h = gridY + gridH + cellW * 5;
  frameRate(30);

  createCanvas(windowWidth, windowHeight);
  responsive();
  //let canvas = createCanvas(w, h).parent('p5canvas');



  // let w = document.getElementById('p5canvas').offsetWidth;
  // let h = w;
  // canvas = createCanvas(w, h).parent('p5canvas');

  gridImg = createGraphics(rows, cols);
  img = createImage(10, 10);

  //set all pixels to black
  for (let i = 0; i < rows * cols; i++) {
    pixels[i] = color1;
  }

  // gridImg = createGraphics(rows, cols);
}

function draw() {


  gridX = cellW * 2;
  gridY = cellW * 3.5;


  background(255);

  stroke(0, 0, 0, 50);
  strokeWeight(1);

  let fps = frameRate();
  fill(0);
  textAlign(LEFT);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
  //text(str(cellCoordX) + ", " + str(cellCoordY), 10, height - 25);
  text(str(undoState), 10, height - 25);



  if (mouseIsPressed && workspaceCheck() == true) {

    //Labels where the mouse is relative to the grid being 0
    coordX = mouseX - gridX;
    coordY = mouseY - gridY;

    //Labels where the mouse was relative to the grid being 0
    pcoordX = pmouseX - gridX;
    pcoordY = pmouseY - gridY;


    //Labels which cell the mouse was in relative to the grid being 0

    pcellCoordX = int(map(pcoordX, 0, gridW, 0, rows));

    if (pcellCoordX < 0) {
      pcellCoordX = floor(pcellCoordX);
    } else {
      pcellCoordX = int(pcellCoordX);
    }

    pcellCoordY = map(pcoordY, 0, gridH, 0, cols);
    if (pcellCoordY < 0) {
      pcellCoordY = floor(pcellCoordY);
    } else {
      pcellCoordY = int(pcellCoordY);
    }

    // Labels which cell the mouse is in relative to the grid being 0

    cellCoordX = map(coordX, 0, gridW, 0, rows);
    if (cellCoordX < 0) {
      cellCoordX = floor(cellCoordX);
    } else {
      cellCoordX = int(cellCoordX);
    }

    cellCoordY = map(coordY, 0, gridH, 0, cols);
    /* prevents negative Y coordintes from being rounded to wrong cell via int().
    Bug came into question when trying to click save and undo buttons */
    if (cellCoordY < 0) {
      cellCoordY = floor(cellCoordY);
    } else {
      cellCoordY = int(cellCoordY);
    }


    /* Max amount of intepolation relative to the distance between mouse
    coordinates if maxLerp is not at least one, a single touch press wont
    register */

    let maxLerp = 1;
    maxLerp = dist(pcoordX, pcoordY, coordX, coordY) + 1;
    maxLerp = constrain(maxLerp, 0, 200);

    for (let i = 0; i < maxLerp; i++) {


      pcellCoordX = lerp(pcellCoordX, cellCoordX, 0.04);
      pcellCoordY = lerp(pcellCoordY, cellCoordY, 0.04);


      // prevents negative X coordintes from being rounded to wrong cell via round()
      let x;

      if (pcellCoordX < 0) {
        x = floor(floor(cellCoordX));
      } else {
        x = round(pcellCoordX);
      }

      let y = round(pcellCoordY);




      if (brush == 1 && x >= 0 && x < rows && y >= 0) {
        pixels[(rows * y) + x] = activeColor;
      } else if (brush == 2 && y >= 0) {
        /* if coord y < 0 when users click just outside of the top of the grid
        especially in trying to click the buttons, marks are placed on grid */

        //center column
        if (x >= 0 && x < rows) {
          pixels[(rows * y) + x] = activeColor;
          pixels[(rows * (y - 1)) + x] = activeColor;
        }

        //left column
        if (x > 0 && x < rows) {
          pixels[(rows * y) + x - 1] = activeColor;
          pixels[(rows * (y - 1)) + x - 1] = activeColor;
        }
      } else if (brush == 3 && y >= 0) {

        //center column
        if (x >= 0 && x < rows) {
          pixels[(rows * y) + x] = activeColor;
          pixels[(rows * (y - 1)) + x] = activeColor;
          pixels[(rows * (y + 1)) + x] = activeColor;
          pixels[(rows * (y + 2)) + x] = activeColor;
        }

        //left column
        if (x > 0 && x < rows) {
          pixels[(rows * y) + x - 1] = activeColor;
          pixels[(rows * (y - 1)) + x - 1] = activeColor;
          pixels[(rows * (y + 1)) + x - 1] = activeColor;
          pixels[(rows * (y + 2)) + x - 1] = activeColor;
        }

        // right column
        if (x >= 0 && x < rows - 1) {
          pixels[(rows * y) + x + 1] = activeColor;
          pixels[(rows * (y - 1)) + x + 1] = activeColor;
          pixels[(rows * (y + 1)) + x + 1] = activeColor;
          pixels[(rows * (y + 2)) + x + 1] = activeColor;
        }
      }
    }

  }

  //redraw Grid
  //fill(0);
  rect(gridX - cellW, gridY - cellH, gridW + cellW * 2, gridH + cellH * 2);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      stroke(200, 100);
      fill(pixels[(rows * j) + i]);
      rect(cellW * i + gridX, cellH * j + gridY, cellW, cellH);
    }
  }


  // Create preview Image

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      gridImg.noStroke();
      gridImg.fill(pixels[(rows * j) + i]);
      gridImg.rect(i, j, 1, 1);
    }
  }



  createInterface();


  ////////////////////////////////////////////////////////////////

  // GRID CURSOR

  // noFill prevents fill within the cursor itself before the overlay color is used
  noFill();
  if (gridCheck() && touches.length < 1) {
    noCursor();
    strokeWeight(3);
    stroke(255, 255, 255, 100);

    if (brush == 1) {
      rect(mouseX - cellW / 2, mouseY - cellH / 2, cellW, cellH);
      strokeWeight(1);
      stroke(0, 0, 0, 100);
      fill(red(activeColor), green(activeColor), blue(activeColor), 100);
      rect(mouseX - cellW / 2, mouseY - cellH / 2, cellW, cellH);
    }
    if (brush == 2) {
      rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 2, cellH * 2);
      strokeWeight(1);
      stroke(0, 0, 0, 100);
      fill(red(activeColor), green(activeColor), blue(activeColor), 100);
      rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 2, cellH * 2);
    }
    if (brush == 3) {
      rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 3, cellH * 4);
      strokeWeight(1);
      stroke(0, 0, 0, 100);
      fill(red(activeColor), green(activeColor), blue(activeColor), 100);
      rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 3, cellH * 4);
    }
  } else {
    cursor();
  }



  //Place  Preview Image
  if (width > 600) {
    image(gridImg, gridX + gridW + cellW * 2, gridY - cellH, cellW * 3, cellW * 3);
  }
}


////////////////////////////////////////////////////////////////

// END OF DRAW

////////////////////////////////////////////////////////////////

// END OF DRAW

////////////////////////////////////////////////////////////////


function touchStarted() {


  createSwatches(true);

  undoButton(true);

  saveButton(true);

  clearButton(true);

  sizeButton(true);

  if (gridCheck()) {
    // Just the grid
    trackUndo();
    return false;
  }
  touchState = false;
}


function windowResized() {
  //responsive();
  resizeCanvas(windowWidth, windowHeight);
  responsive();
  // h = gridY + gridH + cellW * 4;
  // resizeCanvas(w, h);
}


function responsive() {
  if (width > 600) {
    cellW = width / 35;
    // cellW = document.getElementById('p5canvas').offsetWidth/35;
  } else {
    cellW = width / (rows + 4);
    //cellW = document.getElementById('p5canvas').offsetWidth / (rows + 2);
  }
  cellH = round(0.7 * cellW);
  padding = (cellW / 2);
  gridW = rows * cellW; // CellW changing means that this variable needs updating
  gridH = cols * cellH; // CellH changing means that this variable needs updating
}


function createInterface() {

  fontSize = cellH * 1.25;

  textSize(fontSize);

  createSwatches(false);

  saveButton(false);

  undoButton(false);

  clearButton(false);

  sizeButton(false);

}



function createSwatches(click) {

  let colorW = round(cellW * 2);
  let colorH = colorW;

  let x = gridX - cellW;
  let y = gridY + gridH + cellH * 2;

  let padding = (cellW / 2);

  for (let i = 0; i < 6; i++) {
    fill(swatches[i]);
    if (activeColor === swatches[i]) {
      stroke(0);
      strokeWeight(3);
    } else {
      stroke(200);
      strokeWeight(1)
    }

    let x2 = (x + colorW * i + (i * padding));

    rect(x2, y, colorW, colorH);
    if (click == true && clickCheck(x2, y, colorW, colorH)) {
      activeColor = swatches[i];
    }
  }
}

function undoButton(click) {

  fill(0);
  noStroke();

  let x = gridX - cellW;
  let y = gridY - cellH * 2;

  let x2 = x - cellW / 4;
  let y2 = y - cellH - fontSize * 0.4

  fill(0);
  noStroke();
  text("↩️Undo", x, y);
  if (undoState == 0) {
    fill(255, 210);
    //click area bounds
    rect(x2, y2, cellW * 4, cellH * 2);
  }

  if (click == true && undoState >= 1 && clickCheck(x2, y2, cellW * 4, cellH * 2)) {
    undo();
    return false;
  }

}

function saveButton(click) {

  fill(0);
  noStroke();

  let w = cellW * 3.5;
  let x = gridX + gridW + cellW - w;
  let y = gridY - cellH * 2;

  fill(0);
  noStroke();
  text("💾Save", x, y);

  let y2 = y - cellH * 1.5;

  //rect(x - cellW/4, y2, w + cellW/2, cellH * 2);

  if (click == true && clickCheck(x - cellW / 4, y2, w + cellW / 2, cellH * 2)) {
    save(gridImg, 'stringandloop-input.png');
    print("saved");
    return false;
  }
}

function clearButton(click) {

  fill(0);
  noStroke();

  let x = gridX + gridW / 2;
  let y = gridY - cellH * 2;

  let w = cellW * 4;


  textAlign(CENTER);
  text("❌Clear", x, y);

  let x2 = x - w/2;
  let y2 = y - cellH * 1.5;


  textAlign(LEFT);
  
  let isClear = true;
  
  for (let i = 0 ; i < rows * cols; i++){
  if (pixels[i] != color1){
      isClear = false;
    }
  }
  
  if (click == true && isClear == false && clickCheck(x2, y2, w, cellH * 2)) {
    trackUndo();
    saveGrid();
    for (let i = 0; i < rows * cols; i++) {
      pixels[i] = color1;
    }
    return true; // use to create an undoState out of clear
  } 
}

function trackUndo() {
    // Track undos
  if (undoState > maxUndo - 1) {
    undoState = maxUndo - 1;
    for (let i = 0; i < maxUndo; i++) {
      undos[i] = undos[i + 1];
    }
  }

    undoState += 1;
    undos[undoState] = [];
    for (let i = 0; i < rows * cols; i++) {
      undos[undoState][i] = pixels[i];
    }
}


function sizeButton(click) {


  fill(255);
  noStroke(200);
  strokeWeight(1);

  let w = cellW * 6;
  let h = cellW * 2;
  let x = gridX + gridW + cellW - w;
  let y = gridY + gridH + cellH * 2;


  stroke(200);
  rect(x, y, w, h);


  if (click == true && clickCheck(x, y, w / 2, h)) {
    if (brush == 3) {
      brush = 2;
    } else if (brush == 2) {
      brush = 1;
      return brush;
    }
  }

  if (click == true && clickCheck(x + w / 2, y, w / 2, h)) {
    if (brush == 1) {
      brush = 2;
    } else if (brush == 2) {
      brush = 3;
    }
  }
}



function undo() {
  saveGrid();
  if (undoState > 0) {
    if (undoState >= 1) {
      undoState = undoState - 1;
    }
  }
}


function saveGrid() {
for (let i = 0; i < rows * cols; i++) {
      pixels[i] = undos[undoState][i];
    }
}

function clickCheck(x, y, w, h) {
  if (mouseIsPressed && mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    return true;
  } else {
    return false;
  }
}

function gridCheck() {
  if (mouseX > gridX && mouseX < gridX + gridW && mouseY > gridY && mouseY < gridY + gridH) {
    return true;
  }
}

function workspaceCheck() {
  if (mouseX > gridX - workspace && mouseX < gridX + gridW + workspace &&
    mouseY > gridY - workspace && mouseY < gridY + gridH + workspace) {
    return true;
  }
}



// function deviceShaken() {
//   for (let i = 0; i < rows * cols; i++) {
//     pixels[i] = 0;
//   }
// }

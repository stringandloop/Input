function saveGrid() {
  // If capped off at the max undo, set undoState to the limit and shift array
  if (undoState > maxUndo - 1) {
    undoState = maxUndo - 1;
    for (let i = 0; i < maxUndo; i++) {
      savedGrids[i] = savedGrids[i + 1];
    }
  }
  select('#undo-button').addClass('undo-on');
  select('#undo-button').style('opacity: 1;')
  savedGrids[undoState] = [];
  for (let i = 0; i < rowLen * colLen; i++) {
    savedGrids[undoState][i] = pixels[i];
  }
  undoState += 1;
}


function sendImage() {
  background(bg);
  drawPixels();
  let a = canvas.toDataURL("image/png");
  select('#preview-image').style('background-image', 'url("' + str(a) + '")');
  drawGrid();
}


function controlButtons() {
  select('#undo-button').mousePressed(undo);
  select('#undo-button').style('opacity: .15;')
  //
  select('#save-button').mousePressed(saveButton);
  //
  select('#clear-button').mousePressed(clearButton);
}


function undo() {
  if (undoState > 0) {
    undoState = undoState - 1;
    for (let i = 0; i < rowLen * colLen; i++) {
      pixels[i] = savedGrids[undoState][i];
    }
    print(undoState);
  }
  if (undoState == 0) {
    select('#undo-button').removeClass('undo-on');
    select('#undo-button').style('opacity: .15;')
  }

  sendImage();
  localStorage.setItem("pixels", JSON.stringify(pixels));
  redraw();
}


function clearButton() {
  saveGrid();
  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      pixels[(rowLen * j) + i] = bg;
    }
  }
  sendImage();
  localStorage.setItem("pixels", JSON.stringify(pixels));
  redraw();
}


function saveButton() {
  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      gridImg.noStroke();
      gridImg.fill(pixels[(rowLen * j) + i]);
      gridImg.rect(i, j, 1, 1);
    }
  }
  menu = true;
  let filename = prompt("What is your name") + '-stringandloop-input.png';
  save(gridImg, filename);
}

function createPalette() {
  createSwatch(swatch1, 'swatch1', color1);
  createSwatch(swatch2, 'swatch2', color2);
  createSwatch(swatch3, 'swatch3', color3);
  createSwatch(swatch4, 'swatch4', color4);
  createSwatch(swatch5, 'swatch5', color5);
  createSwatch(swatch6, 'swatch6', color6);

  select('#swatch1').style('outline', 'solid 4px black');
}

function createSwatch(element, name, color) {
  element = select('#' + str(name))
  element.style('background-color', str(color));

  element.style('outline', 'solid 1px lightgrey');
  //
  element.mousePressed(swatchButton(color, name));
}

function swatchButton(color, name) {
  return function() {
    activeColor = color;
    select('#swatch1').style('outline', 'solid 1px lightgrey');
    select('#swatch2').style('outline', 'solid 1px lightgrey');
    select('#swatch3').style('outline', 'solid 1px lightgrey');
    select('#swatch4').style('outline', 'solid 1px lightgrey');
    select('#swatch5').style('outline', 'solid 1px lightgrey');
    select('#swatch6').style('outline', 'solid 1px lightgrey');

    if ((red(color) + green(color) + blue(color)) / 3 > 50) {
      select('#' + str(name)).style('outline', 'solid 4px black');
    } else {
      select('#' + str(name)).style('outline', 'solid 4px grey');
    }
  }
}

function brushButtons() {
  select('#plus-button').addClass('brush-size-on');
  select('#plus-button').mousePressed(plus);
  select('#minus-button').addClass('brush-size-on');
  select('#minus-button').mousePressed(minus);
}


function minus() {
  if (brushSize == 4) {
    brushSize = 3;
    select('#plus-button').addClass('brush-size-on');
    select('#plus-button').style('opacity: 1;');
    select('#minus-button').addClass('brush-size-on');
    select('#minus-button').style('opacity: 1;');
  } else if (brushSize == 3) {
    brushSize = 2;
    select('#plus-button').addClass('brush-size-on');
    select('#plus-button').style('opacity: 1;');
    select('#minus-button').addClass('brush-size-on');
    select('#minus-button').style('opacity: 1;');
  } else if (brushSize == 2) {
    brushSize = 1;
    select('#plus-button').style('opacity: 1;');
    select('#minus-button').removeClass('brush-size-on');
    select('#minus-button').style('opacity: .15;');
  }
}

function plus() {
  if (brushSize == 1) {
    brushSize = 2;
    select('#plus-button').addClass('brush-size-on');
    select('#plus-button').style('opacity: 1;');
    select('#minus-button').addClass('brush-size-on');
    select('#minus-button').style('opacity: 1;');
  } else if (brushSize == 2) {
    brushSize = 3;
    select('#plus-button').addClass('brush-size-on');
    select('#plus-button').style('opacity: 1;');
    select('#minus-button').addClass('brush-size-on');
    select('#minus-button').style('opacity: 1;');
  } else if (brushSize == 3) {
    brushSize = 4;
    select('#plus-button').removeClass('.brush-size-on');
    select('#plus-button').style('opacity: .15;');
    select('#minus-button').style('opacity: 1;');
  }
}

function floodFill() {
  if (gridCheck) {
    saveGrid();
    //take new cellValues
    let x = floor(map(mouseX, 0, cellW * rowLen, 0, rowLen));
    let y = floor(map(mouseY, 0, cellH * colLen, 0, colLen));

    //to compare colors check and compare the indidivual values
    let r = pixels[index(x, y)].levels[0];
    let g = pixels[index(x, y)].levels[1];
    let b = pixels[index(x, y)].levels[2];

    let activer = activeColor.levels[0];
    let activeg = activeColor.levels[1];
    let activeb = activeColor.levels[2];

    if (str(r, g, b) != str(activer, activeg, activeb)) {
      floodFillInner(x, y, r, g, b);
    }

    redraw();
    localStorage.setItem("pixels", JSON.stringify(pixels));
    sendImage();
  }
}

function floodFillInner(x, y, r, g, b) {
  if (x < 0 || x > rowLen - 1 || y < 0 || y > colLen - 1) {
    return; // already go back
  }

  let r2 = pixels[index(x, y)].levels[0];
  let g2 = pixels[index(x, y)].levels[1];
  let b2 = pixels[index(x, y)].levels[2];

  if (str(r, g, b) != str(r2, g2, b2)) {
    return;
  }

  pixels[index(x, y)] = activeColor; // mark the point so that I know if I passed through it.

  floodFillInner(x + 1, y, r, g, b); // then i can either go south
  floodFillInner(x - 1, y, r, g, b); // or north
  floodFillInner(x, y + 1, r, g, b); // or east
  floodFillInner(x, y - 1, r, g, b); // or west
}

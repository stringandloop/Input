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
  select('#submit-button').mousePressed(submit);
  select('#modal').mousePressed(hideModal);
  //hideModal();

  select('#clear-button').mousePressed(clearButton);
}


function undo() {
  if (undoState > 0) {
    undoState = undoState - 1;
    for (let i = 0; i < rowLen * colLen; i++) {
      pixels[i] = savedGrids[undoState][i];
    }
  }
  if (undoState == 0) {
    select('#undo-button').removeClass('undo-on');
    select('#undo-button').style('opacity: .15;')
  }

  sendImage();
  localStorage.setItem("pixels", JSON.stringify(compress(pixels)));
  redraw();
}


function clearButton() {
  saveGrid();
  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      pixels[(rowLen * j) + i] = [bg[0], bg[1], bg[2]];
    }
  }
  sendImage();
  localStorage.setItem("pixels", JSON.stringify(compress(pixels)));
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
  modal = true;
  print(modal);
  select('#modal').style('display: block;');
  select('#modal').style('opacity: 1;');;
}

function createPalette() {
  createSwatch(swatch1, 'swatch1', color1);
  createSwatch(swatch2, 'swatch2', color2);
  createSwatch(swatch3, 'swatch3', color3);
  createSwatch(swatch4, 'swatch4', color4);
  createSwatch(swatch5, 'swatch5', color5);
  createSwatch(swatch6, 'swatch6', color6);

  select('#swatch1').style('box-shadow', '0 0 0 3px black');
}

function createSwatch(element, name, color) {
  element = select('#' + str(name))
  element.style('background-color', 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')');

  element.style('box-shadow', '0 0 0 1px lightgrey');
  //
  element.mousePressed(swatchButton(color, name));
}

function swatchButton(color, name) {
  return function() {
    activeColor = color;
    select('#swatch1').style('box-shadow', '0 0 0 1px lightgrey');
    select('#swatch2').style('box-shadow', '0 0 0 1px lightgrey');
    select('#swatch3').style('box-shadow', '0 0 0 1px lightgrey');
    select('#swatch4').style('box-shadow', '0 0 0 1px lightgrey');
    select('#swatch5').style('box-shadow', '0 0 0 1px lightgrey');
    select('#swatch6').style('box-shadow', '0 0 0 1px lightgrey');

    if ((color[0] + color[1] + color[2]) / 3 > 50) {
      select('#' + str(name)).style('box-shadow', '0 0 0 3px black');
    } else {
      select('#' + str(name)).style('box-shadow', '0 0 0 3px grey');
    }
  }
}

function brushButtons() {
  select('#brush1').mousePressed(brush1);
  select('#brush2').mousePressed(brush2);
  select('#brush3').mousePressed(brush3);
  select('#brush4').mousePressed(brush4);

  function resetBrushes() {
    select('#brush1').html('1️⃣');
    select('#brush2').html('2️⃣')
    select('#brush3').html('3️⃣')
    select('#brush4').html('4️⃣')
  }

  function brush1() {
    brushSize = 1;
    resetBrushes();
    select('#brush1').html('*️⃣');
  }

  function brush2() {
    brushSize = 2;
    resetBrushes();
    select('#brush2').html('*️⃣');
  }

  function brush3() {
    brushSize = 3;
    resetBrushes();
    select('#brush3').html('*️⃣');
  }

  function brush4() {
    brushSize = 4;
    resetBrushes();
    select('#brush4').html('*️⃣');
  }
}


function floodFill() {
  if (gridCheck) {
    saveGrid();
    //take new cellValues
    let x = floor(map(mouseX, 0, cellW * rowLen, 0, rowLen));
    let y = floor(map(mouseY, 0, cellH * colLen, 0, colLen));

    //to compare colors check and compare the indidivual values
    let r = pixels[index(x, y)][0];
    let g = pixels[index(x, y)][1];
    let b = pixels[index(x, y)][2];

    let activer = activeColor[0];
    let activeg = activeColor[1];
    let activeb = activeColor[2];

    if (str(r, g, b) != str(activer, activeg, activeb)) {
      floodFillInner(x, y, r, g, b);
    }

    redraw();
    localStorage.setItem("pixels", JSON.stringify(compress(pixels)));
    sendImage();
  }
}

function floodFillInner(x, y, r, g, b) {
  if (x < 0 || x > rowLen - 1 || y < 0 || y > colLen - 1) {
    return; // already go back
  }

  let r2 = pixels[index(x, y)][0];
  let g2 = pixels[index(x, y)][1];
  let b2 = pixels[index(x, y)][2];

  if (str(r, g, b) != str(r2, g2, b2)) {
    return;
  }

  pixels[index(x, y)] = [activeColor[0], activeColor[1], activeColor[2]]; // mark the point so that I know if I passed through it.

  floodFillInner(x + 1, y, r, g, b); // then i can either go south
  floodFillInner(x - 1, y, r, g, b); // or north
  floodFillInner(x, y + 1, r, g, b); // or east
  floodFillInner(x, y - 1, r, g, b); // or west
}

function submit() {
  let checkedValue = document.getElementById('input-checkbox').checked;
  let inputAuthor = document.getElementById('input-author').value;
  let inputID = document.getElementById('input-id').value;

  print(checkedValue, inputAuthor, inputID);
  let filename = 'stringandloop-input.png';
  if (inputAuthor.length > 0) {
    filename = inputAuthor + '-' + filename;
  }
  if (checkedValue == false) {
    print('Please accept the terms and conditions')
  }
  if (checkedValue == true) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var uid = firebase.auth().currentUser.uid;
        console.log(uid);
      } else {

      }
    });
  }
}

function hideModal() {
  var modal = document.getElementById('modal');

  if (event.target == modal) {
    select('#modal').style('display: none;');
    select('#modal').style('opacity: 0;');
    // Clear modal values
    document.getElementById('input-author').value = "";
    document.getElementById('input-id').value = "";
    document.getElementById('input-checkbox').checked = false;

  }
}

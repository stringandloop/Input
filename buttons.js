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
  let a = canvas.toDataURL("image/jpeg");
  select('#preview-image').style('background-image', 'url("' + str(a) + '")');
  drawGrid(showGrid);
}


function controlButtons() {
  select('#undo-button').mousePressed(undoButton);
  select('#undo-button').style('opacity: .15;')
  select('#clear-button').mousePressed(clearButton);
  select('#grid-button').mousePressed(gridButton);
  select('#load-button').mousePressed(loadButton);
  select('#save-button').mousePressed(saveButton);


  function undoButton() {
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

  function gridButton() {
    if (showGrid == true) {
      showGrid = false;
    } else {
      showGrid = true;
    }
    redraw();
  }

  function loadButton() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var uid = firebase.auth().currentUser.uid;
        var path = database.ref('backers/' + uid);
        path.once('value', gotData, errData);

        function gotData(data) {
          // get the value of the current plot and updated pixels
          let storedPixels = decompress(data.val().pixels);
          if (storedPixels.length == pixels.length) {
            updateLoadedPixels(storedPixels);
            redraw();
            sendImage();
            alert('Successfully loaded data loaded from Server')
            //Save the action so that it may be undone
            saveGrid();
            //release the canvas from drawing to debug the alert box counting as a mouse press
            canvasReleased();
            return;
          }
          alert('Sorry, your saved data is incompatible with the current canvas.')
        }

        function errData(data) {
          alert('Sorry. Something went wrong. Could Not read data from server.')
        }
      }
    });
  }

  function saveButton() {
    for (let i = 0; i < rowLen; i++) {
      for (let j = 0; j < colLen; j++) {
        gridImg.noStroke();
        gridImg.fill(pixels[index(i, j)]);
        gridImg.stroke(pixels[index(i, j)]);
        gridImg.rect(i * 7, j * 5, 7, 5);
      }
    }
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var uid = firebase.auth().currentUser.uid;
        write(uid);
      } else {
        alert('Thank you for your submission!');
      }
    });
    save(gridImg, 'stringandloop-input.png');
    saveGrid();
    canvasReleased();
  }
}

function toolButtons() {
  select('#pencil-button').mousePressed(pencilButton);
  select('#pencil-button').style('color', '#e43a4c');
  select('#line-button').mousePressed(lineButton);
  select('#fill-button').mousePressed(fillButton);

  function pencilButton() {
    tool = 0;
    preview = false;
    select('#pencil-button').style('color', '#e43a4c');
    select('#line-button').style('color', 'black');
    select('#fill-button').style('color', 'black');
  }

  function lineButton() {
    tool = 1;
    select('#pencil-button').style('color', 'black');
    select('#line-button').style('color', '#e43a4c');
    select('#fill-button').style('color', 'black');
    removeModifier();
  }

  function fillButton() {
    tool = 2;
    select('#pencil-button').style('color', 'black');
    select('#line-button').style('color', 'black');
    select('#fill-button').style('color', '#e43a4c');
    removeModifier();
  }

  function removeModifier() {
    dither = false;
    mirrorX = false;
    mirrorY = false;
    select('#dither-button').style('color', 'black');
    select('#mirrorx-button').style('color', 'black');
    select('#mirrory-button').style('color', 'black');
  }
}


function modifierButtons() {
  select('#dither-button').mousePressed(ditherButton);
  select('#mirrorx-button').mousePressed(mirrorXButton);
  select('#mirrory-button').mousePressed(mirrorYButton);

  function ditherButton() {
    if (dither == false && tool == 0) {
      dither = true;
      select('#dither-button').style('color', '#e43a4c');
    } else {
      dither = false;
      select('#dither-button').style('color', 'black');
    }
  }

  function mirrorXButton() {
    if (mirrorX == false && tool == 0) {
      mirrorX = true;
      select('#mirrorx-button').style('color', '#e43a4c');
    } else {
      mirrorX = false;
      select('#mirrorx-button').style('color', 'black');
    }
  }

  function mirrorYButton() {
    if (mirrorY == false && tool == 0) {
      mirrorY = true;
      select('#mirrory-button').style('color', '#e43a4c');
    } else {
      mirrorY = false;
      select('#mirrory-button').style('color', 'black');
    }
  }
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
  select('#brush2').html('*️⃣');
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
  if (checkedValue == true) {}
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

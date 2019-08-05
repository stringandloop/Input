function brushTool(cellX, cellY, pushCursorX, pushCursorY, reflect1, reflect2) {

  let pcellX = (floor((pmouseX + pushCursorX) / cellW));
  let pcellY = (floor((pmouseY + pushCursorY) / cellH));

  let maxLerp = 1;
  maxLerp = dist(pmouseX, pmouseY, mouseX, mouseY) + 1;
  maxLerp = constrain(maxLerp, 0, 200);

  for (let i = 0; i < maxLerp; i++) {

    // interpolate to from pcellCoord to the ycellCoord
    pcellX = lerp(pcellX, cellX, 0.04);
    pcellY = lerp(pcellY, cellY, 0.04);

    // do not round the lerp values since. Only the final coordinates used for painting while interpoloation continues to happen
    let x = round(pcellX);
    let y = round(pcellY);

    if (reflect1 != undefined) {
      if (reflect2 == undefined) {
        reflect2 = ' ';
      }
      if (reflect1.toLowerCase() == 'x' || reflect2.toLowerCase() == 'x') {
        x = rowLen - x;
      }
      // Need to check for both arguments separately do not use else if
      if (reflect1.toLowerCase() == 'y' || reflect2.toLowerCase() == 'y') {
        y = colLen - y;
      }
    }
    placeMultiPixel(x, y);
  }
}

function lineTool(cellX, cellY, startX, startY, pushCursorX, pushCursorY, preview) {

  let pcellX = (floor((startX + pushCursorX) / cellW));
  let pcellY = (floor((startY + pushCursorY) / cellH));

  let maxLerp = 1;
  // calculate start from mouseX
  maxLerp = dist(startX, startY, mouseX, mouseY) + 1;
  maxLerp = constrain(maxLerp, 0, 400);

  for (let i = 0; i < maxLerp; i++) {

    // interpolate to from pcellCoord to the ycellCoord
    pcellX = lerp(pcellX, cellX, 0.015);
    pcellY = lerp(pcellY, cellY, 0.015);

    // do not round the lerp values since. Only the final coordinates used for painting while interpoloation continues to happen
    let x = round(pcellX);
    let y = round(pcellY);
    placeMultiPixel(x, y);
  }
}



function placeMultiPixel(x, y) {

  if (brushSize == 1) {
    placePixel(x, y);
  } else if (brushSize == 2) {
    placePixel(x, y);
    placePixel(x, y - 1);
    placePixel(x - 1, y);
    placePixel(x - 1, y - 1);
  } else if (brushSize == 3) {
    placePixel(x, y);
    placePixel(x, y - 1);
    placePixel(x, y - 2);
    placePixel(x - 1, y);
    placePixel(x - 1, y - 1);
    placePixel(x - 1, y - 2);
  } else if (brushSize == 4) {
    placePixel(x, y - 1);
    placePixel(x, y);
    placePixel(x, y + 1);
    placePixel(x, y + 2);
    //
    placePixel(x + 1, y - 1);
    placePixel(x + 1, y);
    placePixel(x + 1, y + 1);
    placePixel(x + 1, y + 2);
    //
    placePixel(x - 1, y - 1);
    placePixel(x - 1, y);
    placePixel(x - 1, y + 1);
    placePixel(x - 1, y + 2);
  }
}

function placePixel(x, y) {
  if (x >= 0 && x < rowLen && y >= 0 && y < colLen) {
    if (dither == true) {
      if (x % 2 == 0 && (y % 4 == 0 || y % 4 == 1)) {
        return;
      } else if (x % 2 == 1 && (y % 4 == 2 || y % 4 == 3)) {
        return;
      }
    }
    if (preview == false) {
      pixels[index(x, y)] = [activeColor[0], activeColor[1], activeColor[2]];
    } else {
      fill(activeColor);
      rect(x * cellW, y * cellH, cellW, cellH);
    }
  }
}

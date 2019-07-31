function brushTool(cellX, cellY, pushCursorX, pushCursorY) {

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
}

function lineTool(cellX, cellY, pCellX, pCellY, pushCursorX, pushCursorY, preview) {

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
}


function brushTool(cellX, cellY, pushCursorX, pushCursorY) {

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
}

function mirrorTool(cellX, cellY, pushCursorX, pushCursorY) {

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

    if (brushSize == 1) {
      placePixel(rowLen - x, y);
    } else if (brushSize == 2) {
      placePixel(rowLen - x, y);
      placePixel(rowLen - x, y - 1);
      placePixel(rowLen - x - 1, y);
      placePixel(rowLen - x - 1, y - 1);
    } else if (brushSize == 3) {
      placePixel(rowLen - x, y);
      placePixel(rowLen - x, y - 1);
      placePixel(rowLen - x, y - 2);
      placePixel(rowLen - x - 1, y);
      placePixel(rowLen - x - 1, y - 1);
      placePixel(rowLen - x - 1, y - 2);
    } else if (brushSize == 4) {
      placePixel(rowLen - x, y - 1);
      placePixel(rowLen - x, y);
      placePixel(rowLen - x, y + 1);
      placePixel(rowLen - x, y + 2);
      //
      placePixel(rowLen - x + 1, y - 1);
      placePixel(rowLen - x + 1, y);
      placePixel(rowLen - x + 1, y + 1);
      placePixel(rowLen - x + 1, y + 2);
      //
      placePixel(rowLen - x - 1, y - 1);
      placePixel(rowLen - x - 1, y);
      placePixel(rowLen - x - 1, y + 1);
      placePixel(rowLen - x - 1, y + 2);
    }
  }
}

function brush(cellX, cellY, pushCursorX, pushCursorY) {

  //let pcellX = floor(map(pmouseX + pushCursorX, 0, cellW * rowLen, 0, rowLen));
  //let pcellY = floor(map(pmouseY + pushCursorY, 0, cellH * colLen, 0, colLen));

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
      checkPixel(x, y);
    } else if (brushSize == 2) {
      checkPixel(x, y);
      checkPixel(x, y - 1);
      checkPixel(x - 1, y);
      checkPixel(x - 1, y - 1);
    } else if (brushSize == 3) {
      checkPixel(x, y);
      checkPixel(x, y - 1);
      checkPixel(x, y - 2);
      checkPixel(x - 1, y);
      checkPixel(x - 1, y - 1);
      checkPixel(x - 1, y - 2);
    } else if (brushSize == 4) {
      checkPixel(x, y - 1);
      checkPixel(x, y);
      checkPixel(x, y + 1);
      checkPixel(x, y + 2);
      //
      checkPixel(x + 1, y - 1);
      checkPixel(x + 1, y);
      checkPixel(x + 1, y + 1);
      checkPixel(x + 1, y + 2);
      //
      checkPixel(x - 1, y - 1);
      checkPixel(x - 1, y);
      checkPixel(x - 1, y + 1);
      checkPixel(x - 1, y + 2);
    }
  }
}

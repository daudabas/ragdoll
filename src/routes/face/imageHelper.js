const getOrientation = (file, callback) => {
  var reader = new FileReader();
  reader.onload = function(e) {

      var view = new DataView(e.target.result);
      if (view.getUint16(0, false) != 0xFFD8)
      {
          return callback(-2);
      }
      var length = view.byteLength, offset = 2;
      while (offset < length) 
      {
          if (view.getUint16(offset+2, false) <= 8) return callback(-1);
          var marker = view.getUint16(offset, false);
          offset += 2;
          if (marker == 0xFFE1) 
          {
              if (view.getUint32(offset += 2, false) != 0x45786966) 
              {
                  return callback(-1);
              }

              var little = view.getUint16(offset += 6, false) == 0x4949;
              offset += view.getUint32(offset + 4, little);
              var tags = view.getUint16(offset, little);
              offset += 2;
              for (var i = 0; i < tags; i++)
              {
                  if (view.getUint16(offset + (i * 12), little) == 0x0112)
                  {
                      return callback(view.getUint16(offset + (i * 12) + 8, little));
                  }
              }
          }
          else if ((marker & 0xFF00) != 0xFF00)
          {
              break;
          }
          else
          { 
              offset += view.getUint16(offset, false);
          }
      }
      return callback(-1);
  };
  reader.readAsArrayBuffer(file);
}

const rotateBase64Image = (base64Image, orientation, callback) => {
  // create an off-screen canvas
  var offScreenCanvas = document.createElement('canvas');
  var offScreenCanvasCtx = offScreenCanvas.getContext('2d');

  // cteate Image
  var img = new Image();
  img.src = base64Image;
  
  img.onload = () => {
    // set its dimension to rotated size
    
    switch (orientation) {
      case 1:
        offScreenCanvas.height = img.height;
        offScreenCanvas.width = img.width;
        break;
      case 3:
        offScreenCanvas.height = img.height;
        offScreenCanvas.width = img.width;
        offScreenCanvasCtx.rotate(180 * Math.PI / 180);
        offScreenCanvasCtx.translate(-offScreenCanvas.width, -offScreenCanvas.height);
        break
      case 6:
        offScreenCanvas.height = img.width;
        offScreenCanvas.width = img.height;
        offScreenCanvasCtx.rotate(90 * Math.PI / 180);
        offScreenCanvasCtx.translate(0, -offScreenCanvas.width);
        break
      default:
        break; 
    }
    // // rotate and draw source image into the off-screen canvas:
    // if (isClockwise) { 
    //     offScreenCanvasCtx.rotate(90 * Math.PI / 180);
    //     offScreenCanvasCtx.translate(0, -offScreenCanvas.width);
    // } else {
    //     offScreenCanvasCtx.rotate(-90 * Math.PI / 180);
    //     offScreenCanvasCtx.translate(-offScreenCanvas.height, 0);
    // }
    offScreenCanvasCtx.drawImage(img, 0, 0);
    const dataURL = offScreenCanvas.toDataURL();
    callback(dataURL);
  }
}

module.exports = {
  getOrientation,
  rotateBase64Image,
}
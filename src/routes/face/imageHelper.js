const getOrientation = (file, callback) => {
  var reader = new FileReader();
  reader.onload = function(e) {

      var view = new DataView(e.target.result);
      if (view.getUint16(0, false) !== 0xFFD8)
      {
          return callback(-2);
      }
      var length = view.byteLength, offset = 2;
      while (offset < length) 
      {
          if (view.getUint16(offset+2, false) <= 8) return callback(-1);
          var marker = view.getUint16(offset, false);
          offset += 2;
          if (marker === 0xFFE1) 
          {
              if (view.getUint32(offset += 2, false) !== 0x45786966) 
              {
                  return callback(-1);
              }

              var little = view.getUint16(offset += 6, false) === 0x4949;
              offset += view.getUint32(offset + 4, little);
              var tags = view.getUint16(offset, little);
              offset += 2;
              for (var i = 0; i < tags; i++)
              {
                  if (view.getUint16(offset + (i * 12), little) === 0x0112)
                  {
                      return callback(view.getUint16(offset + (i * 12) + 8, little));
                  }
              }
          }
          else if ((marker & 0xFF00) !== 0xFF00)
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

const isLandscape = (image) => {
  return (image.width > image.height);
}

const getRatio = (firstImage, secondImage) => {
  const firstLength = Math.sqrt((Math.pow(firstImage.width, 2) + Math.pow(firstImage.height, 2)));
  const secondLength = Math.sqrt((Math.pow(secondImage.width, 2) + Math.pow(secondImage.height, 2)));

  return firstLength / secondLength;
}

const rotateBase64Image = (base64Image, orientation, callback) => {
  if (orientation === -1) {
    return callback(base64Image);
  }
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  var image = new Image();
  image.src = base64Image;
  image.onload = () => {
    canvas.height = image.height;
    canvas.width = image.width;
    switch (orientation) {
      case 1:
        canvas.height = image.height;
        canvas.width = image.width;
        break;
      case 3:
        canvas.height = image.height;
        canvas.width = image.width;
        context.rotate(180 * Math.PI / 180);
        context.translate(-canvas.width, -canvas.height);
        break
      case 6:
        canvas.height = image.width;
        canvas.width = image.height;
        context.rotate(90 * Math.PI / 180);
        context.translate(0, -canvas.width);
        break
      default:
        canvas.height = image.height;
        canvas.width = image.width;
        break; 
    }

    context.drawImage(image, 0, 0);
    const newBase64Image = canvas.toDataURL();

    return callback(newBase64Image);
  };
};

const createFile = (base64Image) => {
  const blobBin = atob(base64Image.split(',')[1]);
  const array = [];
  for (var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  const file = new Blob([new Uint8Array(array)], {type: 'image/png'});

  return file;
};

const rotateImage = (file, callback) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    getOrientation(file, (orientation) => {
      rotateBase64Image(reader.result, orientation, (base64Image) => {
        callback(base64Image);
      })
    })
  }

  reader.readAsDataURL(file);
};

const cropImage = (canvas, translateX, translateY, width, height) => {
  const tempCanvas = document.createElement('canvas');
  const tempContext = tempCanvas.getContext('2d');

  tempCanvas.width = width;
  tempCanvas.height = height;

  tempContext.drawImage(canvas, translateX, translateY);

  return tempCanvas.toDataURL();
}

module.exports = {
  createFile,
  rotateImage,
  cropImage,
  isLandscape,
  getRatio,
}
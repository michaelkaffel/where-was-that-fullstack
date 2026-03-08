export const processImage16x9 = (
  file,
  outputWidth = 1200,
  quality = 0.85
) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const aspectRatio = 16 / 9;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const imgAspect = img.width / img.height;

        let cropWidth, cropHeight, cropX, cropY;

        if (imgAspect > aspectRatio) {
          // too wide → crop sides
          cropHeight = img.height;
          cropWidth = cropHeight * aspectRatio;
          cropX = (img.width - cropWidth) / 2;
          cropY = 0;
        } else {
          // too tall → crop top/bottom
          cropWidth = img.width;
          cropHeight = cropWidth / aspectRatio;
          cropX = 0;
          cropY = (img.height - cropHeight) / 2;
        }

        

        canvas.width = outputWidth;
        canvas.height = Math.round(outputWidth / aspectRatio);

        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // ✅ compressed + cropped result
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
      };
    };
  });
};
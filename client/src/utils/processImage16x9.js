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

        const outputHeight = Math.round(outputWidth / aspectRatio);

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          outputWidth,
          outputHeight
        );

        // ✅ compressed + cropped result
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    };
  });
};
import { useEffect, useState } from 'react';

function removeGreenBackground(imageSrc) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        const greenDominant = green > 145 && green > red * 1.32 && green > blue * 1.32;
        const keyDistance = Math.abs(red) + Math.abs(green - 255) + Math.abs(blue);

        if (greenDominant || keyDistance < 150) {
          data[index + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => resolve(imageSrc);
    image.src = imageSrc;
  });
}

function ChromaCutoutImage({ src, alt, className = '' }) {
  const [cutoutSrc, setCutoutSrc] = useState('');

  useEffect(() => {
    let alive = true;
    setCutoutSrc('');
    removeGreenBackground(src).then((dataUrl) => {
      if (alive) setCutoutSrc(dataUrl);
    });
    return () => {
      alive = false;
    };
  }, [src]);

  return <img className={className} src={cutoutSrc || src} alt={alt} draggable="false" />;
}

export default ChromaCutoutImage;

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE = 12 * 1024 * 1024;

export function validateImageFile(file) {
  if (!file) return 'No image selected.';
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Please upload a JPG, JPEG, PNG, or WEBP image.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Image is too large. Please choose a file under 12MB.';
  }
  return '';
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
}

export async function getCroppedImage(imageSrc, pixelCrop) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas.toDataURL('image/png');
}

export async function createImageDataFromUrl(src) {
  const image = await loadImage(src);
  const canvas = document.createElement('canvas');
  const maxSide = 1800;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return {
    width: canvas.width,
    height: canvas.height,
    imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
  };
}

export function cloneImageData(imageData) {
  return new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
}

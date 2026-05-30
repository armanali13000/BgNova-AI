export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportCanvas(canvas, format, backgroundColor = '#ffffff') {
  const output = document.createElement('canvas');
  output.width = canvas.width;
  output.height = canvas.height;
  const ctx = output.getContext('2d');

  if (format !== 'png') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, output.width, output.height);
  }

  ctx.drawImage(canvas, 0, 0);
  const mime = format === 'webp' ? 'image/webp' : format === 'jpg' ? 'image/jpeg' : 'image/png';
  return output.toDataURL(mime, 0.94);
}

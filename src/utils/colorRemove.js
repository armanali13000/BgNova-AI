import { cloneImageData } from './imageUtils.js';

function distance(data, index, color) {
  const dr = data[index] - color.r;
  const dg = data[index + 1] - color.g;
  const db = data[index + 2] - color.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const parsed = parseInt(value.length === 3 ? value.split('').map((c) => c + c).join('') : value, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

export function removeSimilarColor(imageData, color, tolerance) {
  const next = cloneImageData(imageData);
  const data = next.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0 && distance(data, i, color) <= tolerance) {
      data[i + 3] = 0;
    }
  }
  return next;
}

export function magicErase(imageData, startX, startY, tolerance) {
  const width = imageData.width;
  const height = imageData.height;
  const x = Math.floor(startX);
  const y = Math.floor(startY);
  if (x < 0 || y < 0 || x >= width || y >= height) return cloneImageData(imageData);

  const next = cloneImageData(imageData);
  const data = next.data;
  const startIndex = (y * width + x) * 4;
  const target = {
    r: data[startIndex],
    g: data[startIndex + 1],
    b: data[startIndex + 2],
  };
  const visited = new Uint8Array(width * height);
  const stack = [[x, y]];

  while (stack.length) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
    const point = cy * width + cx;
    if (visited[point]) continue;
    visited[point] = 1;
    const index = point * 4;
    if (data[index + 3] === 0 || distance(data, index, target) > tolerance) continue;
    data[index + 3] = 0;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }

  return next;
}

export function brushEdit(imageData, originalImageData, x, y, size, mode) {
  const next = cloneImageData(imageData);
  const data = next.data;
  const original = originalImageData.data;
  const radius = Math.max(1, size / 2);
  const minX = Math.max(0, Math.floor(x - radius));
  const maxX = Math.min(next.width - 1, Math.ceil(x + radius));
  const minY = Math.max(0, Math.floor(y - radius));
  const maxY = Math.min(next.height - 1, Math.ceil(y + radius));

  for (let py = minY; py <= maxY; py += 1) {
    for (let px = minX; px <= maxX; px += 1) {
      const dx = px - x;
      const dy = py - y;
      if (dx * dx + dy * dy > radius * radius) continue;
      const index = (py * next.width + px) * 4;
      if (mode === 'repair') {
        data[index] = original[index];
        data[index + 1] = original[index + 1];
        data[index + 2] = original[index + 2];
        data[index + 3] = original[index + 3];
      } else {
        data[index + 3] = 0;
      }
    }
  }

  return next;
}

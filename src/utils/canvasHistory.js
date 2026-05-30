import { cloneImageData } from './imageUtils.js';

export function createHistory(initialImageData) {
  return {
    past: [],
    present: cloneImageData(initialImageData),
    future: [],
  };
}

export function pushHistory(history, nextImageData) {
  return {
    past: [...history.past.slice(-29), cloneImageData(history.present)],
    present: cloneImageData(nextImageData),
    future: [],
  };
}

export function undoHistory(history) {
  if (!history.past.length) return history;
  const previous = history.past[history.past.length - 1];
  return {
    past: history.past.slice(0, -1),
    present: cloneImageData(previous),
    future: [cloneImageData(history.present), ...history.future],
  };
}

export function redoHistory(history) {
  if (!history.future.length) return history;
  const next = history.future[0];
  return {
    past: [...history.past, cloneImageData(history.present)],
    present: cloneImageData(next),
    future: history.future.slice(1),
  };
}

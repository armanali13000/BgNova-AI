import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Toolbar from './Toolbar.jsx';
import BrushControls from './BrushControls.jsx';
import HistoryControls from './HistoryControls.jsx';
import DownloadPanel from './DownloadPanel.jsx';
import BackgroundPreview from './BackgroundPreview.jsx';
import BeforeAfterPreview from './BeforeAfterPreview.jsx';
import { createImageDataFromUrl, cloneImageData } from '../utils/imageUtils.js';
import { createHistory, pushHistory, redoHistory, undoHistory } from '../utils/canvasHistory.js';
import { autoRemoveBackground, brushEdit, hexToRgb, magicErase, removeSimilarColor } from '../utils/colorRemove.js';
import { downloadDataUrl, exportCanvas } from '../utils/exportUtils.js';

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function EditorCanvas({ imageSrc, onRecrop }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const workingRef = useRef(null);
  const originalRef = useRef(null);
  const drawingRef = useRef(false);
  const panningRef = useRef(null);
  const [history, setHistory] = useState(null);
  const [activeTool, setActiveTool] = useState('erase');
  const [brushSize, setBrushSize] = useState(36);
  const [tolerance, setTolerance] = useState(64);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [previewBg, setPreviewBg] = useState('checker');
  const [customBg, setCustomBg] = useState('#2563eb');
  const [customBgImage, setCustomBgImage] = useState('');
  const [exportBg, setExportBg] = useState('#ffffff');
  const [showBefore, setShowBefore] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [loading, setLoading] = useState(true);

  const renderImageData = useCallback((imageData) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.putImageData(imageData, 0, 0);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    createImageDataFromUrl(imageSrc)
      .then(({ imageData }) => {
        if (!alive) return;
        originalRef.current = cloneImageData(imageData);
        workingRef.current = cloneImageData(imageData);
        setHistory(createHistory(imageData));
        renderImageData(imageData);
        setPan({ x: 0, y: 0 });
        setZoom(1);
      })
      .catch(() => toast.error('Could not open this image.'))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [imageSrc, renderImageData]);

  useEffect(() => {
    if (!history) return;
    workingRef.current = cloneImageData(history.present);
    renderImageData(showBefore ? originalRef.current : history.present);
  }, [history, renderImageData, showBefore]);

  const commit = useCallback(
    (nextImageData, message) => {
      workingRef.current = cloneImageData(nextImageData);
      setHistory((current) => pushHistory(current, nextImageData));
      renderImageData(nextImageData);
      if (message) toast.success(message);
    },
    [renderImageData],
  );

  const canvasPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const editAt = (event) => {
    if (!workingRef.current || !originalRef.current) return;
    const point = canvasPoint(event);
    const next = brushEdit(workingRef.current, originalRef.current, point.x, point.y, brushSize, activeTool);
    workingRef.current = next;
    renderImageData(next);
  };

  const handlePointerDown = (event) => {
    if (showBefore) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top, visible: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    if (activeTool === 'pan' || event.button === 1 || (zoom > 1 && event.altKey)) {
      panningRef.current = { x: event.clientX, y: event.clientY, pan };
      return;
    }
    if (activeTool === 'magic') {
      const point = canvasPoint(event);
      commit(magicErase(workingRef.current, point.x, point.y, tolerance), 'Magic eraser applied');
      return;
    }
    if (activeTool === 'autoColor') {
      const point = canvasPoint(event);
      const x = Math.floor(point.x);
      const y = Math.floor(point.y);
      const index = (y * workingRef.current.width + x) * 4;
      const sampled = {
        r: workingRef.current.data[index],
        g: workingRef.current.data[index + 1],
        b: workingRef.current.data[index + 2],
      };
      setBgColor(rgbToHex(sampled.r, sampled.g, sampled.b));
      commit(removeSimilarColor(workingRef.current, sampled, tolerance), 'Sampled color removed');
      return;
    }
    if (activeTool === 'erase' || activeTool === 'repair') {
      drawingRef.current = true;
      editAt(event);
    }
  };

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top, visible: true });
    if (panningRef.current) {
      const start = panningRef.current;
      setPan({ x: start.pan.x + event.clientX - start.x, y: start.pan.y + event.clientY - start.y });
      return;
    }
    if (drawingRef.current) editAt(event);
  };

  const handlePointerUp = () => {
    if (drawingRef.current && workingRef.current) {
      setHistory((current) => pushHistory(current, workingRef.current));
    }
    drawingRef.current = false;
    panningRef.current = null;
    setCursor((current) => ({ ...current, visible: false }));
  };

  const undo = useCallback(() => setHistory((current) => undoHistory(current)), []);
  const redo = useCallback(() => setHistory((current) => redoHistory(current)), []);
  const zoomIn = useCallback(() => setZoom((value) => Math.min(4, Number((value + 0.15).toFixed(2)))), []);
  const zoomOut = useCallback(() => setZoom((value) => Math.max(0.2, Number((value - 0.15).toFixed(2)))), []);
  const fit = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        undo();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
      }
      if (event.key === '+') zoomIn();
      if (event.key === '-') zoomOut();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [redo, undo, zoomIn, zoomOut]);

  const handleAutoColor = () => {
    if (!workingRef.current) return;
    commit(removeSimilarColor(workingRef.current, hexToRgb(bgColor), tolerance), 'Similar color removed');
  };

  const handleAiAuto = () => {
    if (!workingRef.current) return;
    const loadingToast = toast.loading('AI Auto is removing the background...');
    window.setTimeout(() => {
      const { imageData, removedPixels } = autoRemoveBackground(workingRef.current, tolerance);
      toast.dismiss(loadingToast);
      if (!removedPixels) {
        toast.error('AI Auto could not detect a clear background. Try Auto Color or Magic Eraser.');
        return;
      }
      commit(imageData, 'AI Auto background removed');
      setActiveTool('repair');
    }, 40);
  };

  const reset = () => {
    if (!originalRef.current) return;
    commit(cloneImageData(originalRef.current), 'Image reset');
  };

  const download = (format) => {
    if (!history?.present) return;
    const temp = document.createElement('canvas');
    temp.width = history.present.width;
    temp.height = history.present.height;
    temp.getContext('2d').putImageData(history.present, 0, 0);
    const dataUrl = exportCanvas(temp, format, exportBg);
    downloadDataUrl(dataUrl, `bgnova-edited-image.${format === 'jpg' ? 'jpg' : format}`);
    toast.success(`${format.toUpperCase()} downloaded`);
  };

  const fullscreen = () => {
    stageRef.current?.requestFullscreen?.();
  };

  const previewClass = previewBg === 'checker' ? 'checker' : '';
  const previewStyle =
    previewBg === 'white'
      ? { background: '#ffffff' }
      : previewBg === 'black'
        ? { background: '#05070d' }
        : previewBg === 'image' && customBgImage
          ? { backgroundImage: `url(${customBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : previewBg === 'custom'
          ? { background: customBg }
          : {};

  return (
    <div className="editor-grid" ref={stageRef}>
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onAiAuto={handleAiAuto}
        onReset={reset}
        onRecrop={onRecrop}
        onFullscreen={fullscreen}
      />
      <section className="canvas-shell glass">
        {loading && <div className="loader">Preparing editor...</div>}
        <div
          className={`canvas-stage ${previewClass}`}
          style={previewStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <canvas
            ref={canvasRef}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              cursor: activeTool === 'pan' ? 'grab' : activeTool === 'magic' ? 'crosshair' : 'none',
            }}
          />
          {(activeTool === 'erase' || activeTool === 'repair') && !showBefore && cursor.visible && (
            <span
              className="brush-cursor"
              style={{ width: brushSize, height: brushSize, left: cursor.x, top: cursor.y }}
            />
          )}
        </div>
      </section>
      <aside className="settings-panel glass">
        <BrushControls
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          tolerance={tolerance}
          setTolerance={setTolerance}
          bgColor={bgColor}
          setBgColor={setBgColor}
          onAutoColor={handleAutoColor}
        />
        <HistoryControls
          onUndo={undo}
          onRedo={redo}
          canUndo={Boolean(history?.past.length)}
          canRedo={Boolean(history?.future.length)}
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFit={fit}
        />
        <BackgroundPreview
          previewBg={previewBg}
          setPreviewBg={setPreviewBg}
          customBg={customBg}
          setCustomBg={setCustomBg}
          customBgImage={customBgImage}
          setCustomBgImage={setCustomBgImage}
        />
        <BeforeAfterPreview showBefore={showBefore} setShowBefore={setShowBefore} />
        <DownloadPanel exportBg={exportBg} setExportBg={setExportBg} onDownload={download} />
      </aside>
    </div>
  );
}

export default EditorCanvas;

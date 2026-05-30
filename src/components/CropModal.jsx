import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import toast from 'react-hot-toast';
import { FiCheck, FiCrop, FiImage, FiMaximize2, FiRotateCcw, FiX } from 'react-icons/fi';
import { getCroppedImage, loadImage } from '../utils/imageUtils.js';

const cropRatios = [
  { label: 'Original', value: 'original' },
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:5', value: 4 / 5 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
];

function CropModal({ imageSrc, onCancel, onCropComplete, onUseOriginal }) {
  const cropStageRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(null);
  const [customSizing, setCustomSizing] = useState(false);
  const [cropSize, setCropSize] = useState({ width: 320, height: 240 });
  const [originalAspect, setOriginalAspect] = useState(undefined);
  const [pixels, setPixels] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    loadImage(imageSrc).then((image) => {
      if (alive) setOriginalAspect(image.width / image.height);
    });
    return () => {
      alive = false;
    };
  }, [imageSrc]);

  useEffect(() => {
    const stage = cropStageRef.current;
    if (!stage) return undefined;
    const updateSize = () => {
      const rect = stage.getBoundingClientRect();
      setCropSize((current) => ({
        width: Math.min(Math.max(current.width, 120), Math.max(120, rect.width - 80)),
        height: Math.min(Math.max(current.height, 120), Math.max(120, rect.height - 80)),
      }));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handlePixels = useCallback((_, croppedAreaPixels) => {
    setPixels(croppedAreaPixels);
  }, []);

  const clampCropSize = useCallback((nextSize) => {
    const rect = cropStageRef.current?.getBoundingClientRect();
    const maxWidth = rect ? rect.width - 80 : 720;
    const maxHeight = rect ? rect.height - 80 : 500;
    return {
      width: Math.round(Math.min(Math.max(nextSize.width, 96), Math.max(96, maxWidth))),
      height: Math.round(Math.min(Math.max(nextSize.height, 96), Math.max(96, maxHeight))),
    };
  }, []);

  const updateCropSize = useCallback(
    (key, value) => {
      setCustomSizing(true);
      setAspect(null);
      setCropSize((current) => clampCropSize({ ...current, [key]: Number(value) || 96 }));
    },
    [clampCropSize],
  );

  const startResize = useCallback(
    (event, direction) => {
      event.preventDefault();
      event.stopPropagation();
      setCustomSizing(true);
      setAspect(null);
      const start = {
        x: event.clientX,
        y: event.clientY,
        size: cropSize,
      };
      const resize = (moveEvent) => {
        const dx = moveEvent.clientX - start.x;
        const dy = moveEvent.clientY - start.y;
        const next = { ...start.size };
        if (direction.includes('e')) next.width = start.size.width + dx * 2;
        if (direction.includes('w')) next.width = start.size.width - dx * 2;
        if (direction.includes('s')) next.height = start.size.height + dy * 2;
        if (direction.includes('n')) next.height = start.size.height - dy * 2;
        setCropSize(clampCropSize(next));
      };
      const stop = () => {
        window.removeEventListener('pointermove', resize);
        window.removeEventListener('pointerup', stop);
      };
      window.addEventListener('pointermove', resize);
      window.addEventListener('pointerup', stop);
    },
    [clampCropSize, cropSize],
  );

  const applyCrop = async () => {
    if (!pixels) return;
    setBusy(true);
    try {
      const cropped = await getCroppedImage(imageSrc, pixels);
      onCropComplete(cropped);
      toast.success('Crop applied');
    } catch {
      toast.error('Could not crop this image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="crop-modal glass">
        <div className="modal-head">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2>Crop Image Optional</h2>
          </div>
          <button className="icon-btn" onClick={onCancel} aria-label="Close cropper">
            <FiX />
          </button>
        </div>
        <div className="crop-top-actions">
          <button className="btn" onClick={onUseOriginal}>
            <FiImage /> Use Original Size
          </button>
          <p>Skip crop to edit the uploaded image exactly as it is.</p>
        </div>
        <div className="crop-ratios">
          {cropRatios.map((ratio) => (
            <button
              key={ratio.label}
              className={`ratio-btn ${aspect === ratio.value ? 'active' : ''}`}
              onClick={() => {
                setAspect(ratio.value);
                setCustomSizing(false);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
              }}
            >
              {ratio.label}
            </button>
          ))}
        </div>
        <div className={`crop-stage ${customSizing ? 'crop-stage-custom' : ''}`} ref={cropStageRef}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect === null ? undefined : aspect === 'original' ? originalAspect : aspect}
            cropSize={customSizing ? cropSize : undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={handlePixels}
            showGrid
          />
          {customSizing && (
            <div className="crop-resize-overlay" style={{ width: cropSize.width, height: cropSize.height }}>
              {['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'].map((direction) => (
                <button
                  key={direction}
                  type="button"
                  className={`crop-resize-handle handle-${direction}`}
                  aria-label={`Resize crop ${direction}`}
                  onPointerDown={(event) => startResize(event, direction)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="crop-controls">
          <div className="crop-main-controls">
            <label className="crop-zoom-control">
              Zoom
              <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
            </label>
            <button
              className={`tool-btn ${customSizing ? 'active' : ''}`}
              onClick={() => {
                setAspect(null);
                setCustomSizing((value) => {
                  const next = !value;
                  if (next) setCropSize((current) => clampCropSize(current));
                  return next;
                });
              }}
            >
              <FiMaximize2 /> Resize Box
            </button>
            <button className="tool-btn" onClick={() => setRotation((value) => value + 90)}>
              <FiRotateCcw /> Rotate
            </button>
          </div>
          {customSizing && (
            <div className="crop-size-fields">
              <label>
                Width
                <input
                  type="number"
                  min="96"
                  value={cropSize.width}
                  onChange={(event) => updateCropSize('width', event.target.value)}
                />
              </label>
              <label>
                Height
                <input
                  type="number"
                  min="96"
                  value={cropSize.height}
                  onChange={(event) => updateCropSize('height', event.target.value)}
                />
              </label>
            </div>
          )}
          <div className="crop-action-row">
            <button className="btn crop-apply-btn" disabled={busy} onClick={applyCrop}>
              {aspect === null ? <FiCrop /> : <FiCheck />} {busy ? 'Cropping...' : 'Apply Crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropModal;

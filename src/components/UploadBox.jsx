import { useCallback, useEffect, useRef, useState } from 'react';
import { FiImage, FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fileToDataUrl, validateImageFile } from '../utils/imageUtils.js';

function UploadBox({ onImageReady, compact = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    async (file) => {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      const dataUrl = await fileToDataUrl(file);
      onImageReady(dataUrl, file);
    },
    [onImageReady],
  );

  useEffect(() => {
    const onPaste = (event) => {
      const file = [...event.clipboardData.files].find((item) => item.type.startsWith('image/'));
      if (file) handleFile(file);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFile]);

  return (
    <div
      className={`upload-box ${compact ? 'compact' : ''} ${dragging ? 'dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFile(event.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(event) => handleFile(event.target.files[0])}
      />
      <span className="upload-icon">{compact ? <FiImage /> : <FiUploadCloud />}</span>
      <h3>{compact ? 'Upload an image' : 'Drop, paste, or upload your image'}</h3>
      <p>JPG, PNG, WEBP up to 12MB</p>
      <button className="btn" onClick={() => inputRef.current?.click()}>
        Upload Image
      </button>
    </div>
  );
}

export default UploadBox;

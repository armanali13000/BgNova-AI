import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import UploadBox from '../components/UploadBox.jsx';
import CropModal from '../components/CropModal.jsx';
import EditorCanvas from '../components/EditorCanvas.jsx';

function Editor() {
  const location = useLocation();
  const [sourceImage, setSourceImage] = useState(location.state?.imageSrc || '');
  const [cropSource, setCropSource] = useState(location.state?.imageSrc || '');
  const [croppedImage, setCroppedImage] = useState('');

  const handleImageReady = (dataUrl) => {
    setSourceImage(dataUrl);
    setCropSource(dataUrl);
    setCroppedImage('');
    toast.success('Image ready. Crop is optional.');
  };

  return (
    <section className="editor-page">
      {!cropSource && !croppedImage && (
        <div className="editor-upload">
          <p className="eyebrow">BgNova AI Editor</p>
          <h1>Upload an image to begin</h1>
          <UploadBox onImageReady={handleImageReady} />
        </div>
      )}
      {cropSource && !croppedImage && (
        <CropModal
          imageSrc={cropSource}
          onCancel={() => {
            setCropSource('');
            if (!sourceImage) setCroppedImage('');
          }}
          onCropComplete={(dataUrl) => {
            setCroppedImage(dataUrl);
            setCropSource('');
          }}
          onUseOriginal={() => {
            setCroppedImage(sourceImage || cropSource);
            setCropSource('');
            toast.success('Original image opened');
          }}
        />
      )}
      {croppedImage && (
        <EditorCanvas
          imageSrc={croppedImage}
          onRecrop={() => {
            setCropSource(sourceImage || croppedImage);
            setCroppedImage('');
          }}
        />
      )}
    </section>
  );
}

export default Editor;

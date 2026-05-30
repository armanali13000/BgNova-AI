import { FiImage, FiTrash2, FiUpload } from 'react-icons/fi';

function BackgroundPreview({ previewBg, setPreviewBg, customBg, setCustomBg, customBgImage, setCustomBgImage }) {
  const options = [
    ['checker', 'Transparent'],
    ['white', 'White'],
    ['black', 'Black'],
    ['custom', 'Custom'],
    ['image', 'Image'],
  ];

  return (
    <section className="panel-section">
      <h3>Background Preview</h3>
      <div className="segmented">
        {options.map(([value, label]) => (
          <button key={value} className={previewBg === value ? 'active' : ''} onClick={() => setPreviewBg(value)}>
            {label}
          </button>
        ))}
      </div>
      {previewBg === 'custom' && (
        <label>
          Preview Color
          <input type="color" value={customBg} onChange={(event) => setCustomBg(event.target.value)} />
        </label>
      )}
      {previewBg === 'image' && (
        <div className="background-image-picker">
          <label className="bg-upload-btn">
            <FiUpload /> Upload Background
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setCustomBgImage(reader.result);
                  setPreviewBg('image');
                };
                reader.readAsDataURL(file);
                event.target.value = '';
              }}
            />
          </label>
          {customBgImage ? (
            <div className="bg-image-chip">
              <FiImage />
              <span>Custom background ready</span>
              <button type="button" className="icon-btn" onClick={() => setCustomBgImage('')} aria-label="Remove custom background">
                <FiTrash2 />
              </button>
            </div>
          ) : (
            <p className="muted">Upload a JPG, PNG, or WEBP to preview behind the cutout.</p>
          )}
        </div>
      )}
    </section>
  );
}

export default BackgroundPreview;

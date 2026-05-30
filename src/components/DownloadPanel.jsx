import { FiDownload } from 'react-icons/fi';

function DownloadPanel({ exportBg, setExportBg, onDownload }) {
  return (
    <section className="panel-section">
      <h3>Download</h3>
      <label>
        JPG / WEBP Background
        <input type="color" value={exportBg} onChange={(event) => setExportBg(event.target.value)} />
      </label>
      <div className="button-grid">
        <button className="tool-btn" onClick={() => onDownload('png')}>
          <FiDownload /> PNG
        </button>
        <button className="tool-btn" onClick={() => onDownload('jpg')}>
          <FiDownload /> JPG
        </button>
        <button className="tool-btn" onClick={() => onDownload('webp')}>
          <FiDownload /> WEBP
        </button>
      </div>
    </section>
  );
}

export default DownloadPanel;

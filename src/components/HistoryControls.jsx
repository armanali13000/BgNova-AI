import { FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut, FiMinimize2 } from 'react-icons/fi';

function HistoryControls({ onUndo, onRedo, canUndo, canRedo, zoom, onZoomIn, onZoomOut, onFit }) {
  return (
    <section className="panel-section">
      <h3>History & Zoom</h3>
      <div className="button-grid">
        <button className="tool-btn" disabled={!canUndo} onClick={onUndo}>
          <FiRotateCcw /> Undo
        </button>
        <button className="tool-btn" disabled={!canRedo} onClick={onRedo}>
          <FiRotateCw /> Redo
        </button>
        <button className="tool-btn" onClick={onZoomIn}>
          <FiZoomIn /> In
        </button>
        <button className="tool-btn" onClick={onZoomOut}>
          <FiZoomOut /> Out
        </button>
      </div>
      <button className="tool-btn full-row" onClick={onFit}>
        <FiMinimize2 /> Fit to Screen
      </button>
      <p className="muted">Zoom {Math.round(zoom * 100)}%</p>
    </section>
  );
}

export default HistoryControls;

import {
  FiAperture,
  FiDroplet,
  FiEdit3,
  FiMaximize2,
  FiMousePointer,
  FiRefreshCcw,
  FiScissors,
  FiSun,
  FiZap,
} from 'react-icons/fi';

const tools = [
  ['ai', 'AI Auto', FiZap],
  ['autoColor', 'Auto Color', FiDroplet],
  ['magic', 'Magic Eraser', FiAperture],
  ['erase', 'Manual Eraser', FiScissors],
  ['repair', 'Repair', FiEdit3],
  ['pan', 'Pan', FiMousePointer],
];

function Toolbar({ activeTool, onToolChange, onAiAuto, onReset, onRecrop, onFullscreen }) {
  return (
    <aside className="toolbar glass">
      {tools.map(([id, label, Icon]) => (
        <button
          key={id}
          className={`tool-btn ${activeTool === id ? 'active' : ''}`}
          onClick={() => (id === 'ai' ? onAiAuto() : onToolChange(id))}
          title={label}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
      <span className="tool-separator" />
      <button className="tool-btn" onClick={onRecrop} title="Crop">
        <FiSun />
        <span>Crop</span>
      </button>
      <button className="tool-btn" onClick={onReset} title="Reset">
        <FiRefreshCcw />
        <span>Reset</span>
      </button>
      <button className="tool-btn" onClick={onFullscreen} title="Fullscreen">
        <FiMaximize2 />
        <span>Full</span>
      </button>
    </aside>
  );
}

export default Toolbar;

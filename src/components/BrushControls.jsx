function BrushControls({ brushSize, setBrushSize, tolerance, setTolerance, bgColor, setBgColor, onAutoColor }) {
  return (
    <section className="panel-section">
      <h3>Controls</h3>
      <label>
        Brush Size <strong>{brushSize}px</strong>
        <input type="range" min="6" max="140" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} />
      </label>
      <label>
        Tolerance <strong>{tolerance}</strong>
        <input type="range" min="8" max="180" value={tolerance} onChange={(event) => setTolerance(Number(event.target.value))} />
      </label>
      <label>
        Auto Color
        <input type="color" value={bgColor} onChange={(event) => setBgColor(event.target.value)} />
      </label>
      <button className="btn btn-wide" onClick={onAutoColor}>
        Remove Similar Color
      </button>
    </section>
  );
}

export default BrushControls;

function BeforeAfterPreview({ showBefore, setShowBefore }) {
  return (
    <section className="panel-section">
      <h3>Before / After</h3>
      <div className="segmented">
        <button className={showBefore ? 'active' : ''} onClick={() => setShowBefore(true)}>
          Before
        </button>
        <button className={!showBefore ? 'active' : ''} onClick={() => setShowBefore(false)}>
          After
        </button>
      </div>
    </section>
  );
}

export default BeforeAfterPreview;

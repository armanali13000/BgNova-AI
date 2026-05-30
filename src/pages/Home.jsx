import { FiCpu, FiDownload, FiLayers, FiMousePointer, FiShield, FiZap } from 'react-icons/fi';
import Hero from '../components/Hero.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import beforeAfterPersonImage from '../assets/before-after-person-demo.svg';

function Home() {
  const features = [
    [<FiZap />, 'AI Auto Remove', 'API-ready background removal flow for remove.bg, Clipdrop, or your own model.'],
    [<FiMousePointer />, 'Precision Erasing', 'Manual brush, magic eraser, repair, brush size, and tolerance controls.'],
    [<FiLayers />, 'Live Previews', 'Transparent checkerboard, white, black, and custom background previews.'],
    [<FiDownload />, 'Clean Exports', 'Download transparent PNG plus JPG and WEBP with selected background color.'],
    [<FiCpu />, 'Browser Canvas', 'Fast crop-first editing with undo, redo, zoom, and fullscreen workspace.'],
    [<FiShield />, 'Private MVP', 'Images are edited in the browser until an AI API is connected.'],
  ];

  const faqs = [
    ['Does AI Auto Remove work now?', 'The UI and function are ready. Connect the placeholder to remove.bg, Clipdrop, or a custom model.'],
    ['Can I restore erased parts?', 'Yes. The Repair tool paints pixels back from the cropped original image.'],
    ['What formats can I export?', 'PNG, JPG, and WEBP are supported from the editor download panel.'],
  ];

  return (
    <>
      <Hero />
      <section className="section">
        <div className="section-head">
          <p className="eyebrow">Editor-grade controls</p>
          <h2>Everything needed for fast background cleanup</h2>
        </div>
        <div className="feature-grid">
          {features.map(([icon, title, text]) => (
            <FeatureCard key={title} icon={icon} title={title} text={text} />
          ))}
        </div>
      </section>
      <section className="section split-section">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>Upload, crop, erase, export</h2>
          <div className="steps">
            <span>1. Upload or paste a JPG, PNG, or WEBP image.</span>
            <span>2. Crop the subject before opening the editor.</span>
            <span>3. Use AI Auto, color removal, magic erase, manual erase, and repair.</span>
            <span>4. Preview the background and download the finished file.</span>
          </div>
        </div>
        <div className="before-after glass">
          <div className="before-panel">
            <img src={beforeAfterPersonImage} alt="Original portrait before background removal" />
            <span>Before</span>
          </div>
          <div className="after-panel checker">
            <img src={beforeAfterPersonImage} alt="Portrait after AI background removal" />
            <span>After</span>
          </div>
          <span className="compare-line" />
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>Built for a practical MVP</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question} className="glass">
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;

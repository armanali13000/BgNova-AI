import { useEffect, useState } from 'react';
import { FiCpu, FiDownload, FiLayers, FiMousePointer, FiShield, FiZap } from 'react-icons/fi';
import Hero from '../components/Hero.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import beforeAfterPersonImage from '../assets/before-after-person-demo.svg';
import productSampleImage from '../assets/quality-product-source.png';
import peopleSampleImage from '../assets/quality-people-source.png';
import petSampleImage from '../assets/quality-pets-source.png';
import carSampleImage from '../assets/quality-cars-source.png';
import graphicsSampleImage from '../assets/quality-graphics-source.png';

function removeGreenBackground(imageSrc) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        const greenDistance = Math.abs(red) + Math.abs(green - 255) + Math.abs(blue);
        const greenDominant = green > 150 && green > red * 1.35 && green > blue * 1.35;

        if (greenDistance < 150 || greenDominant) {
          data[index + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => resolve(imageSrc);
    image.src = imageSrc;
  });
}

function QualityComparison({ sample }) {
  const [slider, setSlider] = useState(50);
  const [cutoutSrc, setCutoutSrc] = useState(sample.image);

  useEffect(() => {
    let alive = true;
    removeGreenBackground(sample.image).then((dataUrl) => {
      if (alive) setCutoutSrc(dataUrl);
    });
    setSlider(50);
    return () => {
      alive = false;
    };
  }, [sample.image]);

  const updateSlider = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = ((event.clientX - rect.left) / rect.width) * 100;
    setSlider(Math.min(92, Math.max(8, next)));
  };

  const startDrag = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateSlider(event);
  };

  return (
    <div
      className="quality-showcase glass"
      style={{ '--slider': `${slider}%`, '--before-bg': sample.beforeBg }}
      onPointerDown={startDrag}
      onPointerMove={(event) => {
        if (event.buttons === 1) updateSlider(event);
      }}
    >
      <div className="quality-layer quality-original">
        <img src={cutoutSrc} alt={`${sample.label} original sample`} draggable="false" />
      </div>
      <div className="quality-layer quality-removed checker">
        <img src={cutoutSrc} alt={`${sample.label} background removed sample`} draggable="false" />
      </div>
      <div className="quality-divider" aria-hidden="true">
        <span>&lt;&gt;</span>
      </div>
    </div>
  );
}

function Home() {
  const qualitySamples = [
    {
      key: 'products',
      label: 'Products',
      title: 'Catalog items stay sharp and sell-ready',
      image: productSampleImage,
      beforeBg: 'linear-gradient(135deg, #c4a7b7, #ead8f2)',
    },
    {
      key: 'people',
      label: 'People',
      title: 'Portrait edges stay clean around hair and clothing',
      image: peopleSampleImage,
      beforeBg: 'linear-gradient(135deg, #bae6fd, #ddd6fe)',
    },
    {
      key: 'pets',
      label: 'Pets',
      title: 'Soft edges remain natural for furry subjects',
      image: petSampleImage,
      beforeBg: 'linear-gradient(135deg, #fde68a, #fed7aa)',
    },
    {
      key: 'cars',
      label: 'Cars',
      title: 'Vehicles keep reflections and strong outlines',
      image: carSampleImage,
      beforeBg: 'linear-gradient(135deg, #bfdbfe, #c7d2fe)',
    },
    {
      key: 'graphics',
      label: 'Graphics',
      title: 'Artwork and icons export with crisp transparency',
      image: graphicsSampleImage,
      beforeBg: 'linear-gradient(135deg, #ccfbf1, #e9d5ff)',
    },
  ];
  const [activeSample, setActiveSample] = useState(qualitySamples[0].key);
  const currentSample = qualitySamples.find((sample) => sample.key === activeSample) || qualitySamples[0];

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
      <section className="section quality-section">
        <div className="quality-head">
          <p className="eyebrow">Clear cutout results</p>
          <h2>Polished detail across every kind of image</h2>
        </div>
        <div className="quality-tabs" role="tablist" aria-label="Background removal sample categories">
          {qualitySamples.map((sample) => (
            <button
              key={sample.key}
              type="button"
              role="tab"
              aria-selected={currentSample.key === sample.key}
              className={currentSample.key === sample.key ? 'active' : ''}
              onClick={() => setActiveSample(sample.key)}
            >
              {sample.label}
            </button>
          ))}
        </div>
        <QualityComparison sample={currentSample} />
        <div className="quality-caption">
          <p>{currentSample.title}</p>
          <a href="#/editor">Try your image</a>
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

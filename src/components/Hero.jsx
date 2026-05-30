import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UploadBox from './UploadBox.jsx';
import personDemoImage from '../assets/ai-auto-person-demo.svg';

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          Premium AI image editing suite
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          Remove Backgrounds in Seconds with AI
        </motion.h1>
        <motion.p className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          Upload, crop, erase, restore, preview, and export polished transparent images from one fast browser editor.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <UploadBox onImageReady={(dataUrl) => navigate('/editor', { state: { imageSrc: dataUrl } })} compact />
        </motion.div>
      </div>
      <motion.div className="hero-preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="preview-stage checker">
          <img className="hero-demo-image" src={personDemoImage} alt="AI removed background preview with a person" />
          <div className="preview-badge">AI Auto Ready</div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;

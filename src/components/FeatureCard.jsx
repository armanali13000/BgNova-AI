import { motion } from 'framer-motion';

function FeatureCard({ icon, title, text }) {
  return (
    <motion.article
      className="feature-card glass"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <span className="feature-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.article>
  );
}

export default FeatureCard;

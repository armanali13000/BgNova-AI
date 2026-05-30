import { FiMail, FiMessageSquare, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

function Contact() {
  return (
    <section className="content-page">
      <p className="eyebrow">Contact</p>
      <h1>Let’s build sharper image workflows</h1>
      <div className="contact-grid">
        <article className="glass info-card">
          <FiMail />
          <h3>Email</h3>
          <p>hello@bgnova.ai</p>
        </article>
        <article className="glass info-card">
          <FiMessageSquare />
          <h3>Support</h3>
          <p>Product, billing, and editor feedback.</p>
        </article>
      </div>
      <form
        className="contact-form glass"
        onSubmit={(event) => {
          event.preventDefault();
          toast.success('Message captured in the demo form.');
        }}
      >
        <input placeholder="Name" />
        <input placeholder="Email" type="email" />
        <textarea placeholder="Message" rows="5" />
        <button className="btn">
          <FiSend /> Send Message
        </button>
      </form>
    </section>
  );
}

export default Contact;

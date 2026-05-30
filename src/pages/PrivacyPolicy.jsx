function PrivacyPolicy() {
  return (
    <section className="content-page legal-page">
      <p className="eyebrow">Privacy Policy</p>
      <h1>Privacy Policy</h1>
      <p>
        BgNova AI processes uploaded images locally in the browser for this MVP editor. Images are not sent to an AI
        provider unless an external background-removal API is connected in the future.
      </p>
      <h2>Data We Handle</h2>
      <p>Uploaded files, cropped previews, canvas edits, and exports are used only to provide editing functionality.</p>
      <h2>Future AI Integrations</h2>
      <p>
        If AI Auto Remove is connected to a third-party API, the app should display provider-specific privacy details
        before sending images for processing.
      </p>
      <h2>Contact</h2>
      <p>Questions can be sent to hello@bgnova.ai.</p>
    </section>
  );
}

export default PrivacyPolicy;

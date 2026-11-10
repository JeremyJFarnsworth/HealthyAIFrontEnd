import { LinkButton, Wordmark } from "@/components/ui";

export default function Landing() {
  return (
    <div className="landing">
      <header className="site-header">
        <div className="landing-bar">
          <div style={{ flex: 1 }}><Wordmark size={17} /></div>
          <LinkButton href="/login" variant="outlined">Log in</LinkButton>
          <LinkButton href="/signup" variant="primary">Create account</LinkButton>
        </div>
      </header>

      <main className="landing-main">
        <div className="hero">
          <div className="eyebrow">Diagnostic assistant for healthcare professionals</div>
          <h1>Faster, ranked diagnoses from the case in front of you.</h1>
          <p className="lede">
            Describe a patient case. Healthy returns candidate diagnoses with calibrated likelihood
            scores, recommended treatment plans, and confirmatory tests.
          </p>
          <div className="cta-row">
            <LinkButton href="/signup" variant="primary" size="lg">Create account</LinkButton>
            <LinkButton href="/login" variant="muted" size="lg">Log in</LinkButton>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <div>Healthy is clinical decision support. Results do not replace professional judgment.</div>
      </footer>
    </div>
  );
}

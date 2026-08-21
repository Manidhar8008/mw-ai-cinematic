import { FormEvent, useState } from 'react'
import { Analytics } from './Analytics'

const productSignals = [
  ['01', 'Lead capture', 'Bring phone, walk-in, website and WhatsApp leads into one operating surface.'],
  ['02', 'Follow-up intelligence', 'Turn forgotten follow-ups into visible next actions for the whole team.'],
  ['03', 'Automation layer', 'Add triggers, summaries and AI workflows after the core operating rhythm is stable.'],
]

const principles = [
  'One source of truth for the operation.',
  'WhatsApp-native workflows for Tier-2 markets.',
  'Modular enough to evolve without premature microservices.',
  'Local-first AI compatibility with Ollama and provider-neutral adapters.',
]

type Consent = 'unset' | 'accepted' | 'rejected'

export function LandingPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [consent, setConsent] = useState<Consent>(() => {
    if (typeof window === 'undefined') return 'unset'
    return (window.localStorage.getItem('mw-cookie-consent') as Consent) || 'unset'
  })

  const chooseConsent = (value: Exclude<Consent, 'unset'>) => {
    window.localStorage.setItem('mw-cookie-consent', value)
    setConsent(value)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setStatus('error')
      return
    }

    setStatus('loading')
    await new Promise((resolve) => window.setTimeout(resolve, 550))
    setStatus('success')
    setEmail('')
  }

  return (
    <main id="main-content" className="landing-shell">
      <Analytics enabled={consent === 'accepted'} />

      <header className="site-nav" aria-label="Primary navigation">
        <a href="#top" className="brand-mark" aria-label="MW.AI home">
          MW<span>.AI</span>
        </a>
        <nav>
          <a href="#system">System</a>
          <a href="#why">Why MW.AI</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-cta" href="#contact">Request a demo</a>
      </header>

      <section id="top" className="hero-section section-grid">
        <div className="hero-copy">
          <p className="eyebrow">INTELLIGENCE INFRASTRUCTURE · WARANGAL / INDIA</p>
          <h1>Build the operating system behind your business.</h1>
          <p className="hero-lede">
            MW.AI helps growing businesses capture leads, run follow-ups and automate repetitive operations from one practical system.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">See MW.AI in action <span>↗</span></a>
            <a className="button button-ghost" href="#system">Explore the system</a>
          </div>
          <div className="trust-row">
            <span>CRM</span><i /> <span>Automation</span><i /> <span>AI-ready</span><i /> <span>Tier-2 first</span>
          </div>
        </div>
        <div className="hero-terminal" aria-label="MW.AI system preview">
          <div className="terminal-bar"><span /><span /><span /><b>mw.ai / control</b></div>
          <div className="terminal-body">
            <div className="terminal-kicker">LIVE OPERATING VIEW</div>
            <div className="terminal-title">Your business,<br />remembered.</div>
            <div className="metric-grid">
              <div><small>OPEN LEADS</small><strong>128</strong><em>+18% this week</em></div>
              <div><small>FOLLOW-UPS</small><strong>42</strong><em>7 need attention</em></div>
              <div><small>AUTOMATIONS</small><strong>16</strong><em>running</em></div>
              <div><small>DATA SOURCES</small><strong>09</strong><em>connected</em></div>
            </div>
            <div className="signal-line"><span /> Signal integrity: nominal</div>
          </div>
        </div>
      </section>

      <section className="marquee-strip" aria-label="MW.AI capabilities">
        <span>LEADS → FOLLOW-UPS → WHATSAPP → AUTOMATION → AI → OPERATIONS →</span>
      </section>

      <section id="system" className="content-section section-grid">
        <div className="section-heading">
          <p className="eyebrow">THE SYSTEM</p>
          <h2>Start with the work. Add intelligence where it matters.</h2>
          <p>MW.AI is deliberately practical: first make the operation visible, then make it faster.</p>
        </div>
        <div className="signal-list">
          {productSignals.map(([number, title, copy]) => (
            <article className="signal-card" key={number}>
              <div className="signal-number">{number}</div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="signal-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="why" className="dark-panel">
        <div className="section-grid content-section compact">
          <div className="section-heading">
            <p className="eyebrow">WHY MW.AI</p>
            <h2>Less dashboard theatre. More operational memory.</h2>
          </div>
          <ul className="principles-list">
            {principles.map((principle) => <li key={principle}><span>+</span>{principle}</li>)}
          </ul>
        </div>
      </section>

      <section className="content-section architecture-section">
        <div className="architecture-copy">
          <p className="eyebrow">ARCHITECTURE</p>
          <h2>Simple enough to ship. Serious enough to scale.</h2>
          <p>
            React + TypeScript on the surface. FastAPI + PostgreSQL underneath. Automation and AI stay behind stable interfaces so the product can grow without turning the MVP into infrastructure theatre.
          </p>
        </div>
        <div className="architecture-diagram" aria-label="MW.AI architecture">
          <div><small>INPUTS</small><strong>Phone · Forms · WhatsApp · Referrals</strong></div>
          <div><small>CORE</small><strong>Leads · Tasks · Follow-ups · Timeline</strong></div>
          <div><small>INTELLIGENCE</small><strong>Automation · Summaries · AI adapters</strong></div>
          <div><small>OUTCOME</small><strong>Faster decisions · Fewer forgotten actions</strong></div>
        </div>
      </section>

      <section className="proof-section">
        <div className="content-section proof-grid">
          <div>
            <p className="eyebrow">BUILT FOR THE NEXT MARKET</p>
            <h2>Tier-2 businesses deserve Tier-1 systems.</h2>
          </div>
          <div className="quote-card">
            <p>“The product should understand how the business actually runs — not force the business to learn another enterprise workflow.”</p>
            <small>MW.AI product principle</small>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-inner">
          <p className="eyebrow">EARLY ACCESS</p>
          <h2>Bring us the bottleneck.</h2>
          <p>Tell us where leads, follow-ups or repetitive work are leaking time. We will map the first system around that bottleneck.</p>
          <form className="contact-form" onSubmit={submit} noValidate>
            <label htmlFor="email">Work email</label>
            <div className="form-row">
              <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setStatus('idle') }} placeholder="you@company.com" aria-invalid={status === 'error'} />
              <button className="button button-primary" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Validating…' : 'Request access'}
              </button>
            </div>
            <div className="form-status" role="status" aria-live="polite">
              {status === 'error' && 'Enter a valid email address.'}
              {status === 'success' && 'Demo form is wired for validation. Connect the production inbox/webhook before accepting live requests.'}
            </div>
          </form>
          <div className="contact-links">
            <a href="https://www.linkedin.com/in/manidhar-pati-1723811b0/" target="_blank" rel="noreferrer">Founder / LinkedIn ↗</a>
            <span>Warangal, Telangana, India</span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div><strong>MW<span>.AI</span></strong><small>Intelligence infrastructure for practical businesses.</small></div>
        <div className="footer-links"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/sitemap.xml">Sitemap</a></div>
        <small>© 2026 MW.AI</small>
      </footer>

      {consent === 'unset' && (
        <div className="cookie-banner" role="dialog" aria-label="Analytics cookie preferences">
          <div><strong>Privacy controls</strong><p>MW.AI can use optional analytics to understand site usage. Essential functionality works without it.</p></div>
          <div className="cookie-actions"><button type="button" onClick={() => chooseConsent('rejected')}>Reject</button><button type="button" onClick={() => chooseConsent('accepted')}>Allow analytics</button></div>
        </div>
      )}

      <a className="sticky-mobile-cta" href="#contact">Request a demo ↗</a>
    </main>
  )
}

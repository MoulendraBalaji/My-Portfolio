import { m } from 'motion/react';
import { Copy, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

import SectionHeading from './SectionHeading.jsx';
import { ContactSlats } from '../SlatsBackdrop/SlatsBackdrop.jsx';
import Magnetic from '../ui/Magnetic.jsx';
import Reveal from '../ui/Reveal.jsx';
import { GitHubIcon, LinkedInIcon } from '../ui/SocialIcons.jsx';
import { fadeUp } from '../../lib/motion';
import { contact, sectionMeta } from '../../data/portfolio.js';
import './Contact.css';

const ICONS = { GitHub: GitHubIcon, LinkedIn: LinkedInIcon, Email: Mail };

/** Builds a prefilled mailto so the form works with no backend at all. */
function mailtoLink(values) {
  const subject = encodeURIComponent(
    `Collaboration Inquiry from ${values.name || 'a visitor'}`
  );
  const body = encodeURIComponent(
    `Hello Moulendra,\n\n${values.message || ''}\n\nBest regards,\n${values.name || ''}\nEmail: ${values.email || ''}`
  );
  return `mailto:${contact.email}?subject=${subject}&body=${body}`;
}

/** Opens the visitor's mail client with the message pre-filled. */
function handleSubmit(event, form) {
  // `mailto:` as a form action is blocked by browsers, so build the link here.
  event.preventDefault();
  window.location.href = mailtoLink(form);
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [copied, setCopied] = useState(false);

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-heading">
      {/* Instance 2 of 2 — calmer 'tide' preset. */}
      <ContactSlats />

      <div className="shell contact__inner">
        <SectionHeading
          id="contact-heading"
          index={sectionMeta.contact.index}
          label={sectionMeta.contact.label}
          title={contact.headline}
        />

        <div className="contact__grid">
          <Reveal className="contact__details" stagger>
            <m.a className="contact__email" href={`mailto:${contact.email}`} variants={fadeUp}>
              {contact.email}
            </m.a>

            <m.p className="contact__sub" variants={fadeUp}>
              {contact.sub}
            </m.p>

            <m.ul className="contact__facts" variants={fadeUp}>
              <li>
                <MapPin size={15} strokeWidth={1.75} aria-hidden="true" />
                {contact.location}
              </li>
              <li>
                <Phone size={15} strokeWidth={1.75} aria-hidden="true" />
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </li>
            </m.ul>

            <m.ul className="contact__socials" variants={fadeUp}>
              {contact.socials.map((social) => {
                const Icon = ICONS[social.label];
                const external = social.href.startsWith('http');
                return (
                  <li key={social.label}>
                    <a
                      className="btn btn--ghost btn--sm"
                      href={social.href}
                      {...(external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {Icon ? <Icon size={15} strokeWidth={1.75} aria-hidden="true" /> : null}
                      {social.label}
                    </a>
                  </li>
                );
              })}
              <li>
                <button type="button" className="btn btn--ghost btn--sm" onClick={copyEmail}>
                  <Copy size={15} strokeWidth={1.75} aria-hidden="true" />
                  {copied ? 'Copied' : 'Copy email'}
                </button>
              </li>
            </m.ul>
          </Reveal>

          <Reveal className="contact__form-wrap" stagger>
            <m.form
              className="contact__form"
              onSubmit={(event) => handleSubmit(event, form)}
              variants={fadeUp}
            >
              <h3 className="contact__form-title">Send a message</h3>

              <div className="contact__field">
                <label htmlFor="contact-name">Your name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={update('name')}
                  required
                />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-email">Your email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={update('email')}
                  required
                />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Describe your project, question, or proposal..."
                  value={form.message}
                  onChange={update('message')}
                  required
                />
              </div>

              <Magnetic>
                <button type="submit" className="btn btn--primary">
                  Send via email client
                </button>
              </Magnetic>
            </m.form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
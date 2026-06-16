import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [copied, setCopied] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    
    const subject = encodeURIComponent(`Collaboration Inquiry from ${formData.name}`)
    const body = encodeURIComponent(
      `Hello Moulendra,\n\n${formData.message}\n\nBest regards,\n${formData.name}\nEmail: ${formData.email}`
    )
    window.location.href = `mailto:moulendrabalaji2007@gmail.com?subject=${subject}&body=${body}`
  }

  const copyEmail = () => {
    navigator.clipboard.writeText('moulendrabalaji2007@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    // 1. Active section tracker observer
    const navObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    const sections = document.querySelectorAll('section[id]')
    for (const section of sections) navObserver.observe(section)

    // 2. Scroll-Driven Reveal observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -100px 0px', threshold: 0.05 }
    )

    const revealElements = document.querySelectorAll('.reveal-on-scroll')
    revealElements.forEach(el => revealObserver.observe(el))

    // 3. Magnetic UI Micro-interactions
    const magneticElements = document.querySelectorAll('.btn, .project-card, .contact-card-premium')
    
    const handleMouseMove = (e) => {
      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      const isCard = el.classList.contains('project-card') || el.classList.contains('contact-card-premium')
      const pullFactor = isCard ? 0.05 : 0.22 // Cards are heavy, buttons drag aggressively
      
      el.style.transform = `translate(${x * pullFactor}px, ${y * pullFactor}px)`
      el.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
    }

    const handleMouseLeave = (e) => {
      const el = e.currentTarget
      el.style.transform = 'translate(0px, 0px)'
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    }

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', handleMouseMove)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      for (const section of sections) navObserver.unobserve(section)
      revealElements.forEach(el => revealObserver.unobserve(el))
      magneticElements.forEach(el => {
        el.removeEventListener('mousemove', handleMouseMove)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const projects = [
    {
      id: 'crdt',
      title: 'Conflict-Free Collaborative OLTP',
      role: 'CRDT Engine Developer — Pixel Pirates',
      description: 'A masterless, local-first, peer-to-peer relational database engine powered by Conflict-Free Replicated Data Types (CRDTs). Supports offline-first operation, seamless multi-peer synchronization, and guaranteed 100% bit-identical state convergence across arbitrary network partitions.',
      impacts: [
        'Architected cell-level LWW-Registers and OR-Sets with Lamport clocks — Preserved concurrent non-overlapping column updates without data loss',
        'Implemented a deterministic uniqueness protocol with post-merge resolution — Enforced UNIQUE constraints across distributed peers without central coordination',
        'Designed configurable foreign-key policies (cascade, tombstone, orphan) — Maintained referential integrity under network partitions',
        'Built continuous OpLog garbage collection with compaction — Bounded metadata growth per row to distinct peer count',
      ],
      tech: ['Python', 'CRDT', 'LWW-Register', 'OR-Set', 'Lamport Clocks', 'Pytest', 'Docker'],
      links: { github: 'https://github.com/SiddharthaMadireddy/Conflict-Free_Collaborative_OLTP' },
      badge: 'Anvil L3 Benchmark — 90%'
    },
    {
      id: 'scrybe',
      title: 'Scrybe.io — Text & Video Analyzer',
      role: 'AI Developer — The Synapse Squad',
      description: 'An AI-driven evaluation platform that assesses video and audio responses against reference answers. Extracts media, performs high-fidelity transcription via Whisper, generates frame-by-frame visual insights via Gemini Vision, and verifies semantic similarity using all-mpnet-base-v2.',
      impacts: [
        'Engineered a multi-stage ML pipeline (FFmpeg → Whisper → Gemini Vision → Sentence-Transformers) — Reduced evaluation latency while maintaining 95%+ transcription accuracy',
        'Implemented hybrid similarity scoring combining abstract semantic similarity with exact keyword overlap — Achieved higher score predictability than cosine-only approaches',
        'Built FastAPI backend with async job processing — Supported concurrent evaluation requests with real-time progress streaming',
        'Designed React + Vite frontend with glassmorphism UI and PDF report export — Delivered polished user experience for interview practice, presentations, and spoken assignments',
      ],
      tech: ['Python', 'FastAPI', 'React 19', 'Vite', 'OpenAI Whisper', 'Gemini Vision', 'Sentence-Transformers', 'all-mpnet-base-v2', 'FFmpeg', 'PyTorch', 'Docker'],
      links: {
        github: 'https://github.com/MoulendraBalaji/Scrybe.io-Text-And-Video-Analyzer',
        demo: 'https://moulendrabalaji.github.io/Scrybe.io-Text-And-Video-Analyzer/'
      }
    },
    {
      id: 'triage',
      title: 'Support Triage Environment',
      role: 'AI Environment Developer',
      description: 'A realistic simulation environment for training AI agents in customer support triage logic. Agents operate in a single-action command space — reading emails, querying customer metadata, searching knowledge bases — to decide whether to reply or escalate. Features tiered difficulty (Easy → Hard) with validated baseline scores.',
      impacts: [
        'Designed a structured action-observation space (read_email, lookup_customer, search_kb, reply, escalate) — Enabled systematic RL/LLM agent training on real-world support flows',
        'Implemented three difficulty tiers with escalating reasoning requirements — Validated progressive skill acquisition (Easy: 1.0, Medium: 0.9, Hard: 0.8 baseline scores)',
        'Built Docker containerized environment with REST API — Enabled headless evaluation and CI/CD integration for agent pipelines',
        'Authored comprehensive inference script with GPT-4o baseline — Provided reproducible benchmark for agent comparison',
      ],
      tech: ['Python', 'OpenAI', 'Docker', 'REST API', 'FastAPI', 'UV', 'Hugging Face'],
      links: { github: 'https://github.com/MoulendraBalaji/support_triage' }
    }
  ]

  const techCategories = [
    { label: 'AI & ML', items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Hugging Face', 'LangChain', 'OpenAI', 'Gemini', 'Whisper', 'Sentence-Transformers'] },
    { label: 'Backend', items: ['FastAPI', 'Python', 'Node.js', 'REST APIs', 'PostgreSQL'] },
    { label: 'Frontend', items: ['React', 'Vite', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Tailwind'] },
    { label: 'Data & DevOps', items: ['Docker', 'Git', 'Power BI', 'DAX', 'MySQL', 'CI/CD'] },
    { label: 'Core CS', items: ['CRDT', 'Distributed Systems', 'Data Structures', 'Algorithms', 'OOP'] },
  ]

  const certifications = [
    { name: 'HCL Volt MX Application Development', issuer: 'HCL Technologies' },
    { name: 'IBM Data Visualization', issuer: 'IBM / Cognitive Class' },
    { name: 'HTML & CSS Essentials', issuer: 'Cisco Networking Academy' },
    { name: 'Google Cloud Expertise', issuer: 'Google Cloud' },
  ]

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <span className="nav-logo" onClick={() => scrollTo('hero')}>MoulendraBalaji's Portfolio</span>
        <div className="nav-links">
          {navLinks.map(l => (
            <button
              key={l.id}
              className={`nav-link ${activeSection === l.id ? 'active' : ''}`}
              onClick={() => scrollTo(l.id)}
            >{l.label}</button>
          ))}
        </div>
      </nav>

      <section id="hero" className="hero-section">
        <div className="hero-content">
          <p className="hero-tagline">Bridging Intelligent Algorithms with Scalable Interfaces</p>
          <h1 className="hero-title">
            Moulendra <span className="gradient-text">Balaji</span>
          </h1>
          <p className="hero-subtitle">AI Engineer &middot; ML & Deep Learning Specialist</p>
          <p className="hero-summary">
            AI Engineer with expertise in designing and deploying intelligent systems using machine learning,
            deep learning, and generative AI technologies. Experienced in building end-to-end AI solutions —
            from data processing and model development to scalable deployment and optimization. Strong foundation
            in AI research, data science, and software engineering, enabling robust, production-ready systems
            that solve complex real-world problems. Passionate about advancing AI capabilities and transforming
            cutting-edge research into impactful applications.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => scrollTo('projects')}>Explore My Work</button>
            <button className="btn btn-secondary" onClick={() => scrollTo('contact')}>Get In Touch</button>
          </div>
          <div className="hero-social">
            <a href="https://github.com/MoulendraBalaji" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/moulendra-balaji-01979b325" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="mailto:moulendrabalaji2007@gmail.com" aria-label="Email">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Infinite Tech Marquee Section */}
      <div className="marquee-wrapper">
        <div className="marquee-fade-left"></div>
        <div className="marquee-fade-right"></div>
        <div className="marquee-track">
          <div className="marquee-group">
            <span className="marquee-text-tag">React</span>
            <span className="marquee-text-tag">Python</span>
            <span className="marquee-text-tag">PyTorch</span>
            <span className="marquee-text-tag">FastAPI</span>
            <span className="marquee-text-tag">Docker</span>
            <span className="marquee-text-tag">Gemini AI</span>
            <span className="marquee-text-tag">Whisper</span>
            <span className="marquee-text-tag">LangChain</span>
            <span className="marquee-text-tag">TensorFlow</span>
            <span className="marquee-text-tag">Hugging Face</span>
            <span className="marquee-text-tag">PostgreSQL</span>
            <span className="marquee-text-tag">Git</span>
          </div>
          <div className="marquee-group" aria-hidden="true">
            <span className="marquee-text-tag">React</span>
            <span className="marquee-text-tag">Python</span>
            <span className="marquee-text-tag">PyTorch</span>
            <span className="marquee-text-tag">FastAPI</span>
            <span className="marquee-text-tag">Docker</span>
            <span className="marquee-text-tag">Gemini AI</span>
            <span className="marquee-text-tag">Whisper</span>
            <span className="marquee-text-tag">LangChain</span>
            <span className="marquee-text-tag">TensorFlow</span>
            <span className="marquee-text-tag">Hugging Face</span>
            <span className="marquee-text-tag">PostgreSQL</span>
            <span className="marquee-text-tag">Git</span>
          </div>
        </div>
      </div>

      <section id="about" className="about-section reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>Engineering student at <strong>CRRAO AIMSCS, Hyderabad</strong>, specializing in Artificial Intelligence, Machine Learning, and Web Development. At 19, my focus is bridging the gap between intelligent algorithmic systems and clean, scalable user interfaces.</p>
              <div className="about-drives">
                <h3>What Drives Me</h3>
                <ul>
                  <li>Transforming complex data challenges into intuitive user experiences</li>
                  <li>High-stakes environments — hackathons, national challenges, competitive benchmarks</li>
                  <li>End-to-end ownership: from research paper to production deployment</li>
                </ul>
              </div>
              <div className="about-diff">
                <h3>Key Differentiators</h3>
                <ul>
                  <li>Practical experience across cross-platform apps, data-driven logistics dashboards, and deployed ML models</li>
                  <li>Currently at <strong>flyrank.ai</strong> as ML Intern</li>
                  <li>Published CRDT database engine scoring 90% on Anvil L3 Benchmark</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="projects-section reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">Projects</h2>
          <div className="projects-grid">
            {projects.map(p => (
              <div key={p.id} className="project-card">
                <div className="project-header">
                  <h3 className="project-title">{p.title}</h3>
                  <span className="project-role">{p.role}</span>
                </div>
                <p className="project-desc">{p.description}</p>
                <div className="project-impacts">
                  <h4>Impact</h4>
                  <ul>
                    {p.impacts.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
                <div className="project-tech">
                  {p.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
                </div>
                <div className="project-links">
                  <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-sm">GitHub</a>
                  {p.links.demo && <a href={p.links.demo} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">Live Demo</a>}
                  {p.badge && <span className="project-badge">{p.badge}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="experience-section reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>Machine Learning Intern</h3>
                  <span className="timeline-company">flyrank.ai</span>
                  <span className="timeline-date">June 2026 – Present</span>
                  <span className="timeline-location">Hyderabad, India</span>
                </div>
                <ul className="timeline-details">
                  <li>Developing ML pipelines for ranking and recommendation systems using Python and PyTorch</li>
                  <li>Building data processing workflows for large-scale feature engineering and model training</li>
                  <li>Deploying models to production with monitoring and performance optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="achievements" className="achievements-section reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">Achievements &amp; Certifications</h2>
          <div className="ach-grid">
            <div className="ach-col">
              <h3>Hackathons &amp; Competitions</h3>
              <ul className="ach-list">
                <li><strong>IIT Hyderabad</strong> — Sustainable Development / Cybersecurity Challenges</li>
                <li><strong>Anvil Hackathon (Scalar)</strong> — Built Conflict-Free Collaborative OLTP (90% L3 Benchmark)</li>
                <li><strong>SIH (Smart India Hackathon)</strong> — Participant</li>
              </ul>
            </div>
            <div className="ach-col">
              <h3>Certifications</h3>
              <div className="cert-list">
                {certifications.map(c => (
                  <div key={c.name} className="cert-item">
                    <span className="cert-name">{c.name}</span>
                    <span className="cert-issuer">{c.issuer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="skills-section reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">Tech Stack</h2>
          <div className="skills-grid">
            {techCategories.map(cat => (
              <div key={cat.label} className="skill-category">
                <h3>{cat.label}</h3>
                <div className="skill-items">
                  {cat.items.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="education" className="education-section reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">Education</h2>
          <div className="edu-card">
            <h3>B.Tech in Computer Science (AI &amp; ML Specialization)</h3>
            <p>CRRAO AIMSCS, Hyderabad | 2023 – 2027</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section reveal-on-scroll">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          
          <div className="contact-grid">
            {/* Left Column: Premium Action Cards */}
            <div className="contact-info-cards">
              {/* Email Card */}
              <div className="contact-card-premium">
                <div className="contact-card-header">
                  <div className="contact-card-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <h3>Email Address</h3>
                </div>
                <div className="contact-card-body">
                  <p className="contact-card-text">Drop a line for collaboration or inquiries</p>
                  <p className="contact-card-value">moulendrabalaji2007@gmail.com</p>
                </div>
                <div className="contact-card-actions">
                  <button className="btn btn-sm btn-primary" onClick={copyEmail}>
                    {copied ? 'Copied!' : 'Copy Address'}
                  </button>
                  <a href="mailto:moulendrabalaji2007@gmail.com" className="btn btn-sm btn-secondary">
                    Send Mail
                  </a>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="contact-card-premium">
                <div className="contact-card-header">
                  <div className="contact-card-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                  <h3>LinkedIn Profile</h3>
                </div>
                <div className="contact-card-body">
                  <p className="contact-card-text">Connect for industry updates and networking</p>
                  <p className="contact-card-value">moulendra-balaji-01979b325</p>
                </div>
                <div className="contact-card-actions">
                  <a href="https://www.linkedin.com/in/moulendra-balaji-01979b325" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                    Open Profile
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Contact Form */}
            <div className="contact-form-container">
              <h3>Send a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group-premium">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input-premium"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group-premium">
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input-premium"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group-premium">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-input-premium form-textarea-premium"
                    placeholder="Describe your project, question, or proposal..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-submit-premium">
                  Send Message via Email Client
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Moulendra Balaji. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin, FiExternalLink, FiDownload } from 'react-icons/fi';
import { personalInfo, skills, experience, education, projects, projectCategories, contactInfo } from './data/portfolioData';
import './index.css';
import DotGrid from './components/DotGrid';
// Animation wrapper component
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <div 
      ref={ref} 
      className={`fade-in ${inView ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact'];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#" className="nav-logo">HJ</a>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {navItems.map(item => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
            </li>
          ))}
        </ul>
        <div className={`nav-toggle ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

// Hero Section
const Hero = () => (
  <section className="hero" id="hero">
    <div className="hero-content">
      <AnimatedSection>
        <div className="hero-badge">
          <span className="dot"></span>
          Available for opportunities
        </div>
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <h1 className="hero-title">
          <span className="gradient-text">{personalInfo.name}</span>
        </h1>
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <p className="hero-subtitle">{personalInfo.title} • {personalInfo.subtitle}</p>
      </AnimatedSection>
      <AnimatedSection delay={0.3}>
        <p className="hero-description">{personalInfo.heroDescription}</p>
      </AnimatedSection>
      <AnimatedSection delay={0.4}>
        <div className="hero-buttons">
          <a href="#projects" className="btn btn-primary">View My Work</a>
          <a href={personalInfo.cvFile} download className="btn btn-secondary">
            <FiDownload /> Download CV
          </a>
        </div>
      </AnimatedSection>
    </div>
    <div className="scroll-indicator">
      <div className="mouse"></div>
      <span>Scroll down</span>
    </div>
  </section>
);

// About Section
const About = () => (
  <section className="section" id="about">
    <div className="container">
      <div className="about-grid">
        <AnimatedSection className="about-image fade-in-left">
          <div className="about-image-wrapper">
            <img src={personalInfo.profileImage} alt={personalInfo.name} onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div style="height:400px;display:flex;align-items:center;justify-content:center;font-size:4rem;opacity:0.3;">👨‍💻</div>';
            }} />
          </div>
          <div className="about-image-decoration"></div>
        </AnimatedSection>
        <AnimatedSection className="about-content fade-in-right">
          <span className="section-tag">About Me</span>
          <h3>{personalInfo.aboutTitle}</h3>
          {personalInfo.aboutDescription.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-value">6+</div>
              <div className="stat-label">AI Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">🏆</div>
              <div className="stat-label">Boeing Prize</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">98%</div>
              <div className="stat-label">Cost Reduction</div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

// Skills Section
const Skills = () => (
  <section className="section" id="skills">
    <div className="container">
      <AnimatedSection className="section-header">
        <span className="section-tag">Expertise</span>
        <h2 className="section-title">Skills & Technologies</h2>
        <p className="section-description">Tools and technologies I use to bring ideas to life</p>
      </AnimatedSection>
      <div className="skills-grid">
        {skills.categories.map((category, index) => (
          <AnimatedSection key={category.name} delay={index * 0.1}>
            <div className="skill-category">
              <h3>{category.name}</h3>
              <div className="skill-tags">
                {category.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

// Projects Section
const Projects = () => {
  const [filter, setFilter] = useState('All');
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section className="section" id="projects">
      <div className="container">
        <AnimatedSection className="section-header">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-description">A selection of my recent work and personal projects</p>
        </AnimatedSection>
        <AnimatedSection>
          <div className="projects-filter">
            {projectCategories.map(cat => (
              <button 
                key={cat} 
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <AnimatedSection key={project.id} delay={index * 0.1}>
              <div className={`project-card ${project.featured ? 'featured' : ''}`}>
                <div className="project-image">
                  {project.image ? (
                    <img src={project.image} alt={project.title} onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span class="placeholder">🚀</span>';
                    }} />
                  ) : (
                    <span className="placeholder">🚀</span>
                  )}
                  <div className="project-overlay">
                    <div className="project-links">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                          <FiGithub />
                        </a>
                      )}
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link">
                          <FiExternalLink />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="project-content">
                  {project.award && <span className="project-award">{project.award}</span>}
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.technologies.map(tech => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// Experience Section
const Experience = () => (
  <section className="section" id="experience">
    <div className="container">
      <AnimatedSection className="section-header">
        <span className="section-tag">Career</span>
        <h2 className="section-title">Work Experience</h2>
        <p className="section-description">My professional journey so far</p>
      </AnimatedSection>
      <div className="timeline">
        {experience.map((exp, index) => (
          <AnimatedSection key={exp.id} delay={index * 0.1}>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date">{exp.duration}</span>
                <h3 className="timeline-title">{exp.role}</h3>
                <p className="timeline-company">{exp.company} • {exp.location}</p>
                <p className="timeline-description">{exp.description}</p>
                <ul className="timeline-list">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
                <div className="timeline-tech">
                  {exp.technologies.map(tech => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

// Education Section
const Education = () => (
  <section className="section" id="education">
    <div className="container">
      <AnimatedSection className="section-header">
        <span className="section-tag">Education</span>
        <h2 className="section-title">Academic Background</h2>
        <p className="section-description">My educational journey and qualifications</p>
      </AnimatedSection>
      <div className="timeline">
        {education.map((edu, index) => (
          <AnimatedSection key={edu.id} delay={index * 0.1}>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date">{edu.duration}</span>
                <h3 className="timeline-title">{edu.degree}</h3>
                <p className="timeline-company">{edu.field}</p>
                <p className="timeline-description">{edu.school} • {edu.location}</p>
                {edu.grade && <p className="timeline-description">Grade: {edu.grade}</p>}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

// Contact Section
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    // For now, just log - replace with actual form handling
    console.log('Form submitted:', formData);
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <AnimatedSection className="section-header">
          <span className="section-tag">Contact</span>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-description">{contactInfo.description}</p>
        </AnimatedSection>
        <div className="contact-grid">
          <AnimatedSection className="contact-info fade-in-left">
            <h3>{contactInfo.title}</h3>
            <p>I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-item-icon"><FiMail /></div>
                <div className="contact-item-text">
                  <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon"><FiPhone /></div>
                <div className="contact-item-text">
                  <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon"><FiMapPin /></div>
                <div className="contact-item-text">{personalInfo.location}</div>
              </div>
            </div>
            <div className="social-links">
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="social-link">
                <FiGithub />
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                <FiLinkedin />
              </a>
              <a href={`mailto:${personalInfo.email}`} className="social-link">
                <FiMail />
              </a>
            </div>
          </AnimatedSection>
          <AnimatedSection className="fade-in-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <p className="footer-text">
          © {new Date().getFullYear()} {personalInfo.name}. Built with React & ❤️
        </p>
        <div className="footer-links">
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`mailto:${personalInfo.email}`}>Email</a>
        </div>
      </div>
    </div>
  </footer>
);

// Custom Cursor
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div className={`cursor ${isHovering ? 'hover' : ''}`} style={{ left: position.x, top: position.y }} />
      <div className="cursor-dot" style={{ left: position.x, top: position.y }} />
    </>
  );
};

// Main App
function App() {
  return (
    <div className="app">
      <DotGrid />
      <CustomCursor />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;

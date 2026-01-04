import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin, FiExternalLink, FiDownload } from 'react-icons/fi';
import { personalInfo, skills, experience, education, projects, projectCategories, contactInfo } from './data/portfolioData';
import './index.css';
import DotGrid from './components/DotGrid';
import FogBackground from './components/SmokeBackground';

// ==========================================
// UTILITY COMPONENTS
// ==========================================

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

// ==========================================
// NAVBAR
// ==========================================

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

// ==========================================
// HERO SECTION
// ==========================================

const Hero = () => (
  <section className="hero" id="hero">
    <FogBackground />
    
    {/* Corner brackets */}
    <div className="hero-brackets">
      <span className="bracket bracket-tl"></span>
      <span className="bracket bracket-tr"></span>
      <span className="bracket bracket-bl"></span>
      <span className="bracket bracket-br"></span>
    </div>
  
    <span className="bracket-label">ポートフォリオ</span>
    <span className="bracket-text">Portfolio</span>

    {/* HUD elements */}
    <div className="hero-hud">
      <div className="hud-left">
        <div className="hud-label">Location</div>
        <div className="hud-value">Kenitra, Morocco</div>
      </div>
      <div className="hud-right">
        <div className="hud-label">Status</div>
        <div className="hud-value">
          <span className="hud-dot"></span>
          Connected
        </div>
      </div>
    </div>

    {/* Main content */}
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

// ==========================================
// ABOUT SECTION
// ==========================================

const About = () => (
  <section className="section" id="about">
    <div className="container">
      <div className="about-grid">
        <AnimatedSection className="about-image fade-in-left">
          <div className="about-image-wrapper">
            <img 
              src={personalInfo.profileImage} 
              alt={personalInfo.name} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="about-placeholder">👨‍💻</div>';
              }} 
            />
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

// ==========================================
// SKILLS SECTION
// ==========================================

const Skills = () => {
  const categoryIcons = {
    "Languages & Frameworks": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    "Machine Learning & AI": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 2v4m0 12v4M2 12h4m12 0h4"></path>
      </svg>
    ),
    "LLMs & RAG": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    "Computer Vision": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
    "Automation & Agents": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="m3 16 4 4 4-4"></path>
        <path d="M7 20V4"></path>
        <path d="m21 8-4-4-4 4"></path>
        <path d="M17 4v16"></path>
      </svg>
    ),
    "Tools & Platforms": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    )
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
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
              <div className="skill-category" onMouseMove={handleMouseMove}>
                <div className="skill-category-content">
                  <div className="skill-category-header">
                    <h3>{category.name}</h3>
                    <div className="skill-category-icon">
                      {categoryIcons[category.name]}
                    </div>
                  </div>
                  <div className="skill-tags">
                    {category.skills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
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

// ==========================================
// PROJECTS SECTION
// ==========================================

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalAnimation, setModalAnimation] = useState('');
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const openModal = (project, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setSelectedProject(project);
    setModalAnimation('opening');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalAnimation('closing');
    setTimeout(() => {
      setSelectedProject(null);
      setModalAnimation('');
      document.body.style.overflow = '';
    }, 400);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedProject) closeModal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedProject]);

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

        <div className={`projects-grid ${selectedProject ? 'modal-active' : ''}`}>
          {filteredProjects.map((project, index) => (
            <AnimatedSection key={project.id} delay={index * 0.1}>
              <div 
                className={`project-card ${project.featured ? 'featured' : ''} ${selectedProject?.id === project.id ? 'selected' : ''}`}
                onClick={(e) => openModal(project, e)}
              >
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
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link" onClick={(e) => e.stopPropagation()}>
                          <FiGithub />
                        </a>
                      )}
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link" onClick={(e) => e.stopPropagation()}>
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
                  <span className="project-expand-hint">Click to expand →</span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className={`project-modal-overlay ${modalAnimation}`} 
          onClick={closeModal}
          style={{
            '--origin-x': `${clickPosition.x}px`,
            '--origin-y': `${clickPosition.y}px`
          }}
        >
          <div className={`project-modal ${modalAnimation}`} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <span></span>
              <span></span>
            </button>
            
            <div className="modal-header">
              {selectedProject.award && <span className="project-award">{selectedProject.award}</span>}
              <h2 className="modal-title">{selectedProject.title}</h2>
              <p className="modal-subtitle">{selectedProject.subtitle}</p>
            </div>

            <div className="modal-body">
              <div className="modal-image">
                {selectedProject.image ? (
                  <img src={selectedProject.image} alt={selectedProject.title} onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="placeholder">🚀</span>';
                  }} />
                ) : (
                  <span className="placeholder">🚀</span>
                )}
              </div>
              
              <div className="modal-content">
                <h4>About this project</h4>
                <p>{selectedProject.description}</p>
                {selectedProject.longDescription && <p>{selectedProject.longDescription}</p>}

                <h4>Technologies Used</h4>
                <div className="modal-tech">
                  {selectedProject.technologies.map(tech => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="modal-links">
                  {selectedProject.github && (
                    <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      <FiGithub /> View on GitHub
                    </a>
                  )}
                  {selectedProject.live && (
                    <a href={selectedProject.live} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      <FiExternalLink /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// ==========================================
// EXPERIENCE SECTION
// ==========================================

const Experience = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="section experience-section" id="experience">
      <div className="exp-bg-glow"></div>
      
      <div className="container">
        <AnimatedSection className="section-header">
          <span className="section-tag">Career</span>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-description">My professional journey and achievements</p>
        </AnimatedSection>

        <div className="exp-timeline">
          <div className="exp-timeline-track">
            <div className="exp-timeline-progress"></div>
          </div>

          {experience.map((exp, index) => (
            <AnimatedSection key={exp.id} delay={index * 0.15}>
              <div 
                className={`exp-card ${activeIndex === index ? 'active' : ''} ${exp.current ? 'current' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="exp-node">
                  <div className="exp-node-outer">
                    <div className="exp-node-inner">
                      <div className="exp-node-pulse"></div>
                    </div>
                  </div>
                  <span className="exp-node-year">{exp.duration.split(' ')[0]}</span>
                </div>

                <div className="exp-card-content">
                  <div className="exp-card-header">
                    <div className="exp-company-badge">
                      <div className="exp-company-icon">{exp.company.charAt(0)}</div>
                      <div className="exp-company-info">
                        <span className="exp-duration">{exp.duration}</span>
                        <h4 className="exp-company-name">{exp.company}</h4>
                        <span className="exp-location">
                          <FiMapPin size={12} /> {exp.location}
                        </span>
                      </div>
                    </div>
                    <div className="exp-status">
                      <span className="exp-status-dot"></span>
                      {exp.current ? 'Current' : exp.type || 'Completed'}
                    </div>
                  </div>

                  <h3 className="exp-role">{exp.role}</h3>
                  <p className="exp-description">{exp.description}</p>

                  <div className="exp-achievements">
                    <span className="exp-achievements-label">Key Achievements</span>
                    <ul className="exp-achievements-list">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>
                          <span className="exp-achievement-icon">◆</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="exp-tech">
                    {exp.technologies.map((tech, i) => (
                      <span key={tech} className="exp-tech-tag" style={{ animationDelay: `${i * 0.05}s` }}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="exp-card-corner"></div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// EDUCATION SECTION
// ==========================================

const Education = () => {
  const [activeCard, setActiveCard] = useState(null);
  
  const getEducationIcon = (degree) => {
    if (degree.toLowerCase().includes('master')) return '🎓';
    if (degree.toLowerCase().includes('bachelor')) return '📜';
    return '📚';
  };

  return (
    <section className="section education-section" id="education">
      <div className="container">
        <AnimatedSection className="section-header">
          <span className="section-tag">Education</span>
          <h2 className="section-title">Academic Journey</h2>
          <p className="section-description">The story of my educational path</p>
        </AnimatedSection>

        <div className="edu-storyline">
          <div className="edu-path">
            <div className="edu-path-line"></div>
            <div className="edu-path-progress"></div>
          </div>

          <div className="edu-chapters">
            {education.map((edu, index) => (
              <AnimatedSection key={edu.id} delay={index * 0.2}>
                <div 
                  className={`edu-chapter ${activeCard === index ? 'active' : ''} ${index === 0 ? 'current' : ''}`}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div className="edu-chapter-marker">
                    <div className="edu-marker-node">
                      <span className="edu-marker-number">0{education.length - index}</span>
                      <div className="edu-marker-ring"></div>
                      <div className="edu-marker-pulse"></div>
                    </div>
                  </div>

                  <div className="edu-story-card">
                    <div className="edu-card-glow"></div>
                    
                    <div className="edu-card-header">
                      <div className="edu-icon-wrapper">
                        <span className="edu-icon">{getEducationIcon(edu.degree)}</span>
                        <div className="edu-icon-bg"></div>
                      </div>
                      <div className="edu-timeline-badge">
                        <span className="edu-year">{edu.duration}</span>
                        {index === 0 && <span className="edu-current-tag">In Progress</span>}
                      </div>
                    </div>

                    <div className="edu-card-content">
                      <h3 className="edu-degree">{edu.degree}</h3>
                      <p className="edu-field">{edu.field}</p>
                      
                      <div className="edu-school-info">
                        <div className="edu-school-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
                          </svg>
                        </div>
                        <div>
                          <span className="edu-school-name">{edu.school}</span>
                          <span className="edu-location">{edu.location}</span>
                        </div>
                      </div>

                      {edu.description && <p className="edu-description">{edu.description}</p>}

                      {edu.grade && (
                        <div className="edu-grade">
                          <span className="edu-grade-label">Grade</span>
                          <span className="edu-grade-value">{edu.grade}</span>
                        </div>
                      )}
                    </div>

                    <div className="edu-card-corner">
                      <svg viewBox="0 0 40 40">
                        <path d="M0 0 L40 0 L40 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="edu-journey-start">
            <span>Start of Journey</span>
            <div className="edu-start-icon">🚀</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// CONTACT SECTION
// ==========================================

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
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
              <button type="submit" className="btn btn-primary btn-full">
                {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// FOOTER
// ==========================================

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <p className="footer-text">
          © {new Date().getFullYear()} {personalInfo.name}. Built with React & atay bne3na3
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

// ==========================================
// CUSTOM CURSOR
// ==========================================

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => setPosition({ x: e.clientX, y: e.clientY });

    const handleMouseOver = (e) => {
      const isInteractive = e.target.tagName === 'A' || 
                           e.target.tagName === 'BUTTON' || 
                           e.target.closest('a') || 
                           e.target.closest('button');
      setIsHovering(isInteractive);
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

// ==========================================
// MAIN APP
// ==========================================

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
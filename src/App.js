import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // ==========================================
    // 🎬 Preloader
    // ==========================================
    const preloader = document.getElementById('preloader');
    const preloaderNum = document.getElementById('preloaderNum');
    const preloaderFill = document.getElementById('preloaderFill');
    let loadProgress = 0;

    const loadInterval = setInterval(() => {
      loadProgress += Math.random() * 12 + 3;
      if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(loadInterval);
        setTimeout(() => {
          if (preloader) preloader.classList.add('done');
          document.body.style.overflow = '';
        }, 400);
      }
      if (preloaderNum) preloaderNum.textContent = Math.floor(loadProgress);
      if (preloaderFill) preloaderFill.style.width = loadProgress + '%';
    }, 120);

    document.body.style.overflow = 'hidden';

    // ==========================================
    // 🖱️ Custom Cursor
    // ==========================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top = my + 'px';
      }
    };
    document.addEventListener('mousemove', onMouseMove);

    function animateCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (cursorRing) {
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top = ry + 'px';
      }
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .service-card, .project-item, .tool-item, .contact-method, .social-link, .team-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot?.classList.add('hover');
        cursorRing?.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot?.classList.remove('hover');
        cursorRing?.classList.remove('hover');
      });
    });

    // ==========================================
    // 📜 Scroll & Navigation
    // ==========================================
    const nav = document.getElementById('nav');
    const backToTop = document.getElementById('backToTop');
    const onScroll = () => {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll);

    // Reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Skill bars
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.style.width = entry.target.dataset.width + '%'; });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-fill').forEach(bar => skillObserver.observe(bar));

    // Count up
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          let current = 0;
          const increment = target / 80;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { entry.target.textContent = target; clearInterval(timer); }
            else { entry.target.textContent = Math.floor(current); }
          }, 25);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

    // ==========================================
    // 🎨 Hero Canvas Particles
    // ==========================================
    const heroCanvas = document.getElementById('heroCanvas');
    let heroAnimId;
    if (heroCanvas) {
      const ctx = heroCanvas.getContext('2d');
      let particles = [];
      const resizeHeroCanvas = () => {
        const hero = document.getElementById('hero');
        if (hero) { heroCanvas.width = hero.offsetWidth; heroCanvas.height = hero.offsetHeight; }
      };
      resizeHeroCanvas();
      window.addEventListener('resize', resizeHeroCanvas);

      class Particle {
        constructor() {
          this.x = Math.random() * heroCanvas.width;
          this.y = Math.random() * heroCanvas.height;
          this.size = Math.random() * 1.5 + 0.3;
          this.speedX = (Math.random() - 0.5) * 0.25;
          this.speedY = (Math.random() - 0.5) * 0.25;
          this.opacity = Math.random() * 0.4 + 0.05;
        }
        update() {
          this.x += this.speedX; this.y += this.speedY;
          if (this.x < 0 || this.x > heroCanvas.width) this.speedX *= -1;
          if (this.y < 0 || this.y > heroCanvas.height) this.speedY *= -1;
        }
        draw() {
          ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`; ctx.fill();
        }
      }
      const initParticles = () => {
        const count = Math.min(60, Math.floor(heroCanvas.width * heroCanvas.height / 25000));
        particles = Array.from({ length: count }, () => new Particle());
      };
      const connectParticles = () => {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(201, 168, 76, ${0.04 * (1 - dist / 130)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      };
      const animateParticles = () => {
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        heroAnimId = requestAnimationFrame(animateParticles);
      };
      initParticles(); animateParticles();
    }

    // ==========================================
    // 🌌 SPACE BACKGROUND (Stars & Shooting Stars)
    // ==========================================
    const spaceCanvas = document.getElementById('spaceCanvas');
    let spaceAnimId;
    if (spaceCanvas) {
      const ctx = spaceCanvas.getContext('2d');
      let w = spaceCanvas.width = window.innerWidth;
      let h = spaceCanvas.height = window.innerHeight;
      
      // Stars
      const stars = [];
      const numStars = 200;
      
      class Star {
        constructor() {
          this.reset();
        }
        
        reset() {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
          this.size = Math.random() * 2 + 0.5;
          this.speedX = (Math.random() - 0.5) * 0.05;
          this.speedY = (Math.random() - 0.5) * 0.05;
          this.opacity = Math.random();
          this.twinkleSpeed = Math.random() * 0.02 + 0.005;
          this.brightness = Math.random() * 0.5 + 0.5;
        }
        
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          this.opacity += this.twinkleSpeed;
          
          if (this.opacity > 1 || this.opacity < 0.3) {
            this.twinkleSpeed *= -1;
          }
          
          if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
            this.reset();
          }
        }
        
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * this.brightness})`;
          ctx.fill();
        }
      }
      
      // Initialize stars
      for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
      }
      
      // Shooting stars
      const shootingStars = [];
      
      class ShootingStar {
        constructor() {
          this.reset();
        }
        
        reset() {
          this.x = Math.random() * w;
          this.y = Math.random() * h * 0.5;
          this.length = Math.random() * 80 + 20;
          this.speed = Math.random() * 3 + 2;
          this.angle = Math.PI / 4;
          this.opacity = 0;
          this.life = 0;
          this.maxLife = Math.random() * 30 + 20;
          this.waitTime = Math.random() * 200 + 100;
        }
        
        update() {
          if (this.waitTime > 0) {
            this.waitTime--;
            return;
          }
          
          this.life++;
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed;
          
          // Fade in and out
          if (this.life < this.maxLife * 0.2) {
            this.opacity = (this.life / (this.maxLife * 0.2)) * 0.8;
          } else if (this.life > this.maxLife * 0.7) {
            this.opacity = ((this.maxLife - this.life) / (this.maxLife * 0.3)) * 0.8;
          }
          
          if (this.life > this.maxLife || this.x > w || this.y > h) {
            this.reset();
          }
        }
        
        draw() {
          if (this.waitTime > 0 || this.opacity <= 0) return;
          
          const endX = this.x - Math.cos(this.angle) * this.length;
          const endY = this.y - Math.sin(this.angle) * this.length;
          
          const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
          
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      
      // Initialize shooting stars
      for (let i = 0; i < 3; i++) {
        shootingStars.push(new ShootingStar());
      }
      
      // Nebula effect
      const nebulae = [];
      const numNebulae = 5;
      
      class Nebula {
        constructor() {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
          this.radius = Math.random() * 200 + 100;
          this.color = `rgba(${Math.random() * 100 + 100}, ${Math.random() * 50 + 50}, ${Math.random() * 150 + 100}, 0.05)`;
          this.speedX = (Math.random() - 0.5) * 0.02;
          this.speedY = (Math.random() - 0.5) * 0.02;
        }
        
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          
          if (this.x < -this.radius * 2) this.x = w + this.radius * 2;
          if (this.x > w + this.radius * 2) this.x = -this.radius * 2;
          if (this.y < -this.radius * 2) this.y = h + this.radius * 2;
          if (this.y > h + this.radius * 2) this.y = -this.radius * 2;
        }
        
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }
      
      for (let i = 0; i < numNebulae; i++) {
        nebulae.push(new Nebula());
      }
      
      const animateSpace = () => {
        // Clear with dark background
        ctx.fillStyle = 'rgba(1, 1, 3, 1)';
        ctx.fillRect(0, 0, w, h);
        
        // Draw nebulae
        nebulae.forEach(nebula => {
          nebula.update();
          nebula.draw();
        });
        
        // Draw stars
        stars.forEach(star => {
          star.update();
          star.draw();
        });
        
        // Draw shooting stars
        shootingStars.forEach(star => {
          star.update();
          star.draw();
        });
        
        spaceAnimId = requestAnimationFrame(animateSpace);
      };
      
      animateSpace();
      
      const handleResize = () => {
        w = spaceCanvas.width = window.innerWidth;
        h = spaceCanvas.height = window.innerHeight;
      };
      
      window.addEventListener('resize', handleResize);
    }

    // Magnetic buttons
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0, 0)'; });
    });

    // ==========================================
    // 🧹 Cleanup
    // ==========================================
    return () => {
      clearInterval(loadInterval);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      revealObserver.disconnect();
      skillObserver.disconnect();
      countObserver.disconnect();
      if (heroAnimId) cancelAnimationFrame(heroAnimId);
      if (spaceAnimId) cancelAnimationFrame(spaceAnimId);
    };
  }, []);

  // ==========================================
  // 🎮 Event Handlers
  // ==========================================
  const handleHamburgerClick = () => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger?.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
    document.body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
  };

  const closeMobile = () => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    document.body.style.overflow = '';
  };

  const handleFilterClick = (e) => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const btn = e.currentTarget;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      if (show) {
        item.style.display = 'grid';
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 10);
      } else {
        item.style.opacity = '0'; item.style.transform = 'translateY(20px)';
        setTimeout(() => { item.style.display = 'none'; }, 400);
      }
    });
  };

  const goToSlide = (index) => {
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.testimonial-dot');
    const total = 3;
    const current = ((index % total) + total) % total;
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    return current;
  };

  useEffect(() => {
    let current = 0;
    const next = document.getElementById('nextTestimonial');
    const prev = document.getElementById('prevTestimonial');
    const dots = document.querySelectorAll('.testimonial-dot');
    const goNext = () => { current = goToSlide(current + 1); };
    const goPrev = () => { current = goToSlide(current - 1); };
    next?.addEventListener('click', goNext);
    prev?.addEventListener('click', goPrev);
    dots.forEach(d => d.addEventListener('click', () => { current = goToSlide(parseInt(d.dataset.index)); }));
    const auto = setInterval(goNext, 6000);
    return () => { clearInterval(auto); next?.removeEventListener('click', goNext); prev?.removeEventListener('click', goPrev); };
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const form = e.target;
    if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
    setTimeout(() => {
      if (btn) { btn.textContent = '✓ Message Sent!'; btn.classList.add('success'); }
      form?.reset();
      setTimeout(() => {
        if (btn) { btn.textContent = 'Send Message →'; btn.classList.remove('success'); btn.disabled = false; }
      }, 3000);
    }, 1500);
  };

  // ==========================================
  // 🌐 JSX Render
  // ==========================================
  return (
    <div className="App">
      {/* === SPACE BACKGROUND === */}
      <canvas id="spaceCanvas" className="space-bg-canvas" aria-hidden="true"></canvas>

      {/* === Preloader === */}
      <div className="preloader" id="preloader">
        <div className="preloader-counter"><span id="preloaderNum">0</span><span>%</span></div>
        <div className="preloader-label">Loading NexusTech Experience</div>
        <div className="preloader-line"><div className="preloader-line-fill" id="preloaderFill"></div></div>
      </div>

      {/* === Custom Cursor === */}
      <div className="cursor-dot" id="cursorDot"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* === Navigation === */}
      <nav className="nav" id="nav">
        <div className="container">
          <div className="nav-inner">
            <a href="#" className="nav-logo">Cy<span className="accent">code</span>.</a>
            <ul className="nav-menu">
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#projects">Work</a></li>
              <li><a href="#team">Team</a></li>
              <li><a href="#testimonials">Reviews</a></li>
              <li><a href="#contact" className="nav-cta-link">Let's Talk</a></li>
            </ul>
            <div className="hamburger" id="hamburger" onClick={handleHamburgerClick}>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </nav>

      {/* === Mobile Menu === */}
      <div className="mobile-overlay" id="mobileMenu">
        <ul className="mobile-nav-links">
          <li><a href="#about" onClick={closeMobile}>About</a></li>
          <li><a href="#services" onClick={closeMobile}>Services</a></li>
          <li><a href="#projects" onClick={closeMobile}>Work</a></li>
          <li><a href="#team" onClick={closeMobile}>Team</a></li>
          <li><a href="#testimonials" onClick={closeMobile}>Reviews</a></li>
          <li><a href="#contact" onClick={closeMobile}>Contact</a></li>
        </ul>
        <div className="mobile-nav-footer"><p>hello@ccycode.dz</p></div>
      </div>

      {/* === Hero Section === */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <div className="hero-gradient-orb"></div>
          <div className="hero-gradient-orb"></div>
          <div className="hero-gradient-orb"></div>
          <div className="hero-noise"></div>
        </div>
        <canvas id="heroCanvas" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}></canvas>
        <div className="container">
          <div className="hero-content">
            <div className="hero-top">
              <div className="hero-tag"><span className="hero-tag-dot"></span>Available for Enterprise Projects</div>
              <div className="hero-year"></div>
            </div>
            <h1 className="hero-title">
              <span className="title-line"><span className="title-line-inner">Digital Security &</span></span>
              <span className="title-line"><span className="title-line-inner"><span className="outline-text">Innovation</span> <span className="accent">Studio</span></span></span>
            </h1>
            <div className="hero-bottom">
              <p className="hero-desc">A collective of elite engineers specializing in Cybersecurity, Game Development, and AI. We architect secure digital ecosystems and craft high-performance solutions for global clients.</p>
              <div className="hero-cta-group">
                <a href="#projects" className="btn btn-primary magnetic"><span>View Our Work</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
                <a href="#contact" className="btn btn-outline magnetic">Start a Project</a>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator"><span className="hero-scroll-text">Scroll</span><div className="hero-scroll-line"></div></div>
      </section>

      {/* === Marquee === */}
      <div className="marquee-section">
        <div className="marquee-track">
          {['Cyber Security', 'Game Development', 'Artificial Intelligence', 'Mobile Apps', 'Web Applications', 'Cloud Infrastructure'].map((t, i) => (
            <React.Fragment key={i}>
              <span className={`marquee-item ${i % 2 !== 0 ? 'highlight' : ''}`}>{t} <span className="sep"></span></span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* === About === */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-layout">
            <div className="about-image-section reveal">
              <div className="about-img-container">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="NexusTech Team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="about-img-border"></div>
              <div className="about-float-card"><div className="about-float-card-number">15+</div><div className="about-float-card-text">Expert Engineers</div></div>
            </div>
            <div className="about-content">
              <div className="section-label reveal">About Us</div>
              <h2 className="section-title reveal reveal-delay-1">Building the <span style={{ color: 'var(--accent)' }}>Future of Digital Security</span></h2>
              <div style={{ height: '24px' }} className="reveal reveal-delay-2"></div>
              <p className="reveal reveal-delay-2">NexusTech is a collective of 15+ expert engineers, security specialists, and creative developers. Founded in 2021, we merge cutting-edge technology with strategic innovation to deliver enterprise-grade solutions that stand the test of time.</p>
              <p className="reveal reveal-delay-3">Our multidisciplinary approach combines penetration testing, AI development, game engineering, and full-stack architecture under one roof — ensuring your project benefits from diverse expertise and seamless collaboration.</p>
              <div className="about-details-grid reveal reveal-delay-4">
                {[['Company', 'NexusTech Studio'], ['Founded', '2021, Constantine'], ['Email', 'hello@nexustech.dz'], ['Phone', '+213 793 484 581'], ['Specialization', 'SecOps • AI • Gaming • Web'], ['Status', 'Accepting New Projects']].map(([l, v], i) => (
                  <div className="about-detail-item" key={i}><span className="about-detail-label">{l}</span><span className="about-detail-value" style={l === 'Status' ? { color: 'var(--accent)' } : {}}>{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Services === */}
      <section className="section section-alt" id="services">
        <div className="container">
          <div className="section-header center">
            <div className="section-label reveal">Our Services</div>
            <h2 className="section-title reveal reveal-delay-1">Full-Spectrum Engineering</h2>
            <p className="section-subtitle reveal reveal-delay-2">End-to-end solutions spanning security, software, and artificial intelligence.</p>
          </div>
          <div className="services-grid">
            {[
              ['01', '🛡️', 'Enterprise Security', 'Penetration testing, vulnerability assessment, SOC implementation, and robust security architecture for enterprise applications.'],
              ['02', '🎮', 'Game Studio', 'Crafting immersive 2D/3D games with high-performance engines, complex AI-driven mechanics, and multiplayer infrastructure.'],
              ['03', '🤖', 'AI & Machine Learning', 'Integrating advanced neural networks, predictive models, and automation into modern digital ecosystems.'],
              ['04', '🌐', 'Web Development', 'Building scalable, secure, and ultra-fast web applications using React, Next.js, Node.js, and modern DevOps practices.'],
              ['05', '📱', 'Mobile Applications', 'High-end native and cross-platform mobile experiences with security-first implementation and seamless UX.'],
              ['06', '☁️', 'Cloud Infrastructure', 'Designing and managing secure, scalable cloud architectures on AWS, Azure, and GCP with automated CI/CD pipelines.']
            ].map(([n, icon, title, desc], i) => (
              <div className={`service-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}`} key={i}>
                <div className="service-number">{n}</div>
                <div className="service-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="service-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Skills === */}
      <section className="section" id="skills">
        <div className="container">
          <div className="section-header center">
            <div className="section-label reveal">Tech Stack</div>
            <h2 className="section-title reveal reveal-delay-1">Tools of the Trade</h2>
            <p className="section-subtitle reveal reveal-delay-2">A high-performance toolkit refined through intense professional practice.</p>
          </div>
          <div className="skills-layout">
            <div className="skills-group reveal">
              <h4>Security & Backend</h4>
              {[['Penetration Testing / Kali', '98'], ['Python / AI Frameworks', '95'], ['C++ / Game Engines (Unreal/Unity)', '92'], ['Network Security / OWASP', '94']].map(([name, val], i) => (
                <div className="skill-row" key={i}><div className="skill-row-header"><span className="skill-row-name">{name}</span><span className="skill-row-value">{val}%</span></div><div className="skill-track"><div className="skill-fill" data-width={val}></div></div></div>
              ))}
            </div>
            <div className="skills-group reveal reveal-delay-2">
              <h4>Web & Mobile Engineering</h4>
              {[['React / Next.js / Node.js', '96'], ['React Native / Flutter', '90'], ['PostgreSQL / MongoDB', '93'], ['Docker / Kubernetes / CI/CD', '88']].map(([name, val], i) => (
                <div className="skill-row" key={i}><div className="skill-row-header"><span className="skill-row-name">{name}</span><span className="skill-row-value">{val}%</span></div><div className="skill-track"><div className="skill-fill" data-width={val}></div></div></div>
              ))}
            </div>
          </div>
          <div className="tools-grid reveal" style={{ marginTop: '64px' }}>
            {['🛡️ CyberSec', '🎮 Unity/UE', '⚛️ React', '🐍 Python', '🤖 AI/ML', '🐳 Docker', '☁️ AWS/Azure', '📱 Mobile'].map(t => {
              const [icon, name] = t.split(' ');
              return <div className="tool-item" key={name}><div className="tool-item-icon">{icon}</div><div className="tool-item-name">{name}</div></div>;
            })}
          </div>
        </div>
      </section>

      {/* === Stats === */}
      <div className="numbers-section">
        <div className="container">
          <div className="numbers-grid">
            {[['120', 'Systems Secured'], ['15', 'Games Launched'], ['5', 'Years of Excellence'], ['45', 'AI Implementations']].map(([t, l], i) => (
              <div className={`number-item reveal ${i > 0 ? `reveal-delay-${i}` : ''}`} key={i}>
                <div className="number-value"><span className="count-up" data-target={t}>0</span>+</div>
                <div className="number-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === Projects === */}
      <section className="section section-alt" id="projects">
        <div className="container">
          <div className="projects-header">
            <div><div className="section-label reveal">Case Studies</div><h2 className="section-title reveal reveal-delay-1">Featured Projects</h2></div>
            <div className="project-filters reveal reveal-delay-2">
              {['All', 'Security', 'Games', 'AI / Web'].map(f => (
                <button key={f} className={`filter-btn ${f === 'All' ? 'active' : ''}`} data-filter={f.toLowerCase().replace(' / ', '').replace('s', '')} onClick={handleFilterClick}>{f}</button>
              ))}
            </div>
          </div>
          <div className="projects-list">
            {[
              { cat: 'security', img: 'photo-1550751827-4bd374c3f58b', title: 'Guardian Sentinel X', desc: 'Advanced real-time intrusion detection system using neural networks to identify and neutralize zero-day threats in enterprise cloud networks.', tags: ['Python', 'TensorFlow', 'CyberSec', 'AWS'], link: 'View Case Study' },
              { cat: 'game', img: 'photo-1542751371-adc38448a05e', title: 'CyberShift: Origins', desc: 'A high-fidelity cyberpunk RPG built in Unreal Engine 5, featuring procedurally generated environments and advanced NPC behavior logic.', tags: ['C++', 'Unreal Engine 5', 'AI'], link: 'Explore Universe' },
              { cat: 'ai', img: 'photo-1555066931-4365d14bab8c', title: 'NeuralSync Dashboard', desc: 'Next-generation management dashboard for AI-driven logistics, integrating real-time predictive analytics and secure API endpoints.', tags: ['Next.js', 'GraphQL', 'Node.js'], link: 'View Demo' }
            ].map((p, i) => (
              <div className={`project-item reveal ${i > 0 ? `reveal-delay-${i}` : ''}`} data-category={p.cat} key={i}>
                <div className="project-image-section"><img src={`https://images.unsplash.com/${p.img}?auto=format&fit=crop&q=80&w=800`} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                <div className="project-info-section">
                  <div className="project-category">{p.cat === 'security' ? 'Security Protocol' : p.cat === 'game' ? 'Immersive Game' : 'AI-SaaS Platform'}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="project-tech-tags">{p.tags.map(t => <span className="project-tech-tag" key={t}>{t}</span>)}</div>
                  <a href="#" className="project-link">{p.link} →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Team === */}
      <section className="section" id="team">
        <div className="container">
          <div className="section-header center">
            <div className="section-label reveal">Our Team</div>
            <h2 className="section-title reveal reveal-delay-1">Meet the Experts</h2>
            <p className="section-subtitle reveal reveal-delay-2">The talented minds behind NexusTech's success.</p>
          </div>
          <div className="team-grid">
            {[['🛡️', 'Amina K.', 'Lead Security Architect', '10+ years in enterprise security, CISSP certified.'], ['🎮', 'Youssef M.', 'Senior Game Developer', 'Unreal Engine specialist, shipped 5+ AAA titles.'], ['🤖', 'Sara B.', 'AI/ML Specialist', 'PhD in Machine Learning, TensorFlow expert.'], ['⚛️', 'Karim L.', 'Full-Stack Engineer', 'React/Node.js architect, DevOps enthusiast.']].map(([icon, name, role, bio], i) => (
              <div className={`team-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}`} key={i}>
                <div className="team-avatar">{icon}</div>
                <h4>{name}</h4>
                <p className="team-role">{role}</p>
                <p className="team-bio">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Experience === */}
      <section className="section section-alt" id="experience">
        <div className="container">
          <div className="section-header center">
            <div className="section-label reveal">Our Journey</div>
            <h2 className="section-title reveal reveal-delay-1">Company Milestones</h2>
            <p className="section-subtitle reveal reveal-delay-2">Key achievements that define our expertise.</p>
          </div>
          <div className="experience-list">
            {[['2024 — Present', 'Global Expansion', 'NexusTech International', 'Opened regional offices in Europe and North America, serving Fortune 500 clients with 24/7 security operations and dedicated development squads.'], ['2022 — 2024', 'AI & Gaming Division Launch', 'NexusTech Studio', 'Established specialized teams for AI/ML solutions and AAA game development, delivering 12+ successful projects with 98% client satisfaction.'], ['2021 — 2022', 'Company Foundation', 'NexusTech • Constantine, DZ', 'Founded by a team of cybersecurity experts and full-stack engineers with a mission to bridge the gap between security, creativity, and performance.']].map(([year, title, company, desc], i) => (
              <div className={`experience-item reveal ${i > 0 ? `reveal-delay-${i}` : ''}`} key={i}>
                <div className="experience-year">{year}</div>
                <div className="experience-role"><h4>{title}</h4><div className="experience-company">{company}</div><p className="experience-desc">{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Testimonials === */}
      <section className="section section-alt" id="testimonials">
        <div className="container">
          <div className="section-header center">
            <div className="section-label reveal">Endorsements</div>
            <h2 className="section-title reveal reveal-delay-1">Industry Feedback</h2>
            <p className="section-subtitle reveal reveal-delay-2">What global collaborators say about NexusTech's engineering precision.</p>
          </div>
          <div className="testimonials-container reveal">
            <div className="testimonial-slider">
              <div className="testimonial-track" id="testimonialTrack">
                {[['🏢', 'Michael Chen', 'CTO, GlobalFin Corp', '"NexusTech\'s team transformed our security posture completely. Their collaborative approach and deep expertise made them true partners in our digital transformation."'], ['🎮', 'Elena Rodriguez', 'Studio Head, PixelForge Games', '"The game NexusTech developed for us exceeded all expectations. Their attention to detail and technical excellence resulted in a product our players love."'], ['🤖', 'Dr. James Wilson', 'Director of Innovation, DataCore AI', '"NexusTech\'s AI implementation transformed our data processing from hours to milliseconds. Their code is clean, efficient, and profoundly secure."']].map(([icon, name, pos, text], i) => (
                  <div className="testimonial-slide" key={i}>
                    <div className="testimonial-stars">★ ★ ★ ★ ★</div>
                    <p className="testimonial-text">{text}</p>
                    <div className="testimonial-author"><div className="testimonial-avatar">{icon}</div><div><div className="testimonial-name">{name}</div><div className="testimonial-position">{pos}</div></div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="testimonial-controls">
              <button className="testimonial-btn" id="prevTestimonial">←</button>
              <div className="testimonial-dots">
                <button className="testimonial-dot active" data-index="0"></button>
                <button className="testimonial-dot" data-index="1"></button>
                <button className="testimonial-dot" data-index="2"></button>
              </div>
              <button className="testimonial-btn" id="nextTestimonial">→</button>
            </div>
          </div>
        </div>
      </section>

      {/* === Contact === */}
      <section className="section" id="contact">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info">
              <div className="section-label reveal">Initiate Contact</div>
              <h3 className="reveal reveal-delay-1">Let's Build Something <span>Remarkable</span></h3>
              <p className="reveal reveal-delay-2">Whether you need an enterprise security audit, a high-performance game, or a secure AI-driven application, our team is ready to architect your solution with precision and excellence.</p>
              <div className="contact-methods reveal reveal-delay-3">
                {[['📧', 'General Inquiries', 'hello@nexustech.dz', 'mailto:hello@nexustech.dz'], ['🚀', 'New Projects', 'projects@nexustech.dz', 'mailto:projects@nexustech.dz'], ['📍', 'Headquarters', 'Ali Mendjeli, Constantine, Algeria', null]].map(([icon, label, val, href], i) => (
                  <a key={i} href={href} className="contact-method" style={!href ? { cursor: 'default' } : {}}>
                    <div className="contact-method-icon">{icon}</div>
                    <div><div className="contact-method-label">{label}</div><div className="contact-method-value">{val}</div></div>
                  </a>
                ))}
              </div>
              <div className="contact-socials reveal reveal-delay-4">
                {[['GH', 'GitHub'], ['IN', 'LinkedIn'], ['X', 'Twitter/X'], ['DR', 'Dribbble']].map(([txt, title], i) => (
                  <a key={i} href="#" className="social-link" title={title}>{txt}</a>
                ))}
              </div>
            </div>
            <div className="contact-form-wrapper reveal">
              <form id="contactForm" onSubmit={handleContactSubmit}>
                <div className="form-grid">
                  <div className="form-field"><label>Full Name</label><input type="text" placeholder="John Doe" required /></div>
                  <div className="form-field"><label>Company</label><input type="text" placeholder="Your Company" /></div>
                  <div className="form-field"><label>Email Address</label><input type="email" placeholder="john@company.com" required /></div>
                  <div className="form-field"><label>Inquiry Type</label><select required><option value="">Select Service</option><option value="security">Security Audit</option><option value="game">Game Development</option><option value="ai">AI Integration</option><option value="web">Web/Mobile App</option><option value="consulting">Technical Consulting</option></select></div>
                  <div className="form-field"><label>Budget Range</label><select><option value="">Select Range</option><option value="5k-15k">$5,000 — $15,000</option><option value="15k-30k">$15,000 — $30,000</option><option value="30k-60k">$30,000 — $60,000</option><option value="60k+">$60,000+</option></select></div>
                  <div className="form-field full"><label>Project Brief</label><textarea placeholder="Describe your project goals, technical requirements, timeline, and any specific challenges..." required></textarea></div>
                  <div className="form-field full"><button type="submit" className="form-submit" id="submitBtn">Send Project Brief →</button></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* === Footer === */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand"><h3>Cy<span className="accent">code</span>.</h3><p>A collective of elite engineers delivering secure, scalable, and innovative digital solutions from Algeria to the world.</p></div>
            <div className="footer-col"><h4>Company</h4><ul>{['About Us', 'Services', 'Case Studies', 'Our Team', 'Careers'].map(l => <li key={l}><a href={`#${l.toLowerCase().replace(' ', '-')}`}>{l}</a></li>)}</ul></div>
            <div className="footer-col"><h4>Services</h4><ul>{['Security Audit', 'Game Design', 'AI Systems', 'App Development', 'Cloud Infrastructure'].map(l => <li key={l}><a href="#services">{l}</a></li>)}</ul></div>
            <div className="footer-col"><h4>Connect</h4><ul>{['GitHub', 'LinkedIn', 'Twitter / X', 'Dribbble', 'Contact Us'].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul></div>
          </div>
          <div className="footer-bottom"><p>© 2026 NexusTech Studio. All rights reserved. Security Certified • ISO 27001</p><div className="footer-bottom-links">{['Privacy Policy', 'Terms of Service', 'Security Report'].map(l => <a key={l} href="#">{l}</a>)}</div></div>
        </div>
      </footer>

      {/* === Back to Top === */}
      <button className="back-to-top" id="backToTop" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </div>
  );
}

export default App;
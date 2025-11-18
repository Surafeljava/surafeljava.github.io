/* Theme persistence and system mode */
(function () {
  const root = document.documentElement;
  const select = document.getElementById('theme-select');

  const stored = localStorage.getItem('theme');
  const initial = stored || 'dark';
  root.setAttribute('data-theme', initial);
  if (select) select.value = initial;

  function applyTheme(value) {
    root.setAttribute('data-theme', value);
    try { localStorage.setItem('theme', value); } catch {}
  }

  if (select) {
    select.addEventListener('change', function (e) {
      applyTheme(e.target.value);
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  
  // Intersection Observer for Scroll Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));

  // --- Particle Animation System ---
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  
  // Configuration
  const particleCount = 80;
  const connectionDistance = 150;
  const mouseDistance = 200;

  let width, height;
  
  // Mouse state
  const mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      
      // Randomize color opacity based on theme roughly (can refine)
      this.baseColor = 'rgba(59, 130, 246, '; // Blue-ish base
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseDistance - distance) / mouseDistance;
          
          // Gentle push away
          // const directionX = forceDirectionX * force * 2;
          // const directionY = forceDirectionY * force * 2;
          // this.vx -= directionX * 0.05;
          // this.vy -= directionY * 0.05;

          // Or attraction? Let's do gentle attraction/connection visualization more
        }
      }
    }

    draw() {
      // Color changes based on theme
      const isDark = root.getAttribute('data-theme') === 'dark';
      const color = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    const isDark = root.getAttribute('data-theme') === 'dark';
    const lineColor = isDark ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Draw connections
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          const opacity = 1 - (distance / connectionDistance);
          ctx.strokeStyle = lineColor + opacity * 0.15 + ')';
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      
      // Draw connection to mouse
      if (mouse.x != null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseDistance) {
            ctx.beginPath();
            const opacity = 1 - (distance / mouseDistance);
            ctx.strokeStyle = isDark 
                ? `rgba(59, 130, 246, ${opacity * 0.4})` // Blue glow in dark
                : `rgba(37, 99, 235, ${opacity * 0.3})`; // Blue in light
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();

})();

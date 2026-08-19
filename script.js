/* Custom interactions (jQuery)
   - Smooth scrolling
   - Active nav highlighting on scroll
   - Projects + skills rendering
   - Contact form demo (no backend)
   - Simple counters and carousel init
*/

$(function() {
  // ---------- Mobile menu backdrop and body lock ----------
  const $navbarCollapse = $('#mainNav');
  const $body = $('body');
  const $navbarToggler = $('.navbar-toggler');

  let $backdrop = $('.menu-backdrop');
  if ($backdrop.length === 0) {
    $backdrop = $('<div class="menu-backdrop"></div>');
    $body.append($backdrop);
  }

  function setMenuOpen(isOpen) {
    $body.toggleClass('menu-open', isOpen);
    $backdrop.toggleClass('show', isOpen);
    $navbarToggler.attr('aria-expanded', isOpen ? 'true' : 'false');
    $navbarToggler.attr('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  if (typeof bootstrap === 'undefined' || !bootstrap.Collapse) {
    $navbarToggler.on('click', function(e) {
      e.preventDefault();
      const isOpen = !$navbarCollapse.hasClass('show');
      $navbarCollapse.toggleClass('show', isOpen);
      setMenuOpen(isOpen);
    });
  }

  function closeMenu() {
    if (typeof $navbarCollapse.collapse === 'function') {
      $navbarCollapse.collapse('hide');
    } else {
      $navbarCollapse.removeClass('show');
      setMenuOpen(false);
    }
  }
    if (window.innerWidth < 992) setMenuOpen(true);
  });

  $navbarCollapse.on('hide.bs.collapse', function() {
    setMenuOpen(false);
  });

  $backdrop.on('click', function() {
    if (window.innerWidth < 992) closeMenu();
  });

  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $body.hasClass('menu-open')) closeMenu();
  });

  $(document).on('click', '.navbar-collapse .nav-link', function() {
    if (window.innerWidth < 992) {
      $navbarCollapse.collapse('hide');
    }
  });

  $(window).on('resize', function() {
    if (window.innerWidth >= 992) {
      setMenuOpen(false);
      $navbarCollapse.removeClass('show');
    }
  });

  // ---------- Smooth scroll for anchor links only ----------
  $(document).on('click', 'a[href*="#"]', function(e) {
    const href = this.getAttribute('href');
    if (!href) return;

    const hashIndex = href.indexOf('#');
    if (hashIndex === -1 || href.length === hashIndex + 1) return;

    const path = href.slice(0, hashIndex);
    const hash = href.slice(hashIndex);
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const targetPath = (!path || path === '/') ? '/' : path.replace(/\/$/, '');

    if (targetPath !== currentPath && !(currentPath === '/' && (targetPath === '/' || targetPath === ''))) {
      return;
    }

    const target = $(hash);
    if (target.length) {
      e.preventDefault();
      $('html,body').animate({ scrollTop: target.offset().top - 70 }, 600);
      $('.navbar-collapse').collapse('hide');
    }
  });

  // ---------- Active nav link ----------
  function currentPath() {
    return window.location.pathname.replace(/\/$/, '') || '/';
  }

  function updateActiveNav() {
    const path = currentPath();
    $('.navbar .nav-link').removeClass('active');
    $('.navbar .nav-link').each(function() {
      const href = ($(this).attr('href') || '').split('#')[0];
      const linkPath = !href || href === '/' ? '/' : href.replace(/\/$/, '');
      if (linkPath === path) {
        $(this).addClass('active');
      }
    });

    if (path === '/') {
      const pos = $(window).scrollTop() + 80;
      let currentId = 'home';
      $('section[id], header#home').each(function() {
        if (pos >= $(this).offset().top) currentId = $(this).attr('id');
      });
      if (currentId === 'contact') {
        $('.navbar .nav-link').removeClass('active');
        $('.navbar .nav-link[href="/#contact"], .navbar .nav-link[href="#contact"]').addClass('active');
      }
    }
  }
  $(window).on('scroll resize', updateActiveNav);
  updateActiveNav();

 
  function loadProjects() {
  
    const projects = [
      { id: 'legnapath', title: "LegnaPath Mentorship Platform", year: "2025", desc: "Mentorship features, match-making and micro-payments.", img: "assets/projects/legnapath.png", tags:['web'], collab:'team', github: 'https://github.com/Enqutk' },
      { id: 'custom-user-form', title: "Custom User Form Plugin", year: "2025", desc: "Shortcode based capture & management.", img: "assets/projects/custom-user-form.png", tags:['wp'], collab:'solo', github: 'https://github.com/Enqutk' },
      { id: 'food-ordering', title: "Food Ordering System", year: "2025", desc: "Ordering web app with guest checkout.", img: "assets/projects/food-ordering.png", tags:['web','mobile'], collab:'team', github: 'https://github.com/Enqutk/shopping' },
      { id: 'memory-maze', title: "Memory Maze", year: "2025", desc: "Interactive memory game and book unlocks.", img: "assets/projects/memory-maze.png", tags:['game'], collab:'solo', github: 'https://github.com/Enqutk/memory_maze' },
      { id: 'cookbook', title: "CookBook Pro", year: "2025", desc: "Recipe training web app.", img: "assets/projects/cookbook.png", tags:['web'], collab:'solo', github: 'https://github.com/Enqutk' },
      { id: 'waste-collection', title: "Waste Collection App", year: "2025", desc: "Localized waste collection planning and mapping.", img: "assets/projects/waste-collection.png", tags:['web','mobile'], collab:'team', github: 'https://github.com/Enqutk' },
      { id: 'freelance-dire', title: "Freelance Dire", year: "2025", desc: "Student hiring platform & community features.", img: "assets/projects/freelance-dire.png", tags:['web'], collab:'team', github: 'https://github.com/Enqutk/jeffery-job' },
      { id: 'keyboard-crush', title: "Keyboard Crush Pro", year: "2025", desc: "Typing speed and accuracy test platform.", img: "assets/projects/keyboard-crush.png", tags:['web','game'], collab:'solo', github: 'https://github.com/Enqutk/Keyboard-crush-pro' },
      { id: 'java-delivery', title: "Online Food Delivery (Java)", year: "2025", desc: "OOP simulation of delivery process.", img: "assets/projects/java-delivery.png", tags:['java'], collab:'solo', github: 'https://github.com/Enqutk' },
      { id: 'memory-reading', title: "Memory Based Reading System", year: "2025", desc: "Book unlocking app based on recall.", img: "assets/projects/memory-reading.png", tags:['web'], collab:'solo', github: 'https://github.com/Enqutk/ReadItOut' }
    ];

    const $grid = $('#projects-grid');
    $grid.empty();

    // Enhanced project card rendering
    projects.forEach((p) => {
      const tagsList = p.tags.map(t => `<span class="badge bg-light text-muted">${escapeHtml(t)}</span>`).join(' ');
      const projectCard = $(`
        <div class="project-tile will-reveal" data-id="${p.id}" data-tags="${p.tags.concat([p.collab]).join(',')}">
          <img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy">
          <div class="project-overlay">
            <div>
              <div class="project-title">${escapeHtml(p.title)}</div>
              <div class="project-meta">${escapeHtml(p.year)} • ${escapeHtml(p.desc)}</div>
            </div>
          </div>
          <div class="project-body">
            <div class="project-title">${escapeHtml(p.title)}</div>
            <div class="project-meta">${escapeHtml(p.year)} • ${escapeHtml(p.tags.join(', '))}</div>
            <div class="project-footer">
              <div class="project-tags-small">${tagsList}</div>
              <div class="d-flex align-items-center gap-2">
                <a class="project-github-link" href="${p.github || 'https://github.com/Enqutk'}" target="_blank" rel="noopener" title="View on GitHub" aria-label="GitHub" onclick="event.stopPropagation()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <span class="badge badge-collab ${p.collab==='team' ? 'team' : 'solo'}">${p.collab==='team' ? 'Team' : 'Individual'}</span>
              </div>
            </div>
          </div>
        </div>
      `);
      $grid.append(projectCard);
    });

   
    updateStats(projects.length, 8);

  
    const tiles = Array.from(document.querySelectorAll('.project-tile.will-reveal'));
    if ('IntersectionObserver' in window && tiles.length) {
      const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tiles.forEach((tile, i) => setTimeout(()=> tile.classList.add('revealed'), i * 90));
            observer.disconnect();
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
      const projectsSection = document.querySelector('#projects');
      if (projectsSection) {
        obs.observe(projectsSection);
      }
    } else {
      tiles.forEach((tile, i) => setTimeout(()=> tile.classList.add('revealed'), i * 90));
    }

    $(document).off('click', '.project-tile').on('click', '.project-tile', function() {
      const id = $(this).data('id');
      const proj = projects.find(x => x.id === id);
      if (!proj) return;
      
      const tagsHtml = proj.tags.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join(' ');
      const collabBadge = `<span class="badge badge-collab ${proj.collab==='team' ? 'team' : 'solo'}">${proj.collab==='team' ? 'Team Project' : 'Individual Project'}</span>`;
      
      const modalHtml = `
        <img class="proj-hero" src="${proj.img}" alt="${escapeHtml(proj.title)}">
        <div class="proj-details">
          <h4>${escapeHtml(proj.title)}</h4>
          <div class="proj-meta">
            <span>${escapeHtml(proj.year)}</span>
            <span>•</span>
            <span>${escapeHtml(proj.desc)}</span>
          </div>
          <div class="proj-tags">
            ${tagsHtml}
            ${collabBadge}
          </div>
          <div class="proj-description">
            <p>This project showcases ${proj.desc.toLowerCase()}. Built with modern technologies and best practices, it demonstrates expertise in ${proj.tags.join(', ')} development.</p>
            <p>Key features include responsive design, user-friendly interface, and robust functionality that addresses real-world needs.</p>
          </div>
          <div class="proj-actions">
            <a class="btn btn-gold" href="${proj.github || 'https://github.com/Enqutk'}" target="_blank" rel="noopener">View on GitHub</a>
          </div>
        </div>
      `;
      $('#project-modal-content').html(modalHtml);
      const modal = new bootstrap.Modal(document.getElementById('projectModal'), {});
      modal.show();
    });

  
    // Update filter count
    function updateFilterCounts() {
      const total = projects.length;
      $('#filter-count-all').text(total);
      
      ['web', 'wp', 'mobile', 'game', 'team', 'solo'].forEach(filter => {
        const count = projects.filter(p => {
          const tags = p.tags.concat([p.collab]);
          return tags.includes(filter);
        }).length;
        const $btn = $(`.filter-btn[data-filter="${filter}"]`);
        if ($btn.length && count > 0) {
          if (!$btn.find('.filter-count').length) {
            $btn.append(`<span class="filter-count">${count}</span>`);
          } else {
            $btn.find('.filter-count').text(count);
          }
        }
      });
    }
    updateFilterCounts();

    // Enhanced filter functionality
    $('#projects-filters').off('click').on('click', '.filter-btn', function() {
      const filter = $(this).data('filter');
      $('#projects-filters .filter-btn').removeClass('active');
      $(this).addClass('active');

      let visibleCount = 0;
      
      if (filter === '*') {
        $('.project-tile').removeClass('d-none').each(function() {
          $(this).addClass('will-reveal');
          setTimeout(() => {
            $(this).addClass('revealed');
          }, 50);
          visibleCount++;
        });
      } else {
        $('.project-tile').each(function() {
          const tags = $(this).data('tags') || '';
          const list = String(tags).split(',').map(t => t.trim());
          if (list.indexOf(filter) >= 0) {
            $(this).removeClass('d-none').addClass('will-reveal');
            setTimeout(() => {
              $(this).addClass('revealed');
            }, 50);
            visibleCount++;
          } else {
            $(this).addClass('d-none').removeClass('revealed will-reveal');
          }
        });
      }

      // Show/hide empty state
      if (visibleCount === 0) {
        $('#projects-empty').fadeIn(300);
        $('#projects-grid').fadeOut(200);
      } else {
        $('#projects-empty').fadeOut(200);
        $('#projects-grid').fadeIn(300);
      }

      // Smooth scroll to projects section
      const top = $('#projects').offset().top - 80;
      $('html,body').animate({ scrollTop: top }, 400);
    });
  }


  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }

 
  function loadSkills() {
    const skills = [
      { name: 'HTML/CSS', percent: 95 },
      { name: 'JavaScript', percent: 90 },
      { name: 'Bootstrap', percent: 92 },
      { name: 'PHP', percent: 85 },
      { name: 'Node.js', percent: 80 },
      { name: 'React', percent: 78 },
      { name: 'Next.js', percent: 70 }
    ];

    let $col = $('#skills-column');
    if (!$col.length) return;

    const rows = skills.map(s => `
      <div class="skill-entry visible" data-percent="${s.percent}">
        <div class="skill-meta">
          <span class="skill-name">${escapeHtml(s.name)}</span>
          <span class="percent-value">${s.percent}%</span>
        </div>
        <div class="skill-progress">
          <div class="progress-bar" style="width:${s.percent}%" role="progressbar" aria-valuenow="${s.percent}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    `).join('');

    $col.html(`<div class="skills-list">${rows}</div>`);
  }

 
  function animateCounter($el, to) {
    // Minimal UI: set instantly, no count-up
    if ($el && $el.length) $el.text(String(to));
  }
  function updateStats(projects, clients) {
    animateCounter($('#stat-projects'), projects || 11);
    animateCounter($('#stat-clients'), clients || 8);
    // Experience is static (10 months)
  }

 
  $('#contact-form').off('submit').on('submit', async function(e) {
    e.preventDefault();
    const $form = $(this);
    const $send = $('#contact-send');
    const $result = $('#contact-result');

  
    function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||'')); }
    function showError(name,msg){ $(`[data-for="${name}"]`).text(msg||''); }
    function clearErrors(){ $form.find('.form-error').text(''); }

    clearErrors();
    if ($form.find('input[name="hp_field"]').val()) return; // honeypot

    const data = {
      name: $('#cf-name').val().trim(),
      email: $('#cf-email').val().trim(),
      subject: $('#cf-subject').val().trim(),
      message: $('#cf-message').val().trim(),
      consent: $('#cf-consent').is(':checked')
    };

    let ok = true;
    if (!data.name) { showError('name','Please enter your name'); ok=false; }
    if (!data.email || !isEmail(data.email)) { showError('email','Enter a valid email'); ok=false; }
    if (!data.subject) { showError('subject','Add a subject'); ok=false; }
    if (!data.message || data.message.length < 10) { showError('message','Message must be at least 10 characters'); ok=false; }
    if (!data.consent) { 
      $result.html('<div class="text-warning small">Please agree to be contacted.</div>');
      ok=false; 
    }

    if (!ok) {
      $send.addClass('shake');
      setTimeout(()=> $send.removeClass('shake'), 420);
      return;
    }

    $send.prop('disabled', true).addClass('loading').removeClass('success');
    $send.find('.btn-text').text('Sending...');
    $result.text('');

    try {
      // Use API service if available
      if (typeof api !== 'undefined' && api.sendContactMessage) {
        await api.sendContactMessage(data.name, data.email, data.subject, data.message);
      } else {
        // Fallback: simulate API call for demo purposes (when backend not available)
        await new Promise(resolve => setTimeout(resolve, 800));
        // Show info that it's a demo
        console.info('Backend API not available - using demo mode');
      }
      
      // Success
      $send.removeClass('loading').addClass('success');
      $send.find('.btn-text').text('Sent!');
      $result.html('<div class="alert alert-success mt-3"><strong>Success!</strong> Message sent — thanks! I will reply soon.</div>');

      // Save to localStorage for convenience
      try { 
        localStorage.setItem('contact_name', data.name); 
        localStorage.setItem('contact_email', data.email); 
      } catch(e){}

      // Reset form after delay
      setTimeout(()=> {
        $form[0].reset();
        $send.prop('disabled', false).removeClass('success');
        $send.find('.btn-text').text('Send Message');
        $result.html('');
      }, 3000);
    } catch (error) {
      // Error handling
      $send.prop('disabled', false).removeClass('loading');
      $send.find('.btn-text').text('Send Message');
      $result.html(`<div class="alert alert-danger mt-3"><strong>Error:</strong> ${error.message || 'Failed to send message. Please try again or contact me directly.'}</div>`);
      
      // Show shake animation on error
      $send.addClass('shake');
      setTimeout(()=> $send.removeClass('shake'), 420);
    }
  });

 
  $('#contact-reset').off('click').on('click', function(){
    $('#contact-form')[0].reset();
    $('#contact-form .form-error').text('');
    $('#contact-result').text('');
  });

  // restore saved name/email on load
  $(function(){
    try {
      const n = localStorage.getItem('contact_name');
      const e = localStorage.getItem('contact_email');
      if (n) $('#cf-name').val(n);
      if (e) $('#cf-email').val(e);
    } catch(e){}
  });


  $('#footer-year').text(new Date().getFullYear());

 
  const testimonialsEl = document.getElementById('testimonialsCarousel');
  if (testimonialsEl) {
    bootstrap.Carousel.getOrCreateInstance(testimonialsEl, { interval: 4200, ride: 'carousel', pause: 'hover' });
  }

 
  loadProjects();
  loadSkills();


  updateActiveNav();
});


// Universal theme toggle function - can be called from any page
// NOTE: This now just calls the global toggleTheme function to avoid conflicts
window.initThemeToggle = function() {
  const $toggle = $('#theme-toggle');
  const $body = $('body');
  
  // Only proceed if toggle button exists
  if ($toggle.length === 0) {
    return;
  }
  
  // Remove any existing jQuery handlers to prevent conflicts
  $toggle.off('click.theme-toggle');
  
  // Initialize theme from localStorage - DEFAULT TO DARK MODE
  function initTheme() {
    try {
      let saved = localStorage.getItem('theme');
      if (!saved) {
        const oldSaved = localStorage.getItem('theme_preference');
        if (oldSaved === 'dark') {
          saved = 'dark-mode';
          localStorage.setItem('theme', saved);
        } else if (oldSaved === 'light') {
          saved = 'light-mode';
          localStorage.setItem('theme', saved);
        } else {
          // DEFAULT TO DARK MODE if no preference exists
          saved = 'dark-mode';
          localStorage.setItem('theme', 'dark-mode');
          localStorage.setItem('theme_preference', 'dark');
        }
      }
      
      if (saved === 'dark-mode') {
        $body.addClass('dark-mode');
        document.documentElement.classList.add('dark-mode');
        $toggle.text('☀️');
      } else {
        $body.removeClass('dark-mode');
        document.documentElement.classList.remove('dark-mode');
        $toggle.text('🌙');
      }
    } catch(e) {
      console.error('Theme initialization error:', e);
      // Default to dark mode on error
      $body.addClass('dark-mode');
      document.documentElement.classList.add('dark-mode');
      $toggle.text('☀️');
    }
  }
  
  // Initialize on load
  initTheme();

  // Use the global toggleTheme function if available, otherwise fallback
  if (typeof window.toggleTheme === 'function') {
    // Just ensure the button calls the global function
    $toggle.attr('onclick', 'window.toggleTheme(event)');
  } else {
    // Fallback jQuery handler
  $toggle.on('click.theme-toggle', function(){
    const isDark = $body.toggleClass('dark-mode').hasClass('dark-mode');
      // Also toggle on documentElement for CSS variables
      if (isDark) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    $toggle.text(isDark ? '☀️' : '🌙');
    try { 
      localStorage.setItem('theme', isDark ? 'dark-mode' : 'light-mode');
      localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
    } catch(e){
      console.error('Theme save error:', e);
    }
  });
  }
};

// Auto-initialize on pages that include script.js
$(function(){
  if (typeof window.initThemeToggle === 'function') {
    window.initThemeToggle();
  }
});


$(function() {
  // Minimal UI: no typing / parallax motion
  const $target = $('#typed-text');
  if ($target.length && !$target.text().trim()) {
    $target.text('Enku Taddesse');
  }
  $('.typed-cursor').hide();
});

// reveal About section elements and trigger stats when visible
(function aboutRevealAndStats() {
  const targets = document.querySelectorAll('.about-reveal');
  if (!targets.length) return;

  // trigger when 25% visible
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        // when middle column becomes visible, animate stats (use existing updateStats)
        if (en.target.querySelector && en.target.querySelector('#stat-projects')) {
          // if stats present in this element, call updateStats with values
          // Use the number of projects already loaded (script.loadProjects calls updateStats), but ensure animation runs here as well
          updateStats(parseInt($('#stat-projects').text(),10) || 11, parseInt($('#stat-clients').text(),10) || 8);
        }
      }
    });
  }, { threshold: 0.22 });

  targets.forEach(t => obs.observe(t));
})();

// Animate & reveal services — minimal UI: show immediately, no tilt
(function servicesRevealAndTilt() {
  const serviceCards = Array.from(document.querySelectorAll('.service-card'));
  if (!serviceCards.length) return;
  serviceCards.forEach(card => card.classList.add('visible'));
})();

// About section — minimal UI: no float / parallax / stagger
(function aboutPhotoAndTextAnimation() {
  const aboutEl = document.getElementById('about');
  if (!aboutEl) return;
  aboutEl.querySelectorAll('.text-reveal, .profile-img, h2, p, .timeline li, .stat-number').forEach(el => {
    el.classList.add('visible');
  });
})();

// reveal hero inner and quote when hero is visible
(function revealHeroQuote() {
  const hero = document.getElementById('home');
  if (!hero) return;
  const quote = hero.querySelector('.hero-quote');
  const inner = hero.querySelector('.hero-inner');
  if (quote) quote.classList.add('visible');
  if (inner) inner.classList.add('visible');
})();

// Tech Stack loader: randomized sizes, rotation and packing
function loadStack() {
  const stack = [
    { name: 'HTML5', src: 'assets/stack/html.png' },
    { name: 'CSS3', src: 'assets/stack/css.png' },
    { name: 'JavaScript', src: 'assets/stack/js.png' },
    { name: 'Bootstrap', src: 'assets/stack/bootstrap.png' },
    { name: 'PHP', src: 'assets/stack/php.png' },
    { name: 'Node.js', src: 'assets/stack/nodejs.png' },
    { name: 'React', src: 'assets/stack/react.png' },
    { name: 'Next.js', src: 'assets/stack/nextjs.png' }
  ];

  const $grid = $('#stack-grid');
  if (!$grid.length) return;

  // shuffle for random order
  function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } }

  shuffle(stack);

  function randomSize(){ const r=Math.random(); if(r<0.55) return 'size-sm'; if(r<0.85) return 'size-md'; return 'size-lg'; }

  const html = stack.map(s => {
    const size = randomSize();
    return `<div class="stack-item ${size}" data-name="${s.name}">
      <img src="${s.src}" alt="${s.name} logo" loading="lazy">
      <div class="stack-label">${s.name}</div>
    </div>`;
  }).join('');
  $grid.html(html);

  // Minimal UI: flat grid, no rotation / stagger / tilt
  Array.from(document.querySelectorAll('#stack-grid .stack-item')).forEach(el => {
    el.classList.add('visible');
    el.style.transform = 'none';
    el.style.left = '';
    el.style.top = '';
    el.style.transition = 'none';
  });
}

// call loader on DOM ready
$(function(){ loadStack(); });

// Clients & Partners loader
function loadClients() {
  const clients = [
    { id:'abol', name:'ABOL Solution', img:'assets/clients/abol.png', featured:true, website:'#', desc:'Technology solutions partner focused on local web tools and community outreach initiatives.' },
    { id:'ddu', name:'DDU ICT Club', img:'assets/clients/dduictclub.jpg', featured:true, website:'#', desc:'University technology club providing mentorship, workshops, and collaborative learning opportunities for students.' }
  ];

  const $grid = $('#clients-grid');
  const $marquee = $('#marquee-track');
  const $carousel = $('#clients-carousel');
  $grid.empty(); $marquee.empty(); $carousel.empty();

  // Build grid columns with enhanced cards
  clients.forEach(c => {
    const col = $(`
      <div class="col-6 col-sm-4 col-md-3 client-col">
        <div class="client-tile" data-id="${c.id}">
          <div class="client-card">
            <img class="client-logo" src="${c.img}" alt="${c.name}">
            <div class="client-overlay">
              <span class="client-name">${c.name}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `);
    $grid.append(col);

    // marquee featured
    if (c.featured && $marquee.length) {
      $marquee.append(`<div class="marquee-item"><img src="${c.img}" alt="${c.name}"></div>`);
    }
  });

  // Mobile carousel: group 2 per slide
  if ($carousel.length) {
    let slides = [];
    const perSlide = 2;
    for (let i = 0; i < clients.length; i += perSlide) {
      const group = clients.slice(i, i+perSlide);
      const itemsHtml = group.map(ci => `<div class="px-2"><img class="client-logo" src="${ci.img}" alt="${ci.name}"></div>`).join('');
      slides.push(`<div class="carousel-item ${i===0? 'active':''}"><div class="d-flex justify-content-center align-items-center">${itemsHtml}</div></div>`);
    }
    const carouselHtml = `
      <div id="clientsMobileCarousel" class="carousel slide" data-bs-ride="false" data-bs-interval="false">
        <div class="carousel-inner">${slides.join('')}</div>
      </div>`;
    $carousel.html(carouselHtml);
    const el = document.getElementById('clientsMobileCarousel');
    if (el) bootstrap.Carousel.getOrCreateInstance(el, { interval: false, ride: false });
  }

  // Minimal UI: show clients immediately, no tilt / stagger
  Array.from(document.querySelectorAll('#clients-grid .client-tile')).forEach(tile => {
    tile.classList.add('revealed');
    tile.style.transform = 'none';
  });

  // marquee disabled for minimal UI
  if (false && $marquee.length) {
    const track = $marquee[0];
    let pos = 0;
    // duplicate content for seamless loop
    track.innerHTML = track.innerHTML + track.innerHTML;
    function step() {
      pos -= 0.4; // speed
      if (Math.abs(pos) >= track.scrollWidth/2) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // click -> open partner modal
  $(document).off('click', '.client-tile').on('click', '.client-tile', function(){
    const id = $(this).data('id');
    const info = clients.find(x => x.id === id);
    if (!info) return;
    const html = `
      <div class="mb-4">
        <img src="${info.img}" class="partner-logo mb-3" alt="${info.name}">
      </div>
      <h4 class="fw-bold mb-3">${info.name}</h4>
      <p class="partner-desc mb-4">${info.desc}</p>
      ${info.website !== '#' ? `<a class="btn btn-gold" href="${info.website}" target="_blank">Visit Website</a>` : ''}
    `;
    $('#partner-modal-content').html(html);
    const modal = new bootstrap.Modal(document.getElementById('partnerModal'), {});
    modal.show();
  });
}

// call clients loader
$(function(){ loadClients(); });

// Testimonials loader -> Bootstrap fade carousel (single centered card, indicators, keyboard support)
async function loadTestimonials() {
  let testimonials = [];
  
  // Try to load from API first, fallback to hardcoded if API fails
  try {
    if (typeof api !== 'undefined' && api.getTestimonials) {
      const data = await api.getTestimonials(true); // Only get approved
      if (data && data.testimonials && data.testimonials.length > 0) {
        testimonials = data.testimonials.map(t => ({
          name: t.name,
          role: t.role || 'Client',
          avatar: t.avatar || 'assets/testimonials/default-avatar.jpg',
          quote: t.quote,
          rating: t.rating || 5
        }));
      }
    }
  } catch (error) {
    console.log('Could not load testimonials from API, using fallback:', error);
  }
  
  // Fallback to hardcoded testimonials if API fails or returns empty
  if (testimonials.length === 0) {
    testimonials = [
      { name: 'Kaleb Getachew', role: 'CEO • ABOL Solution', avatar: 'assets/testimony/kalebgetachew.png', quote: "Strategic, reliable and fast — Enku is a pleasure to work with.", rating:5 },
      { name: 'Yeabsira Endale', role: 'Lead • ICT Club / CTO • AOL Solution', avatar: 'assets/testimony/yeabsira.png', quote: "Provided great technical leadership and mentored our team effectively.", rating:5 },
      { name: 'Kaleb Abebe', role: 'Client', avatar: 'assets/testimony/kalebabebe.png', quote: "Delivered exactly what I needed on time — highly recommended.", rating:4 },
      { name: 'Berket Bahiru', role: 'Core Team Lead • ICT Club', avatar: 'assets/testimony/bereket.png', quote: "A dependable collaborator and excellent communicator.", rating:5 }
    ];
  }

  const carouselRoot = document.getElementById('testimonialsCarousel');
  if (!carouselRoot) return;

  // build indicators + slides with fade class
  const inner = document.createElement('div');
  inner.className = 'carousel-inner';

  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';

  testimonials.forEach((t, i) => {
    const active = i === 0 ? 'active' : '';
    const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);

    // slide
    const slide = document.createElement('div');
    slide.className = `carousel-item ${active}`;
    slide.setAttribute('role','tabpanel');
    slide.innerHTML = `
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-8">
          <div class="testimonial-card">
            <div class="testimonial-quote-wrapper">
              <div class="testimonial-quote-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                </svg>
              </div>
              <div class="testimonial-quote">${t.quote}</div>
            </div>
            <div class="testimonial-footer">
              <div class="testimonial-author">
                <img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar" onerror="this.src='assets/testimonials/default-avatar.jpg'">
                <div class="testimonial-author-info">
                  <div class="testimonial-author-name">${t.name}</div>
                  <div class="testimonial-author-role">${t.role}</div>
                </div>
              </div>
              <div class="testimonial-rating">
                <div class="testimonial-stars" aria-label="Rating: ${t.rating} out of 5">${stars}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    inner.appendChild(slide);

    // indicator
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-bs-target', '#testimonialsCarousel');
    btn.setAttribute('data-bs-slide-to', String(i));
    if (i === 0) btn.className = 'active';
    btn.setAttribute('aria-label', `${t.name} testimonial`);
    indicators.appendChild(btn);
  });

  // replace existing content safely
  const existingInner = carouselRoot.querySelector('.carousel-inner');
  if (existingInner) existingInner.replaceWith(inner);
  else carouselRoot.appendChild(inner);

  const existingInd = carouselRoot.querySelector('.carousel-indicators');
  if (existingInd) existingInd.replaceWith(indicators);
  else carouselRoot.insertBefore(indicators, carouselRoot.firstChild);

  // Remove fade class if present - we want sliding animation
  carouselRoot.classList.remove('carousel-fade');

  // Minimal UI: manual carousel only, no autoplay / reveal stagger
  bootstrap.Carousel.getOrCreateInstance(carouselRoot, {
    interval: false,
    ride: false,
    keyboard: true,
    touch: true,
    wrap: true
  });
  carouselRoot.classList.add('in-view');
  carouselRoot.querySelectorAll('.testimonial-card').forEach(c => c.classList.add('visible'));
}

// Handle testimonial form submission
$(function() {
  $('#testimonial-form').on('submit', async function(e) {
    e.preventDefault();
    const $form = $(this);
    const $btn = $form.find('button[type="submit"]');
    const $spinner = $btn.find('.spinner-border');
    const $submitText = $btn.find('.submit-text');
    const $message = $('#testimonial-message');
    const $modal = $('#testimonialModal');
    
    const name = $('#testimonial-name').val().trim();
    const email = $('#testimonial-email').val().trim();
    const role = $('#testimonial-role').val().trim() || 'Client';
    const quote = $('#testimonial-quote').val().trim();
    const rating = parseInt($('#testimonial-rating').val()) || 5;
    
    // Validate
    if (!name || !email || !quote) {
      $message.html('<div class="alert alert-danger mb-0">Please fill in all required fields.</div>');
      return;
    }
    
    // Show loading state
    $btn.prop('disabled', true);
    $spinner.removeClass('d-none');
    $submitText.text('Submitting...');
    $message.html('');
    
    try {
      if (typeof api !== 'undefined' && api.createTestimonial) {
        await api.createTestimonial(name, role, email, quote, rating);
        $message.html('<div class="alert alert-success mb-0"><strong>Thank you!</strong> Your testimonial has been submitted and will be reviewed before being published.</div>');
        $form[0].reset();
        
        // Close modal after 2 seconds on success
        setTimeout(() => {
          const modal = bootstrap.Modal.getInstance($modal[0]);
          if (modal) modal.hide();
          $message.html('');
        }, 2000);
      } else {
        // Fallback if API is not available
        $message.html('<div class="alert alert-warning mb-0">Thank you for your testimonial! Please contact me directly to submit it.</div>');
      }
    } catch (error) {
      console.error('Testimonial submission error:', error);
      $message.html(`<div class="alert alert-danger mb-0"><strong>Error:</strong> ${error.message || 'Failed to submit testimonial. Please try again later.'}</div>`);
    } finally {
      $btn.prop('disabled', false);
      $spinner.addClass('d-none');
      $submitText.text('Submit Testimonial');
    }
  });
  
  // Reset form when modal is closed
  $('#testimonialModal').on('hidden.bs.modal', function() {
    $('#testimonial-form')[0].reset();
    $('#testimonial-message').html('');
  });
});

// auto-run
$(function(){ loadTestimonials(); });


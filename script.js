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
  
  // Create backdrop element if it doesn't exist
  let $backdrop = $('.menu-backdrop');
  if ($backdrop.length === 0) {
    $backdrop = $('<div class="menu-backdrop"></div>');
    $body.append($backdrop);
  }
  
  // Handle menu show
  $navbarCollapse.on('show.bs.collapse', function() {
    if (window.innerWidth < 992) {
      $body.addClass('menu-open');
      $backdrop.addClass('show');
      // Reset animations for menu items
      $('.navbar-collapse .nav-item').css('animation', 'none');
      setTimeout(function() {
        $('.navbar-collapse .nav-item').css('animation', '');
      }, 10);
    }
  });
  
  // Handle menu hide
  $navbarCollapse.on('hide.bs.collapse', function() {
    $body.removeClass('menu-open');
    $backdrop.removeClass('show');
  });
  
  // Handle menu shown (after animation)
  $navbarCollapse.on('shown.bs.collapse', function() {
    if (window.innerWidth < 992) {
      $navbarCollapse.addClass('show');
    }
  });
  
  // Handle menu hidden (after animation)
  $navbarCollapse.on('hidden.bs.collapse', function() {
    $navbarCollapse.removeClass('show');
  });
  
  // Close menu when clicking backdrop
  $backdrop.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (window.innerWidth < 992) {
      $navbarCollapse.collapse('hide');
    }
  });
  
  // Close menu when clicking nav links on mobile
  $(document).on('click', '.navbar-collapse .nav-link', function() {
    if (window.innerWidth < 992) {
      setTimeout(function() {
        $navbarCollapse.collapse('hide');
      }, 100);
    }
  });
  
  // Close menu when clicking close button
  $(document).on('click', '.menu-close-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (window.innerWidth < 992) {
      $navbarCollapse.collapse('hide');
    }
  });
  
  // Handle window resize
  $(window).on('resize', function() {
    if (window.innerWidth >= 992) {
      $body.removeClass('menu-open');
      $backdrop.removeClass('show');
      if ($navbarCollapse.hasClass('show')) {
        $navbarCollapse.removeClass('show');
      }
    }
  });
  
  // ---------- Smooth scroll for anchor links ----------
  $('a[href^="#"]').on('click', function(e) {
    const href = this.getAttribute('href');
    // Only handle anchor links on the same page
    if (href.includes('#') && href.startsWith('#')) {
      const target = $(href);
      if (target.length) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: target.offset().top - 70 }, 600);
        // collapse navbar on mobile after click
        $('.navbar-collapse').collapse('hide');
      }
    }
  });

  // ---------- Active nav link on scroll ----------
  const sections = $('section[id], header#home');
  function updateActiveNav() {
    const pos = $(window).scrollTop() + 80;
    let currentId = null;
    sections.each(function() {
      const top = $(this).offset().top;
      if (pos >= top) { currentId = $(this).attr('id'); }
    });
    $('.navbar .nav-link').removeClass('active');
    if (currentId) $('.navbar .nav-link[href="#' + currentId + '"]').addClass('active');
  }
  $(window).on('scroll resize', updateActiveNav);
  updateActiveNav();

 
  function loadProjects() {
  
    const projects = [
      { id: 'legnapath', title: "LegnaPath Mentorship Platform", year: "2025", desc: "Mentorship features, match-making and micro-payments.", img: "assets/projects/legnapath.png", tags:['web'], collab:'team' },
      { id: 'custom-user-form', title: "Custom User Form Plugin", year: "2025", desc: "Shortcode based capture & management.", img: "assets/projects/custom-user-form.png", tags:['wp'], collab:'solo' },
      { id: 'food-ordering', title: "Food Ordering System", year: "2025", desc: "Ordering web app with guest checkout.", img: "assets/projects/food-ordering.png", tags:['web','mobile'], collab:'team' },
      { id: 'memory-maze', title: "Memory Maze", year: "2025", desc: "Interactive memory game and book unlocks.", img: "assets/projects/memory-maze.png", tags:['game'], collab:'solo' },
      { id: 'cookbook', title: "CookBook Pro", year: "2025", desc: "Recipe training web app.", img: "assets/projects/cookbook.png", tags:['web'], collab:'solo' },
      { id: 'waste-collection', title: "Waste Collection App", year: "2025", desc: "Localized waste collection planning and mapping.", img: "assets/projects/waste-collection.png", tags:['web','mobile'], collab:'team' },
      { id: 'freelance-dire', title: "Freelance Dire", year: "2025", desc: "Student hiring platform & community features.", img: "assets/projects/freelance-dire.png", tags:['web'], collab:'team' },
      { id: 'keyboard-crush', title: "Keyboard Crush Pro", year: "2025", desc: "Typing speed and accuracy test platform.", img: "assets/projects/keyboard-crush.png", tags:['web','game'], collab:'solo' },
      { id: 'java-delivery', title: "Online Food Delivery (Java)", year: "2025", desc: "OOP simulation of delivery process.", img: "assets/projects/java-delivery.png", tags:['java'], collab:'solo' },
      { id: 'memory-reading', title: "Memory Based Reading System", year: "2025", desc: "Book unlocking app based on recall.", img: "assets/projects/memory-reading.png", tags:['web'], collab:'solo' }
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
              <span class="badge badge-collab ${p.collab==='team' ? 'team' : 'solo'}">${p.collab==='team' ? 'Team' : 'Individual'}</span>
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
            <a class="btn btn-outline-secondary" href="#" onclick="return false;">View Repository</a>
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
    let html = '<div class="row g-4">';
    skills.forEach((s, i) => {
      html += `
        <div class="col-md-6">
          <div class="skill-entry" data-percent="${s.percent}">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold skill-name">${s.name}</span>
              <span class="percent-value">0%</span>
            </div>
            <div class="skill-progress progress">
              <div class="progress-bar" role="progressbar" style="width:0%" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    $col.html(html);

    const container = document.querySelector('#skills-column');
    const entries = container.querySelectorAll('.skill-entry');

    function animateAll() {
      entries.forEach((el, i) => {
        setTimeout(() => {
          const $el = $(el);
          $el.addClass('visible');
          const p = Number($el.data('percent')) || 0;
          const $bar = $el.find('.progress-bar');
          const $label = $el.find('.percent-value');

         
          $bar[0].offsetWidth;
          $bar.css('width', p + '%').attr('aria-valuenow', p);

          $({ val: 0 }).animate({ val: p }, {
            duration: 900,
            easing: 'swing',
            step(now){ $label.text(Math.floor(now) + '%'); },
            complete(){ $label.text(p + '%'); }
          });
        }, i * 130);
      });
    }

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entriesObs, o) => {
        entriesObs.forEach(en => {
          if (en.isIntersecting) {
            animateAll();
            o.disconnect();
          }
        });
      }, { threshold: 0.25 });
      obs.observe(container);
    } else {
     
      setTimeout(animateAll, 400);
    }
  }

 
  function animateCounter($el, to) {
    $({ val: 0 }).animate({ val: to }, {
      duration: 900,
      easing: 'swing',
      step(now){ $el.text(Math.floor(now)); },
      complete(){ $el.text(to); }
    });
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
window.initThemeToggle = function() {
  const $toggle = $('#theme-toggle');
  const $body = $('body');
  
  // Only proceed if toggle button exists
  if ($toggle.length === 0) {
    return;
  }
  
  // Remove any existing handlers to prevent duplicates
  $toggle.off('click.theme-toggle');
  
  // Initialize theme from localStorage
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
        }
      }
      
      if (saved === 'dark-mode') {
        $body.addClass('dark-mode');
        $toggle.text('☀️');
      } else {
        $body.removeClass('dark-mode');
        $toggle.text('🌙');
      }
    } catch(e) {
      console.error('Theme initialization error:', e);
    }
  }
  
  // Initialize on load
  initTheme();

  // Toggle handler with namespace to prevent conflicts
  $toggle.on('click.theme-toggle', function(){
    const isDark = $body.toggleClass('dark-mode').hasClass('dark-mode');
    $toggle.text(isDark ? '☀️' : '🌙');
    try { 
      localStorage.setItem('theme', isDark ? 'dark-mode' : 'light-mode');
      localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
    } catch(e){
      console.error('Theme save error:', e);
    }
  });
};

// Auto-initialize on pages that include script.js
$(function(){
  if (typeof window.initThemeToggle === 'function') {
    window.initThemeToggle();
  }
});


$(function() {
 
  (function typingEffect() {
    const text = "Welcome to My Portfolio";
    const $target = $('#typed-text');
    const $cursor = $('.typed-cursor');
    if (!$target.length) return;
    let i = 0;
    const speed = 55; 
    $target.text(''); $cursor.show();
    const typer = setInterval(() => {
      $target.text($target.text() + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(typer);
      
        setTimeout(() => $cursor.fadeOut(600), 700);
      }
    }, speed);
  })();

 
  (function parallaxIllustration() {
    const $hero = $('.hero');
    const $par = $('.parallax');
    if (!$hero.length || !$par.length) return;

    let raf = null;
    let lastX = 0, lastY = 0;

    function updateTransform() {
      // gentle easing toward target
      const tx = lastX;
      const ty = lastY;
      // scale down the movement a bit
      $par.css('transform', `translate3d(${tx}px, ${ty}px, 0) rotate(${tx * 0.08}deg)`);
      raf = null;
    }

    function onPointerMove(e) {
      const rect = $hero[0].getBoundingClientRect();
      // use clientX/clientY for mouse and touch (pointer events handled)
      const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || (rect.left + rect.width/2);
      const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || (rect.top + rect.height/2);
      const px = (x - rect.left) / rect.width - 0.5; // -0.5..0.5
      const py = (y - rect.top) / rect.height - 0.5;
      // target offsets (px * scale)
      lastX = px * 26; // horizontal movement
      lastY = py * 10; // vertical movement
      if (!raf) raf = requestAnimationFrame(updateTransform);
    }

    function resetParallax() {
      lastX = 0; lastY = 0;
      if (!raf) raf = requestAnimationFrame(updateTransform);
    }

    // pointer events (covers mouse + touch)
    $hero.on('pointermove', onPointerMove);
    $hero.on('pointerleave pointercancel', resetParallax);
    // Also add touch handlers for older devices
    $hero.on('touchmove', onPointerMove);
    $hero.on('touchend touchcancel', resetParallax);
  })();
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

// Animate & reveal services with IntersectionObserver + small pointer tilt
(function servicesRevealAndTilt() {
  const serviceCards = Array.from(document.querySelectorAll('.service-card'));
  if (!serviceCards.length) return;

  // IntersectionObserver to add .visible with small stagger
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // reveal children with stagger
          const cards = Array.from(document.querySelectorAll('.service-card'));
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 120);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.18 });
    obs.observe(document.querySelector('#services') || document.body);
  } else {
    // fallback: reveal after short delay
    setTimeout(() => serviceCards.forEach((c,i) => setTimeout(()=>c.classList.add('visible'), i*120)), 300);
  }

  // Pointer/touch tilt for each card (subtle)
  serviceCards.forEach(card => {
    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const clientX = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY);
      if (!clientX) return;
      const px = (clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const py = (clientY - rect.top) / rect.height - 0.5;
      const rx = (-py * 6).toFixed(2); // rotateX
      const ry = (px * 6).toFixed(2);  // rotateY
      const sx = 1.008;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0) scale(${sx})`;
      card.classList.add('tilt');
    }
    function onLeave() {
      card.style.transform = '';
      card.classList.remove('tilt');
    }
    card.addEventListener('pointermove', onMove, { passive: true });
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('touchmove', onMove, { passive: true });
    card.addEventListener('touchend', onLeave);
  });
})();

// About section enhanced animations: photo float + pointer parallax and staggered text reveal
(function aboutPhotoAndTextAnimation() {
  const aboutEl = document.getElementById('about');
  if (!aboutEl) return;

  const photo = aboutEl.querySelector('.profile-img') || aboutEl.querySelector('.about-photo') || null;
  const textContainer = aboutEl.querySelector('.about-reveal') || aboutEl; // fallback
  // build list of text nodes to animate: heading, paragraphs, timeline items, stats
  const textItems = [];
  const heading = aboutEl.querySelector('h2');
  if (heading) textItems.push(heading);
  const paragraphs = Array.from(aboutEl.querySelectorAll('p'));
  paragraphs.forEach(p => textItems.push(p));
  const timelineItems = Array.from(aboutEl.querySelectorAll('.timeline li'));
  timelineItems.forEach(li => textItems.push(li));
  const stats = Array.from(aboutEl.querySelectorAll('.stat-number'));
  stats.forEach(s => textItems.push(s));

  // ensure elements have helper classes for CSS
  textItems.forEach(el => el.classList.add('text-reveal'));

  // IntersectionObserver trigger
  const obs = ('IntersectionObserver' in window) ? new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // photo: add float + visible
      if (photo) {
        photo.classList.add('float', 'visible');
      }

      // stagger text reveal
      textItems.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 110);
      });

      // initialize a simple pointer parallax on the photo (mouse + touch)
      if (photo) {
        let raf = null;
        let lastX = 0, lastY = 0;
        function update() {
          photo.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) rotate(${lastX * 0.06}deg)`;
          raf = null;
        }
        function onPointer(e) {
          const rect = aboutEl.getBoundingClientRect();
          const x = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX);
          const y = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY);
          if (x == null || y == null) return;
          const px = (x - rect.left) / rect.width - 0.5;
          const py = (y - rect.top) / rect.height - 0.5;
          lastX = px * 16;
          lastY = py * 8;
          if (!raf) raf = requestAnimationFrame(update);
        }
        function reset() {
          lastX = 0; lastY = 0;
          if (!raf) raf = requestAnimationFrame(update);
        }
        aboutEl.addEventListener('pointermove', onPointer);
        aboutEl.addEventListener('pointerleave', reset);
        aboutEl.addEventListener('touchmove', onPointer, { passive: true });
        aboutEl.addEventListener('touchend', reset);
      }

      observer.disconnect();
    });
  }, { threshold: 0.2 }) : null;

  if (obs) {
    obs.observe(aboutEl);
  } else {
    // fallback: run animations after short delay
    setTimeout(() => {
      if (photo) photo.classList.add('float','visible');
      textItems.forEach((el,i) => setTimeout(()=>el.classList.add('visible'), i*110));
    }, 300);
  }
})();

// reveal hero inner and quote when hero is visible
(function revealHeroQuote() {
  const hero = document.getElementById('home');
  if (!hero) return;
  const quote = hero.querySelector('.hero-quote');
  const inner = hero.querySelector('.hero-inner');
  if (!('IntersectionObserver' in window)) {
    if (quote) quote.classList.add('visible');
    if (inner) inner.classList.add('visible');
    return;
  }
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        if (quote) quote.classList.add('visible');
        if (inner) inner.classList.add('visible');
        o.disconnect();
      }
    });
  }, { threshold: 0.2 });
  obs.observe(hero);
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

  // apply random rotation/offset and reveal
  const items = Array.from(document.querySelectorAll('#stack-grid .stack-item'));
  const isMobile = window.innerWidth <= 576;
  const gridRect = $grid[0]?.getBoundingClientRect();
  const gridWidth = isMobile && gridRect ? gridRect.width - 40 : 0;
  const gridHeight = isMobile && gridRect ? Math.max(600, items.length * 100) : 0;
  
  // Track placed items for overlap detection on mobile
  const placedItems = [];
  
  items.forEach((el,i) => {
    const rot = (Math.random()*16 - 8).toFixed(2);
    let tx, ty;
    
    if (isMobile) {
      // Random positioning on mobile with overlap avoidance, keeping items close together
      const itemWidth = el.classList.contains('size-lg') ? 110 : el.classList.contains('size-md') ? 90 : 70;
      const itemHeight = itemWidth;
      
      // Use a tighter container area to keep items grouped
      const containerPadding = 20;
      const maxX = Math.max(0, gridWidth - itemWidth - containerPadding * 2);
      const maxY = Math.max(0, gridHeight - itemHeight - containerPadding * 2);
      
      // If no items placed yet, start from a central/random position
      if (placedItems.length === 0) {
        tx = containerPadding + Math.random() * Math.min(maxX, 200); // Keep first items in a smaller area
        ty = containerPadding + Math.random() * Math.min(maxY, 300);
      } else {
        // For subsequent items, try placing near existing items
        const baseItem = placedItems[Math.floor(Math.random() * placedItems.length)];
        const clusterRadius = 150; // Maximum distance from base item
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * clusterRadius;
        
        tx = baseItem.x + Math.cos(angle) * distance;
        ty = baseItem.y + Math.sin(angle) * distance;
        
        // Constrain to grid bounds
        tx = Math.max(containerPadding, Math.min(maxX + containerPadding, tx));
        ty = Math.max(containerPadding, Math.min(maxY + containerPadding, ty));
      }
      
      // Try to find a non-overlapping position near the calculated position
      let attempts = 0;
      let foundPosition = false;
      const searchRadius = 80; // Smaller search radius for tighter grouping
      
      while (attempts < 30 && !foundPosition) {
        if (attempts > 0) {
          // Slightly randomize position if first attempt overlapped
          const offsetX = (Math.random() - 0.5) * searchRadius;
          const offsetY = (Math.random() - 0.5) * searchRadius;
          tx = Math.max(containerPadding, Math.min(maxX + containerPadding, tx + offsetX));
          ty = Math.max(containerPadding, Math.min(maxY + containerPadding, ty + offsetY));
        }
        
        // Check for overlaps with already placed items (reduced padding for closer placement)
        const overlaps = placedItems.some(placed => {
          const dx = Math.abs(tx - placed.x);
          const dy = Math.abs(ty - placed.y);
          const minDistance = (itemWidth + placed.width) / 2 + 5; // Reduced from 10px to 5px padding
          return dx < minDistance && dy < minDistance;
        });
        
        if (!overlaps) {
          foundPosition = true;
          placedItems.push({ x: tx, y: ty, width: itemWidth, height: itemHeight });
        }
        attempts++;
      }
      
      // If still overlapping after attempts, use the position anyway (they'll be close)
      if (!foundPosition) {
        placedItems.push({ x: tx, y: ty, width: itemWidth, height: itemHeight });
      }
      
      el.style.left = tx.toFixed(1) + 'px';
      el.style.top = ty.toFixed(1) + 'px';
      el.style.transform = `rotate(${rot}deg) scale(.98)`;
    } else {
      // Desktop: subtle offset
      tx = (Math.random()*14 - 7).toFixed(1);
      ty = (Math.random()*10 - 5).toFixed(1);
      el.style.transform = `translate3d(${tx}px, ${ty}px,0) rotate(${rot}deg) scale(.98)`;
    }
    
    el.setAttribute('data-rot', rot);

    setTimeout(() => {
      el.classList.add('visible');
      if (isMobile) {
        // Mobile: settle to lighter rotation
        const sRot = (rot * 0.45).toFixed(2);
        el.style.transition = 'transform 650ms cubic-bezier(.2,.9,.3,1), box-shadow .28s';
        el.style.transform = `rotate(${sRot}deg) scale(1)`;
      } else {
        // Desktop: settle to lighter offset
        const sTx = (tx * 0.45).toFixed(1), sTy = (ty * 0.45).toFixed(1), sRot = (rot * 0.45).toFixed(2);
        el.style.transition = 'transform 650ms cubic-bezier(.2,.9,.3,1), box-shadow .28s';
        el.style.transform = `translate3d(${sTx}px, ${sTy}px,0) rotate(${sRot}deg) scale(1)`;
      }
      setTimeout(()=> el.classList.add('float'), 600 + i*40);
    }, 120 + i*80);
  });
  
  // Update grid height on mobile
  if (isMobile && gridRect) {
    const maxBottom = Math.max(...items.map(el => {
      const rect = el.getBoundingClientRect();
      return rect.bottom - gridRect.top;
    }));
    if (maxBottom > 0) {
      $grid[0].style.minHeight = (maxBottom + 40) + 'px';
    }
  }

  // pointer parallax / tilt
  items.forEach(item => {
    let raf=null, tx=0, ty=0;
    const isMobileItem = window.innerWidth <= 576;
    function apply(){ 
      const base = parseFloat(item.getAttribute('data-rot')||'0');
      if (isMobileItem) {
        item.style.transform = `rotate(${(base + (tx*0.12)).toFixed(2)}deg) scale(1.02)`;
      } else {
        item.style.transform = `translate3d(${tx}px, ${ty}px,0) rotate(${(base + (tx*0.12)).toFixed(2)}deg) scale(1.02)`;
      }
      raf=null; 
    }
    function onMove(e){
      const rect=item.getBoundingClientRect();
      const cx = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX);
      const cy = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY);
      if (cx==null) return;
      const px=(cx - rect.left)/rect.width - 0.5;
      const py=(cy - rect.top)/rect.height - 0.5;
      tx = px*10; ty = py*6;
      if(!raf) raf=requestAnimationFrame(apply);
    }
    function onLeave(){
      const baseRot = parseFloat(item.getAttribute('data-rot')||'0') * 0.45;
      item.style.transition = 'transform 500ms cubic-bezier(.2,.9,.3,1)';
      if (isMobileItem) {
        item.style.transform = `rotate(${baseRot}deg) scale(1)`;
      } else {
        item.style.transform = `translate3d(0px,0px,0) rotate(${baseRot}deg) scale(1)`;
      }
    }
    item.addEventListener('pointermove', onMove, { passive:true });
    item.addEventListener('pointerleave', onLeave);
    item.addEventListener('touchmove', onMove, { passive:true });
    item.addEventListener('touchend', onLeave);

    item.addEventListener('click', function(){ $(this).addClass('clicked'); setTimeout(()=> $(this).removeClass('clicked'),420); });
  });
  
  // Handle window resize - recalculate positions on mobile
  let resizeTimeout;
  $(window).on('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      if (window.innerWidth <= 576) {
        // Recalculate positions on mobile resize using clustering approach
        const gridRect = $grid[0]?.getBoundingClientRect();
        if (gridRect) {
          const gridWidth = gridRect.width - 40;
          const gridHeight = Math.max(400, items.length * 80); // Reduced height
          const containerPadding = 20;
          
          const resizePlacedItems = [];
          items.forEach((el, i) => {
            const itemWidth = el.classList.contains('size-lg') ? 110 : el.classList.contains('size-md') ? 90 : 70;
            const maxX = Math.max(0, gridWidth - itemWidth - containerPadding * 2);
            const maxY = Math.max(0, gridHeight - itemWidth - containerPadding * 2);
            
            let tx, ty;
            if (resizePlacedItems.length === 0) {
              tx = containerPadding + Math.random() * Math.min(maxX, 200);
              ty = containerPadding + Math.random() * Math.min(maxY, 250);
            } else {
              const baseItem = resizePlacedItems[Math.floor(Math.random() * resizePlacedItems.length)];
              const clusterRadius = 150;
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * clusterRadius;
              
              tx = baseItem.x + Math.cos(angle) * distance;
              ty = baseItem.y + Math.sin(angle) * distance;
              tx = Math.max(containerPadding, Math.min(maxX + containerPadding, tx));
              ty = Math.max(containerPadding, Math.min(maxY + containerPadding, ty));
            }
            
            resizePlacedItems.push({ x: tx, y: ty, width: itemWidth, height: itemWidth });
            el.style.left = tx.toFixed(1) + 'px';
            el.style.top = ty.toFixed(1) + 'px';
          });
        }
      }
    }, 250);
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
      <div id="clientsMobileCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="2800">
        <div class="carousel-inner">${slides.join('')}</div>
      </div>`;
    $carousel.html(carouselHtml);
    // bootstrap auto-init happens via data attributes; ensure instance
    const el = document.getElementById('clientsMobileCarousel');
    if (el) bootstrap.Carousel.getOrCreateInstance(el, { interval: 2800 });
  }

  // Stagger reveal and pointer tilt for desktop grid
  const tiles = Array.from(document.querySelectorAll('#clients-grid .client-tile'));
  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add('revealed');
      // small pointer tilt
      tile.addEventListener('pointermove', function(e){
        const rect = tile.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width - 0.5);
        const py = ((e.clientY - rect.top) / rect.height - 0.5);
        tile.style.transform = `perspective(700px) rotateX(${(-py*6).toFixed(2)}deg) rotateY(${(px*6).toFixed(2)}deg) translateZ(0)`;
      }, { passive:true });
      tile.addEventListener('pointerleave', function(){ tile.style.transform=''; });
    }, 120 + i * 70);
  });

  // marquee infinite loop (CSS-free JS small loop)
  if ($marquee.length) {
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

  // init carousel with automatic sliding from right to left
  const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselRoot, {
    interval: 4200,
    ride: true, // Enable automatic sliding
    pause: 'hover', // Pause on hover
    keyboard: true,
    touch: true,
    wrap: true // Loop back to first slide
  });

  // reveal testimonial-cards when the testimonials section scrolls into view
  const cards = Array.from(carouselRoot.querySelectorAll('.testimonial-card'));
  cards.forEach(c => c.classList.remove('visible'));

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          carouselRoot.classList.add('in-view');
          cards.forEach((c, i) => setTimeout(() => c.classList.add('visible'), i * 140));
          observer.disconnect();
        }
      });
    }, { threshold: 0.18 });
    obs.observe(carouselRoot);
  } else {
    setTimeout(() => cards.forEach((c, i) => setTimeout(() => c.classList.add('visible'), i * 140)), 240);
  }
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


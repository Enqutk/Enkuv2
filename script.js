/* Custom interactions (jQuery)
   - Smooth scrolling
   - Active nav highlighting on scroll
   - Projects + skills rendering
   - Contact form demo (no backend)
   - Simple counters and carousel init
*/

$(function() {
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
      { id: 'agripedia', title: "Agripedia Term Management Plugin", year: "2024", desc: "WordPress plugin with admin UI and taxonomy features.", img: "assets/projects/agripedia.png", tags:['wp','web'], collab:'team' },
      { id: 'legnapath', title: "LegnaPath Mentorship Platform", year: "2024", desc: "Mentorship features, match-making and micro-payments.", img: "assets/projects/legnapath.png", tags:['web'], collab:'team' },
      { id: 'custom-user-form', title: "Custom User Form Plugin", year: "2023", desc: "Shortcode based capture & management.", img: "assets/projects/custom-user-form.png", tags:['wp'], collab:'solo' },
      { id: 'food-ordering', title: "Food Ordering System", year: "2023", desc: "Ordering web app with guest checkout.", img: "assets/projects/food-ordering.png", tags:['web','mobile'], collab:'team' },
      { id: 'memory-maze', title: "Memory Maze", year: "2022", desc: "Interactive memory game and book unlocks.", img: "assets/projects/memory-maze.png", tags:['game'], collab:'solo' },
      { id: 'cookbook', title: "CookBook Pro", year: "2023", desc: "Recipe training web app.", img: "assets/projects/cookbook.png", tags:['web'], collab:'solo' },
      { id: 'waste-collection', title: "Waste Collection App", year: "2024", desc: "Localized waste collection planning and mapping.", img: "assets/projects/waste-collection.png", tags:['web','mobile'], collab:'team' },
      { id: 'freelance-dire', title: "Freelance Dire", year: "2024", desc: "Student hiring platform & community features.", img: "assets/projects/freelance-dire.png", tags:['web'], collab:'team' },
      { id: 'keyboard-crush', title: "Keyboard Crush Pro", year: "2022", desc: "Typing speed and accuracy test platform.", img: "assets/projects/keyboard-crush.png", tags:['web','game'], collab:'solo' },
      { id: 'java-delivery', title: "Online Food Delivery (Java)", year: "2021", desc: "OOP simulation of delivery process.", img: "assets/projects/java-delivery.png", tags:['java'], collab:'solo' },
      { id: 'memory-reading', title: "Memory Based Reading System", year: "2022", desc: "Book unlocking app based on recall.", img: "assets/projects/memory-reading.png", tags:['web'], collab:'solo' }
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
            <a class="btn btn-gold" href="#" onclick="return false;">View Live Demo</a>
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
    let html = '<h5 class="skills-heading">Skills</h5>';
    skills.forEach((s, i) => {
      html += `
        <div class="skill-entry mb-3" data-percent="${s.percent}">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <small class="fw-semibold">${s.name}</small><small class="text-muted percent-value">0%</small>
          </div>
          <div class="skill-progress progress">
            <div class="progress-bar" role="progressbar" style="width:0%" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      `;
    });
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
    // Experience years doesn't need animation (already set to 5+)
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


$(function(){
  const $toggle = $('#theme-toggle');
  const $body = $('body');
  // Initialize from saved preference
  try {
    const saved = localStorage.getItem('theme_preference'); // 'dark' | 'light' | null
    if (saved === 'dark') {
      $body.addClass('dark-mode');
      $toggle.text('☀️');
    } else {
      $toggle.text('🌙');
    }
  } catch(e){}

  // Toggle handler
  $toggle.on('click', function(){
    const isDark = $body.toggleClass('dark-mode').hasClass('dark-mode');
    // Update icon
    $toggle.text(isDark ? '☀️' : '🌙');
    // Persist
    try { localStorage.setItem('theme_preference', isDark ? 'dark' : 'light'); } catch(e){}
  });
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
  items.forEach((el,i) => {
    const rot = (Math.random()*16 - 8).toFixed(2);
    const tx  = (Math.random()*14 - 7).toFixed(1);
    const ty  = (Math.random()*10 - 5).toFixed(1);
    el.style.transform = `translate3d(${tx}px, ${ty}px,0) rotate(${rot}deg) scale(.98)`;
    el.setAttribute('data-rot', rot);

    setTimeout(() => {
      el.classList.add('visible');
      // settle to lighter offset
      const sTx = (tx * 0.45).toFixed(1), sTy = (ty * 0.45).toFixed(1), sRot = (rot * 0.45).toFixed(2);
      el.style.transition = 'transform 650ms cubic-bezier(.2,.9,.3,1), box-shadow .28s';
      el.style.transform = `translate3d(${sTx}px, ${sTy}px,0) rotate(${sRot}deg) scale(1)`;
      setTimeout(()=> el.classList.add('float'), 600 + i*40);
    }, 120 + i*80);
  });

  // pointer parallax / tilt
  items.forEach(item => {
    let raf=null, tx=0, ty=0;
    function apply(){ const base = parseFloat(item.getAttribute('data-rot')||'0'); item.style.transform = `translate3d(${tx}px, ${ty}px,0) rotate(${(base + (tx*0.12)).toFixed(2)}deg) scale(1.02)`; raf=null; }
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
      item.style.transform = `translate3d(0px,0px,0) rotate(${baseRot}deg) scale(1)`;
    }
    item.addEventListener('pointermove', onMove, { passive:true });
    item.addEventListener('pointerleave', onLeave);
    item.addEventListener('touchmove', onMove, { passive:true });
    item.addEventListener('touchend', onLeave);

    item.addEventListener('click', function(){ $(this).addClass('clicked'); setTimeout(()=> $(this).removeClass('clicked'),420); });
  });
}

// call loader on DOM ready
$(function(){ loadStack(); });

// Clients & Partners loader
function loadClients() {
  const clients = [
    { id:'abol', name:'ABOL Solution', img:'assets/clients/logo-abol.png', featured:true, website:'#', desc:'Partner on local web tools and outreach.' },
    { id:'agripedia', name:'Agripedia', img:'assets/clients/logo-1.png', featured:true, website:'#', desc:'Content & taxonomy integrations.' },
    { id:'ddu', name:'DDU ICT Club', img:'assets/clients/logo-2.png', featured:false, website:'#', desc:'University club & mentorship.' },
    { id:'client3', name:'Client 3', img:'assets/clients/logo-3.png', featured:false, website:'#', desc:'Design & development collaboration.' }
  ];

  const $grid = $('#clients-grid');
  const $marquee = $('#marquee-track');
  const $carousel = $('#clients-carousel');
  $grid.empty(); $marquee.empty(); $carousel.empty();

  // Build grid columns
  clients.forEach(c => {
    const col = $(`
      <div class="col-6 col-sm-4 col-md-3 client-col">
        <div class="client-tile" data-id="${c.id}">
          <img class="client-logo" src="${c.img}" alt="${c.name}">
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
      <img src="${info.img}" class="partner-logo" alt="${info.name}">
      <h5 class="fw-bold">${info.name}</h5>
      <p class="partner-desc">${info.desc}</p>
      <div class="mt-3"><a class="btn btn-outline-secondary" href="${info.website}" target="_blank">Visit site</a></div>
    `;
    $('#partner-modal-content').html(html);
    const modal = new bootstrap.Modal(document.getElementById('partnerModal'), {});
    modal.show();
  });
}

// call clients loader
$(function(){ loadClients(); });

// Testimonials loader -> Bootstrap fade carousel (single centered card, indicators, keyboard support)
function loadTestimonials() {
  const testimonials = [
    { name: 'Dr. Alemu', role: 'Professor • Debre Tabor Univ', avatar: 'assets/testimonials/person1.jpg', quote: "Enku delivered reliable tools for our department and mentored students with patience and skill.", rating:5 },
    { name: 'Sara Bekele', role: 'Product Lead • ABOL', avatar: 'assets/testimonials/person2.jpg', quote: "Clear thinking, fast prototyping — the project exceeded expectations.", rating:5 },
    { name: 'Mekdes Y', role: 'Community Organizer', avatar: 'assets/testimonials/person3.jpg', quote: "Practical solutions and great local impact — highly recommended.", rating:4 },
    { name: 'Tadesse K', role: 'Client', avatar: 'assets/testimonials/person4.jpg', quote: "Reliable, communicative, and thoughtful about UX.", rating:5 },

    // new entries requested
    { name: 'Kaleb Getachew', role: 'CEO • ABOL Solution', avatar: 'assets/testimonials/kaleb-getachew.jpg', quote: "Strategic, reliable and fast — Enku is a pleasure to work with.", rating:5 },
    { name: 'Yeabsira Endale', role: 'Lead • ICT Club / CTO • AOL Solution', avatar: 'assets/testimonials/yeabsira-endale.jpg', quote: "Provided great technical leadership and mentored our team effectively.", rating:5 },
    { name: 'Kaleb Abebe', role: 'Client', avatar: 'assets/testimonials/kaleb-abebe.jpg', quote: "Delivered exactly what I needed on time — highly recommended.", rating:4 },
    { name: 'Berket Bahiru', role: 'Core Team Lead • ICT Club', avatar: 'assets/testimonials/berket-bahiru.jpg', quote: "A dependable collaborator and excellent communicator.", rating:5 }
  ];

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
        <div class="col-md-8">
          <div class="testimonial-card d-flex flex-column align-items-stretch">
            <div class="d-flex align-items-center">
              <img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar me-3">
              <div>
                <div class="fw-bold">${t.name}</div>
                <div class="small">${t.role}</div>
              </div>
            </div>
            <div class="testimonial-quote mt-3">“${t.quote}”</div>
            <div class="mt-3 testimonial-stars" aria-hidden="true">${stars}</div>
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

  // add fade class for smooth crossfade
  carouselRoot.classList.add('carousel-fade');

  // init carousel with moderate speed and keyboard control
  const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselRoot, {
    interval: 4200,
    ride: false,
    pause: 'hover',
    keyboard: true,
    touch: true
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

// auto-run
$(function(){ loadTestimonials(); });


document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Menú mobile ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('menu');
  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-header')) closeMenu();
  });

  /* ---------- CTAs "Entre em contato" -> formulario ---------- */
  const form = document.getElementById('lead-form');
  document.querySelectorAll('a[href="#contato"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('contato').scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => form.elements.nome.focus({ preventScroll: true }), 600);
    });
  });

  /* ---------- Fallback de imágenes faltantes ---------- */
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    const mark = () => img.parentElement.classList.add('img-missing');
    if (img.complete && img.naturalWidth === 0) mark();
    else img.addEventListener('error', mark);
  });

  /* ---------- Formulario ---------- */
  const msg = form.querySelector('.form-msg');
  const btn = form.querySelector('button[type="submit"]');
  const required = form.querySelectorAll('[required]');

  const setMsg = (text, type) => {
    msg.textContent = text;
    msg.className = 'form-msg' + (type ? ' ' + type : '');
  };

  form.querySelectorAll('input, select, textarea').forEach(f => {
    ['input', 'change'].forEach(ev => f.addEventListener(ev, () => f.classList.remove('is-invalid')));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    setMsg('');

    let firstInvalid = null;
    required.forEach(f => {
      const ok = f.checkValidity();
      f.classList.toggle('is-invalid', !ok);
      if (!ok && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      setMsg('Preencha os campos obrigatórios corretamente.', 'err');
      firstInvalid.focus();
      return;
    }

    if (form.elements.website.value) return; // honeypot: bot

    const endpoint = form.dataset.endpoint;
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
      } else {
        // Modo prototipo: no envía nada, solo loguea
        console.info('Lead (protótipo):', Object.fromEntries(new FormData(form)));
        await new Promise(r => setTimeout(r, 600));
      }
      form.reset();
      setMsg('Obrigado! Em breve um especialista entrará em contato.', 'ok');
    } catch (err) {
      console.error(err);
      setMsg('Não foi possível enviar. Tente novamente.', 'err');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar';
    }
  });

  /* ---------- Contadores de stats ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = el => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = prefix + Math.round(target * ease(p)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!reduceMotion && 'IntersectionObserver' in window) {
    counters.forEach(el => {
      el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  }
});
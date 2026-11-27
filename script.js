const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (!document.querySelector('link[rel="icon"]')) {
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = 'favicon.svg';
  document.head.appendChild(favicon);
}

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));

document.querySelectorAll('.footer-contact p').forEach((item) => {
  if (item.textContent.includes('City, Nation')) {
    item.innerHTML = '⌖ Agape Fellowship Center, Mitaboni';
  }
});

const registrationModal = document.querySelector('#registration-modal');
const registrationForm = document.querySelector('#registration-form');

if (registrationModal) {
  const openRegistration = () => {
    registrationModal.classList.add('is-open');
    registrationModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    registrationModal.querySelector('input')?.focus();
  };
  const closeRegistration = () => {
    registrationModal.classList.remove('is-open');
    registrationModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.register').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      openRegistration();
    });
  });
  registrationModal.querySelectorAll('[data-close-registration]').forEach((element) => element.addEventListener('click', closeRegistration));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && registrationModal.classList.contains('is-open')) closeRegistration();
  });
  registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = registrationForm.querySelector('button[type="submit"]');
    const status = registrationForm.querySelector('.registration-status');
    const originalText = submitButton.textContent;
    const formData = new FormData(registrationForm);

    formData.append('access_key', '430034bf-12c4-4f09-abf8-c0999f6b53d8');
    formData.append('subject', 'New HOFIRE Conference Registration');
    formData.append('from_name', 'HOFIRE Conference Registration Form');

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    status.textContent = '';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit registration.');
      }

      status.textContent = 'Thank you! Your registration has been received.';
      registrationForm.reset();
    } catch (error) {
      status.textContent = error.message || 'Something went wrong. Please try again.';
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
}

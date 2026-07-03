/* =============================================================
   ECOTOXICOLOGY LAB — SCRIPT.JS
   -------------------------------------------------------------
   Sections in this file:
   1. Navbar (scroll shadow + mobile menu + smooth scroll)
   2. Scroll-reveal animations
   3. Project "Contribute" buttons -> scroll to contribution form
   4. Contribution form + Contact form (demo submit handling)
   5. Help Center / Chatbot widget (fully editable questions & replies)
============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================================================
     1. NAVBAR: scroll shadow + mobile toggle + smooth scroll
  =========================================================== */
  const navbar   = document.getElementById('navbar');
  const navToggle= document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu after a link is tapped
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  /* ===========================================================
     2. SCROLL-REVEAL ANIMATIONS
     Automatically fades/slides in sections & cards as they enter view.
  =========================================================== */
  const revealTargets = document.querySelectorAll(
    '.about-grid, .supervisor-card, .member-card, .group-photo-wrap, .research-card, .project-card, .contribute-option, .lab-form, .contact-info, .section-head'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => observer.observe(el));

  /* ===========================================================
     2b. ANIMATED STAT COUNTERS
     Numbers in the About section count up from 0 once visible.
     Works with numbers that may end in "+" or "%" (e.g. "7+", "100%").
  =========================================================== */
  const statEls = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const numericPart = parseInt(raw.replace(/\D/g, ''), 10);
      const suffix = raw.replace(/[0-9]/g, ''); // keeps "+", "%", etc.

      if (!isNaN(numericPart)){
        let current = 0;
        const duration = 1000; // ms
        const stepTime = Math.max(Math.floor(duration / numericPart), 20);
        el.textContent = '0' + suffix;

        const timer = setInterval(() => {
          current += 1;
          el.textContent = current + suffix;
          if (current >= numericPart){
            clearInterval(timer);
            el.textContent = numericPart + suffix;
          }
        }, stepTime);
      }
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => statObserver.observe(el));

  /* ===========================================================
     3. PROJECT CARDS -> "Contribute" button
     Scrolls to the contribution form and pre-fills the message box
     with the project name so staff know which project it relates to.
  =========================================================== */
  const contributeMessage = document.getElementById('c-message');
  document.querySelectorAll('.contribute-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectName = btn.dataset.project || '';
      document.getElementById('contribute').scrollIntoView({ behavior: 'smooth' });
      if (contributeMessage && !contributeMessage.value){
        contributeMessage.value = `I'm interested in contributing to: "${projectName}". `;
        contributeMessage.focus();
      }
    });
  });

  /* ===========================================================
     4. FORMS — Contribution form & Contact form
     NOTE: These currently just show a success message (demo only).
     To connect to a real backend / email service, replace the
     "TODO" comment inside each handler with your API call
     (e.g. fetch('/api/contribute', { method:'POST', body:... })).
  =========================================================== */
  function handleDemoSubmit(formId, successId){
    const form = document.getElementById(formId);
    const successMsg = document.getElementById(successId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // TODO: send form data to your server / email service here.
      // Example:
      // fetch('/api/submit', { method: 'POST', body: new FormData(form) });

      successMsg.classList.add('show');
      form.reset();

      setTimeout(() => successMsg.classList.remove('show'), 5000);
    });
  }

  handleDemoSubmit('contributeForm', 'contributeSuccess');
  handleDemoSubmit('contactForm', 'contactSuccess');

  /* ===========================================================
     5. HELP CENTER / CHATBOT WIDGET
     -----------------------------------------------------------
     EDIT HERE:
     - helpTopics: the list of quick-reply buttons + their answers
     - fallbackReply: shown when the user types a free-text question
  =========================================================== */
  const helpTopics = [
    {
      label: "I want to know about the lab",
      reply: "The Ecotoxicology Lab researches environmental pollutants — like fluoride and heavy metals — and how they affect human health and ecosystems, using both field studies and molecular biology. See the 'About' section above for more detail."
    },
    {
      label: "I want to collaborate",
      reply: "Great! Please fill out the contribution form in the 'How You Can Contribute' section and select 'Collaborate with our lab' — our team will get back to you shortly."
    },
    {
      label: "I want to join as a student",
      reply: "Wonderful — we welcome student researchers. Please use the contribution form and select 'Join as student researcher', or email us directly using the Contact section below."
    },
    {
      label: "I want information about projects",
      reply: "You can find our current projects — including fluoride exposure and genetic susceptibility studies — in the 'Lab Projects' section, each with a status label and a Contribute button."
    },
    {
      label: "I want to contact the lab",
      reply: "You can reach us via the Contact section below — email, phone, and a message form are all available there."
    }
  ];

  // Generic fallback reply for free-typed questions
  const fallbackReply = "Thanks for your message! A member of the Ecotoxicology Lab team will follow up with you soon. In the meantime, feel free to browse our Research Areas or Projects sections.";

  const helpWidget  = document.getElementById('helpWidget');
  const helpToggle  = document.getElementById('helpToggle');
  const helpClose   = document.getElementById('helpClose');
  const helpOptions = document.getElementById('helpOptions');
  const helpBody    = document.getElementById('helpBody');
  const helpForm    = document.getElementById('helpForm');
  const helpInput   = document.getElementById('helpInput');

  // Build the quick-reply option buttons from helpTopics above
  helpTopics.forEach(topic => {
    const btn = document.createElement('button');
    btn.className = 'help-option-btn';
    btn.type = 'button';
    btn.textContent = topic.label;
    btn.addEventListener('click', () => {
      appendChatBubble(topic.label, 'user');
      appendChatBubble(topic.reply, 'bot');
    });
    helpOptions.appendChild(btn);
  });

  function appendChatBubble(text, sender){
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender === 'user' ? 'chat-user' : 'chat-bot'}`;
    bubble.textContent = text;
    helpBody.appendChild(bubble);
    helpBody.scrollTop = helpBody.scrollHeight;
  }

  function openHelp(){
    helpWidget.classList.add('open');
    helpToggle.setAttribute('aria-label', 'Close help center');
  }
  function closeHelp(){
    helpWidget.classList.remove('open');
    helpToggle.setAttribute('aria-label', 'Open help center');
  }

  helpToggle.addEventListener('click', () => {
    helpWidget.classList.contains('open') ? closeHelp() : openHelp();
  });
  helpClose.addEventListener('click', closeHelp);

  helpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = helpInput.value.trim();
    if (!question) return;

    appendChatBubble(question, 'user');
    helpInput.value = '';

    // Simple keyword matching against topic labels; falls back to generic reply.
    const match = helpTopics.find(t =>
      question.toLowerCase().includes(t.label.toLowerCase().replace('i want to ', '').split(' ')[0])
    );

    setTimeout(() => {
      appendChatBubble(match ? match.reply : fallbackReply, 'bot');
    }, 400);
  });

  /* ===========================================================
     Footer: auto-update copyright year
  =========================================================== */
  document.getElementById('year').textContent = new Date().getFullYear();

});

// Pipun VPN - Main JavaScript
// FAQ Accordion and Mobile Menu functionality

document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion Toggle
  initFaqAccordion();
  
  // Mobile Menu Toggle
  initMobileMenu();
});

/**
 * Initialize FAQ Accordion functionality
 * Toggles answer visibility when question is clicked
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq__question');
  
  faqQuestions.forEach(function(question) {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isActive = this.classList.contains('active');
      
      // Close all other answers
      faqQuestions.forEach(function(q) {
        q.classList.remove('active');
        if (q.nextElementSibling) {
          q.nextElementSibling.classList.remove('active');
        }
      });
      
      // Toggle current answer
      if (!isActive) {
        this.classList.add('active');
        if (answer) {
          answer.classList.add('active');
        }
      }
    });
  });
}

/**
 * Initialize Mobile Menu functionality
 * Toggles mobile menu visibility
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      const isActive = mobileMenu.classList.contains('active');
      
      if (isActive) {
        mobileMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.add('active');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });
    
    // Close menu when clicking on a link
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
}

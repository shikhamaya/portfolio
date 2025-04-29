// Portfolio website JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('Portfolio website loaded!');
  
  // Navigation functionality
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Prevent default only if it's an anchor link
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Get the target section
        const target = this.getAttribute('href').substring(1);
        
        // Scroll to the target section
        if (target) {
          const targetElement = document.getElementById(target);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      }
    });
  });

  // Intersection Observer for section highlighting
  const sections = document.querySelectorAll('section[id], div[id="case-studies"], div[id="approach"], div[id="impact"]');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find the corresponding nav link and activate it
        const id = entry.target.getAttribute('id');
        const correspondingLink = document.querySelector(`nav a[href="#${id}"]`);
        
        if (correspondingLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    observer.observe(section);
  });

  // Handle case study cards
  const caseStudyCards = document.querySelectorAll('.case-study-card');
  
  caseStudyCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
    });
  });

  // Dynamically set current year in footer copyright
  const footerYear = document.querySelector('footer p');
  if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.textContent = footerYear.textContent.replace('2025', currentYear);
  }
});

// Lazy load images for better performance
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
});

// Create a simple contact form validation (if you add a contact form later)
function validateContactForm() {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  let isValid = true;
  
  if (nameInput && nameInput.value.trim() === '') {
    nameInput.classList.add('error');
    isValid = false;
  } else if (nameInput) {
    nameInput.classList.remove('error');
  }
  
  if (emailInput) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      emailInput.classList.add('error');
      isValid = false;
    } else {
      emailInput.classList.remove('error');
    }
  }
  
  if (messageInput && messageInput.value.trim() === '') {
    messageInput.classList.add('error');
    isValid = false;
  } else if (messageInput) {
    messageInput.classList.remove('error');
  }
  
  return isValid;
}  

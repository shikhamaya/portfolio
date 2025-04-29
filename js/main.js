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

  // SVG loading error handling
  document.querySelectorAll('.artifact-img').forEach(img => {
    img.addEventListener('error', function() {
      console.error('Failed to load image:', this.src);
      this.alt = 'Image failed to load - Please check the file path';
      this.style.height = '100px';
      this.style.display = 'flex';
      this.style.alignItems = 'center';
      this.style.justifyContent = 'center';
      this.style.backgroundColor = '#f8d7da';
      this.style.color = '#721c24';
      this.style.padding = '20px';
      this.style.textAlign = 'center';
      this.style.border = '1px solid #f5c6cb';
      this.style.borderRadius = '4px';
    });
  });

  // Dynamically set current year in footer copyright
  const footerYear = document.querySelector('footer p');
  if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.textContent = footerYear.textContent.replace('2025', currentYear);
  }

  // Fix for SVG display in older browsers
  if (document.querySelector('img[src$=".svg"]')) {
    const fixSVGs = function() {
      document.querySelectorAll('img[src$=".svg"]').forEach(img => {
        const imgID = img.getAttribute('id');
        const imgClass = img.getAttribute('class');
        const imgURL = img.getAttribute('src');
        
        fetch(imgURL)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load SVG (${response.status}): ${imgURL}`);
            }
            return response.text();
          })
          .then(data => {
            // Get the SVG tag, ignore the rest
            const parser = new DOMParser();
            const svg = parser.parseFromString(data, 'image/svg+xml').querySelector('svg');
            
            // Add replaced image's ID to the new SVG
            if (imgID) {
              svg.setAttribute('id', imgID);
            }
            
            // Add replaced image's classes to the new SVG
            if (imgClass) {
              svg.setAttribute('class', imgClass + ' replaced-svg');
            }
            
            // Remove any invalid XML tags
            svg.removeAttribute('xmlns:a');
            
            // Replace image with new SVG
            img.parentNode.replaceChild(svg, img);
          })
          .catch(error => {
            console.error('SVG replacement error:', error);
            // Mark as failed with a placeholder
            img.alt = 'SVG failed to load - Please check file path';
            img.style.backgroundColor = '#f8d7da';
            img.style.padding = '20px';
            img.style.textAlign = 'center';
            img.style.color = '#721c24';
            img.style.border = '1px solid #f5c6cb';
            img.style.borderRadius = '4px';
          });
      });
    };
    
    // Only attempt to fix SVGs on desktop browsers where fetch is available
    if (window.fetch) {
      setTimeout(fixSVGs, 1000); // Give a small delay for page to settle
    }
  }

  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
});

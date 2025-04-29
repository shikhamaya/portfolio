// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    delay: 100
  });
  
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Navigation active state and scroll behavior
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.main-nav a');
  
  // Progress bar for scrolling
  window.onscroll = function() {
    updateProgressBar();
    handleScrollEvents();
  };
  
  // Update progress bar based on scroll position
  function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
  }
  
  // Handle scroll-dependent UI changes
  function handleScrollEvents() {
    // Show/hide back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
    
    // Change nav styles on scroll
    const nav = document.querySelector('.main-nav');
    if (window.pageYOffset > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= (sectionTop - 200)) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === currentSection) {
        link.classList.add('active');
      }
    });
  }
  
  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      } else {
        window.location.href = targetId;
      }
    });
  });
  
  // Back to top button functionality
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Case study card hover effects
  const caseStudyCards = document.querySelectorAll('.case-study-card');
  caseStudyCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Tab system for dashboard
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Hide all tab panes
      const tabPanes = document.querySelectorAll('.tab-pane');
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Show the selected tab pane
      const targetTab = this.getAttribute('data-tab');
      document.getElementById(targetTab).classList.add('active');
    });
  });
  
  // SVG loading error handling
  document.querySelectorAll('.artifact-img').forEach(img => {
    img.addEventListener('error', function() {
      console.error('Failed to load image:', this.src);
      this.alt = 'Image failed to load - Please check the file path';
      this.style.height = '200px';
      this.style.display = 'flex';
      this.style.alignItems = 'center';
      this.style.justifyContent = 'center';
      this.style.backgroundColor = '#f8d7da';
      this.style.color = '#721c24';
      this.style.padding = '20px';
      this.style.textAlign = 'center';
      this.style.border = '1px solid #f5c6cb';
      this.style.borderRadius = '4px';
      
      // Create error message element
      const errorMsg = document.createElement('div');
      errorMsg.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="font-size: 32px; margin-bottom: 10px;"></i>
        <p>Unable to load artifact image.</p>
        <p style="font-size: 12px;">Path: ${this.src}</p>
      `;
      
      // Replace image with error message
      this.parentNode.replaceChild(errorMsg, this);
    });
  });
  
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
          });
      });
    };
    
    // Only attempt to fix SVGs on desktop browsers where fetch is available
    if (window.fetch) {
      setTimeout(fixSVGs, 1000); // Give a small delay for page to settle
    }
  }
  
  // Mobile navigation toggle
  const createMobileNav = () => {
    if (window.innerWidth <= 768) {
      const nav = document.querySelector('.main-nav');
      if (!document.querySelector('.mobile-nav-toggle')) {
        const navToggle = document.createElement('button');
        navToggle.className = 'mobile-nav-toggle';
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        nav.querySelector('.container').prepend(navToggle);
        
        const navMenu = nav.querySelector('ul');
        navMenu.style.display = 'none';
        
        navToggle.addEventListener('click', function() {
          if (navMenu.style.display === 'none') {
            navMenu.style.display = 'flex';
            navToggle.innerHTML = '<i class="fas fa-times"></i>';
          } else {
            navMenu.style.display = 'none';
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
          }
        });
      }
    }
  };
  
  // Check on load and resize
  createMobileNav();
  window.addEventListener('resize', createMobileNav);
  
  // Add CSS for mobile nav
  if (window.innerWidth <= 768) {
    const style = document.createElement('style');
    style.textContent = `
      .mobile-nav-toggle {
        background: transparent;
        border: none;
        color: var(--accent-color);
        font-size: 24px;
        cursor: pointer;
        padding: var(--space-sm);
        display: block;
        margin-left: auto;
      }
      .main-nav .container {
        flex-direction: row;
        flex-wrap: wrap;
        padding: var(--space-sm);
      }
      .main-nav ul {
        flex-direction: column;
        width: 100%;
      }
      .main-nav ul li {
        width: 100%;
        margin: 0;
      }
      .main-nav ul li a {
        display: block;
        padding: var(--space-md);
        border-bottom: 1px solid var(--medium-gray);
      }
    `;
    document.head.appendChild(style);
  }
});

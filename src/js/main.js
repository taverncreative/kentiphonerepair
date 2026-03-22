// Kent iPhone Repair - Main JavaScript
(function(){
  'use strict';

  // Mobile nav toggle
  var toggle = document.querySelector('.header__toggle');
  var nav = document.querySelector('.header__nav');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      nav.classList.toggle('active');
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
    });
  }

  // Services dropdown
  var dropdowns = document.querySelectorAll('.nav-dropdown__trigger');
  dropdowns.forEach(function(trigger){
    trigger.addEventListener('click', function(e){
      e.preventDefault();
      var parent = this.closest('.nav-dropdown');
      parent.classList.toggle('active');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e){
    if(!e.target.closest('.nav-dropdown')){
      document.querySelectorAll('.nav-dropdown.active').forEach(function(d){
        d.classList.remove('active');
      });
    }
  });

  // Close mobile nav on link click
  document.querySelectorAll('.header__nav a:not(.nav-dropdown__trigger)').forEach(function(link){
    link.addEventListener('click', function(){
      if(nav) nav.classList.remove('active');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item__question').forEach(function(q){
    q.addEventListener('click', function(){
      var item = this.closest('.faq-item');
      var wasActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item.active').forEach(function(i){
        i.classList.remove('active');
      });
      // Toggle current
      if(!wasActive) item.classList.add('active');
    });
  });

  // Model select -> show price and update contact form
  var modelSelect = document.getElementById('hero-model-select');
  var priceDisplay = document.getElementById('hero-price');
  if(modelSelect && priceDisplay){
    modelSelect.addEventListener('change', function(){
      var selected = this.options[this.selectedIndex];
      var price = selected.getAttribute('data-price');
      if(price && this.value){
        priceDisplay.textContent = 'Screen repair: ' + price;
        priceDisplay.style.display = 'block';
      } else {
        priceDisplay.textContent = '';
        priceDisplay.style.display = 'none';
      }
      // Also update contact form if on same page
      if(this.value){
        var contactForm = document.querySelector('#contact-form');
        if(contactForm){
          var modelField = contactForm.querySelector('select[name="model"]');
          if(modelField){
            modelField.value = this.value;
            contactForm.scrollIntoView({behavior:'smooth'});
          }
        }
      }
    });
  }

  // Contact form submission
  var form = document.querySelector('#contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      var data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: {'Accept': 'application/json'}
      }).then(function(response){
        if(response.ok){
          form.reset();
          btn.textContent = 'Sent!';
          setTimeout(function(){ btn.textContent = originalText; btn.disabled = false; }, 3000);
        } else {
          btn.textContent = 'Error - Try Again';
          btn.disabled = false;
        }
      }).catch(function(){
        btn.textContent = 'Error - Try Again';
        btn.disabled = false;
      });
    });
  }

  // Lazy intersection observer for animation (optional)
  if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.1});

    document.querySelectorAll('.stat, .testimonial-card, .step').forEach(function(el){
      observer.observe(el);
    });
  }
})();

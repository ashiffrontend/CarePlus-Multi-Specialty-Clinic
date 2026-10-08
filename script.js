/**
 * CarePlus Multi-Specialty Clinic - Vanilla JavaScript Application
 * Clean, Accessible, Zero-Dependency, Production Quality
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode with Persistence)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('careplus_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('careplus_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('careplus_theme', 'light');
    }
  };

  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (prefersDark) {
    applyTheme('dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Scroll Progress Bar & Sticky Header Styling
  // --------------------------------------------------------------------------
  const progressBar = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top');

  const onScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Progress Bar
    if (progressBar && docHeight > 0) {
      const scrolledPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrolledPercent))}%`;
    }

    // Sticky Header elevation
    if (siteHeader) {
      if (scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to Top button
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileMenuOpenBtn = document.getElementById('mobile-menu-open');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileMenuOpenBtn) mobileMenuOpenBtn.addEventListener('click', openMobileMenu);
  if (mobileMenuCloseBtn) mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --------------------------------------------------------------------------
  // 4. Scroll Reveal Animations (Intersection Observer)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --------------------------------------------------------------------------
  // 5. Animated Number Statistics (Count Up)
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsCounted = false;

  const animateStats = () => {
    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const isFormatK = el.getAttribute('data-format') === 'k';
      const duration = 1800;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        if (isFormatK) {
          el.textContent = `${currentVal.toLocaleString()}+`;
        } else {
          el.textContent = `${currentVal}+`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.getElementById('statistics');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          animateStats();
        }
      });
    }, { threshold: 0.25 });
    statsObserver.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // 6. Navigation Link Active Spy
  // --------------------------------------------------------------------------
  const navSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 120;

    navSections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      desktopNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // --------------------------------------------------------------------------
  // 7. About Section Tabs (Mission / Vision / Values)
  // --------------------------------------------------------------------------
  const aboutTabButtons = document.querySelectorAll('.about-tab-btn');
  const aboutPanes = document.querySelectorAll('.about-tab-pane');

  aboutTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');
      aboutTabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      aboutPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const activePane = document.getElementById(`pane-${tabTarget}`);
      if (activePane) activePane.classList.add('active');
    });
  });

  // --------------------------------------------------------------------------
  // 8. Doctor Directory Filtering & Search
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const doctorCards = document.querySelectorAll('.doctor-card');
  const doctorSearchInput = document.getElementById('doctor-search');
  let currentDeptFilter = 'all';

  const filterDoctors = () => {
    const query = (doctorSearchInput ? doctorSearchInput.value : '').toLowerCase().trim();

    doctorCards.forEach(card => {
      const dept = card.getAttribute('data-dept') || '';
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();

      const matchesDept = (currentDeptFilter === 'all') || (dept === currentDeptFilter);
      const matchesSearch = !query || name.includes(query) || keywords.includes(query) || dept.toLowerCase().includes(query);

      if (matchesDept && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDeptFilter = btn.getAttribute('data-filter') || 'all';
      filterDoctors();
    });
  });

  if (doctorSearchInput) {
    doctorSearchInput.addEventListener('input', filterDoctors);
  }

  // Hero Quick Search Jump
  const heroQuickSearchInput = document.getElementById('hero-quick-search');
  const heroSearchBtn = document.getElementById('hero-search-btn');

  const executeHeroSearch = () => {
    if (!heroQuickSearchInput) return;
    const term = heroQuickSearchInput.value.trim();
    if (term) {
      if (doctorSearchInput) {
        doctorSearchInput.value = term;
      }
      currentDeptFilter = 'all';
      filterButtons.forEach(b => {
        if (b.getAttribute('data-filter') === 'all') b.classList.add('active');
        else b.classList.remove('active');
      });
      filterDoctors();
      
      const doctorsSec = document.getElementById('doctors');
      if (doctorsSec) {
        doctorsSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (heroSearchBtn) heroSearchBtn.addEventListener('click', executeHeroSearch);
  if (heroQuickSearchInput) {
    heroQuickSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeHeroSearch();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. Interactive Appointment Scheduler Form
  // --------------------------------------------------------------------------
  const apptForm = document.getElementById('appointment-form');
  const apptDateInput = document.getElementById('appt-date');
  const apptDeptSelect = document.getElementById('appt-department');
  const apptDoctorSelect = document.getElementById('appt-doctor');
  const timeSlotButtons = document.querySelectorAll('.time-slot-btn');
  const selectedTimeSlotInput = document.getElementById('selected-time-slot');

  // Set min date to today
  if (apptDateInput) {
    const today = new Date().toISOString().split('T')[0];
    apptDateInput.setAttribute('min', today);
    // default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    apptDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Doctor list by department mapping
  const doctorsByDept = {
    'Cardiology': ['Dr. Sarah Jenkins'],
    'Orthopedics': ['Dr. Marcus Vance'],
    'Pediatrics': ['Dr. Emily Chen'],
    'Neurology': ['Dr. Julian Ross'],
    'Gynecology': ['Dr. Priya Patel'],
    'General Medicine': ['Dr. Robert Thorne'],
    'Dermatology': ['Dr. Alyssa Diaz'],
    'ENT': ['Dr. Julian Ross (ENT Consultant)'],
    'Dental': ['Dr. Alyssa Diaz (Dental Specialist)'],
    'Ophthalmology': ['Dr. Robert Thorne (Eye Specialist)'],
    'Psychiatry': ['Dr. Priya Patel (Counseling Consultant)']
  };

  if (apptDeptSelect && apptDoctorSelect) {
    apptDeptSelect.addEventListener('change', () => {
      const selectedDept = apptDeptSelect.value;
      apptDoctorSelect.innerHTML = '<option value="" disabled selected>Select Doctor</option>';
      const docs = doctorsByDept[selectedDept] || ['Dr. Robert Thorne', 'Dr. Sarah Jenkins', 'Dr. Emily Chen'];
      docs.forEach(doc => {
        const opt = document.createElement('option');
        opt.value = doc;
        opt.textContent = `${doc} (${selectedDept})`;
        apptDoctorSelect.appendChild(opt);
      });
      if (docs.length > 0) {
        apptDoctorSelect.selectedIndex = 1;
      }
    });
  }

  // Time slot chip selection
  timeSlotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (selectedTimeSlotInput) {
        selectedTimeSlotInput.value = btn.getAttribute('data-time') || '11:45 AM';
      }
    });
  });

  // Appointment Form Submission & Validation
  if (apptForm) {
    apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('patient-name');
      const email = document.getElementById('patient-email');
      const phone = document.getElementById('patient-phone');
      const dept = document.getElementById('appt-department');
      const doctor = document.getElementById('appt-doctor');
      const date = document.getElementById('appt-date');
      const timeSlot = selectedTimeSlotInput ? selectedTimeSlotInput.value : '11:45 AM';

      let isValid = true;

      // Validate Name
      if (!name.value.trim() || name.value.trim().length < 2) {
        showError(name, 'err-name');
        isValid = false;
      } else {
        clearError(name, 'err-name');
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        showError(email, 'err-email');
        isValid = false;
      } else {
        clearError(email, 'err-email');
      }

      // Validate Phone
      if (!phone.value.trim() || phone.value.trim().length < 7) {
        showError(phone, 'err-phone');
        isValid = false;
      } else {
        clearError(phone, 'err-phone');
      }

      // Validate Dept
      if (!dept.value) {
        showError(dept, 'err-dept');
        isValid = false;
      } else {
        clearError(dept, 'err-dept');
      }

      // Validate Doctor
      if (!doctor.value) {
        showError(doctor, 'err-doctor');
        isValid = false;
      } else {
        clearError(doctor, 'err-doctor');
      }

      // Validate Date
      if (!date.value) {
        showError(date, 'err-date');
        isValid = false;
      } else {
        clearError(date, 'err-date');
      }

      if (!isValid) return;

      // Simulate instantaneous booking confirmation
      const submitBtn = document.getElementById('appt-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          Generating Confirmed Slip...
        `;
      }

      setTimeout(() => {
        // Generate Token code
        const randomCode = `CP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Update Confirmation Modal Slip
        document.getElementById('slip-token').textContent = randomCode;
        document.getElementById('slip-patient-name').textContent = name.value.trim();
        document.getElementById('slip-dept').textContent = dept.value;
        document.getElementById('slip-doctor').textContent = doctor.value;
        document.getElementById('slip-datetime').textContent = `${date.value} at ${timeSlot}`;
        document.getElementById('slip-phone').textContent = phone.value.trim();

        // Open modal
        openModal('modal-appt-success');
        showToast(`Appointment confirmed! Token ${randomCode}`, 'success');

        // Reset submit button & form
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Confirm & Generate Appointment Slip';
        }
        apptForm.reset();
        
        // Restore default selected time chip
        timeSlotButtons.forEach(b => b.classList.remove('selected'));
        if (timeSlotButtons[2]) timeSlotButtons[2].classList.add('selected');
        if (selectedTimeSlotInput) selectedTimeSlotInput.value = '11:45 AM';
      }, 700);
    });
  }

  const showError = (inputEl, errorId) => {
    inputEl.classList.add('is-invalid');
    const errSpan = document.getElementById(errorId);
    if (errSpan) errSpan.classList.add('visible');
  };

  const clearError = (inputEl, errorId) => {
    inputEl.classList.remove('is-invalid');
    const errSpan = document.getElementById(errorId);
    if (errSpan) errSpan.classList.remove('visible');
  };

  // --------------------------------------------------------------------------
  // 10. Patient Testimonial Auto Slider
  // --------------------------------------------------------------------------
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('slider-dots-container');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let currentSlide = 0;
  let slideInterval = null;

  const updateSlider = (index) => {
    if (!track || slides.length === 0) return;
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, i) => {
        if (i === currentSlide) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval = setInterval(() => {
      updateSlider(currentSlide + 1);
    }, 5500);
  };

  const stopAutoSlide = () => {
    if (slideInterval) clearInterval(slideInterval);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlider(currentSlide - 1);
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlider(currentSlide + 1);
      startAutoSlide();
    });
  }

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateSlider(idx);
        startAutoSlide();
      });
    });
  }

  if (track) {
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
  }

  startAutoSlide();

  // --------------------------------------------------------------------------
  // 11. FAQ Accordion
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 12. Contact Form Validation
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const msg = document.getElementById('contact-message');

      let isValid = true;
      if (!name.value.trim()) {
        showError(name, 'c-err-name');
        isValid = false;
      } else {
        clearError(name, 'c-err-name');
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        showError(email, 'c-err-email');
        isValid = false;
      } else {
        clearError(email, 'c-err-email');
      }

      if (!msg.value.trim()) {
        showError(msg, 'c-err-msg');
        isValid = false;
      } else {
        clearError(msg, 'c-err-msg');
      }

      if (isValid) {
        showToast('Message sent! Our clinical desk will get back to you within 4 hours.', 'success');
        contactForm.reset();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 13. Newsletter Subscription
  // --------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletter-email');
      if (input && input.value.trim()) {
        showToast('Thank you for subscribing to CarePlus Health Bulletin!', 'success');
        newsletterForm.reset();
      }
    });
  }

  // Keydown Escape to close all modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
      });
      closeMobileMenu();
    }
  });
});

// ----------------------------------------------------------------------------
// Global Window Functions (Modals, Toasts, Pre-fills)
// ----------------------------------------------------------------------------

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close when clicking modal backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      ${type === 'success' ? '<polyline points="20 6 9 17 4 12"/>' : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Pre-fill doctor selection when clicked from doctor directory card
function selectDoctorForAppointment(doctorName, department) {
  const apptSec = document.getElementById('appointments');
  const deptSelect = document.getElementById('appt-department');
  const doctorSelect = document.getElementById('appt-doctor');
  const nameInput = document.getElementById('patient-name');

  if (apptSec) apptSec.scrollIntoView({ behavior: 'smooth' });

  if (deptSelect) {
    deptSelect.value = department;
    deptSelect.dispatchEvent(new Event('change'));
  }

  setTimeout(() => {
    if (doctorSelect) {
      let matched = false;
      for (let i = 0; i < doctorSelect.options.length; i++) {
        if (doctorSelect.options[i].value.includes(doctorName)) {
          doctorSelect.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const newOpt = document.createElement('option');
        newOpt.value = doctorName;
        newOpt.textContent = `${doctorName} (${department})`;
        newOpt.selected = true;
        doctorSelect.appendChild(newOpt);
      }
    }
    if (nameInput) nameInput.focus();
    showToast(`Selected ${doctorName} for booking`, 'success');
  }, 100);
}

// Pre-fill package booking
function selectPackageForBooking(packageName) {
  const apptSec = document.getElementById('appointments');
  const reasonInput = document.getElementById('appt-reason');
  const nameInput = document.getElementById('patient-name');

  if (apptSec) apptSec.scrollIntoView({ behavior: 'smooth' });
  if (reasonInput) {
    reasonInput.value = `Health Package Booking: ${packageName}`;
  }
  if (nameInput) nameInput.focus();
  showToast(`Package selected: ${packageName}`, 'success');
}

// Department Details Modal
const departmentsData = {
  'General Medicine': {
    title: 'Department of General Medicine',
    head: 'Dr. Robert Thorne, MD (Internal Medicine)',
    doctors: '10 Available Specialists',
    description: 'Our General Medicine unit is the clinical backbone of CarePlus, managing comprehensive adult internal health, multisystem acute disorders, fever triage, and long-term metabolic health.',
    treatments: ['Hypertension & Lipid Management', 'Type 1 & Type 2 Diabetes Glycemic Control', 'Infectious Diseases & Tropical Fevers', 'Adult Preventive Screenings', 'Pre-operative Medical Clearances'],
    facilities: ['Automated POCT Diagnostics', 'Continuous Glucose Monitoring (CGM)', 'Outpatient Infusion Suites', 'Dedicated Geriatric Counseling']
  },
  'Cardiology': {
    title: 'Department of Cardiology & Vascular Medicine',
    head: 'Dr. Sarah Jenkins, MD, DM, FACC',
    doctors: '8 Available Cardiologists',
    description: 'Equipped with digital cardiac catheterization, 2D strain echocardiography, and rapid acute coronary syndrome triage to detect and reverse heart conditions swiftly.',
    treatments: ['Coronary Angiography & Stenting', 'Arrhythmia Management & Pacemaker Clinic', 'Heart Failure Management', 'Non-invasive Cardiac Stress Testing', 'Lipid & Preventive Cardiology'],
    facilities: ['Flat-Panel Cath Lab', '24×7 Rapid Chest Pain Center', 'Philips EPIQ 2D/3D Echo', 'Holter & Ambulatory BP Monitors']
  },
  'Orthopedics': {
    title: 'Department of Orthopedics & Joint Reconstruction',
    head: 'Dr. Marcus Vance, MS, FRCS',
    doctors: '7 Available Surgeons',
    description: 'Providing advanced robotic joint arthroplasty, arthroscopic sports reconstruction, spine surgery, and comprehensive post-op physical rehabilitation.',
    treatments: ['Computer-Assisted Knee & Hip Replacement', 'ACL/PCL Arthroscopic Ligament Repair', 'Spine Disc Decompression', 'Complex Trauma & Fracture Fixation', 'Pediatric Orthopedics'],
    facilities: ['Laminar Flow Joint Theatres', 'C-Arm Fluoroscopy Imaging', 'Advanced Kinetic Physical Therapy Gym', 'PRP Regenerative Injections']
  },
  'Neurology': {
    title: 'Department of Neurology & Neurosciences',
    head: 'Dr. Julian Ross, MD, DM (Neuro)',
    doctors: '6 Senior Neurologists',
    description: 'Advanced neuro-diagnostic and therapeutic care for neurological diseases, brain stroke thrombolysis, epilepsy, and neurodegenerative disorders.',
    treatments: ['Acute Ischemic Stroke Thrombolysis', 'Epilepsy & Seizure Protocols', 'Headache & Migraine Center', 'Parkinson’s Disease & Movement Disorders', 'Neuropathies & Myasthenia Gravis'],
    facilities: ['Digital 32-Channel EEG & Video Telemetry', 'Electromyography (EMG) & Nerve Conduction Studies', 'High-Resolution Neuro MRI', 'Neuro-Rehabilitation Unit']
  },
  'Pediatrics': {
    title: 'Department of Pediatrics & Neonatal Care',
    head: 'Dr. Emily Chen, MD (Pediatrics), DCH',
    doctors: '9 Pediatric Specialists',
    description: 'A compassionate, joyful healing space for infants, toddlers, children, and teenagers, supported by a state-of-the-art Level-3 Neonatal Intensive Care Unit (NICU).',
    treatments: ['Newborn Screening & Well-Baby Visits', 'Complete Pediatric Immunization Programs', 'Childhood Asthma & Allergy Clinic', 'Growth & Developmental Milestones Tracking', 'Pediatric Infections & Fever Management'],
    facilities: ['Child-Friendly Private Consultation Suites', 'Level-3 NICU Incubators & Warmers', 'Emergency Pediatric Resuscitation', 'Lactation Consultation Services']
  },
  'Gynecology': {
    title: 'Department of Gynecology & Obstetrics',
    head: 'Dr. Priya Patel, MS (OBG), FICOG',
    doctors: '8 Women’s Health Specialists',
    description: 'Holistic care for women across all life stages, including high-risk pregnancy monitoring, minimally invasive laparoscopic surgery, and menopausal wellness.',
    treatments: ['High-Risk Antenatal Care & Delivery', 'Laparoscopic Hysterectomy & Fibroid Removal', 'PCOS & Hormonal Imbalance Clinic', 'Infertility Evaluation & Follicular Tracking', 'Cervical Cancer Screening & HPV Vaccines'],
    facilities: ['4D HD Live Maternal Ultrasound', 'Painless Labor & Epidural Support', 'Dedicated Birthing Suites', 'Colposcopy & Well-Woman Health Suites']
  },
  'Dermatology': {
    title: 'Department of Dermatology & Skin Health',
    head: 'Dr. Alyssa Diaz, MD (DVL)',
    doctors: '5 Clinical Dermatologists',
    description: 'Expert diagnostic evaluation for complex medical dermatoses, psoriasis, eczema, acne scar resurfacing, and advanced cosmetic therapies.',
    treatments: ['Acne, Rosacea & Pigmentation Therapies', 'Biological Therapies for Psoriasis & Eczema', 'Skin Biopsy & Mole Mapping', 'Allergy Patch Testing', 'Medical Laser Treatments'],
    facilities: ['Narrowband UVB Phototherapy', 'Fractional CO2 Laser Equipment', 'Digital Dermoscopy System', 'Cryosurgery Unit']
  },
  'ENT': {
    title: 'Department of ENT (Otolaryngology)',
    head: 'Dr. Julian Ross (Clinical Head)',
    doctors: '5 ENT Surgeons',
    description: 'Diagnosis and endoscopic treatment for diseases of the ear, nose, throat, head and neck, voice disorders, and sleep apnea.',
    treatments: ['Functional Endoscopic Sinus Surgery (FESS)', 'Microscopic Ear Surgery & Tympanoplasty', 'Tonsillectomy & Adenoidectomy', 'Hearing Loss Assessments & Audiometry', 'Snoring & Obstructive Sleep Apnea'],
    facilities: ['Soundproof Audiometry Booth', 'Flexible Video Nasopharyngoscope', 'Coblation Surgical System', 'Tympanometry Analyzer']
  },
  'Dental': {
    title: 'Department of Dental Surgery & Oral Health',
    head: 'Dental Clinical Faculty',
    doctors: '6 Dental Specialists',
    description: 'State-of-the-art dental care featuring painless single-sitting root canals, implantology, invisible orthodontic aligners, and restorative dentistry.',
    treatments: ['Rotary Endodontic Root Canal Therapy', 'Titanium Dental Implants', 'Invisalign & Clear Orthodontic Aligners', 'Laser Teeth Whitening & Veneers', 'Pediatric Dental Care'],
    facilities: ['Digital Intraoral X-Rays (RVG)', 'Autoclave Class-B Sterilization', 'Ergonomic Dental Chairs', 'Intraoral 3D Scanners']
  },
  'Ophthalmology': {
    title: 'Department of Ophthalmology & Vision Sciences',
    head: 'Ophthalmic Clinical Team',
    doctors: '4 Eye Surgeons',
    description: 'Modern vision testing, blade-free refractive error correction, micro-incision cataract surgery with premium toric & multifocal lenses, and diabetic retinopathy care.',
    treatments: ['Micro-Incision Phacoemulsification Cataract', 'Glaucoma Early Screening & Pressure Control', 'Diabetic Retinopathy & Macular Degeneration', 'Refractive Vision Correction', 'Dry Eye & Computer Vision Syndrome'],
    facilities: ['Non-Contact Tonometer', 'Optical Coherence Tomography (OCT)', 'Automated Visual Field Perimetry', 'Retinal Green Laser']
  },
  'Psychiatry': {
    title: 'Department of Psychiatry & Behavioral Health',
    head: 'Dr. Priya Patel (Mental Health Lead)',
    doctors: '5 Psychiatrists & Psychologists',
    description: 'Empathetic, confidential mental health services supporting emotional resilience, anxiety disorders, clinical depression, work stress, and neurodiversity.',
    treatments: ['Cognitive Behavioral Therapy (CBT)', 'Anxiety & Panic Disorder Treatment', 'Major Depressive Disorder Care', 'Sleep Disorder & Insomnia Clinic', 'Adolescent Counseling & Stress Management'],
    facilities: ['Confidential Soundproof Therapy Rooms', 'Biofeedback Training Equipment', 'Psychometric Assessment Batteries', 'Virtual Tele-counseling Modules']
  },
  'Emergency Medicine': {
    title: 'Department of Emergency & Trauma Medicine',
    head: 'Level-1 Emergency Trauma Directorate',
    doctors: '12 Emergency Physicians & Trauma Surgeons',
    description: 'Round-the-clock emergency care equipped with multi-bed resuscitation bays, point-of-care ultrasound, bedside arterial blood gas, and rapid surgical access.',
    treatments: ['Level-1 Multi-Trauma Resuscitation', 'Acute Myocardial Infarction STEMI Protocol', 'Severe Respiratory Distress Intubation', 'Toxicology & Snakebite Envenomation', 'Emergency Burn Stabilization'],
    facilities: ['Dedicated 24×7 Ambulance Fleet', 'Bedside Blood Gas Analyzers (i-STAT)', 'Defibrillators with Pacing', 'Dedicated Emergency Operating Room']
  }
};

function openDeptModal(deptName) {
  const data = departmentsData[deptName];
  if (!data) return;

  const titleEl = document.getElementById('dept-modal-title');
  const bodyEl = document.getElementById('dept-modal-body');
  const bookBtn = document.getElementById('dept-modal-book-btn');

  if (titleEl) titleEl.textContent = data.title;
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="margin-bottom: 16px;">
        <span style="background: var(--primary-subtle); color: var(--primary); font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: var(--radius-pill);">${data.doctors}</span>
        <span style="margin-left: 8px; font-size: 0.85rem; color: var(--text-muted);">Head: <strong>${data.head}</strong></span>
      </div>
      <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">${data.description}</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px;">Common Conditions &amp; Treatments:</h4>
      <ul style="list-style: disc; padding-left: 20px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">
        ${data.treatments.map(t => `<li>${t}</li>`).join('')}
      </ul>

      <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px;">Diagnostic &amp; Surgical Infrastructure:</h4>
      <ul style="list-style: disc; padding-left: 20px; color: var(--text-muted); line-height: 1.6;">
        ${data.facilities.map(f => `<li>${f}</li>`).join('')}
      </ul>
    `;
  }

  if (bookBtn) {
    bookBtn.onclick = () => {
      closeModal('modal-dept-details');
      const apptSec = document.getElementById('appointments');
      const deptSelect = document.getElementById('appt-department');
      if (apptSec) apptSec.scrollIntoView({ behavior: 'smooth' });
      if (deptSelect) {
        deptSelect.value = deptName;
        deptSelect.dispatchEvent(new Event('change'));
      }
    };
  }

  openModal('modal-dept-details');
}

// Health Articles Modal
const articlesData = {
  heart: {
    title: '7 Daily Habits to Protect Your Cardiovascular System',
    author: 'Dr. Sarah Jenkins · Chief Cardiologist',
    date: 'October 2026 · 5 min read',
    content: `
      <p>Cardiovascular disease remains the leading cause of preventable illness worldwide. However, extensive clinical research shows that up to 80% of premature heart attacks and strokes can be averted through deliberate daily lifestyle choices.</p>
      <br>
      <h4>1. Embrace Dynamic Movement Over Prolonged Sitting</h4>
      <p>A 30-minute brisk walk daily boosts endothelin-dependent vasodilation, reduces LDL oxidation, and stabilizes blood pressure. Break prolonged desk sitting every 45 minutes with simple bodyweight squats or standing stretches.</p>
      <br>
      <h4>2. Reduce Dietary Sodium Below 2,000 mg</h4>
      <p>Excessive table salt and processed food sodium trigger fluid retention, raising vascular resistance. Replace excess salt with potassium-rich herbs, garlic, and citrus.</p>
      <br>
      <h4>3. Prioritize 7 to 8 Hours of Uninterrupted Sleep</h4>
      <p>Chronic sleep deprivation spikes nighttime cortisol and sympathetic drive, aggravating hypertension and endothelial inflammation.</p>
      <br>
      <h4>4. Know Your Key Biological Metrics</h4>
      <p>Schedule an annual review of your Fasting Lipid Profile, HbA1c, and resting blood pressure to catch subtle metabolic shifts early.</p>
    `
  },
  vaccine: {
    title: 'The Essential Adult & Seasonal Immunization Schedule',
    author: 'Dr. Robert Thorne · Senior Consultant Physician',
    date: 'September 2026 · 4 min read',
    content: `
      <p>While many adults associate vaccines solely with childhood, waning antibodies leave adult populations vulnerable to preventable infections such as pneumococcal pneumonia, shingles, and influenza.</p>
      <br>
      <h4>1. The Annual Quadrivalent Influenza Vaccine</h4>
      <p>Updated yearly to match circulating strains, annual flu shots reduce the risk of severe respiratory hospitalizations by up to 60%, especially in adults aged 50+.</p>
      <br>
      <h4>2. Tetanus, Diphtheria, & Pertussis (Tdap Booster)</h4>
      <p>A single Tdap booster is strongly recommended every 10 years to maintain robust immunity against whooping cough and lockjaw.</p>
      <br>
      <h4>3. Recombinant Zoster (Shingles) Vaccine</h4>
      <p>Recommended for all healthy adults aged 50 and older to prevent debilitating post-herpetic neuralgia caused by reactivation of the varicella-zoster virus.</p>
    `
  },
  nutrition: {
    title: 'Anti-Inflammatory Nutrition for Joint and Gut Longevity',
    author: 'Dr. Priya Patel · Consultant Physician & Clinical Nutritionist',
    date: 'August 2026 · 6 min read',
    content: `
      <p>Systemic low-grade inflammation is a primary driver behind osteoarthritis, metabolic syndrome, and cardiovascular disease. Adopting an anti-inflammatory nutritional pattern acts as cellular medicine.</p>
      <br>
      <h4>1. Emphasize Omega-3 Fatty Acids</h4>
      <p>Fatty cold-water fish, flaxseeds, and chia seeds provide EPA and DHA, precursors to resolvins and protectins that extinguish inflammatory cascades.</p>
      <br>
      <h4>2. Colorful Polyphenols</h4>
      <p>Deeply colored berries, leafy greens, and turmeric contain potent flavonoids that neutralize reactive oxygen species (ROS) in synovial joint fluid.</p>
      <br>
      <h4>3. Prebiotic Fiber for Microbiome Balance</h4>
      <p>Garlic, onions, leeks, and fermented foods supply nourishment to short-chain fatty acid (SCFA)-producing gut bacteria, reinforcing intestinal barrier integrity.</p>
    `
  }
};

function openArticleModal(slug) {
  const art = articlesData[slug];
  if (!art) return;

  const titleEl = document.getElementById('article-modal-title');
  const bodyEl = document.getElementById('article-modal-body');

  if (titleEl) titleEl.textContent = art.title;
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
        <strong style="color: var(--primary);">${art.author}</strong><br>
        <span style="font-size: 0.85rem; color: var(--text-muted);">${art.date}</span>
      </div>
      <div>${art.content}</div>
    `;
  }

  openModal('modal-article-reader');
}

function openDirectionsModal() {
  openModal('modal-directions');
}

function openLegalModal(type) {
  const bodyEl = document.getElementById('legal-modal-body');
  const titleEl = document.getElementById('legal-modal-title');

  if (type === 'privacy') {
    if (titleEl) titleEl.textContent = 'Privacy Policy & Data Security';
    if (bodyEl) {
      bodyEl.innerHTML = `
        <p><strong>CarePlus Multi-Specialty Clinic Frontend Demo</strong></p>
        <p style="margin-top: 10px;">At CarePlus, patient confidentiality is our guiding principle. Please note:</p>
        <ul style="margin-top: 10px; padding-left: 20px; line-height: 1.6;">
          <li>This is a frontend demonstration website created strictly for portfolio showcase purposes by Mohammad Ashif.</li>
          <li>No personal information entered in this browser session is saved to a backend server or persistent database.</li>
          <li>Appointments created are local simulations to showcase user interface and interactive confirmation flows.</li>
        </ul>
      `;
    }
  } else {
    if (titleEl) titleEl.textContent = 'Terms of Service';
    if (bodyEl) {
      bodyEl.innerHTML = `
        <p><strong>Fictional Demonstration Notice</strong></p>
        <p style="margin-top: 10px;">The doctor profiles, phone numbers, appointment confirmation slips, and emergency hotline numbers displayed on this website are illustrative prototypes.</p>
        <p style="margin-top: 10px;">In a real medical emergency, always dial your local emergency services (such as 911 in the USA, 112 in Europe, or 108/102 in India) or visit the nearest emergency room directly.</p>
      `;
    }
  }

  openModal('modal-legal');
}

// Print appointment slip simulation
function printAppointmentSlip() {
  const ticket = document.getElementById('appointment-ticket-preview');
  if (!ticket) return;

  const printWindow = window.open('', '', 'width=600,height=600');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>CarePlus Appointment Pass</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #111827; }
            .ticket { border: 2px dashed #0F766E; padding: 24px; border-radius: 12px; background: #F8FAFC; }
            h2 { color: #0F766E; margin-bottom: 4px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; }
            .row strong { color: #0F766E; }
            .footer { margin-top: 20px; font-size: 12px; color: #64748B; text-align: center; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h2>CarePlus Multi-Specialty Clinic</h2>
            <p style="font-size: 13px; color: #64748B; margin-top: 0;">Official Outpatient Appointment Pass</p>
            ${ticket.innerHTML}
          </div>
          <p class="footer">Please present this pass at the ground floor OPD registration desk upon arrival.<br>&copy; 2026 CarePlus Multi-Specialty Clinic</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  } else {
    window.print();
  }
}

// Ensure functions are accessible in module context
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.selectDoctorForAppointment = selectDoctorForAppointment;
window.selectPackageForBooking = selectPackageForBooking;
window.openDeptModal = openDeptModal;
window.openArticleModal = openArticleModal;
window.openDirectionsModal = openDirectionsModal;
window.openLegalModal = openLegalModal;
window.printAppointmentSlip = printAppointmentSlip;


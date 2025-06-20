import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, AfterViewInit, Renderer2, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';

declare const particlesJS: any;

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  image: string;
  status: 'For Sale' | 'For Rent';
  bedrooms: number;
  bathrooms: number;
  area: number;
}

interface Category {
  name: string;
  icon: string;
  count: number;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  content: string;
  author: string;
  authorTitle: string;
  image: string;
  rating: number;
}

interface Partner {
  name: string;
  logo: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private lastScrollY = 0;
  private ticking = false;
  activeFaq: number | null = null;
  private particles: HTMLElement[] = [];
  private particleInterval: any;
  private observer: IntersectionObserver;
  private cursor: HTMLElement | null = null;
  private cursorSectionListener: any;
  private lastFocusedSection: HTMLElement | null = null;
  private isTourActive = false;

  // ROI Calculator properties
  investmentAmount: number = 0;
  duration: number = 30;
  dailyReturns: number = 0;
  totalReturns: number = 0;
  roi: number = 0;

  activeTestimonial: number = 0;

  featuredProperties: Property[] = [
    {
      id: 1,
      title: 'Modern Apartment in Downtown',
      price: 250000,
      location: 'New York, NY',
      image: 'assets/images/properties/property-1.jpg',
      status: 'For Sale',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200
    },
    {
      id: 2,
      title: 'Luxury Villa with Pool',
      price: 750000,
      location: 'Los Angeles, CA',
      image: 'assets/images/properties/property-2.jpg',
      status: 'For Sale',
      bedrooms: 4,
      bathrooms: 3,
      area: 2800
    },
    {
      id: 3,
      title: 'Cozy Studio Apartment',
      price: 1500,
      location: 'Chicago, IL',
      image: 'assets/images/properties/property-3.jpg',
      status: 'For Rent',
      bedrooms: 1,
      bathrooms: 1,
      area: 600
    }
  ];

  categories: Category[] = [
    { name: 'Apartments', icon: 'building', count: 150 },
    { name: 'Houses', icon: 'home', count: 200 },
    { name: 'Villas', icon: 'house', count: 75 },
    { name: 'Commercial', icon: 'store', count: 50 }
  ];

  features: Feature[] = [
    {
      title: 'Expert Agents',
      description: 'Our team of experienced real estate agents will guide you through every step.',
      icon: 'user-tie'
    },
    {
      title: 'Best Deals',
      description: 'We offer the best deals on properties across the country.',
      icon: 'tag'
    },
    {
      title: 'Secure Payments',
      description: 'All transactions are secure and protected.',
      icon: 'shield-alt'
    }
  ];

  testimonials: Testimonial[] = [
    {
      content: 'Found my dream home thanks to Realtors. The service was exceptional!',
      author: 'John Smith',
      authorTitle: 'Homeowner',
      image: 'assets/images/testimonials/testimonial-1.jpg',
      rating: 5
    },
    {
      content: 'Professional team and great experience. Highly recommended!',
      author: 'Sarah Johnson',
      authorTitle: 'Property Investor',
      image: 'assets/images/testimonials/testimonial-2.jpg',
      rating: 5
    }
  ];

  // Partners
  partners: Partner[] = [
    { name: 'OpenAI', logo: 'assets/images/partners/openai.png' },
    { name: 'Stripe', logo: 'assets/images/partners/stripe.png' },
    { name: 'MetaMask', logo: 'assets/images/partners/metamask.png' },
    { name: 'Twilio', logo: 'assets/images/partners/twilio.png' },
    { name: 'HubSpot', logo: 'assets/images/partners/hubspot.png' },
    { name: 'Firebase', logo: 'assets/images/partners/firebase.png' },
    { name: 'GitHub', logo: 'assets/images/partners/github.png' },
    { name: 'Microsoft', logo: 'assets/images/partners/microsoft.png' }
  ];

  @ViewChild('featuresSection') featuresSection!: ElementRef;
  @ViewChild('howItWorksSection') howItWorksSection!: ElementRef;
  @ViewChild('testimonialsSection') testimonialsSection!: ElementRef;
  @ViewChild('partnersSection') partnersSection!: ElementRef;
  @ViewChild('ctaSection') ctaSection!: ElementRef;

  constructor(private router: Router, private renderer: Renderer2, private ngZone: NgZone) {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );
  }

  ngOnInit() {
    // Initialize particles.js
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#0fffc1' },
        shape: { type: 'circle' },
        opacity: {
          value: 0.5,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#0fffc1',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: { enable: true, rotateX: 600, rotateY: 1200 }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'repulse' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });

    // Initialize number counters
    this.initializeCounters();
  }

  ngAfterViewInit() {
    // Initialize scroll reveal
    document.querySelectorAll('.scroll-reveal').forEach(element => {
      this.observer.observe(element);
    });

    // Initialize custom cursor
    this.initializeCustomCursor();
    this.animateSectionsOnScroll();
    this.trackCursorSectionFocus();
  }

  private initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count') || '0');
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      updateCounter();
    });
  }

  private initializeCustomCursor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);

    document.addEventListener('mousemove', (e) => {
      if (this.cursor) {
        this.cursor.style.left = e.clientX + 'px';
        this.cursor.style.top = e.clientY + 'px';
      }
    });

    document.addEventListener('mousedown', () => {
      if (this.cursor) {
        this.cursor.classList.add('cursor-click');
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.cursor) {
        this.cursor.classList.remove('cursor-click');
      }
    });

    // Add hover effect for interactive elements
    document.querySelectorAll('a, button, input, .glass').forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (this.cursor) {
          this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }
      });

      element.addEventListener('mouseleave', () => {
        if (this.cursor) {
          this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      });
    });
  }

  ngOnDestroy() {
    this.clearParticles();
    this.observer.disconnect();
    if (this.cursor) {
      this.cursor.remove();
    }
    if (this.cursorSectionListener) {
      window.removeEventListener('mousemove', this.cursorSectionListener);
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.lastScrollY = window.scrollY;
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateParallaxEffect();
        this.ticking = false;
      });
      this.ticking = true;
    }

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero') as HTMLElement;
    if (hero) {
      const scrolled = window.pageYOffset;
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  }

  private initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    parallaxElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.transform = 'translateY(0)';
      }
    });
  }

  private updateParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    parallaxElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const speed = 0.5;
        const yPos = -(this.lastScrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      }
    });
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Animated Particle Background
  private createParticles(count: number) {
    const container = document.getElementById('particle-container');
    if (!container) return;
    this.clearParticles();
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = `${Math.random() * 0.5 + 0.3}`;
      particle.style.animationDuration = `${12 + Math.random() * 10}s`;
      particle.style.background = `linear-gradient(135deg, #00f2fe, #7367f0)`;
      container.appendChild(particle);
      this.particles.push(particle);
    }
  }

  private clearParticles() {
    const container = document.getElementById('particle-container');
    if (container) {
      this.particles.forEach(p => container.removeChild(p));
    }
    this.particles = [];
  }

  // Add typing effect functionality
  startTypingEffect(element: HTMLElement): void {
    const text = element.textContent || '';
    element.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    };
    
    typeWriter();
  }

  toggleFaq(index: number) {
    this.activeFaq = this.activeFaq === index ? null : index;
  }

  viewProperty(property: Property) {
    console.log('Viewing property:', property);
    // Navigate to property details page
    this.router.navigate(['/properties', property.id]);
  }

  startSearch() {
    console.log('Starting property search');
    // Navigate to properties page
    this.router.navigate(['/properties']);
  }

  // Hero section actions
  startTrading(): void {
    this.router.navigate(['/auth']);
  }

  explorePlatform(): void {
    this.router.navigate(['/platform']);
  }

  // ROI Calculator
  calculateROI(): void {
    if (this.investmentAmount > 0) {
      // Example calculation (replace with actual AI-based calculation)
      const dailyRate = 0.02; // 2% daily return
      this.dailyReturns = this.investmentAmount * dailyRate;
      this.totalReturns = this.dailyReturns * this.duration;
      this.roi = (this.totalReturns / this.investmentAmount) * 100;
    } else {
      this.dailyReturns = 0;
      this.totalReturns = 0;
      this.roi = 0;
    }
  }

  // Final CTA actions
  createAccount(): void {
    this.router.navigate(['/auth']);
  }

  talkToAdvisor(): void {
    this.router.navigate(['/chat']);
  }

  downloadWhitepaper(): void {
    window.open('assets/whitepaper.pdf', '_blank');
  }

  prevTestimonial() {
    this.activeTestimonial = (this.activeTestimonial - 1 + this.testimonials.length) % this.testimonials.length;
  }

  nextTestimonial() {
    this.activeTestimonial = (this.activeTestimonial + 1) % this.testimonials.length;
  }

  startTour() {
    const sections = [
      this.featuresSection,
      this.howItWorksSection,
      this.testimonialsSection,
      this.partnersSection,
      this.ctaSection
    ];
    let i = 0;
    const scrollToNext = () => {
      if (i >= sections.length) return;
      const section = sections[i];
      if (section && section.nativeElement) {
        section.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        section.nativeElement.classList.add('tour-highlight');
        setTimeout(() => {
          section.nativeElement.classList.remove('tour-highlight');
          i++;
          scrollToNext();
        }, 1200);
      } else {
        i++;
        scrollToNext();
      }
    };
    scrollToNext();
  }

  goToRegister() {
    this.router.navigate(['/auth']);
  }

  async exploreHome() {
    if (this.isTourActive) return;
    this.isTourActive = true;
    const sections = [
      'pillars', 'cta', 'ai-core', 'testimonials', 'partners', 'stats', 'ai-prompt', 'use-cases', 'security', 'whitepaper'
    ];
    // Remove all focus/unfocus classes
    const allSections = Array.from(document.querySelectorAll('section[data-section]')) as HTMLElement[];
    allSections.forEach(s => {
      this.renderer.removeClass(s, 'section-focused');
      this.renderer.removeClass(s, 'section-unfocused');
      this.renderer.removeClass(s, 'section-fadeout');
    });
    let prevSection: HTMLElement | null = null;
    for (let i = 0; i < sections.length; i++) {
      const id = sections[i];
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        allSections.forEach(s => {
          if (s === section) {
            this.renderer.addClass(s, 'section-focused');
            this.renderer.removeClass(s, 'section-unfocused');
          } else {
            this.renderer.removeClass(s, 'section-focused');
            this.renderer.addClass(s, 'section-unfocused');
          }
        });
        // Animate child items with stagger
        const items = Array.from(section.querySelectorAll('.animate-in, .animate-fadeInSlideUp, .glass, .pillar-card'));
        items.forEach((el, idx) => {
          setTimeout(() => {
            this.renderer.addClass(el, 'visible');
          }, idx * 120);
        });
        // Fade out previous section for smooth transition
        if (prevSection) {
          this.renderer.addClass(prevSection, 'section-fadeout');
          setTimeout(() => {
            this.renderer.removeClass(prevSection!, 'section-fadeout');
          }, 600);
        }
        prevSection = section;
        // Hold on each section longer for cinematic effect
        await new Promise(res => setTimeout(res, 2000 + items.length * 120));
      }
    }
    // Remove all focus/unfocus after tour
    setTimeout(() => {
      allSections.forEach(s => {
        this.renderer.removeClass(s, 'section-focused');
        this.renderer.removeClass(s, 'section-unfocused');
        this.renderer.removeClass(s, 'section-fadeout');
      });
      this.isTourActive = false;
    }, 1200);
  }

  animateSectionsOnScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('section[data-section]').forEach(section => {
      observer.observe(section);
      section.querySelectorAll('.animate-in, .animate-fadeInSlideUp, .glass, .pillar-card').forEach(el => {
        observer.observe(el);
      });
    });
  }

  trackCursorSectionFocus() {
    this.ngZone.runOutsideAngular(() => {
      let rafId: number | null = null;
      this.cursorSectionListener = (e: MouseEvent) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const sections = Array.from(document.querySelectorAll('section[data-section]')) as HTMLElement[];
          let found = false;
          for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (
              e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom
            ) {
              if (this.lastFocusedSection !== section) {
                sections.forEach(s => {
                  this.renderer.removeClass(s, 'section-focused');
                  this.renderer.addClass(s, 'section-unfocused');
                });
                this.renderer.addClass(section, 'section-focused');
                this.renderer.removeClass(section, 'section-unfocused');
                this.lastFocusedSection = section;
              }
              found = true;
              break;
            }
          }
          if (!found) {
            sections.forEach(s => {
              this.renderer.removeClass(s, 'section-focused');
              this.renderer.removeClass(s, 'section-unfocused');
            });
            this.lastFocusedSection = null;
          }
        });
      };
      window.addEventListener('mousemove', this.cursorSectionListener);
    });
  }
} 
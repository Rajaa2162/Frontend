import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {
  private lastScrollY = 0;
  private ticking = false;
  activeFaq: number | null = null;

  ngOnInit() {
    this.initParallaxEffect();
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
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
} 
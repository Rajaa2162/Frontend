import { Directive, ElementRef, Input, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[scrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements AfterViewInit {
  @Input() scrollAnimate: string = 'fade-in';
  @Input() scrollAnimateDelay: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (this.scrollAnimateDelay > 0) {
            setTimeout(() => {
              this.renderer.addClass(this.el.nativeElement, this.scrollAnimate);
            }, this.scrollAnimateDelay);
          } else {
            this.renderer.addClass(this.el.nativeElement, this.scrollAnimate);
          }
          observer.unobserve(this.el.nativeElement); // animate once
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(this.el.nativeElement);
  }
} 
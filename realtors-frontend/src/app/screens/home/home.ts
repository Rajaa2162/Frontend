import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LottieComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  lottieOptions = {
    path: '/assets/animations/trading.json',
    loop: true,
    autoplay: true
  };

  constructor(private viewportScroller: ViewportScroller) {}

  ngOnInit(): void {}

  scrollToSection(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }
}

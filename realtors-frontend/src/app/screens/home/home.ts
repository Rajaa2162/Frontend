import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent {
  constructor(private viewportScroller: ViewportScroller) {}

  scrollToSection(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }
}

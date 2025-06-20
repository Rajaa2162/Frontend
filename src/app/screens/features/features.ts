import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-features',
  templateUrl: './features.html',
  styleUrls: ['./features.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FeaturesComponent {
  // Component logic here
} 
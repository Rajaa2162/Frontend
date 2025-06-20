import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.elevated]="elevated">
      <div class="card-header" *ngIf="title">
        <h3 class="card-title">{{ title }}</h3>
      </div>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .card.elevated {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .card.elevated:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
      color: #333;
    }

    .card-content {
      padding: 1rem;
    }
  `]
})
export class CardComponent {
  @Input() title: string = '';
  @Input() elevated: boolean = false;
} 
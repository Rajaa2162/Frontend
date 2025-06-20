import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.hoverable]="hoverable" [class.elevated]="elevated">
      <div *ngIf="header" class="card-header">
        <h3 *ngIf="title" class="card-title">{{ title }}</h3>
        <div class="card-header-content">
          <ng-content select="[headerContent]"></ng-content>
        </div>
      </div>
      
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      
      <div *ngIf="footer" class="card-footer">
        <ng-content select="[footerContent]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-xl);
      overflow: hidden;
      transition: var(--transition-all);
    }

    .card.elevated {
      box-shadow: var(--shadow-lg);
    }

    .card.hoverable:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }

    .card-header {
      padding: var(--spacing-6);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--neutral-100);
    }

    .card-header-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .card-body {
      padding: var(--spacing-6);
    }

    .card-footer {
      padding: var(--spacing-6);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-4);
    }

    @media (max-width: 640px) {
      .card-header,
      .card-body,
      .card-footer {
        padding: var(--spacing-4);
      }
    }
  `]
})
export class CardComponent {
  @Input() title = '';
  @Input() header = false;
  @Input() footer = false;
  @Input() hoverable = false;
  @Input() elevated = false;
} 
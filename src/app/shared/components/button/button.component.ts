import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="getButtonClasses()"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)"
    >
      <span class="spinner" *ngIf="loading"></span>
      <i *ngIf="icon && !loading" [class]="icon" [class.mr-2]="!!label"></i>
      <span *ngIf="label">{{ label }}</span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-3) var(--spacing-6);
      border-radius: var(--radius-lg);
      font-weight: 500;
      transition: var(--transition-all);
      cursor: pointer;
      border: none;
      outline: none;
      min-width: 100px;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: var(--neutral-100);
    }

    .btn-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--primary-500);
      color: var(--primary-500);
    }

    .btn-outline:hover:not(:disabled) {
      background: var(--primary-500);
      color: white;
      transform: translateY(-1px);
    }

    .btn-sm {
      padding: var(--spacing-2) var(--spacing-4);
      font-size: 0.875rem;
    }

    .btn-lg {
      padding: var(--spacing-4) var(--spacing-8);
      font-size: 1.125rem;
    }

    .btn-full {
      width: 100%;
    }

    .spinner {
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: var(--spacing-2);
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon = '';
  @Input() label = '';
  @Output() onClick = new EventEmitter<Event>();

  getButtonClasses(): string {
    const classes = ['btn', `btn-${this.variant}`];
    
    if (this.size !== 'md') {
      classes.push(`btn-${this.size}`);
    }
    
    if (this.fullWidth) {
      classes.push('btn-full');
    }
    
    return classes.join(' ');
  }
} 
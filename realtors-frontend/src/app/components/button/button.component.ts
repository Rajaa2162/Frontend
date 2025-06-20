import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="'btn ' + variant"
      [disabled]="disabled || loading"
      (click)="onClick($event)"
    >
      <span class="spinner" *ngIf="loading"></span>
      <span class="content" [class.hidden]="loading">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      border-radius: 5px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      min-width: 120px;
      position: relative;
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .primary {
      background-color: #4a90e2;
      color: white;
    }

    .primary:hover:not(:disabled) {
      background-color: #357abd;
    }

    .secondary {
      background-color: #f5f5f5;
      color: #333;
    }

    .secondary:hover:not(:disabled) {
      background-color: #e5e5e5;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .content.hidden {
      visibility: hidden;
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
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;

  @Output() click = new EventEmitter<Event>();

  onClick(event: Event) {
    if (!this.disabled && !this.loading) {
      this.click.emit(event);
    }
  }
} 
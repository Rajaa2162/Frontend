import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrapper" [class.has-error]="error" [class.is-focused]="isFocused">
      <label *ngIf="label" [for]="id" class="input-label">{{ label }}</label>
      
      <div class="input-container">
        <i *ngIf="prefixIcon" [class]="prefixIcon" class="input-icon prefix"></i>
        
        <input
          [type]="type"
          [id]="id"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          class="input-field"
        />
        
        <i *ngIf="suffixIcon" [class]="suffixIcon" class="input-icon suffix"></i>
        
        <button
          *ngIf="type === 'password'"
          type="button"
          class="toggle-password"
          (click)="togglePasswordVisibility()"
          aria-label="Toggle password visibility"
        >
          <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
      
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
      
      <div *ngIf="hint" class="hint-text">
        {{ hint }}
      </div>
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .input-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--neutral-100);
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-field {
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      padding-left: var(--spacing-10);
      padding-right: var(--spacing-10);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-lg);
      color: var(--neutral-100);
      font-size: 1rem;
      transition: var(--transition-all);
    }

    .input-field:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    .input-field::placeholder {
      color: var(--neutral-400);
    }

    .input-field:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .input-icon {
      position: absolute;
      color: var(--neutral-400);
      font-size: 1rem;
    }

    .input-icon.prefix {
      left: var(--spacing-4);
    }

    .input-icon.suffix {
      right: var(--spacing-4);
    }

    .toggle-password {
      position: absolute;
      right: var(--spacing-4);
      background: none;
      border: none;
      color: var(--neutral-400);
      cursor: pointer;
      padding: 0;
      font-size: 1rem;
    }

    .toggle-password:hover {
      color: var(--neutral-200);
    }

    .error-message {
      color: var(--error-500);
      font-size: 0.875rem;
      margin-top: var(--spacing-1);
    }

    .hint-text {
      color: var(--neutral-400);
      font-size: 0.875rem;
      margin-top: var(--spacing-1);
    }

    .has-error .input-field {
      border-color: var(--error-500);
    }

    .has-error .input-field:focus {
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    }

    .is-focused .input-field {
      border-color: var(--primary-500);
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() type = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() error = '';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() prefixIcon = '';
  @Input() suffixIcon = '';
  
  value = '';
  isFocused = false;
  showPassword = false;
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onFocus(): void {
    this.isFocused = true;
    this.onTouched();
  }

  onBlur(): void {
    this.isFocused = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
} 
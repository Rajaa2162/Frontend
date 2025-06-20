import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-container" [class.focused]="isFocused">
      <input
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        [class.error]="error"
      >
      <div class="error-message" *ngIf="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    .input-container {
      position: relative;
      width: 100%;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    input:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }

    input.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    .focused input {
      border-color: #4a90e2;
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
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() error: string = '';
  @Input() isFocused: boolean = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  value: any = '';
  isDisabled: boolean = false;
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(this.value);
  }

  onFocus() {
    this.isFocused = true;
    this.focus.emit();
  }

  onBlur() {
    this.isFocused = false;
    this.blur.emit();
  }
} 
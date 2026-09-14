import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
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
  @Input() placeholder = '';
  @Input() label?: string;
  @Input() icon?: string;
  @Input() required = false;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() accept?: string;
  @Input() maxlength?: number | string;
  @Input() min?: number | string;
  @Input() max?: number | string;
  @Input() rows = 3;
  @Input() customClass = '';
  @Input() autocomplete?: string;

  @Output() enterPress = new EventEmitter<void>();
  @Output() fileSelect = new EventEmitter<Event>();
  @Output() valueChange = new EventEmitter<any>();

  value: any = '';
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value !== undefined && value !== null ? value : '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const element = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (this.type === 'checkbox' && element instanceof HTMLInputElement) {
      this.value = element.checked;
    } else {
      this.value = element.value;
    }
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onFileChange(event: Event): void {
    this.fileSelect.emit(event);
  }

  onKeyUpEnter(): void {
    this.enterPress.emit();
  }

  onBlur(): void {
    this.onTouched();
  }
}

import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaskUtils } from '../../../core/utils/mask-utils';

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
  @Input() autocomplete?: string;
  @Input() customClass = '';
  @Input() mask?: 'phone' | 'cpf' | 'cnpj' | 'cep';

  get effectiveMaxLength(): number | string | null {
    if (this.maxlength !== undefined && this.maxlength !== null && this.maxlength !== '') {
      return this.maxlength;
    }
    if (this.mask === 'phone' || this.type === 'tel') return 15;
    if (this.mask === 'cpf') return 14;
    if (this.mask === 'cnpj') return 18;
    if (this.mask === 'cep') return 9;
    return null;
  }

  @Output() enterPress = new EventEmitter<void>();
  @Output() fileSelect = new EventEmitter<Event>();
  @Output() valueChange = new EventEmitter<any>();

  value: any = '';
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      if ((this.mask === 'phone' || this.type === 'tel') && typeof value === 'string') {
        this.value = MaskUtils.formatPhone(value);
      } else if (this.mask === 'cpf' && typeof value === 'string') {
        this.value = MaskUtils.formatCpf(value);
      } else if (this.mask === 'cnpj' && typeof value === 'string') {
        this.value = MaskUtils.formatCnpj(value);
      } else if (this.mask === 'cep' && typeof value === 'string') {
        this.value = MaskUtils.formatCep(value);
      } else {
        this.value = value;
      }
    } else {
      this.value = '';
    }
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
      let rawVal = element.value;
      if (this.mask === 'phone' || this.type === 'tel') {
        rawVal = MaskUtils.formatPhone(rawVal);
        element.value = rawVal;
      } else if (this.mask === 'cpf') {
        rawVal = MaskUtils.formatCpf(rawVal);
        element.value = rawVal;
      } else if (this.mask === 'cnpj') {
        rawVal = MaskUtils.formatCnpj(rawVal);
        element.value = rawVal;
      } else if (this.mask === 'cep') {
        rawVal = MaskUtils.formatCep(rawVal);
        element.value = rawVal;
      }
      this.value = rawVal;
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

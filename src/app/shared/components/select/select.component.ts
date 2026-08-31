import { Component, Input, OnInit, OnDestroy, forwardRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  subLabel?: string;
  icon?: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() id = '';
  @Input() placeholder = 'Selecione...';
  @Input() label?: string;
  @Input() options: SelectOption[] = [];
  @Input() required = false;
  @Input() error?: string;

  value: any = null;
  disabled = false;
  isOpen = false;

  private listener?: (event: Event) => void;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.listener = (event: Event) => {
      if (this.isOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
        this.isOpen = false;
        this.onTouched();
      }
    };
    // Usa capture phase para interceptar cliques e foco mesmo se houver stopPropagation em modais
    window.addEventListener('click', this.listener, true);
    window.addEventListener('focusin', this.listener, true);
  }

  ngOnDestroy(): void {
    if (this.listener) {
      window.removeEventListener('click', this.listener, true);
      window.removeEventListener('focusin', this.listener, true);
    }
  }

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
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (!this.isOpen) {
        this.onTouched();
      }
    }
  }

  selectOption(option: SelectOption): void {
    this.value = option.value;
    this.onChange(this.value);
    this.isOpen = false;
    this.onTouched();
  }

  getSelectedOption(): SelectOption | undefined {
    return this.options.find(opt => String(opt.value) === String(this.value));
  }
}

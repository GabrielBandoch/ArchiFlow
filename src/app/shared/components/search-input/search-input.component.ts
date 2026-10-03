import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true
    }
  ]
})
export class SearchInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() placeholder = 'Buscar...';
  @Input() debounce = 300;
  @Input() value = '';

  @Output() search = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  private searchSubject = new Subject<string>();
  private sub?: Subscription;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  disabled = false;

  ngOnInit(): void {
    this.sub = this.searchSubject.pipe(
      debounceTime(this.debounce),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.search.emit(term);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  writeValue(val: string): void {
    this.value = val || '';
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

  onInput(term: string): void {
    this.value = term;
    this.onChange(term);
    this.valueChange.emit(term);
    this.searchSubject.next(term);
  }

  limpar(): void {
    this.value = '';
    this.onChange('');
    this.valueChange.emit('');
    this.search.emit('');
  }
}

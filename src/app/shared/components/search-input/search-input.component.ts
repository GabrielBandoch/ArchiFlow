import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Buscar...';
  @Input() debounce = 300;
  @Input() value = '';

  @Output() search = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  private searchSubject = new Subject<string>();
  private sub?: Subscription;

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

  onInput(term: string): void {
    this.value = term;
    this.valueChange.emit(term);
    this.searchSubject.next(term);
  }

  limpar(): void {
    this.value = '';
    this.valueChange.emit('');
    this.search.emit('');
  }
}

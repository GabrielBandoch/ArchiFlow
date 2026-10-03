import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, forwardRef, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Lead } from '../../../models/lead.model';
import { ButtonComponent } from '../button/button.component';
import { LeadService } from '../../../core/api/leads/lead.service';
import { SelecionarLeadModalComponent } from '../../../dialogs/leads/selecionar-lead-modal/selecionar-lead-modal.component';

@Component({
  selector: 'app-lead-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SelecionarLeadModalComponent],
  templateUrl: './lead-search.component.html',
  styleUrl: './lead-search.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LeadSearchComponent),
      multi: true
    }
  ]
})
export class LeadSearchComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() id = '';
  @Input() label?: string;
  @Input() placeholder = 'Buscar lead por nome ou e-mail...';
  @Input() required = false;
  @Input() error?: string;
  @Input() leads: Lead[] = [];

  @Output() leadSelected = new EventEmitter<Lead | null>();

  private leadService = inject(LeadService, { optional: true });

  leadSelecionado: Lead | null = null;
  searchText = '';
  sugestoes: Lead[] = [];
  showDropdown = false;
  showModal = false;
  disabled = false;
  private pendingValue: any = null;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if ((!this.leads || this.leads.length === 0) && this.leadService) {
      this.carregarLeadsDoServico();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leads']) {
      if (this.pendingValue) {
        this.writeValue(this.pendingValue);
      }
    }
  }

  private carregarLeadsDoServico(): void {
    if (!this.leadService) return;
    this.leadService.obterTodos().subscribe({
      next: (data) => {
        this.leads = data;
        if (this.pendingValue) {
          this.writeValue(this.pendingValue);
        }
      },
      error: (err) => console.error('Erro ao buscar leads no LeadSearchComponent', err)
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  writeValue(value: any): void {
    this.pendingValue = value;
    if (!value) {
      this.leadSelecionado = null;
      this.searchText = '';
      return;
    }

    if (typeof value === 'string') {
      const lead = (this.leads || []).find(l => l.id === value);
      if (lead) {
        this.leadSelecionado = lead;
        this.searchText = lead.nome;
      }
    } else if (typeof value === 'object' && value.id) {
      this.leadSelecionado = value;
      this.searchText = value.nome || '';
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

  onInputSearch(): void {
    const q = this.searchText.trim().toLowerCase();
    if (q.length >= 2) {
      this.sugestoes = (this.leads || []).filter(l => 
        l.nome.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.telefone && l.telefone.toLowerCase().includes(q))
      );
      this.showDropdown = true;
    } else {
      this.sugestoes = [];
      this.showDropdown = false;
    }
  }

  selecionarLead(lead: Lead): void {
    this.leadSelecionado = lead;
    this.searchText = lead.nome;
    this.showDropdown = false;
    this.pendingValue = lead.id;
    this.onChange(lead.id);
    this.onTouched();
    this.leadSelected.emit(lead);
  }

  limparSelecao(): void {
    this.leadSelecionado = null;
    this.searchText = '';
    this.showDropdown = false;
    this.pendingValue = null;
    this.onChange(null);
    this.onTouched();
    this.leadSelected.emit(null);
  }

  abrirModal(): void {
    if (this.disabled) return;
    this.showModal = true;
    this.showDropdown = false;
  }

  fecharModal(): void {
    this.showModal = false;
  }

  selecionarViaModal(lead: Lead): void {
    this.selecionarLead(lead);
    this.fecharModal();
  }
}

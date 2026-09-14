import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, forwardRef, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Cliente } from '../../../models/cliente.model';
import { ButtonComponent } from '../button/button.component';
import { ClienteService } from '../../../core/api/clientes/cliente.service';
import { SelecionarClienteModalComponent } from '../../../dialogs/clientes/selecionar-cliente-modal/selecionar-cliente-modal.component';

@Component({
  selector: 'app-client-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SelecionarClienteModalComponent],
  templateUrl: './client-search.component.html',
  styleUrl: './client-search.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClientSearchComponent),
      multi: true
    }
  ]
})
export class ClientSearchComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() id = '';
  @Input() label?: string;
  @Input() placeholder = 'Digite ao menos 3 letras para pesquisar...';
  @Input() required = false;
  @Input() error?: string;
  @Input() clientes: Cliente[] = [];

  @Output() clientSelected = new EventEmitter<Cliente | null>();

  private clienteService = inject(ClienteService, { optional: true });

  clienteSelecionado: Cliente | null = null;
  searchText = '';
  sugestoes: Cliente[] = [];
  showDropdown = false;
  showModal = false;
  disabled = false;
  private pendingValue: any = null;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if ((!this.clientes || this.clientes.length === 0) && this.clienteService) {
      this.carregarClientesDoServico();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientes']) {
      if (this.pendingValue) {
        this.writeValue(this.pendingValue);
      }
    }
  }

  private carregarClientesDoServico(): void {
    if (!this.clienteService) return;
    this.clienteService.obterTodos().subscribe({
      next: (data) => {
        this.clientes = data;
        if (this.pendingValue) {
          this.writeValue(this.pendingValue);
        }
      },
      error: (err) => console.error('Erro ao buscar clientes no ClientSearchComponent', err)
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
      this.clienteSelecionado = null;
      this.searchText = '';
      return;
    }

    if (typeof value === 'string') {
      const cli = (this.clientes || []).find(c => c.id === value);
      if (cli) {
        this.clienteSelecionado = cli;
        this.searchText = cli.nome;
      }
    } else if (typeof value === 'object' && value.id) {
      this.clienteSelecionado = value;
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
    if (q.length >= 3) {
      this.sugestoes = (this.clientes || []).filter(c => 
        c.nome.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) ||
        (c.cpfCnpj && c.cpfCnpj.toLowerCase().includes(q)) ||
        (c.telefone && c.telefone.toLowerCase().includes(q))
      );
      this.showDropdown = true;
    } else {
      this.sugestoes = [];
      this.showDropdown = false;
    }
  }

  selecionarCliente(cliente: Cliente): void {
    this.clienteSelecionado = cliente;
    this.searchText = cliente.nome;
    this.showDropdown = false;
    this.pendingValue = cliente.id;
    this.onChange(cliente.id);
    this.onTouched();
    this.clientSelected.emit(cliente);
  }

  limparSelecao(): void {
    this.clienteSelecionado = null;
    this.searchText = '';
    this.showDropdown = false;
    this.pendingValue = null;
    this.onChange(null);
    this.onTouched();
    this.clientSelected.emit(null);
  }

  abrirModal(): void {
    if ((!this.clientes || this.clientes.length === 0) && this.clienteService) {
      this.carregarClientesDoServico();
    }
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
  }

  selecionarViaModal(cliente: Cliente): void {
    this.selecionarCliente(cliente);
    this.fecharModal();
  }
}

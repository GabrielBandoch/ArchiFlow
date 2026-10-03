import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, forwardRef, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Projeto } from '../../../models/projeto.model';
import { ButtonComponent } from '../button/button.component';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { SelecionarProjetoModalComponent } from '../../../dialogs/projetos/selecionar-projeto-modal/selecionar-projeto-modal.component';

@Component({
  selector: 'app-project-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SelecionarProjetoModalComponent],
  templateUrl: './project-search.component.html',
  styleUrl: './project-search.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProjectSearchComponent),
      multi: true
    }
  ]
})
export class ProjectSearchComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() id = '';
  @Input() label?: string;
  @Input() placeholder = 'Buscar projeto por nome...';
  @Input() required = false;
  @Input() error?: string;
  @Input() projetos: Projeto[] = [];

  @Output() projectSelected = new EventEmitter<Projeto | null>();

  private projetoService = inject(ProjetoService, { optional: true });

  projetoSelecionado: Projeto | null = null;
  searchText = '';
  sugestoes: Projeto[] = [];
  showDropdown = false;
  showModal = false;
  disabled = false;
  private pendingValue: any = null;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if ((!this.projetos || this.projetos.length === 0) && this.projetoService) {
      this.carregarProjetosDoServico();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projetos']) {
      if (this.pendingValue) {
        this.writeValue(this.pendingValue);
      }
    }
  }

  private carregarProjetosDoServico(): void {
    if (!this.projetoService) return;
    this.projetoService.obterTodos().subscribe({
      next: (data) => {
        this.projetos = data;
        if (this.pendingValue) {
          this.writeValue(this.pendingValue);
        }
      },
      error: (err) => console.error('Erro ao buscar projetos no ProjectSearchComponent', err)
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
      this.projetoSelecionado = null;
      this.searchText = '';
      return;
    }

    if (typeof value === 'string') {
      const proj = (this.projetos || []).find(p => p.id === value);
      if (proj) {
        this.projetoSelecionado = proj;
        this.searchText = proj.nome;
      }
    } else if (typeof value === 'object' && value.id) {
      this.projetoSelecionado = value;
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
      this.sugestoes = (this.projetos || []).filter(p => 
        p.nome.toLowerCase().includes(q) ||
        (p.clienteNome && p.clienteNome.toLowerCase().includes(q))
      );
      this.showDropdown = true;
    } else {
      this.sugestoes = [];
      this.showDropdown = false;
    }
  }

  selecionarProjeto(projeto: Projeto): void {
    this.projetoSelecionado = projeto;
    this.searchText = projeto.nome;
    this.showDropdown = false;
    this.pendingValue = projeto.id;
    this.onChange(projeto.id);
    this.onTouched();
    this.projectSelected.emit(projeto);
  }

  limparSelecao(): void {
    this.projetoSelecionado = null;
    this.searchText = '';
    this.showDropdown = false;
    this.pendingValue = null;
    this.onChange(null);
    this.onTouched();
    this.projectSelected.emit(null);
  }

  abrirModal(): void {
    if (this.disabled) return;
    if ((!this.projetos || this.projetos.length === 0) && this.projetoService) {
      this.carregarProjetosDoServico();
    }
    this.showModal = true;
    this.showDropdown = false;
  }

  fecharModal(): void {
    this.showModal = false;
  }

  selecionarViaModal(projeto: Projeto): void {
    this.selecionarProjeto(projeto);
    this.fecharModal();
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
  ElementRef,
  HostListener,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { Fornecedor } from "../../../core/models/fornecedor.model";
import { ButtonComponent } from "../button/button.component";
import { FornecedorService } from "../../../core/api/fornecedores/fornecedor.service";
import { NotificationService } from "../../../core/services/notification.service";
import { SelecionarFornecedorModalComponent } from "../../../dialogs/fornecedores/selecionar-fornecedor-modal/selecionar-fornecedor-modal.component";
import { PhoneMaskPipe } from "../../../core/pipes/phone-mask.pipe";

@Component({
  selector: "app-fornecedor-search, app-partner-search",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    SelecionarFornecedorModalComponent,
    PhoneMaskPipe,
  ],
  templateUrl: "./fornecedor-search.component.html",
  styleUrl: "./fornecedor-search.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FornecedorSearchComponent),
      multi: true,
    },
  ],
})
export class FornecedorSearchComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  @Input() id = "";
  @Input() label?: string;
  @Input() placeholder = "Buscar parceiro por nome ou especialidade...";
  @Input() required = false;
  @Input() error?: string;
  @Input() fornecedores: Fornecedor[] = [];

  @Output() fornecedorSelected = new EventEmitter<Fornecedor | null>();

  private fornecedorService = inject(FornecedorService, { optional: true });
  private notificationService = inject(NotificationService, { optional: true });
  private elementRef = inject(ElementRef);

  fornecedorSelecionado: Fornecedor | null = null;
  searchText = "";
  sugestoes: Fornecedor[] = [];
  showDropdown = false;
  showModal = false;
  disabled = false;
  private pendingValue: string | Fornecedor | null = null;

  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    if (
      (!this.fornecedores || this.fornecedores.length === 0) &&
      this.fornecedorService
    ) {
      this.carregarFornecedoresDoServico();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["fornecedores"]) {
      if (this.pendingValue) {
        this.writeValue(this.pendingValue);
      }
    }
  }

  private carregarFornecedoresDoServico(): void {
    if (!this.fornecedorService) return;
    this.fornecedorService.obterTodos().subscribe({
      next: (data) => {
        this.fornecedores = data;
        if (this.pendingValue) {
          this.writeValue(this.pendingValue);
        }
      },
      error: () => {
        this.notificationService?.warning(
          "Não foi possível carregar a lista de parceiros.",
        );
      },
    });
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  writeValue(value: unknown): void {
    this.pendingValue = value as string | Fornecedor | null;
    if (!value) {
      this.fornecedorSelecionado = null;
      this.searchText = "";
      return;
    }

    if (typeof value === "string") {
      const forn = (this.fornecedores || []).find((f) => f.id === value);
      if (forn) {
        this.fornecedorSelecionado = forn;
        this.searchText = forn.nome;
      }
    } else if (typeof value === "object" && (value as Fornecedor).id) {
      const forn = value as Fornecedor;
      this.fornecedorSelecionado = forn;
      this.searchText = forn.nome || "";
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputSearch(): void {
    const q = this.searchText.trim().toLowerCase();
    if (q.length >= 2) {
      this.sugestoes = (this.fornecedores || []).filter(
        (f) =>
          (f.nome && f.nome.toLowerCase().includes(q)) ||
          (f.especialidade && f.especialidade.toLowerCase().includes(q)) ||
          (f.email && f.email.toLowerCase().includes(q)) ||
          (f.telefone && f.telefone.toLowerCase().includes(q)) ||
          (f.cidade && f.cidade.toLowerCase().includes(q)),
      );
      this.showDropdown = true;
    } else {
      this.sugestoes = [];
      this.showDropdown = false;
    }
  }

  selecionarFornecedor(fornecedor: Fornecedor): void {
    this.fornecedorSelecionado = fornecedor;
    this.searchText = fornecedor.nome;
    this.showDropdown = false;
    this.pendingValue = fornecedor.id;
    this.onChange(fornecedor.id);
    this.onTouched();
    this.fornecedorSelected.emit(fornecedor);
  }

  limparSelecao(): void {
    this.fornecedorSelecionado = null;
    this.searchText = "";
    this.showDropdown = false;
    this.pendingValue = null;
    this.onChange(null);
    this.onTouched();
    this.fornecedorSelected.emit(null);
  }

  abrirModal(): void {
    if (
      (!this.fornecedores || this.fornecedores.length === 0) &&
      this.fornecedorService
    ) {
      this.carregarFornecedoresDoServico();
    }
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
  }

  selecionarViaModal(fornecedor: Fornecedor): void {
    this.selecionarFornecedor(fornecedor);
    this.fecharModal();
  }
}

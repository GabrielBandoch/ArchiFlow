import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Fornecedor } from "../../../models/fornecedor.model";
import { FornecedorService } from "../../../core/api/fornecedores/fornecedor.service";
import { DialogComponent } from "../../../shared/components/dialog/dialog.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { PhoneMaskPipe } from "../../../core/pipes/phone-mask.pipe";

@Component({
  selector: "app-selecionar-fornecedor-modal",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogComponent,
    ButtonComponent,
    PhoneMaskPipe,
  ],
  templateUrl: "./selecionar-fornecedor-modal.component.html",
  styleUrl: "./selecionar-fornecedor-modal.component.scss",
})
export class SelecionarFornecedorModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() fornecedores: Fornecedor[] = [];
  @Input() initialSearchText = "";

  @Output() close = new EventEmitter<void>();
  @Output() fornecedorSelected = new EventEmitter<Fornecedor>();

  private fornecedorService = inject(FornecedorService, { optional: true });

  modalSearchText = "";
  modalFornecedoresFiltrados: Fornecedor[] = [];
  paginaAtual = 1;
  itensPorPagina = 5;

  get totalPaginas(): number {
    return (
      Math.ceil(this.modalFornecedoresFiltrados.length / this.itensPorPagina) ||
      1
    );
  }

  get fornecedoresPaginados(): Fornecedor[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.modalFornecedoresFiltrados.slice(
      inicio,
      inicio + this.itensPorPagina,
    );
  }

  ngOnInit(): void {
    this.modalSearchText = this.initialSearchText || "";
    if (
      (!this.fornecedores || this.fornecedores.length === 0) &&
      this.fornecedorService
    ) {
      this.fornecedorService.obterTodos().subscribe({
        next: (data) => {
          this.fornecedores = data;
          this.filtrarModal();
        },
        error: (err) => console.error("Erro ao buscar parceiros no modal", err),
      });
    } else {
      this.filtrarModal();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["show"] && this.show) {
      this.modalSearchText = this.initialSearchText || "";
      if (
        (!this.fornecedores || this.fornecedores.length === 0) &&
        this.fornecedorService
      ) {
        this.fornecedorService.obterTodos().subscribe({
          next: (data) => {
            this.fornecedores = data;
            this.filtrarModal();
          },
          error: (err) =>
            console.error("Erro ao buscar parceiros no modal", err),
        });
      } else {
        this.filtrarModal();
      }
    }
    if (changes["fornecedores"]) {
      this.filtrarModal();
    }
  }

  filtrarModal(): void {
    let result = this.fornecedores || [];
    if (this.modalSearchText.trim()) {
      const q = this.modalSearchText.toLowerCase();
      result = result.filter(
        (f) =>
          (f.nome && f.nome.toLowerCase().includes(q)) ||
          (f.especialidade && f.especialidade.toLowerCase().includes(q)) ||
          (f.email && f.email.toLowerCase().includes(q)) ||
          (f.telefone && f.telefone.toLowerCase().includes(q)) ||
          (f.cidade && f.cidade.toLowerCase().includes(q)) ||
          (f.estado && f.estado.toLowerCase().includes(q)),
      );
    }
    this.modalFornecedoresFiltrados = result;
    this.paginaAtual = 1;
  }

  selecionarViaModal(fornecedor: Fornecedor): void {
    this.fornecedorSelected.emit(fornecedor);
    this.onClose();
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }

  onClose(): void {
    this.close.emit();
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Fornecedor } from '../../models/fornecedor.model';
import { FornecedorService } from '../../core/api/fornecedores/fornecedor.service';
import { DialogService } from '../../core/services/dialog.service';
import { NotificationService } from '../../core/services/notification.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { FornecedorModalComponent } from '../../dialogs/fornecedores/fornecedor-modal/fornecedor-modal.component';
import { AvaliarFornecedorModalComponent } from '../../dialogs/fornecedores/avaliar-fornecedor-modal/avaliar-fornecedor-modal.component';
import { WhatsAppButtonComponent } from '../../shared/components/whatsapp-button/whatsapp-button.component';
import { PhoneMaskPipe } from '../../core/pipes/phone-mask.pipe';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    BadgeComponent,
    EmptyStateComponent,
    SearchInputComponent,
    SelectComponent,
    FornecedorModalComponent,
    AvaliarFornecedorModalComponent,
    WhatsAppButtonComponent,
    PhoneMaskPipe
  ],
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.scss']
})
export class FornecedoresComponent implements OnInit {
  private fornecedorService = inject(FornecedorService);
  private dialogService = inject(DialogService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  fornecedores: Fornecedor[] = [];
  carregando = false;
  termoBusca = '';
  especialidadeSelecionada = 'todos';
  filtroClassificacao = 'qualquer';

  modalCadastroAberto = false;
  modalAvaliarAberto = false;
  fornecedorSelecionado?: Fornecedor;

  readonly especialidadesChips = [
    { label: 'Todos', value: 'todos' },
    { label: 'Iluminação', value: 'Iluminação' },
    { label: 'Pisos', value: 'Pisos' },
    { label: 'Estrutural', value: 'Estrutural' },
    { label: 'Marcenaria', value: 'Marcenaria' },
    { label: 'Vidraçaria', value: 'Vidraçaria' },
    { label: 'Paisagismo', value: 'Paisagismo' }
  ];

  readonly classificacaoOptions: SelectOption[] = [
    { label: 'Qualquer Avaliação', value: 'qualquer' },
    { label: '4.5+ estrelas', value: '4.5' },
    { label: '4.0+ estrelas', value: '4.0' },
    { label: '3.0+ estrelas', value: '3.0' }
  ];

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.carregando = true;
    this.fornecedorService.obterTodos(this.especialidadeSelecionada).subscribe({
      next: (dados) => {
        this.fornecedores = dados;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error('Erro ao carregar lista de parceiros.');
      }
    });
  }

  filtrarPorEspecialidade(esp: string): void {
    this.especialidadeSelecionada = esp;
    this.carregarFornecedores();
  }

  get fornecedoresFiltrados(): Fornecedor[] {
    let lista = this.fornecedores;

    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase().trim();
      lista = lista.filter(f => 
        f.nome.toLowerCase().includes(termo) ||
        f.especialidade.toLowerCase().includes(termo) ||
        (f.cidade && f.cidade.toLowerCase().includes(termo))
      );
    }

    if (this.filtroClassificacao !== 'qualquer') {
      const minNota = parseFloat(this.filtroClassificacao);
      lista = lista.filter(f => f.avaliacaoMedia >= minNota);
    }

    return lista;
  }

  abrirModalNovo(): void {
    this.fornecedorSelecionado = undefined;
    this.modalCadastroAberto = true;
  }

  abrirModalEditar(fornecedor: Fornecedor, event?: Event): void {
    event?.stopPropagation();
    this.fornecedorSelecionado = fornecedor;
    this.modalCadastroAberto = true;
  }

  abrirModalAvaliar(fornecedor: Fornecedor, event?: Event): void {
    event?.stopPropagation();
    this.fornecedorSelecionado = fornecedor;
    this.modalAvaliarAberto = true;
  }

  verDetalhes(fornecedor: Fornecedor): void {
    this.router.navigate(['/fornecedores', fornecedor.id]);
  }

  excluir(fornecedor: Fornecedor, event?: Event): void {
    event?.stopPropagation();
    this.dialogService.confirm({
      title: 'Remover Parceiro',
      message: `Tem certeza que deseja remover o parceiro ${fornecedor.nome}?`,
      confirmLabel: 'Sim, remover',
      cancelLabel: 'Cancelar',
      variant: 'danger'
    }).subscribe(confirmou => {
      if (!confirmou) return;

      this.fornecedorService.excluir(fornecedor.id).subscribe({
        next: () => {
          this.notificationService.success(`Parceiro ${fornecedor.nome} removido.`);
          this.carregarFornecedores();
        },
        error: () => this.notificationService.error('Não foi possível remover o parceiro.')
      });
    });
  }

  onFornecedorSalvo(): void {
    this.modalCadastroAberto = false;
    this.carregarFornecedores();
  }

  onFornecedorAvaliado(): void {
    this.modalAvaliarAberto = false;
    this.carregarFornecedores();
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Fornecedor, AvaliacaoFornecedor, ProjetoFornecedor, VincularProjetoCommand } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../core/api/fornecedores/fornecedor.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { Projeto } from '../../../models/projeto.model';
import { DialogService } from '../../../core/services/dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { WhatsAppButtonComponent } from '../../../shared/components/whatsapp-button/whatsapp-button.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { SelectComponent, SelectOption } from '../../../shared/components/select/select.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ProjectSearchComponent } from '../../../shared/components/project-search/project-search.component';
import { PhoneMaskPipe } from '../../../core/pipes/phone-mask.pipe';
import { FornecedorModalComponent } from '../../../dialogs/fornecedores/fornecedor-modal/fornecedor-modal.component';
import { AvaliarFornecedorModalComponent } from '../../../dialogs/fornecedores/avaliar-fornecedor-modal/avaliar-fornecedor-modal.component';

@Component({
  selector: 'app-detalhes-fornecedor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    BadgeComponent,
    EmptyStateComponent,
    WhatsAppButtonComponent,
    DialogComponent,
    SelectComponent,
    InputComponent,
    ProjectSearchComponent,
    PhoneMaskPipe,
    FornecedorModalComponent,
    AvaliarFornecedorModalComponent
  ],
  templateUrl: './detalhes-fornecedor.component.html',
  styleUrls: ['./detalhes-fornecedor.component.scss']
})
export class DetalhesFornecedorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private fornecedorService = inject(FornecedorService);
  private projetoService = inject(ProjetoService);
  private dialogService = inject(DialogService);
  private notificationService = inject(NotificationService);

  fornecedorId = '';
  fornecedor?: Fornecedor;
  carregando = true;

  modalEditarAberto = false;
  modalAvaliarAberto = false;
  modalVincularAberto = false;

  todosProjetos: Projeto[] = [];
  projetosOptions: SelectOption[] = [];
  formVinculo!: FormGroup;
  salvandoVinculo = false;
  submittedVinculo = false;

  get avaliacoes(): AvaliacaoFornecedor[] {
    return this.fornecedor?.avaliacoes || [];
  }

  get projetosVinculados(): any[] {
    return this.fornecedor?.projetosVinculados || [];
  }

  get fVinculo() {
    return this.formVinculo.controls;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.voltar();
      return;
    }
    this.fornecedorId = id;

    this.formVinculo = this.fb.group({
      projetoId: ['', Validators.required],
      funcaoNoProjeto: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.carregarProjetos();
    this.carregarFornecedor();
  }

  carregarProjetos(): void {
    this.projetoService.obterTodos().subscribe({
      next: (projetos) => {
        this.todosProjetos = projetos;
        this.atualizarOptionsProjetos();
      }
    });
  }

  atualizarOptionsProjetos(): void {
    const idsVinculados = new Set(this.projetosVinculados.map(p => p.projetoId));
    this.projetosOptions = this.todosProjetos
      .filter(p => !idsVinculados.has(p.id))
      .map(p => ({
        label: p.nome,
        value: p.id
      }));
  }

  obterNomeProjeto(projetoId: string): string {
    const proj = this.todosProjetos.find(p => p.id === projetoId);
    return proj ? proj.nome : `Projeto #${projetoId.substring(0, 8)}`;
  }

  carregarFornecedor(): void {
    this.carregando = true;
    this.fornecedorService.obterPorId(this.fornecedorId).subscribe({
      next: (f) => {
        this.fornecedor = f;
        this.carregando = false;
        this.atualizarOptionsProjetos();
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error('Fornecedor não encontrado.');
        this.voltar();
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/fornecedores']);
  }

  abrirModalEditar(): void {
    this.modalEditarAberto = true;
  }

  abrirModalAvaliar(): void {
    this.modalAvaliarAberto = true;
  }

  abrirModalVincular(): void {
    this.submittedVinculo = false;
    this.formVinculo.reset();
    this.atualizarOptionsProjetos();
    this.modalVincularAberto = true;
  }

  fecharModalVincular(): void {
    this.modalVincularAberto = false;
  }

  salvarVinculo(): void {
    this.submittedVinculo = true;
    if (this.formVinculo.invalid || !this.fornecedor) {
      this.formVinculo.markAllAsTouched();
      return;
    }

    this.salvandoVinculo = true;
    const cmd: VincularProjetoCommand = {
      fornecedorId: this.fornecedor.id,
      projetoId: this.formVinculo.value.projetoId,
      funcaoNoProjeto: this.formVinculo.value.funcaoNoProjeto
    };

    this.fornecedorService.vincularProjeto(this.fornecedor.id, cmd).subscribe({
      next: () => {
        this.salvandoVinculo = false;
        this.modalVincularAberto = false;
        this.notificationService.success('Parceiro vinculado à obra com sucesso!');
        this.carregarFornecedor();
      },
      error: () => {
        this.salvandoVinculo = false;
        this.notificationService.error('Erro ao vincular parceiro à obra.');
      }
    });
  }

  desvincular(vinculo: ProjetoFornecedor): void {
    const nomeProj = this.obterNomeProjeto(vinculo.projetoId);
    this.dialogService.confirm({
      title: 'Desvincular Parceiro',
      message: `Deseja desvincular ${this.fornecedor?.nome} da obra "${nomeProj}"?`,
      confirmLabel: 'Sim, desvincular',
      cancelLabel: 'Cancelar',
      variant: 'danger'
    }).subscribe(confirmou => {
      if (!confirmou) return;

      this.fornecedorService.desvincularProjeto(vinculo.id).subscribe({
        next: () => {
          this.notificationService.success('Parceiro desvinculado da obra com sucesso.');
          this.carregarFornecedor();
        },
        error: () => {
          this.notificationService.error('Erro ao desvincular parceiro.');
        }
      });
    });
  }

  onFornecedorSalvo(f: Fornecedor): void {
    this.fornecedor = f;
    this.modalEditarAberto = false;
    this.carregarFornecedor();
  }

  onAvaliacaoRegistrada(): void {
    this.modalAvaliarAberto = false;
    this.carregarFornecedor();
  }

  excluir(): void {
    if (!this.fornecedor) return;

    this.dialogService.confirm({
      title: 'Remover Fornecedor',
      message: `Tem certeza que deseja remover o cadastro de ${this.fornecedor.nome}? Esta ação é irreversível.`,
      confirmLabel: 'Sim, remover',
      cancelLabel: 'Cancelar',
      variant: 'danger'
    }).subscribe(confirmou => {
      if (!confirmou) return;

      this.fornecedorService.excluir(this.fornecedorId).subscribe({
        next: () => {
          this.notificationService.success('Fornecedor removido com sucesso.');
          this.voltar();
        },
        error: () => {
          this.notificationService.error('Erro ao remover fornecedor.');
        }
      });
    });
  }

  copiarTexto(texto?: string, label = 'Informação'): void {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    this.notificationService.success(`${label} copiado para a área de transferência!`);
  }
}

import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { FinanceiroService } from '../../../core/api/financeiro/financeiro.service';
import { ProjetoService } from '../../../core/api/projetos/projeto.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoriaDespesa, DespesaProjeto } from '../../../models/financeiro.model';
import { Projeto } from '../../../models/projeto.model';
import { SelectOption } from '../../../shared/components/select/select.component';
import { CriarDespesaCommand } from '../../../commands/financeiro.commands';

@Component({
  selector: 'app-criar-despesa-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CORE_IMPORTS,
    FORM_IMPORTS,
    DESIGN_SYSTEM
  ],
  templateUrl: './criar-despesa-modal.component.html',
  styleUrl: './criar-despesa-modal.component.scss'
})
export class CriarDespesaModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private financeiroService = inject(FinanceiroService);
  private projetoService = inject(ProjetoService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  @Input() preselectedProjectId?: string;
  @Output() close = new EventEmitter<void>();
  @Output() salva = new EventEmitter<DespesaProjeto>();

  form!: FormGroup;
  projetos: Projeto[] = [];
  projetoOptions: SelectOption[] = [];
  saving = false;
  uploadingFile = false;
  arquivoSelecionado: File | null = null;

  categoriaOptions: SelectOption[] = [
    { value: CategoriaDespesa.PlotagemImpressao, label: 'Plotagem & Impressão' },
    { value: CategoriaDespesa.DeslocamentoVisita, label: 'Deslocamento & Visitas Técnicas' },
    { value: CategoriaDespesa.SoftwareLicencas, label: 'Softwares & Licenças' },
    { value: CategoriaDespesa.Subcontratacao, label: 'Subcontratação / Consultorias' },
    { value: CategoriaDespesa.TaxasPrefeitura, label: 'Taxas de Prefeitura & Órgãos' },
    { value: CategoriaDespesa.Maquetes3D, label: 'Maquetes & Renders 3D' },
    { value: CategoriaDespesa.Outros, label: 'Outras Despesas' }
  ];

  ngOnInit(): void {
    const hoje = new Date().toISOString().substring(0, 10);

    this.form = this.fb.group({
      projetoId: [this.preselectedProjectId || '', [Validators.required]],
      descricao: ['', [Validators.required]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      dataDespesa: [hoje, [Validators.required]],
      categoria: [CategoriaDespesa.PlotagemImpressao, [Validators.required]],
      observacoes: [''],
      comprovanteUrl: ['']
    });

    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.projetoService.obterTodos().subscribe({
      next: (data) => {
        this.projetos = data;
        this.projetoOptions = data.map(p => ({
          value: p.id,
          label: p.nome
        }));
        if (this.preselectedProjectId) {
          this.form.patchValue({ projetoId: this.preselectedProjectId });
        }
      },
      error: (err) => console.error('Erro ao carregar projetos', err)
    });
  }

  onClose(): void {
    this.arquivoSelecionado = null;
    this.uploadingFile = false;
    this.close.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 20 * 1024 * 1024) {
        this.notificationService.error('O arquivo excede o limite máximo de 20 MB.');
        input.value = '';
        return;
      }
      this.arquivoSelecionado = file;
    }
  }

  removerArquivo(fileInput?: HTMLInputElement): void {
    this.arquivoSelecionado = null;
    this.form.patchValue({ comprovanteUrl: '' });
    if (fileInput) fileInput.value = '';
  }

  getFileIcon(nome?: string): string {
    if (!nome) return 'description';
    const ext = nome.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) return 'image';
    if (ext === 'pdf') return 'picture_as_pdf';
    return 'description';
  }

  formatarTamanho(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.warning('Preencha os campos obrigatórios da saída financeira.');
      return;
    }

    if (this.arquivoSelecionado) {
      this.saving = true;
      this.uploadingFile = true;
      this.financeiroService.uploadComprovante(this.arquivoSelecionado).subscribe({
        next: (uploadRes) => {
          this.uploadingFile = false;
          this.form.patchValue({ comprovanteUrl: uploadRes.url });
          this.executarCriarDespesa(uploadRes.url);
        },
        error: (err) => {
          this.saving = false;
          this.uploadingFile = false;
          console.error('Erro ao enviar comprovante', err);
          this.notificationService.error('Erro ao enviar arquivo para o servidor.');
        }
      });
    } else {
      this.saving = true;
      this.executarCriarDespesa(this.form.value.comprovanteUrl);
    }
  }

  private executarCriarDespesa(comprovanteUrl?: string): void {
    const val = this.form.value;

    const command: CriarDespesaCommand = {
      projetoId: val.projetoId,
      descricao: val.descricao,
      valor: Number(val.valor),
      dataDespesa: new Date(val.dataDespesa).toISOString(),
      categoria: val.categoria,
      observacoes: val.observacoes || undefined,
      comprovanteUrl: comprovanteUrl || undefined
    };

    this.financeiroService.criarDespesa(command).subscribe({
      next: (res) => {
        this.saving = false;
        this.notificationService.success('Despesa registrada com sucesso!');
        this.salva.emit(res);
        this.onClose();
      },
      error: (err) => {
        this.saving = false;
        const msg = err.error?.mensagem || err.error?.message || 'Erro ao registrar despesa.';
        this.notificationService.error(msg);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ConfiguracaoPropostaService } from '../../../core/services/configuracao-proposta.service';
import { ConfiguracaoProposta, CONFIGURACAO_PROPOSTA_PADRAO } from '../../../core/models/configuracao-proposta.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NotificationService } from '../../../core/services/notification.service';
import { environment } from '../../../../environments/environment';
import { WhatsAppUtils } from '../../../core/utils/whatsapp-utils';

@Component({
  selector: 'app-configuracao-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './configuracao-empresa.component.html',
  styleUrls: ['./configuracao-empresa.component.scss']
})
export class ConfiguracaoEmpresaComponent implements OnInit {
  public form!: FormGroup;
  public salvando = false;
  public enviandoLogo = false;

  public readonly paletasPredefinidas = [
    { nome: 'Terracota', cor: '#765538' },
    { nome: 'Grafite', cor: '#2d3238' },
    { nome: 'Azul Petróleo', cor: '#1e3a47' },
    { nome: 'Ocre Nobre', cor: '#946638' },
    { nome: 'Verde Oliva', cor: '#37473a' },
    { nome: 'Bordô', cor: '#582b2b' }
  ];

  constructor(
    private fb: FormBuilder,
    private configService: ConfiguracaoPropostaService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.iniciarForm();
    this.carregarDados();
  }

  private iniciarForm(): void {
    this.form = this.fb.group({
      nomeEscritorio: ['', [Validators.required, Validators.maxLength(150)]],
      slogan: ['', [Validators.maxLength(250)]],
      registroProfissional: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      endereco: [''],
      logoUrl: [''],
      corPrimaria: ['#765538'],
      templateMensagemWhatsapp: ['']
    });
  }

  private carregarDados(): void {
    const configAtual = this.configService.getConfiguracao();
    this.preencherForm(configAtual);

    this.configService.carregarDoServidor(true).subscribe({
      next: (servidor) => {
        if (servidor) {
          this.preencherForm(servidor);
        }
      }
    });
  }

  private preencherForm(cfg: ConfiguracaoProposta): void {
    this.form.patchValue({
      nomeEscritorio: cfg.nomeEscritorio || '',
      slogan: cfg.slogan || '',
      registroProfissional: cfg.registroProfissional || '',
      email: cfg.email || '',
      telefone: cfg.telefone || '',
      endereco: cfg.endereco || '',
      logoUrl: cfg.logoUrl || '',
      corPrimaria: cfg.corPrimaria || '#765538',
      templateMensagemWhatsapp: cfg.templateMensagemWhatsapp || ''
    });
  }

  public selecionarCor(cor: string): void {
    this.form.patchValue({ corPrimaria: cor });
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.notificationService.warning('Por favor, selecione um arquivo de imagem válido (PNG, SVG, JPG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      this.notificationService.warning('A imagem do logotipo deve ter no máximo 20MB.');
      return;
    }

    this.enviandoLogo = true;
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>(`${environment.apiUrl}/arquivos/upload-geral`, formData).subscribe({
      next: (res) => {
        this.enviandoLogo = false;
        this.form.patchValue({ logoUrl: res.url });
        this.notificationService.success('Logotipo enviado com sucesso para o armazenamento na nuvem AWS!');
      },
      error: () => {
        this.enviandoLogo = false;
        // Fallback para leitura em base64 se a API estiver offline
        const reader = new FileReader();
        reader.onload = () => {
          this.form.patchValue({ logoUrl: reader.result as string });
          this.notificationService.info('Logotipo carregado localmente.');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  public removerLogotipo(): void {
    this.form.patchValue({ logoUrl: '' });
    this.notificationService.info('Logotipo removido.');
  }

  public salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.warning('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.salvando = true;
    const configAtual = this.configService.getConfiguracao();
    const valoresForm = this.form.value;

    const configCompleta: ConfiguracaoProposta = {
      ...configAtual,
      ...valoresForm,
      configurado: true
    };

    this.configService.salvarConfiguracao(configCompleta).subscribe({
      next: () => {
        this.salvando = false;
        if (valoresForm.nomeEscritorio) {
          localStorage.setItem('nomeEscritorio', valoresForm.nomeEscritorio.trim());
        }
        this.notificationService.success('Configurações da empresa salvas com sucesso!');
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error('Erro ao salvar as configurações da empresa.');
      }
    });
  }

  public get previewMensagemWhatsapp(): string {
    const nome = this.form.get('nomeEscritorio')?.value?.trim();
    if (nome) {
      return `Olá Gabriel Bandoch! Entro em contato sobre o seu projeto na ${nome}.`;
    }
    return `Olá Gabriel Bandoch! Entro em contato sobre o seu projeto no Cotu.`;
  }
}

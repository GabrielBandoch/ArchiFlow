import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgendaService } from '../../../core/api/agenda/agenda.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfiguracaoAgendaEmpresa, SalvarConfiguracaoAgendaCommand } from '../../../models/agenda.model';
import { AgendaForm } from '../../../components/agenda/agenda.form';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-configurar-agenda-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogComponent,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './configurar-agenda-modal.component.html',
  styleUrls: ['./configurar-agenda-modal.component.scss']
})
export class ConfigurarAgendaModalComponent implements OnInit, OnDestroy {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ConfiguracaoAgendaEmpresa>();

  form!: FormGroup;
  carregando = false;
  salvando = false;
  linkEmbed = '';
  copiado = false;

  abaAtiva: 'oauth' | 'json' = 'oauth';
  possuiChaveServiceAccount = false;
  possuiOAuthConectado = false;
  googleOAuthEmail = '';
  conectandoGoogle = false;
  desconectandoGoogle = false;
  codigoOAuthManual = '';

  private ouvinteMensagemOAuth = (event: MessageEvent) => {
    if (event.data?.type === 'GOOGLE_OAUTH_CODE' && event.data?.code) {
      this.conectarComCodigo(event.data.code);
    }
  };

  constructor(
    private fb: FormBuilder,
    private agendaService: AgendaService,
    private notificationService: NotificationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.carregarConfiguracao();
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.ouvinteMensagemOAuth);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this.ouvinteMensagemOAuth);
    }
  }

  private initForm(): void {
    this.form = AgendaForm.createConfiguracao(this.fb);
  }

  carregarConfiguracao(): void {
    this.carregando = true;

    this.agendaService.obterConfiguracaoAgendaEmpresa().subscribe({
      next: (config) => {
        if (config) {
          this.possuiChaveServiceAccount = !!config.possuiChaveServiceAccount;
          this.possuiOAuthConectado = !!config.possuiOAuthConectado;
          this.googleOAuthEmail = config.googleOAuthEmail || '';

          if (this.possuiOAuthConectado) {
            this.abaAtiva = 'oauth';
          } else if (this.possuiChaveServiceAccount) {
            this.abaAtiva = 'json';
          }

          const calId = config.googleCalendarId || config.emailAgendaEmpresa || '';
          this.form.patchValue({
            googleCalendarId: calId,
            nomeAgenda: config.nomeAgenda || 'Agenda Oficial do Escritório',
            sincronizacaoAutomaticaAtiva: config.sincronizacaoAutomaticaAtiva ?? true
          });
          this.linkEmbed = config.linkEmbedGoogleCalendar || '';
        }
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }

  iniciarLoginGoogle(): void {
    const redirectUri = window.location.origin + '/agenda';
    this.conectandoGoogle = true;

    this.agendaService.obterUrlOAuth(redirectUri).subscribe({
      next: (res) => {
        this.conectandoGoogle = false;
        if (res?.url) {
          window.open(res.url, 'google_oauth_popup', 'width=550,height=650,menubar=no,toolbar=no');
        } else {
          this.notificationService.warning('Não foi possível obter a URL de autenticação do Google.');
        }
      },
      error: (err) => {
        this.conectandoGoogle = false;
        const msg = err.error?.message || 'A integração OAuth ainda não foi configurada pelo administrador do sistema (defina GOOGLE_CALENDAR_CLIENT_ID no arquivo .env).';
        this.notificationService.warning(msg);
      }
    });
  }

  confirmarCodigoOAuth(): void {
    if (!this.codigoOAuthManual.trim()) {
      this.notificationService.warning('Cole o código de autorização do Google para continuar.');
      return;
    }
    this.conectarComCodigo(this.codigoOAuthManual.trim());
  }

  conectarComCodigo(code: string): void {
    this.conectandoGoogle = true;
    const redirectUri = window.location.origin + '/agenda';

    this.agendaService.conectarOAuth({
      code: code.trim(),
      redirectUri
    }).subscribe({
      next: (config) => {
        this.conectandoGoogle = false;
        this.codigoOAuthManual = '';
        this.possuiOAuthConectado = true;
        this.googleOAuthEmail = config.googleOAuthEmail || 'Conta Google Conectada';
        if (config.googleCalendarId) {
          this.form.patchValue({ googleCalendarId: config.googleCalendarId });
        }
        this.notificationService.success('Conta Google conectada via OAuth com sucesso!');
        this.saved.emit(config);
      },
      error: (err) => {
        this.conectandoGoogle = false;
        const msg = err.error?.message || 'Código de autorização inválido ou expirado.';
        this.notificationService.warning(msg);
      }
    });
  }

  desconectarOAuth(): void {
    if (!confirm('Deseja realmente desconectar a conta do Google Calendar?')) return;

    this.desconectandoGoogle = true;
    this.agendaService.desconectarOAuth().subscribe({
      next: () => {
        this.desconectandoGoogle = false;
        this.possuiOAuthConectado = false;
        this.googleOAuthEmail = '';
        this.notificationService.info('Conta do Google desconectada.');
      },
      error: () => {
        this.desconectandoGoogle = false;
        this.notificationService.warning('Erro ao desconectar conta do Google.');
      }
    });
  }

  copiarLinkEmbed(): void {
    if (!this.linkEmbed) return;
    navigator.clipboard.writeText(this.linkEmbed);
    this.copiado = true;
    setTimeout(() => {
      this.copiado = false;
    }, 3000);
  }

  abrirGoogleAgendaWeb(): void {
    if (this.linkEmbed) {
      window.open(this.linkEmbed, '_blank');
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.warning('Informe o ID ou e-mail da Agenda do Google.');
      return;
    }

    this.salvando = true;
    const val = this.form.value;
    const calId = (val.googleCalendarId || '').trim();

    const cmd: SalvarConfiguracaoAgendaCommand = {
      emailAgendaEmpresa: calId,
      googleCalendarId: calId,
      chaveGoogleServiceAccountJson: val.chaveGoogleServiceAccountJson?.trim() || '',
      tipoIntegracao: this.abaAtiva === 'oauth' ? 'OAuth' : 'ServiceAccount',
      nomeAgenda: val.nomeAgenda || 'Agenda Oficial do Escritório',
      sincronizacaoAutomaticaAtiva: true
    };

    this.agendaService.salvarConfiguracaoAgendaEmpresa(cmd).subscribe({
      next: (resposta) => {
        this.salvando = false;
        this.linkEmbed = resposta?.linkEmbedGoogleCalendar || '';
        this.notificationService.success('Configurações da agenda corporativa salvas com sucesso!');
        this.saved.emit(resposta);
        this.onClose();
      },
      error: (err) => {
        this.salvando = false;
        let msg = err.error?.error || err.error?.message || err.error?.mensagem;
        if (!msg && err.error?.errors) {
          const firstKey = Object.keys(err.error.errors)[0];
          msg = err.error.errors[firstKey]?.[0];
        }
        if (!msg && err.status === 401) {
          msg = 'Sessão expirada. Por favor, realize login novamente.';
        }
        if (!msg && err.status === 403) {
          msg = 'Você não possui permissão para salvar configurações da agenda corporativa.';
        }
        this.notificationService.warning(msg || 'Erro ao salvar configurações da agenda corporativa.');
      }
    });
  }
}

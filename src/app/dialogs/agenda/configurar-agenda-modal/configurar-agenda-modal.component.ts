import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgendaService } from '../../../core/api/agenda/agenda.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DialogService } from '../../../core/services/dialog.service';
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

  private fb = inject(FormBuilder);
  private agendaService = inject(AgendaService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);

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

  private expectedOAuthState: string | null = null;
  private oauthPopup: Window | null = null;

  private ouvinteMensagemOAuth = (event: MessageEvent) => {
    if (typeof window === 'undefined') return;
    if (event.origin !== window.location.origin) return;
    if (this.oauthPopup && event.source !== this.oauthPopup) return;

    if (!event.data || typeof event.data !== 'object' || event.data.type !== 'GOOGLE_OAUTH_CODE') {
      return;
    }

    const { code, state } = event.data;
    if (typeof code !== 'string' || !code.trim()) {
      return;
    }

    if (this.expectedOAuthState && state !== this.expectedOAuthState) {
      this.notificationService.error('Falha de segurança do OAuth: estado CSRF inválido.');
      return;
    }

    this.conectarComCodigo(code.trim(), state || this.expectedOAuthState || '');
  };

  constructor() {
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
    if (this.oauthPopup && !this.oauthPopup.closed) {
      this.oauthPopup.close();
    }
    this.oauthPopup = null;
    this.expectedOAuthState = null;
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
          this.expectedOAuthState = res.state;
          this.oauthPopup = window.open(res.url, 'google_oauth_popup', 'width=550,height=650,menubar=no,toolbar=no');
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
    this.conectarComCodigo(this.codigoOAuthManual.trim(), this.expectedOAuthState || '');
  }

  conectarComCodigo(code: string, state: string): void {
    this.conectandoGoogle = true;
    const redirectUri = window.location.origin + '/agenda';

    this.agendaService.conectarOAuth({
      code: code.trim(),
      redirectUri,
      state: state.trim()
    }).subscribe({
      next: (config) => {
        this.conectandoGoogle = false;
        this.codigoOAuthManual = '';
        this.expectedOAuthState = null;
        if (this.oauthPopup && !this.oauthPopup.closed) {
          this.oauthPopup.close();
        }
        this.oauthPopup = null;
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
    this.dialogService.confirm({
      title: 'Desconectar Google Calendar',
      message: 'Deseja realmente desconectar a conta do Google Calendar?',
      confirmLabel: 'Sim, desconectar',
      cancelLabel: 'Cancelar',
      variant: 'danger'
    }).subscribe(confirmou => {
      if (!confirmou) return;

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
      sincronizacaoAutomaticaAtiva: val.sincronizacaoAutomaticaAtiva ?? true
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

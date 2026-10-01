import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, finalize, shareReplay } from 'rxjs';
import { ConfiguracaoProposta, CONFIGURACAO_PROPOSTA_PADRAO } from '../models/configuracao-proposta.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoPropostaService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'archiflow_config_proposta_v2';
  private readonly LEGACY_STORAGE_KEY = 'archiflow_config_proposta_v1';
  private readonly apiUrl = `${environment.apiUrl}/propostas/configuracao`;

  private configSubject: BehaviorSubject<ConfiguracaoProposta>;
  public configuracao$: Observable<ConfiguracaoProposta>;
  private carregamentoInFlight$: Observable<ConfiguracaoProposta | null> | null = null;

  constructor() {
    this.limparLegadoSeNecessario();
    const salvo = this.carregarDoStorage();
    this.configSubject = new BehaviorSubject<ConfiguracaoProposta>(salvo);
    this.configuracao$ = this.configSubject.asObservable();
    this.carregarDoServidor().subscribe({
      next: () => {},
      error: () => {}
    });
  }

  private limparLegadoSeNecessario(): void {
    try {
      localStorage.removeItem(this.LEGACY_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  public carregarDoServidor(forceRefresh = false): Observable<ConfiguracaoProposta | null> {
    if (this.carregamentoInFlight$ && !forceRefresh) {
      return this.carregamentoInFlight$;
    }

    this.carregamentoInFlight$ = this.http.get<ConfiguracaoProposta>(this.apiUrl).pipe(
      tap((res) => {
        if (res && (res.configurado || (res.nomeEscritorio && res.nomeEscritorio.trim() !== ''))) {
          // Sanitiza se porventura houver dados residuais mockados de Duna
          if (this.contemDadosDuna(res)) {
            const limpo = this.sanitizarConfiguracao(res);
            this.salvarLocal(limpo);
          } else {
            this.salvarLocal({ ...res, configurado: true });
          }
        }
      }),
      catchError(() => of(null)),
      finalize(() => {
        this.carregamentoInFlight$ = null;
      }),
      shareReplay(1)
    );

    return this.carregamentoInFlight$;
  }

  public getConfiguracao(): ConfiguracaoProposta {
    return this.configSubject.getValue();
  }

  public isConfigurado(): boolean {
    const cfg = this.getConfiguracao();
    return Boolean(
      cfg.configurado &&
      cfg.nomeEscritorio &&
      cfg.nomeEscritorio.trim().length > 0 &&
      cfg.email &&
      cfg.email.trim().length > 0 &&
      cfg.telefone &&
      cfg.telefone.trim().length > 0
    );
  }

  public salvarConfiguracao(config: ConfiguracaoProposta): Observable<ConfiguracaoProposta> {
    const configParaSalvar: ConfiguracaoProposta = {
      ...config,
      configurado: true
    };

    return this.http.put<ConfiguracaoProposta>(this.apiUrl, configParaSalvar).pipe(
      tap((res) => {
        const persistido = res ? { ...res, configurado: true } : configParaSalvar;
        this.salvarLocal(persistido);
      })
    );
  }

  private salvarLocal(config: ConfiguracaoProposta): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignora erro se localStorage estiver indisponível
    }
    this.configSubject.next({ ...config });
  }

  public resetarPadroes(): ConfiguracaoProposta {
    const padrao = { ...CONFIGURACAO_PROPOSTA_PADRAO };
    this.salvarLocal(padrao);
    this.http.put<ConfiguracaoProposta>(this.apiUrl, padrao).subscribe({
      next: () => {},
      error: () => {}
    });
    return padrao;
  }

  public formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  }

  public gerarMensagemWhatsapp(dados: {
    clienteNome?: string;
    projetoTitulo?: string;
    metragem?: number;
    valorFinal?: number;
  }, config?: ConfiguracaoProposta): string {
    const cfg = config || this.getConfiguracao();
    const cliente = dados.clienteNome || 'Prezado(a) Cliente';
    const projeto = dados.projetoTitulo || 'Projeto Arquitetônico';
    const metragem = dados.metragem ? dados.metragem.toString() : '0';
    const valor = this.formatarMoeda(dados.valorFinal || 0);
    const validade = cfg.validadeDias ? cfg.validadeDias.toString() : '15';
    const escritorio = cfg.nomeEscritorio || 'Nosso Escritório';

    let msg = cfg.templateMensagemWhatsapp || CONFIGURACAO_PROPOSTA_PADRAO.templateMensagemWhatsapp;
    msg = msg
      .replace(/{cliente}/g, cliente)
      .replace(/{projeto}/g, projeto)
      .replace(/{metragem}/g, metragem)
      .replace(/{valor}/g, valor)
      .replace(/{validade}/g, validade)
      .replace(/{escritorio}/g, escritorio);

    return msg;
  }

  public gerarLinkWhatsapp(telefone: string, mensagem: string): string {
    const limpo = (telefone || '').replace(/\D/g, '');
    const encoded = encodeURIComponent(mensagem);
    if (!limpo) {
      return `https://api.whatsapp.com/send?text=${encoded}`;
    }
    const comDDI = limpo.startsWith('55') ? limpo : `55${limpo}`;
    return `https://api.whatsapp.com/send?phone=${comDDI}&text=${encoded}`;
  }

  private carregarDoStorage(): ConfiguracaoProposta {
    try {
      const item = localStorage.getItem(this.STORAGE_KEY);
      if (item) {
        const parsed: ConfiguracaoProposta = JSON.parse(item);
        if (this.contemDadosDuna(parsed)) {
          return this.sanitizarConfiguracao(parsed);
        }
        return { ...CONFIGURACAO_PROPOSTA_PADRAO, ...parsed };
      }
    } catch {
      // Fallback para o padrão
    }
    return { ...CONFIGURACAO_PROPOSTA_PADRAO };
  }

  private contemDadosDuna(cfg: Partial<ConfiguracaoProposta>): boolean {
    const haystack = `${cfg.nomeEscritorio || ''} ${cfg.email || ''} ${cfg.dadosBancarios || ''} ${cfg.endereco || ''}`.toLowerCase();
    return haystack.includes('duna') || haystack.includes('a238491') || haystack.includes('45.892.102');
  }

  private sanitizarConfiguracao(cfg: ConfiguracaoProposta): ConfiguracaoProposta {
    return {
      ...CONFIGURACAO_PROPOSTA_PADRAO,
      ...cfg,
      nomeEscritorio: this.limparSeDuna(cfg.nomeEscritorio),
      email: this.limparSeDuna(cfg.email),
      telefone: this.limparSeDuna(cfg.telefone),
      endereco: this.limparSeDuna(cfg.endereco),
      registroProfissional: this.limparSeDuna(cfg.registroProfissional),
      chavePix: this.limparSeDuna(cfg.chavePix),
      dadosBancarios: this.limparSeDuna(cfg.dadosBancarios),
      logoUrl: cfg.logoUrl && cfg.logoUrl.toLowerCase().includes('duna') ? '' : cfg.logoUrl,
      configurado: false
    };
  }

  private limparSeDuna(valor?: string): string {
    if (!valor) return '';
    const v = valor.toLowerCase();
    if (v.includes('duna') || v.includes('a238491') || v.includes('45.892.102')) {
      return '';
    }
    return valor;
  }
}

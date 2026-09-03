import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { MensagemChat } from '../../models/mensagem-chat.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private hubConnection?: signalR.HubConnection;
  private mensagensSubject = new BehaviorSubject<MensagemChat[]>([]);
  public mensagens$ = this.mensagensSubject.asObservable();

  private conectadoSubject = new BehaviorSubject<boolean>(false);
  public conectado$ = this.conectadoSubject.asObservable();

  private projetoIdAtual?: string;

  public get mensagens(): MensagemChat[] {
    return this.mensagensSubject.value;
  }

  public get conectado(): boolean {
    return this.conectadoSubject.value;
  }

  public obterHistorico(projetoId: string): Observable<MensagemChat[]> {
    return this.http.get<MensagemChat[]>(`${environment.apiUrl}/mensagens/projeto/${projetoId}`).pipe(
      tap(historico => {
        this.mensagensSubject.next(historico || []);
      })
    );
  }

  public async iniciarConexao(projetoId: string): Promise<void> {
    this.projetoIdAtual = projetoId;

    // Se já estiver conectado no mesmo projeto, apenas atualiza histórico
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('EntrarNoProjeto', projetoId);
      return;
    }

    const token = this.authService.token;
    const hubUrl = typeof window !== 'undefined' && (window.location.port === '4200' || window.location.hostname === 'localhost')
      ? 'http://localhost:5000/hubs/chat'
      : (environment.apiUrl.startsWith('http')
          ? `${environment.apiUrl.replace(/\/api\/?$/, '')}/hubs/chat`
          : '/hubs/chat');

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token || '',
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.hubConnection.on('ReceiveMessage', (msg: MensagemChat) => {
      const atuais = this.mensagensSubject.value;
      // Evitar duplicatas caso o envio via REST já tenha adicionado
      if (!atuais.some(m => m.id === msg.id)) {
        this.mensagensSubject.next([...atuais, msg]);
      }
    });

    this.hubConnection.onreconnected(async () => {
      this.conectadoSubject.next(true);
      if (this.projetoIdAtual) {
        await this.hubConnection?.invoke('EntrarNoProjeto', this.projetoIdAtual);
      }
    });

    this.hubConnection.onclose(() => {
      this.conectadoSubject.next(false);
    });

    try {
      await this.hubConnection.start();
      this.conectadoSubject.next(true);
      await this.hubConnection.invoke('EntrarNoProjeto', projetoId);
    } catch (err) {
      console.warn('Erro ao conectar SignalR, operando em modo fallback REST', err);
      this.conectadoSubject.next(false);
    }
  }

  public async enviarMensagem(projetoId: string, conteudo: string): Promise<void> {
    if (!conteudo || !conteudo.trim()) return;

    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('EnviarMensagem', projetoId, conteudo.trim());
        return;
      } catch (err) {
        console.warn('Falha no envio via SignalR, tentando REST', err);
      }
    }

    // Fallback REST
    const novaMsg = await this.http.post<MensagemChat>(`${environment.apiUrl}/mensagens/projeto/${projetoId}`, {
      projetoId,
      conteudo: conteudo.trim()
    }).toPromise();

    if (novaMsg) {
      const atuais = this.mensagensSubject.value;
      if (!atuais.some(m => m.id === novaMsg.id)) {
        this.mensagensSubject.next([...atuais, novaMsg]);
      }
    }
  }

  public async desconectar(): Promise<void> {
    if (this.hubConnection) {
      try {
        if (this.projetoIdAtual) {
          await this.hubConnection.invoke('SairDoProjeto', this.projetoIdAtual);
        }
        await this.hubConnection.stop();
      } catch (e) {
        // Ignora erro ao parar
      } finally {
        this.hubConnection = undefined;
        this.conectadoSubject.next(false);
        this.projetoIdAtual = undefined;
      }
    }
  }
}

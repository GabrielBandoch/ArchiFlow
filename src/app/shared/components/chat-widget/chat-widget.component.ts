import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { MensagemChat } from '../../../models/mensagem-chat.model';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.scss'
})
export class ChatWidgetComponent implements OnInit, OnDestroy {
  @Input({ required: true }) projetoId!: string;
  @Input() projetoNome?: string;
  @Input() interlocutorNome?: string;
  @Input() interlocutorCargo?: string;
  @Input() floating: boolean = true;

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef;
  @ViewChild('mensagemInput') private mensagemInput?: ElementRef;

  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  isOpen = false;
  novoTexto = '';
  enviando = false;
  mensagens: MensagemChat[] = [];
  conectado = false;
  naoLidas = 0;

  private subMensagens?: Subscription;
  private subConectado?: Subscription;

  get currentUserId(): string {
    return this.authService.currentUserValue?.id || '';
  }

  get isCliente(): boolean {
    return this.authService.isCliente;
  }

  ngOnInit(): void {
    if (this.projetoId) {
      this.carregarEConectar();
    }
  }

  ngOnDestroy(): void {
    this.subMensagens?.unsubscribe();
    this.subConectado?.unsubscribe();
    this.chatService.desconectar();
  }

  private carregarEConectar(): void {
    this.chatService.obterHistorico(this.projetoId).subscribe();
    this.chatService.iniciarConexao(this.projetoId);

    this.subConectado = this.chatService.conectado$.subscribe(c => {
      this.conectado = c;
    });

    this.subMensagens = this.chatService.mensagens$.subscribe(msgs => {
      const anterioresCount = this.mensagens.length;
      this.mensagens = msgs;

      if (!this.isOpen && msgs.length > anterioresCount) {
        const novas = msgs.slice(anterioresCount);
        const deOutros = novas.filter(m => m.remetenteId !== this.currentUserId);
        this.naoLidas += deOutros.length;
      }

      this.scrollToBottom();
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.naoLidas = 0;
      this.scrollToBottom();
      setTimeout(() => this.mensagemInput?.nativeElement?.focus(), 150);
    }
  }

  fecharChat(): void {
    this.isOpen = false;
  }

  async enviar(): Promise<void> {
    const texto = this.novoTexto.trim();
    if (!texto || this.enviando || texto.length > 2000) return;

    this.enviando = true;
    this.novoTexto = '';

    try {
      await this.chatService.enviarMensagem(this.projetoId, texto);
      this.scrollToBottom();
    } catch (err) {
      console.error('Erro ao enviar mensagem', err);
    } finally {
      this.enviando = false;
      setTimeout(() => this.mensagemInput?.nativeElement?.focus(), 50);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  isMinhaMensagem(msg: MensagemChat): boolean {
    return msg.remetenteId === this.currentUserId;
  }

  formatarHora(dataStr: string): string {
    if (!dataStr) return '';
    try {
      const data = new Date(dataStr);
      return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  obterIniciais(nome: string): string {
    if (!nome) return 'U';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}

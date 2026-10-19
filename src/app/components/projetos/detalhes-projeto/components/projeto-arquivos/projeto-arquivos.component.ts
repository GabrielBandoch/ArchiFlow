import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Arquivo } from '../../../../../models/arquivo.model';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { DialogComponent } from '../../../../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-projeto-arquivos',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyStateComponent, ButtonComponent, DialogComponent],
  templateUrl: './projeto-arquivos.component.html',
  styleUrl: './projeto-arquivos.component.scss'
})
export class ProjetoArquivosComponent {
  private sanitizer = inject(DomSanitizer);

  @Input({ required: true }) arquivos: Arquivo[] = [];
  @Input() uploadingArquivo = false;

  @Output() arquivoUpload = new EventEmitter<{ file: File; visivelCliente: boolean }>();
  @Output() arquivoExcluido = new EventEmitter<Arquivo>();

  novoArquivoVisivelCliente = true;

  arquivoParaVisualizar: Arquivo | null = null;
  tipoVisualizacao: 'imagem' | 'pdf' | 'video' | 'outro' = 'outro';
  safeUrl: SafeResourceUrl | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.arquivoUpload.emit({
        file: input.files[0],
        visivelCliente: this.novoArquivoVisivelCliente
      });
      input.value = '';
    }
  }

  onExcluir(arquivo: Arquivo): void {
    this.arquivoExcluido.emit(arquivo);
  }

  getFileIcon(nome: string): string {
    const ext = nome.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'picture_as_pdf';
    if (['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext || '')) return 'image';
    if (['mp4', 'webm', 'mov', 'ogg'].includes(ext || '')) return 'movie';
    if (['dwg', 'dxf', 'rvt', 'skp'].includes(ext || '')) return 'architecture';
    return 'description';
  }

  visualizarArquivo(arq: Arquivo): void {
    const ext = arq.nome.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext)) {
      this.tipoVisualizacao = 'imagem';
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(arq.urlStorage);
      this.arquivoParaVisualizar = arq;
    } else if (ext === 'pdf') {
      this.tipoVisualizacao = 'pdf';
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(arq.urlStorage);
      this.arquivoParaVisualizar = arq;
    } else if (['mp4', 'webm', 'mov', 'ogg'].includes(ext)) {
      this.tipoVisualizacao = 'video';
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(arq.urlStorage);
      this.arquivoParaVisualizar = arq;
    } else {
      window.open(arq.urlStorage, '_blank');
    }
  }

  fecharModalVisualizacao(): void {
    this.arquivoParaVisualizar = null;
    this.safeUrl = null;
  }

  abrirEmNovaAba(url?: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}

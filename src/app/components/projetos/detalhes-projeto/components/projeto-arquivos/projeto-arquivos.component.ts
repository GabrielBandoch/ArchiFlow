import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Arquivo } from '../../../../../models/arquivo.model';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-projeto-arquivos',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyStateComponent, ButtonComponent],
  templateUrl: './projeto-arquivos.component.html',
  styleUrl: './projeto-arquivos.component.scss'
})
export class ProjetoArquivosComponent {
  @Input({ required: true }) arquivos: Arquivo[] = [];
  @Input() uploadingArquivo = false;

  @Output() arquivoUpload = new EventEmitter<{ file: File; visivelCliente: boolean }>();
  @Output() arquivoExcluido = new EventEmitter<Arquivo>();

  novoArquivoVisivelCliente = true;

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
    if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext || '')) return 'image';
    if (['dwg', 'dxf', 'rvt', 'skp'].includes(ext || '')) return 'architecture';
    return 'description';
  }
}

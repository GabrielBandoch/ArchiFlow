import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Arquivo } from '../../../models/arquivo.model';

@Component({
  selector: 'app-portal-documentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal-documentos.component.html',
  styleUrl: './portal-documentos.component.scss'
})
export class PortalDocumentosComponent {
  @Input() arquivos: Arquivo[] = [];
  @Input() filtro: 'todos' | 'plantas' | 'documentos' | 'imagens' = 'todos';

  @Output() filtroChange = new EventEmitter<'todos' | 'plantas' | 'documentos' | 'imagens'>();
  @Output() download = new EventEmitter<Arquivo>();

  get arquivosFiltrados(): Arquivo[] {
    if (this.filtro === 'todos') return this.arquivos;
    if (this.filtro === 'plantas') {
      return this.arquivos.filter(a => {
        const ext = a.nome.split('.').pop()?.toLowerCase();
        return ['dwg', 'dxf', 'rvt', 'skp', 'ifc'].includes(ext || '') || (a.tipo?.toLowerCase().includes('cad') ?? false);
      });
    }
    if (this.filtro === 'documentos') {
      return this.arquivos.filter(a => {
        const ext = a.nome.split('.').pop()?.toLowerCase();
        return ['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext || '') || (a.tipo?.toLowerCase().includes('pdf') ?? false);
      });
    }
    if (this.filtro === 'imagens') {
      return this.arquivos.filter(a => {
        const ext = a.nome.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext || '') || (a.tipo?.toLowerCase().includes('image') ?? false);
      });
    }
    return this.arquivos;
  }

  setFiltro(tipo: 'todos' | 'plantas' | 'documentos' | 'imagens'): void {
    this.filtro = tipo;
    this.filtroChange.emit(tipo);
  }

  onDownload(arquivo: Arquivo): void {
    this.download.emit(arquivo);
  }

  getFileIcon(nome: string): string {
    const ext = nome.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'picture_as_pdf';
    if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext || '')) return 'image';
    if (['dwg', 'dxf', 'rvt', 'skp'].includes(ext || '')) return 'architecture';
    return 'description';
  }

  formatarData(data: any): string {
    if (!data) return 'Não definida';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }
}

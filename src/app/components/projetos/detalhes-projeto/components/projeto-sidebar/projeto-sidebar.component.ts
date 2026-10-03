import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Projeto } from '../../../../../models/projeto.model';
import { Arquivo } from '../../../../../models/arquivo.model';

@Component({
  selector: 'app-projeto-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projeto-sidebar.component.html',
  styleUrl: './projeto-sidebar.component.scss'
})
export class ProjetoSidebarComponent {
  @Input({ required: true }) projeto!: Projeto;
  @Input({ required: true }) arquivos: Arquivo[] = [];
  @Input() totalConcluidas = 0;

  @Output() verTodosArquivos = new EventEmitter<void>();

  onVerTodos(): void {
    this.verTodosArquivos.emit();
  }

  getFileIcon(nome: string): string {
    const ext = nome.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'picture_as_pdf';
    if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext || '')) return 'image';
    if (['dwg', 'dxf', 'rvt', 'skp'].includes(ext || '')) return 'architecture';
    return 'description';
  }
}

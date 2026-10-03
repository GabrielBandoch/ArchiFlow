import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtapaProjeto, StatusEtapa, TarefaEtapa } from '../../../../../models/projeto.model';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-projeto-etapas',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, ButtonComponent],
  templateUrl: './projeto-etapas.component.html',
  styleUrl: './projeto-etapas.component.scss'
})
export class ProjetoEtapasComponent {
  @Input({ required: true }) etapas: EtapaProjeto[] = [];
  @Input() progressoPercentual = 0;
  @Input() etapaAtiva?: EtapaProjeto;

  @Output() novaEtapaSolicitada = new EventEmitter<void>();
  @Output() etapaStatusAlterado = new EventEmitter<{ etapa: EtapaProjeto; status: StatusEtapa }>();
  @Output() tarefaToggled = new EventEmitter<{ etapa: EtapaProjeto; tarefa: TarefaEtapa }>();
  @Output() tarefaAdicionada = new EventEmitter<{ etapa: EtapaProjeto; inputEl: HTMLInputElement }>();
  @Output() tarefaRemovida = new EventEmitter<{ etapa: EtapaProjeto; tarefaId: string }>();

  StatusEtapa = StatusEtapa;

  onNovaEtapa(): void {
    this.novaEtapaSolicitada.emit();
  }

  alterarStatus(etapa: EtapaProjeto, status: StatusEtapa): void {
    this.etapaStatusAlterado.emit({ etapa, status });
  }

  toggleEtapaStatus(etapa: EtapaProjeto): void {
    if (etapa.status === StatusEtapa.Pendente) {
      this.alterarStatus(etapa, StatusEtapa.EmAndamento);
    } else if (etapa.status === StatusEtapa.EmAndamento) {
      this.alterarStatus(etapa, StatusEtapa.Concluida);
    } else if (etapa.status === StatusEtapa.Concluida) {
      this.alterarStatus(etapa, StatusEtapa.EmAndamento);
    }
  }

  obterTarefas(etapa: EtapaProjeto): TarefaEtapa[] {
    return etapa.tarefas || [];
  }

  getTarefasConcluidasCount(etapa: EtapaProjeto): number {
    return (etapa.tarefas || []).filter(t => t.concluida).length;
  }

  toggleTarefa(etapa: EtapaProjeto, tarefa: TarefaEtapa): void {
    this.tarefaToggled.emit({ etapa, tarefa });
  }

  adicionarTarefa(etapa: EtapaProjeto, inputEl: HTMLInputElement): void {
    this.tarefaAdicionada.emit({ etapa, inputEl });
  }

  removerTarefa(etapa: EtapaProjeto, tarefaId: string): void {
    this.tarefaRemovida.emit({ etapa, tarefaId });
  }
}

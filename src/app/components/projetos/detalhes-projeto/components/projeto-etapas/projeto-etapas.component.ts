import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  EtapaProjeto,
  StatusEtapa,
  TarefaEtapa,
} from "../../../../../core/models/projeto.model";
import { EmptyStateComponent } from "../../../../../shared/components/empty-state/empty-state.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

@Component({
  selector: "app-projeto-etapas",
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyStateComponent, ButtonComponent],
  templateUrl: "./projeto-etapas.component.html",
  styleUrl: "./projeto-etapas.component.scss",
})
export class ProjetoEtapasComponent {
  @Input({ required: true }) etapas: EtapaProjeto[] = [];
  @Input() progressoPercentual = 0;
  @Input() etapaAtiva?: EtapaProjeto;

  @Output() novaEtapaSolicitada = new EventEmitter<void>();
  @Output() etapaStatusAlterado = new EventEmitter<{
    etapa: EtapaProjeto;
    status: StatusEtapa;
    dataConclusao?: string | null;
  }>();
  @Output() etapaDatasAlteradas = new EventEmitter<{
    etapa: EtapaProjeto;
    dataFimPrevista?: string | null;
    dataConclusao?: string | null;
    limparDataFimPrevista?: boolean;
    limparDataConclusao?: boolean;
  }>();
  @Output() tarefaToggled = new EventEmitter<{
    etapa: EtapaProjeto;
    tarefa: TarefaEtapa;
  }>();
  @Output() tarefaAdicionada = new EventEmitter<{
    etapa: EtapaProjeto;
    inputEl: HTMLInputElement;
  }>();
  @Output() tarefaRemovida = new EventEmitter<{
    etapa: EtapaProjeto;
    tarefaId: string;
  }>();
  @Output() tarefaPrazoAlterado = new EventEmitter<{
    etapa: EtapaProjeto;
    tarefa: TarefaEtapa;
    dataLimite?: string | null;
  }>();

  StatusEtapa = StatusEtapa;

  editingPrevisaoEtapaId: string | null = null;
  editingConclusaoEtapaId: string | null = null;
  editingPrazoTarefaId: string | null = null;

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
    return (etapa.tarefas || []).filter((t) => t.concluida).length;
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

  formatarDataParaInput(dataStr?: string | null): string {
    if (!dataStr) return "";
    try {
      const d = new Date(dataStr);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  }

  abrirEdicaoPrevisaoEtapa(etapa: EtapaProjeto, event?: Event): void {
    event?.stopPropagation();
    this.editingPrevisaoEtapaId = etapa.id;
    this.editingConclusaoEtapaId = null;
  }

  salvarPrevisaoEtapa(etapa: EtapaProjeto, event: Event): void {
    const target = event.target as HTMLInputElement;
    const novaData = target.value ? `${target.value}T12:00:00Z` : null;
    etapa.dataFimPrevista = novaData || undefined;
    this.editingPrevisaoEtapaId = null;
    this.etapaDatasAlteradas.emit({
      etapa,
      dataFimPrevista: novaData,
      limparDataFimPrevista: !novaData,
    });
  }

  limparPrevisaoEtapa(etapa: EtapaProjeto): void {
    etapa.dataFimPrevista = undefined;
    this.editingPrevisaoEtapaId = null;
    this.etapaDatasAlteradas.emit({
      etapa,
      dataFimPrevista: null,
      limparDataFimPrevista: true,
    });
  }

  abrirEdicaoConclusaoEtapa(etapa: EtapaProjeto, event?: Event): void {
    event?.stopPropagation();
    this.editingConclusaoEtapaId = etapa.id;
    this.editingPrevisaoEtapaId = null;
  }

  salvarConclusaoEtapa(etapa: EtapaProjeto, event: Event): void {
    const target = event.target as HTMLInputElement;
    const novaData = target.value ? `${target.value}T12:00:00Z` : null;
    etapa.dataConclusao = novaData || undefined;
    this.editingConclusaoEtapaId = null;
    this.etapaDatasAlteradas.emit({
      etapa,
      dataConclusao: novaData,
      limparDataConclusao: !novaData,
    });
  }

  abrirEdicaoPrazoTarefa(tarefa: TarefaEtapa, event?: Event): void {
    event?.stopPropagation();
    this.editingPrazoTarefaId = tarefa.id;
  }

  salvarPrazoTarefa(
    etapa: EtapaProjeto,
    tarefa: TarefaEtapa,
    event: Event,
  ): void {
    const target = event.target as HTMLInputElement;
    const novaData = target.value ? `${target.value}T12:00:00Z` : null;
    tarefa.dataLimite = novaData || undefined;
    this.editingPrazoTarefaId = null;
    this.tarefaPrazoAlterado.emit({
      etapa,
      tarefa,
      dataLimite: novaData,
    });
  }

  limparPrazoTarefa(etapa: EtapaProjeto, tarefa: TarefaEtapa): void {
    tarefa.dataLimite = undefined;
    this.editingPrazoTarefaId = null;
    this.tarefaPrazoAlterado.emit({
      etapa,
      tarefa,
      dataLimite: null,
    });
  }

  cancelarEdicaoDatas(): void {
    this.editingPrevisaoEtapaId = null;
    this.editingConclusaoEtapaId = null;
  }

  cancelarEdicaoPrazoTarefa(): void {
    this.editingPrazoTarefaId = null;
  }
}

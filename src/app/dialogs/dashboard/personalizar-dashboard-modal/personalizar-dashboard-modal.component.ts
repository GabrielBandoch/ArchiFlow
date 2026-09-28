import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { DashboardWidgetConfig, WIDGETS_DEFAULT } from '../../../models/dashboard.model';

@Component({
  selector: 'app-personalizar-dashboard-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './personalizar-dashboard-modal.component.html',
  styleUrl: './personalizar-dashboard-modal.component.scss'
})
export class PersonalizarDashboardModalComponent {
  @Input() show = false;
  @Input() widgets: DashboardWidgetConfig[] = [];
  @Input() salvando = false;

  @Output() close = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<DashboardWidgetConfig[]>();
  @Output() restaurar = new EventEmitter<void>();

  tempWidgets: DashboardWidgetConfig[] = [];

  ngOnInit(): void {
    this.tempWidgets = this.widgets.map(w => ({ ...w }));
  }

  moverWidget(index: number, direcao: 'up' | 'down'): void {
    const novoIndex = direcao === 'up' ? index - 1 : index + 1;
    if (novoIndex < 0 || novoIndex >= this.tempWidgets.length) return;

    const item = this.tempWidgets.splice(index, 1)[0];
    this.tempWidgets.splice(novoIndex, 0, item);
    this.tempWidgets.forEach((w, idx) => w.ordem = idx + 1);
  }

  onRestaurarPadrao(): void {
    this.tempWidgets = WIDGETS_DEFAULT.map(w => ({ ...w }));
    this.restaurar.emit();
  }

  onSalvar(): void {
    this.salvar.emit(this.tempWidgets);
  }

  onClose(): void {
    this.close.emit();
  }
}

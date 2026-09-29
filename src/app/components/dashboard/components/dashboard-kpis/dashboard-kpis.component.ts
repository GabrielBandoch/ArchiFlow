import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardKpis } from '../../../../models/dashboard.model';
import { formatarMoeda } from '../../dashboard.utils';

@Component({
  selector: 'app-dashboard-kpis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-kpis.component.html',
  styleUrl: './dashboard-kpis.component.scss'
})
export class DashboardKpisComponent {
  @Input({ required: true }) kpis!: DashboardKpis;

  formatarMoeda = formatarMoeda;
}

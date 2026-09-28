import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardKpis } from '../../../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-kpis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-kpis.component.html',
  styleUrl: './dashboard-kpis.component.scss'
})
export class DashboardKpisComponent {
  @Input({ required: true }) kpis!: DashboardKpis;
  @Input({ required: true }) formatarMoeda!: (v: number) => string;
}

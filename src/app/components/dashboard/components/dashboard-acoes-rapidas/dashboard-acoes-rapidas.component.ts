import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-acoes-rapidas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-acoes-rapidas.component.html',
  styleUrl: './dashboard-acoes-rapidas.component.scss'
})
export class DashboardAcoesRapidasComponent {
  @Output() novoProjeto = new EventEmitter<void>();
  @Output() novoLead = new EventEmitter<void>();
}

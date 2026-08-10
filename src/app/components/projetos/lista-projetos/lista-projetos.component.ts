import { Component } from '@angular/core';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../shared';

@Component({
  selector: 'app-lista-projetos',
  standalone: true,
  imports: [CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './lista-projetos.component.html',
  styleUrl: './lista-projetos.component.scss'
})
export class ListaProjetosComponent {}

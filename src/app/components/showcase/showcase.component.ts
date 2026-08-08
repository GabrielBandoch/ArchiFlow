import { Component } from '@angular/core';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../shared';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CORE_IMPORTS, DESIGN_SYSTEM],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent {
  inputError = 'Esta é uma mensagem de erro de exemplo.';
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cotu-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cotu-logo-container" [ngClass]="['size-' + size, 'theme-' + theme]">
      <!-- Símbolo Arquitetônico Estilizado COTU -->
      <div class="logo-mark" [style.width.px]="iconSize" [style.height.px]="iconSize">
        <svg
          [attr.width]="iconSize"
          [attr.height]="iconSize"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="logo-svg"
        >
          <defs>
            <linearGradient id="cotuGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#E57A44" />
              <stop offset="100%" stop-color="#C85A24" />
            </linearGradient>
            <linearGradient id="cotuGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#F28E58" />
              <stop offset="100%" stop-color="#E57A44" />
            </linearGradient>
            <linearGradient id="cotuGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#8C3810" />
              <stop offset="100%" stop-color="#652405" />
            </linearGradient>
          </defs>

          <!-- Cubo Isométrico / Prisma Arquitetônico em Forma de "C" -->
          <!-- Face Superior (Planta / Teto) -->
          <polygon points="24,6 40,15 24,24 8,15" fill="url(#cotuGrad2)" />
          
          <!-- Face Esquerda (Parede Frontal com corte arquitetônico) -->
          <polygon points="8,15 24,24 24,42 8,33" fill="url(#cotuGrad1)" />

          <!-- Face Direita / Profundidade Interior (Estilo C) -->
          <polygon points="24,24 40,15 40,24 30,29.5 30,34 40,28.5 40,33 24,42" fill="url(#cotuGradDark)" opacity="0.9" />

          <!-- Linha de Precisão Arquitetônica / Viga -->
          <line x1="24" y1="24" x2="24" y2="42" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
          <line x1="8" y1="15" x2="24" y2="24" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
          <line x1="24" y1="24" x2="40" y2="15" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />

          <!-- Ponto de Foco / Núcleo do Projeto -->
          <circle cx="24" cy="24" r="2.2" fill="#FFFFFF" />
        </svg>
      </div>

      <!-- Tipografia COTU Estilizada -->
      <div *ngIf="showText" class="logo-typography">
        <div class="logo-text-row">
          <span class="brand-name">COTU</span>
          <span *ngIf="badge" class="brand-badge">{{ badge }}</span>
        </div>
        <span *ngIf="subtitle" class="brand-sub">{{ subtitle }}</span>
      </div>
    </div>
  `,
  styles: [`
    .cotu-logo-container {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      user-select: none;
      text-decoration: none;
    }

    .logo-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      filter: drop-shadow(0 2px 8px rgba(229, 122, 68, 0.28));
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .cotu-logo-container:hover .logo-mark {
      transform: scale(1.04) rotate(-1deg);
    }

    .logo-svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .logo-typography {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .logo-text-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .brand-name {
      font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1;
    }

    .brand-badge {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 1px 5px;
      border-radius: 4px;
      text-transform: uppercase;
      background: rgba(229, 122, 68, 0.15);
      color: #E57A44;
      border: 1px solid rgba(229, 122, 68, 0.3);
    }

    .brand-sub {
      font-size: 9px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      font-weight: 600;
      margin-top: 3px;
      opacity: 0.65;
    }

    /* Temas */
    .theme-dark .brand-name {
      color: #F8FAFC;
    }

    .theme-dark .brand-sub {
      color: #94A3B8;
    }

    .theme-light .brand-name {
      color: #0F172A;
    }

    .theme-light .brand-sub {
      color: #64748B;
    }

    /* Tamanhos */
    .size-sm .brand-name {
      font-size: 15px;
    }
    .size-sm .brand-sub {
      font-size: 7.5px;
    }

    .size-md .brand-name {
      font-size: 19px;
    }
    .size-md .brand-sub {
      font-size: 9px;
    }

    .size-lg .brand-name {
      font-size: 26px;
    }
    .size-lg .brand-sub {
      font-size: 11px;
    }
  `]
})
export class CotuLogoComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() theme: 'dark' | 'light' = 'dark';
  @Input() showText = true;
  @Input() badge?: string;
  @Input() subtitle?: string = 'STUDIO';

  get iconSize(): number {
    switch (this.size) {
      case 'sm': return 26;
      case 'lg': return 44;
      case 'md':
      default: return 34;
    }
  }
}

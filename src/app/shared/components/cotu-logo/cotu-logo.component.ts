import { Component, Input } from '@angular/core';

/**
 * Logo oficial COTU: marca gráfica (monograma "C" com ponto de acento) + wordmark.
 * A cor do wordmark é herdada do elemento pai (currentColor) para funcionar em fundos claros e escuros.
 */
@Component({
  selector: 'app-cotu-logo',
  standalone: true,
  template: `
    <span class="cotu-logo" [style.--cotu-logo-size.px]="size">
      <svg class="mark" viewBox="0 0 48 48" role="img" aria-label="COTU" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cotuLogoGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="var(--af-primary, #765538)" />
            <stop offset="1" stop-color="var(--af-primary-container, #a47e5d)" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="13" fill="url(#cotuLogoGradient)" />
        <path d="M33.5 17.2A12.5 12.5 0 1 0 33.5 30.8" fill="none" stroke="#fff" stroke-width="4.6" stroke-linecap="round" />
        <circle cx="35.2" cy="24" r="2.9" fill="#fff" />
      </svg>
      @if (showText) {
        <span class="wordmark">COTU</span>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-flex; }
    .cotu-logo {
      --cotu-logo-size: 32px;
      display: inline-flex;
      align-items: center;
      gap: calc(var(--cotu-logo-size) * 0.32);
      color: inherit;
    }
    .mark {
      width: var(--cotu-logo-size);
      height: var(--cotu-logo-size);
      flex-shrink: 0;
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.18));
    }
    .wordmark {
      font-size: calc(var(--cotu-logo-size) * 0.62);
      font-weight: 800;
      letter-spacing: 0.22em;
      line-height: 1;
      color: currentColor;
    }
  `]
})
export class CotuLogoComponent {
  @Input() size = 32;
  @Input() showText = true;
}

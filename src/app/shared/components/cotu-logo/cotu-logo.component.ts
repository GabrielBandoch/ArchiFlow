import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cotu-logo',
  standalone: true,
  template: `
    <span class="cotu-logo" [style.--cotu-logo-size.px]="size" [attr.aria-label]="showText ? null : 'COTU'">
      <svg class="mark" viewBox="0 0 48 48" [attr.aria-hidden]="showText ? 'true' : null" [attr.role]="showText ? null : 'img'" [attr.aria-label]="showText ? null : 'COTU'" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="var(--af-primary, #765538)" />
        <path d="M 10 24 L 38 24" stroke="rgba(255,255,255,0.18)" stroke-width="1" stroke-dasharray="2 2" />
        <path d="M 14 19 C 14 14.6 17.6 11 22 11 L 36 11 C 37.1 11 38 11.9 38 13 L 38 17 C 38 18.1 37.1 19 36 19 L 23 19 C 20.8 19 19 20.8 19 23 L 19 25 C 19 27.2 20.8 29 23 29 L 36 29 C 37.1 29 38 29.9 38 31 L 38 35 C 38 36.1 37.1 37 36 37 L 22 37 C 17.6 37 14 33.4 14 29 Z" fill="#ffffff" />
        <rect x="30" y="21" width="6" height="6" rx="1.5" fill="#ffffff" opacity="0.9" />
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
      filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.16));
    }
    .wordmark {
      font-size: calc(var(--cotu-logo-size) * 0.62);
      font-weight: 800;
      letter-spacing: 0.2em;
      line-height: 1;
      color: #ffffff;
    }
  `]
})
export class CotuLogoComponent {
  @Input() size = 32;
  @Input() showText = true;
}

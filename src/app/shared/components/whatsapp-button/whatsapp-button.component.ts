import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsAppUtils } from '../../../core/utils/whatsapp-utils';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      *ngIf="telefone"
      type="button"
      class="btn-whatsapp"
      [class.btn-whatsapp-compact]="compact"
      [class.btn-whatsapp-full]="!compact"
      (click)="onClick($event)"
      [title]="'Conversar no WhatsApp: ' + telefone">
      <span class="whatsapp-icon-svg" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.35C9.33 7.35 9 7.42 8.72 7.73C8.44 8.04 7.65 8.78 7.65 10.27C7.65 11.75 8.73 13.18 8.88 13.38C9.03 13.58 11 16.64 13.96 17.92C16.42 18.99 16.92 18.77 17.46 18.72C18 18.67 19.2 18.01 19.45 17.31C19.7 16.61 19.7 16.01 19.62 15.89C19.55 15.76 19.35 15.69 19.05 15.54C18.75 15.39 17.27 14.66 17 14.56C16.73 14.46 16.53 14.41 16.33 14.71C16.13 15.01 15.56 15.69 15.39 15.89C15.21 16.08 15.04 16.11 14.74 15.96C14.44 15.81 13.48 15.5 12.35 14.49C11.47 13.7 10.88 12.73 10.71 12.43C10.53 12.13 10.69 11.97 10.84 11.82C10.98 11.69 11.15 11.47 11.3 11.3C11.45 11.13 11.5 11 11.6 10.8C11.7 10.6 11.65 10.43 11.57 10.28C11.5 10.13 10.9 8.65 10.65 8.05C10.41 7.47 10.17 7.55 9.98 7.54C9.81 7.53 9.61 7.35 9.53 7.35Z"/>
        </svg>
      </span>
      <span *ngIf="label" class="whatsapp-label">{{ label }}</span>
    </button>
  `,
  styles: [`
    .btn-whatsapp {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: #25D366;
      color: #ffffff;
      border: none;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      vertical-align: middle;
      line-height: 1;

      &:hover {
        background: #1ebc57;
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(37, 211, 102, 0.35);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .btn-whatsapp-compact {
      width: 28px;
      height: 28px;
      padding: 0;
      border-radius: 50%;
    }

    .btn-whatsapp-full {
      padding: 6px 12px;
      border-radius: var(--af-radius-sm, 8px);
      font-size: 0.8125rem;
    }

    .whatsapp-icon-svg {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .whatsapp-label {
      font-size: 0.8125rem;
      font-weight: 600;
    }
  `]
})
export class WhatsAppButtonComponent {
  @Input() telefone?: string | null;
  @Input() mensagem?: string;
  @Input() label?: string;
  @Input() compact = true;

  onClick(event: Event): void {
    WhatsAppUtils.abrirWhatsApp(this.telefone, this.mensagem, event);
  }
}

import { Injectable } from '@angular/core';

export interface ToastOptions {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private containerEl: HTMLElement | null = null;

  private getOrCreateContainer(): HTMLElement {
    if (this.containerEl) {
      return this.containerEl;
    }

    let container = document.getElementById('af-notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'af-notification-container';
      container.style.position = 'fixed';
      container.style.top = '24px';
      container.style.right = '24px';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '12px';
      container.style.zIndex = '10000';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
    }
    this.containerEl = container;
    return container;
  }

  show(options: ToastOptions): void {
    const container = this.getOrCreateContainer();

    const toast = document.createElement('div');
    toast.className = `af-toast af-toast-${options.type}`;
    toast.style.pointerEvents = 'auto';

    let icon = 'info';
    if (options.type === 'success') icon = 'check_circle';
    if (options.type === 'error') icon = 'error';
    if (options.type === 'warning') icon = 'warning';

    toast.innerHTML = `
      <span class="material-symbols-outlined af-toast-icon">${icon}</span>
      <span class="af-toast-message">${options.message}</span>
      <button class="af-toast-close">&times;</button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.af-toast-close');
    const dismiss = () => {
      toast.classList.add('af-toast-dismissed');
      setTimeout(() => {
        if (toast.parentNode === container) {
          container.removeChild(toast);
        }
      }, 300); 
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', dismiss);
    }

    const duration = options.duration || 4000;
    setTimeout(dismiss, duration);
  }

  success(message: string): void {
    this.show({ message, type: 'success' });
  }

  error(message: string): void {
    this.show({ message, type: 'error' });
  }

  warning(message: string): void {
    this.show({ message, type: 'warning' });
  }

  info(message: string): void {
    this.show({ message, type: 'info' });
  }
}

import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    const errorString = (error as { message?: string })?.message || String(error);
    const isChunkLoadFailed =
      errorString.includes('Failed to fetch dynamically imported module') ||
      errorString.includes('Loading chunk') ||
      errorString.includes('Failed to load module script');

    if (isChunkLoadFailed) {
      const storageKey = 'archiflow_chunk_reload';
      const lastReload = Number(sessionStorage.getItem(storageKey) || 0);
      const now = Date.now();

      if (now - lastReload > 15000) {
        sessionStorage.setItem(storageKey, String(now));
        this.reloadPage();
        return;
      }
    }

    console.error(error);
  }

  reloadPage(): void {
    window.location.reload();
  }
}

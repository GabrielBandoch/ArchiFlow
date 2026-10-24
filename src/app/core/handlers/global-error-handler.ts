import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    const errorString = this.extractErrorMessage(error);
    const isChunkLoadFailed =
      errorString.includes("Failed to fetch dynamically imported module") ||
      errorString.includes("Loading chunk") ||
      errorString.includes("Failed to load module script");

    if (isChunkLoadFailed && this.canAttemptReload()) {
      this.reloadPage();
      return;
    }

    console.error(error);
  }

  private extractErrorMessage(error: unknown): string {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;

    const withFields = error as { message?: string; rejection?: unknown };
    if (typeof withFields.message === "string") return withFields.message;
    if (withFields.rejection) {
      return this.extractErrorMessage(withFields.rejection);
    }

    return String(error);
  }

  private canAttemptReload(): boolean {
    const storageKeyTs = "archiflow_chunk_reload_ts";
    const storageKeyCount = "archiflow_chunk_reload_count";

    const lastReload = Number(this.getStorageItem(storageKeyTs) || 0);
    const attempts = Number(this.getStorageItem(storageKeyCount) || 0);
    const now = Date.now();

    if (now - lastReload < 60000 && attempts >= 1) {
      return false;
    }

    this.setStorageItem(storageKeyTs, String(now));
    this.setStorageItem(storageKeyCount, String(attempts + 1));
    return true;
  }

  private getStorageItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private setStorageItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch {}
  }

  reloadPage(): void {
    window.location.reload();
  }
}

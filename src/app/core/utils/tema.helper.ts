export class TemaHelper {
  private static readonly STORAGE_KEY = "cotu_primary_color";

  static aplicarTema(corPrimaria?: string | null): void {
    if (
      typeof document === "undefined" ||
      !corPrimaria ||
      !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(corPrimaria)
    ) {
      return;
    }

    document.documentElement.style.setProperty("--af-primary", corPrimaria);
    document.documentElement.style.setProperty(
      "--af-surface-tint",
      corPrimaria,
    );

    let hex = corPrimaria.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const rDark = Math.max(0, Math.floor(r * 0.82));
    const gDark = Math.max(0, Math.floor(g * 0.82));
    const bDark = Math.max(0, Math.floor(b * 0.82));
    const hexDark = `#${rDark.toString(16).padStart(2, "0")}${gDark.toString(16).padStart(2, "0")}${bDark.toString(16).padStart(2, "0")}`;

    const rLight = Math.min(255, Math.floor(r + (255 - r) * 0.45));
    const gLight = Math.min(255, Math.floor(g + (255 - g) * 0.45));
    const bLight = Math.min(255, Math.floor(b + (255 - b) * 0.45));
    const hexLight = `#${rLight.toString(16).padStart(2, "0")}${gLight.toString(16).padStart(2, "0")}${bLight.toString(16).padStart(2, "0")}`;

    document.documentElement.style.setProperty(
      "--af-primary-container",
      hexDark,
    );
    document.documentElement.style.setProperty(
      "--af-inverse-primary",
      hexLight,
    );
    document.documentElement.style.setProperty(
      "--af-primary-active-bg",
      `rgba(${r}, ${g}, ${b}, 0.16)`,
    );
    document.documentElement.style.setProperty(
      "--af-primary-hover-bg",
      `rgba(${r}, ${g}, ${b}, 0.08)`,
    );
    document.documentElement.style.setProperty(
      "--af-primary-border",
      `rgba(${r}, ${g}, ${b}, 0.35)`,
    );

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, corPrimaria);
    }
  }

  static carregarTemaSalvo(): void {
    if (
      typeof localStorage !== "undefined" &&
      typeof document !== "undefined"
    ) {
      const salva = localStorage.getItem(this.STORAGE_KEY);
      if (salva) {
        this.aplicarTema(salva);
      }
    }
  }
}

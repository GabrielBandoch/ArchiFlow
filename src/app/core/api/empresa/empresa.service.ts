import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  DadosEmpresa,
  SalvarDadosEmpresaCommand,
} from "../../../models/empresa.model";
import { UrlBuilder } from "../../utils/url-builder";

@Injectable({
  providedIn: "root",
})
export class EmpresaService {
  constructor(private http: HttpClient) {
    this.carregarTemaSalvo();
  }

  aplicarTema(corPrimaria?: string | null): void {
    if (
      typeof document !== "undefined" &&
      corPrimaria &&
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(corPrimaria)
    ) {
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
        localStorage.setItem("cotu_primary_color", corPrimaria);
      }
    }
  }

  carregarTemaSalvo(): void {
    if (
      typeof localStorage !== "undefined" &&
      typeof document !== "undefined"
    ) {
      const salva = localStorage.getItem("cotu_primary_color");
      if (salva) {
        this.aplicarTema(salva);
      }
    }
  }

  obterDadosEmpresa(): Observable<DadosEmpresa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("configuracoes")
      .segment("empresa")
      .build();
    return this.http.get<DadosEmpresa>(url).pipe(
      tap((dados) => {
        if (dados?.corPrimaria) {
          this.aplicarTema(dados.corPrimaria);
        }
      }),
    );
  }

  salvarDadosEmpresa(
    command: SalvarDadosEmpresaCommand,
  ): Observable<DadosEmpresa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("configuracoes")
      .segment("empresa")
      .build();
    return this.http.put<DadosEmpresa>(url, command).pipe(
      tap((dados) => {
        if (dados?.corPrimaria) {
          this.aplicarTema(dados.corPrimaria);
        }
      }),
    );
  }

  salvarCorPrimaria(corPrimaria: string): Observable<DadosEmpresa> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("configuracoes")
      .segment("empresa")
      .segment("cor")
      .build();
    return this.http.patch<DadosEmpresa>(url, { corPrimaria }).pipe(
      tap((dados) => {
        if (dados?.corPrimaria) {
          this.aplicarTema(dados.corPrimaria);
        }
      }),
    );
  }

  uploadLogo(file: File): Observable<{ logoUrl: string }> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("configuracoes")
      .segment("empresa")
      .segment("logo")
      .build();
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{ logoUrl: string }>(url, formData);
  }

  removerLogo(): Observable<void> {
    const url = new UrlBuilder(environment.apiUrl)
      .segment("configuracoes")
      .segment("empresa")
      .segment("logo")
      .build();
    return this.http.delete<void>(url);
  }
}

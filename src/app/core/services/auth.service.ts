import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AutenticacaoService } from "../api";
import { Usuario } from "../../models/usuario.model";
import { LoginCommand } from "../../commands/autenticacao.commands";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Usuario | undefined>;
  public currentUser$: Observable<Usuario | undefined>;

  constructor(private apiService: AutenticacaoService) {
    let storedUser: Usuario | undefined;
    try {
      const userJson = localStorage.getItem("currentUser");
      if (userJson) {
        const parsed = JSON.parse(userJson);
        if (parsed?.token && !this.isTokenExpired(parsed.token)) {
          storedUser = parsed;
        } else {
          localStorage.removeItem("currentUser");
        }
      }
    } catch (e) {
      console.error("Erro ao ler usuário do localStorage", e);
      localStorage.removeItem("currentUser");
    }
    this.currentUserSubject = new BehaviorSubject<Usuario | undefined>(
      storedUser,
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | undefined {
    return this.currentUserSubject.value;
  }

  public isTokenExpired(token?: string): boolean {
    if (!token) return true;
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return true;
      const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const payloadJson = decodeURIComponent(
        atob(payloadBase64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      const payload = JSON.parse(payloadJson);
      if (!payload.exp) return false;
      const nowInSeconds = Math.floor(Date.now() / 1000);
      return payload.exp <= nowInSeconds;
    } catch {
      return true;
    }
  }

  public get isAuthenticated(): boolean {
    const user = this.currentUserValue;
    if (!user || !user.token) {
      return false;
    }
    if (this.isTokenExpired(user.token)) {
      this.logout();
      return false;
    }
    return true;
  }

  public get token(): string | undefined {
    return this.currentUserValue?.token;
  }

  public get isCliente(): boolean {
    const perfil = this.currentUserValue?.perfil;
    return perfil === "Cliente" || perfil === "ClienteFinal";
  }

  public get isStaff(): boolean {
    const user = this.currentUserValue;
    return !!user && !this.isCliente;
  }

  public get isAdmin(): boolean {
    const perfil = this.currentUserValue?.perfil;
    return (
      perfil === "Administrador" ||
      perfil === "ArquitetoAdmin" ||
      perfil === "AdministradorGeral"
    );
  }

  public hasModulePermission(modulo: string): boolean {
    if (!this.isAuthenticated) return false;
    if (this.isCliente) return false;
    if (this.isAdmin) return true;

    const modulos = this.currentUserValue?.modulosPermitidos;
    if (!modulos || modulos.length === 0) {
      return false;
    }
    return modulos.some((m) => m.toLowerCase() === modulo.toLowerCase());
  }

  public getFirstAllowedRoute(): string {
    if (this.isCliente) {
      return "/portal";
    }
    const candidateRoutes: { modulo: string; route: string }[] = [
      { modulo: "dashboard", route: "/dashboard" },
      { modulo: "projetos", route: "/projetos" },
      { modulo: "clientes", route: "/clientes" },
      { modulo: "leads", route: "/leads" },
      { modulo: "fornecedores", route: "/fornecedores" },
      { modulo: "agenda", route: "/agenda" },
      { modulo: "financeiro", route: "/financeiro" },
      { modulo: "simulador", route: "/simulador" },
      { modulo: "configuracoes", route: "/configuracoes" },
    ];

    for (const item of candidateRoutes) {
      if (this.hasModulePermission(item.modulo)) {
        return item.route;
      }
    }
    return "/perfil";
  }

  public updateCurrentUser(partial: Partial<Usuario>): void {
    const current = this.currentUserValue;
    if (!current) return;
    const updated = { ...current, ...partial };
    localStorage.setItem("currentUser", JSON.stringify(updated));
    this.currentUserSubject.next(updated);
  }

  login(command: LoginCommand): Observable<Usuario> {
    return this.apiService.login(command).pipe(
      map((user) => {
        localStorage.setItem("currentUser", JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
    );
  }

  logout(): void {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(undefined);
  }
}

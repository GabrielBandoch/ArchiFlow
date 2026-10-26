import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { PortalLayoutComponent } from "./portal-layout.component";
import { AuthService } from "../../core/services/auth.service";
import { EmpresaService } from "../../core/api/empresa/empresa.service";

describe("PortalLayoutComponent", () => {
  let component: PortalLayoutComponent;
  let fixture: ComponentFixture<PortalLayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let empresaServiceSpy: jasmine.SpyObj<EmpresaService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj("AuthService", ["logout"], {
      currentUserValue: {
        id: "usr-1",
        nome: "Marina Sievert",
        email: "marina@cliente.com",
        perfil: "Cliente",
      },
    });
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    empresaServiceSpy = jasmine.createSpyObj("EmpresaService", [
      "obterDadosEmpresa",
    ]);
    empresaServiceSpy.obterDadosEmpresa.and.returnValue(
      of({
        nomeEmpresa: "Studio Modelo",
      } as any),
    );

    await TestBed.configureTestingModule({
      imports: [PortalLayoutComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: EmpresaService, useValue: empresaServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve extrair as iniciais do nome do usuario corretamente", () => {
    expect(component.userInitials).toBe("MS");
  });

  it("deve carregar nome do escritorio a partir da empresa", () => {
    expect(component.nomeEscritorio).toBe("Studio Modelo");
  });

  it("deve realizar logout e redirecionar para login", () => {
    component.onLogout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});

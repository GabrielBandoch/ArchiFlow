import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { DadosEmpresaComponent } from "./dados-empresa.component";
import { EmpresaService } from "../../../core/api/empresa/empresa.service";
import { ViaCepService } from "../../../core/services/via-cep.service";
import { NotificationService } from "../../../core/services/notification.service";
import { DadosEmpresa } from "../../../core/models/empresa.model";

describe("DadosEmpresaComponent", () => {
  let component: DadosEmpresaComponent;
  let fixture: ComponentFixture<DadosEmpresaComponent>;
  let empresaServiceSpy: jasmine.SpyObj<EmpresaService>;
  let viaCepServiceSpy: jasmine.SpyObj<ViaCepService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockDadosEmpresa: DadosEmpresa = {
    id: "emp-1",
    nomeEmpresa: "Studio ArchiFlow",
    razaoSocial: "Studio ArchiFlow LTDA",
    cnpj: "12345678000195",
    registroProfissional: "CAU/SP 12345",
    slogan: "Arquitetura com paixão",
    email: "contato@archiflow.com",
    telefone: "11999999999",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310100",
    website: "https://archiflow.com",
    logoUrl: "https://example.com/logo.png",
    corPrimaria: "#765538",
  };

  beforeEach(async () => {
    empresaServiceSpy = jasmine.createSpyObj("EmpresaService", [
      "obterDadosEmpresa",
      "salvarDadosEmpresa",
      "salvarCorPrimaria",
      "aplicarTema",
      "uploadLogo",
      "removerLogo",
    ]);
    viaCepServiceSpy = jasmine.createSpyObj("ViaCepService", ["buscarCep"]);
    notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "success",
      "error",
      "warning",
      "info",
    ]);

    empresaServiceSpy.obterDadosEmpresa.and.returnValue(of(mockDadosEmpresa));

    await TestBed.configureTestingModule({
      imports: [DadosEmpresaComponent, RouterTestingModule],
      providers: [
        { provide: EmpresaService, useValue: empresaServiceSpy },
        { provide: ViaCepService, useValue: viaCepServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DadosEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente e carregar dados", () => {
    expect(component).toBeTruthy();
    expect(empresaServiceSpy.obterDadosEmpresa).toHaveBeenCalled();
    expect(component.empresa).toEqual(mockDadosEmpresa);
    expect(component.carregando).toBeFalse();
  });

  it("deve selecionar cor predefinida e salvar identidade visual", () => {
    empresaServiceSpy.salvarCorPrimaria.and.returnValue(
      of({ corPrimaria: "#1E3A5F" } as any),
    );

    component.selecionarCorPredefinida("#1E3A5F");

    expect(component.empresaForm.get("corPrimaria")?.value).toBe("#1E3A5F");
    expect(empresaServiceSpy.salvarCorPrimaria).toHaveBeenCalledWith("#1E3A5F");
    expect(notificationServiceSpy.success).toHaveBeenCalledWith(
      "Identidade visual salva no banco de dados com sucesso!",
    );
  });

  it("deve validar cor inválida ao tentar salvar", () => {
    component.empresaForm.get("corPrimaria")?.setValue("invalido");
    component.salvarIdentidadeVisual();

    expect(empresaServiceSpy.salvarCorPrimaria).not.toHaveBeenCalled();
    expect(notificationServiceSpy.warning).toHaveBeenCalled();
  });

  it("deve enviar logotipo com sucesso", () => {
    empresaServiceSpy.uploadLogo.and.returnValue(
      of({ logoUrl: "https://example.com/novo-logo.png" } as any),
    );

    const file = new File(["test"], "logo.png", { type: "image/png" });
    const event = {
      target: {
        files: [file],
      },
    } as any;

    component.onLogoSelecionado(event);

    expect(empresaServiceSpy.uploadLogo).toHaveBeenCalledWith(file);
    expect(component.empresa?.logoUrl).toBe("https://example.com/novo-logo.png");
    expect(notificationServiceSpy.success).toHaveBeenCalledWith(
      "Logotipo atualizado com sucesso!",
    );
  });

  it("deve remover logotipo com sucesso", () => {
    empresaServiceSpy.removerLogo.and.returnValue(of(undefined as any));

    component.removerLogo();

    expect(empresaServiceSpy.removerLogo).toHaveBeenCalled();
    expect(component.empresa?.logoUrl).toBeNull();
    expect(notificationServiceSpy.success).toHaveBeenCalledWith(
      "Logotipo removido com sucesso!",
    );
  });

  it("deve salvar formulário válido com sucesso", () => {
    empresaServiceSpy.salvarDadosEmpresa.and.returnValue(of(mockDadosEmpresa));

    component.salvar();

    expect(empresaServiceSpy.salvarDadosEmpresa).toHaveBeenCalled();
    expect(notificationServiceSpy.success).toHaveBeenCalledWith(
      "Dados da empresa salvos com sucesso!",
    );
  });

  it("não deve submeter formulário inválido", () => {
    component.empresaForm.get("nomeEmpresa")?.setValue("");
    component.salvar();

    expect(empresaServiceSpy.salvarDadosEmpresa).not.toHaveBeenCalled();
    expect(notificationServiceSpy.warning).toHaveBeenCalled();
  });
});

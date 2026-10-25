import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { EmpresaService } from "./empresa.service";
import { environment } from "../../../../environments/environment";
import {
  DadosEmpresa,
  SalvarDadosEmpresaCommand,
} from "../../models/empresa.model";
import { TemaHelper } from "../../utils/tema.helper";

describe("EmpresaService", () => {
  let service: EmpresaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    spyOn(TemaHelper, "carregarTemaSalvo");
    spyOn(TemaHelper, "aplicarTema");

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmpresaService],
    });

    service = TestBed.inject(EmpresaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("deve ser criado e carregar tema salvo", () => {
    expect(service).toBeTruthy();
    expect(TemaHelper.carregarTemaSalvo).toHaveBeenCalled();
  });

  it("deve delegar aplicarTema ao TemaHelper", () => {
    service.aplicarTema("#123456");
    expect(TemaHelper.aplicarTema).toHaveBeenCalledWith("#123456");
  });

  it("deve obter dados da empresa via GET e aplicar tema se existir cor", () => {
    const mockDados: DadosEmpresa = {
      nomeEmpresa: "Studio Teste",
      corPrimaria: "#765538",
    };

    service.obterDadosEmpresa().subscribe((dados) => {
      expect(dados).toEqual(mockDados);
      expect(TemaHelper.aplicarTema).toHaveBeenCalledWith("#765538");
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/configuracoes/empresa`,
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockDados);
  });

  it("deve salvar dados da empresa via PUT", () => {
    const command: SalvarDadosEmpresaCommand = {
      nomeEmpresa: "Studio Atualizado",
      corPrimaria: "#223344",
    };
    const mockDados: DadosEmpresa = {
      id: "emp-1",
      nomeEmpresa: "Studio Atualizado",
      corPrimaria: "#223344",
    };

    service.salvarDadosEmpresa(command).subscribe((dados) => {
      expect(dados).toEqual(mockDados);
      expect(TemaHelper.aplicarTema).toHaveBeenCalledWith("#223344");
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/configuracoes/empresa`,
    );
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(command);
    req.flush(mockDados);
  });

  it("deve salvar cor primaria via PATCH", () => {
    const mockDados: DadosEmpresa = {
      nomeEmpresa: "Studio Teste",
      corPrimaria: "#abcdef",
    };

    service.salvarCorPrimaria("#abcdef").subscribe((dados) => {
      expect(dados).toEqual(mockDados);
      expect(TemaHelper.aplicarTema).toHaveBeenCalledWith("#abcdef");
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/configuracoes/empresa/cor`,
    );
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual({ corPrimaria: "#abcdef" });
    req.flush(mockDados);
  });

  it("deve fazer upload de logo via POST com FormData", () => {
    const fakeFile = new File(["dummy"], "logo.png", { type: "image/png" });
    const mockResp = { logoUrl: "https://example.com/logo.png" };

    service.uploadLogo(fakeFile).subscribe((res) => {
      expect(res.logoUrl).toBe(mockResp.logoUrl);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/configuracoes/empresa/logo`,
    );
    expect(req.request.method).toBe("POST");
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush(mockResp);
  });

  it("deve remover logo via DELETE", () => {
    service.removerLogo().subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/configuracoes/empresa/logo`,
    );
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });
});

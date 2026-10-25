import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AutenticacaoService } from "./autenticacao.service";
import { environment } from "../../../../environments/environment";
import {
  LoginCommand,
  SolicitarRecuperacaoCommand,
  ValidarTokenRecuperacaoCommand,
  RedefinirSenhaCommand,
  AtivarContaCommand,
  ResultadoValidacaoTokenDto,
  ResultadoValidacaoConviteDto,
} from "../../../commands/autenticacao.commands";
import { Usuario } from "../../models/usuario.model";

describe("AutenticacaoService", () => {
  let service: AutenticacaoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AutenticacaoService],
    });

    service = TestBed.inject(AutenticacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  it("deve realizar login via POST (login)", () => {
    const command: LoginCommand = {
      email: "teste@archiflow.com",
      senha: "Senha123!",
    };
    const mockUsuario: Usuario = {
      id: "u-1",
      nome: "Usuário Teste",
      email: "teste@archiflow.com",
      token: "jwt-token-123",
      perfil: "ArquitetoAdmin",
      modulosPermitidos: ["dashboard", "projetos"],
    };

    service.login(command).subscribe((usuario) => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(command);
    req.flush(mockUsuario);
  });

  it("deve solicitar recuperacao de senha via POST (solicitarRecuperacao)", () => {
    const command: SolicitarRecuperacaoCommand = {
      email: "teste@archiflow.com",
    };
    const mockResponse = { message: "E-mail de recuperação enviado." };

    service.solicitarRecuperacao(command).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/auth/recuperar-senha`,
    );
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(command);
    req.flush(mockResponse);
  });

  it("deve validar token de recuperacao via POST (validarTokenRecuperacao)", () => {
    const command: ValidarTokenRecuperacaoCommand = { token: "token-rec-123" };
    const mockResponse: ResultadoValidacaoTokenDto = {
      valido: true,
      email: "teste@archiflow.com",
    };

    service.validarTokenRecuperacao(command).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/validar-token`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(command);
    req.flush(mockResponse);
  });

  it("deve redefinir senha via POST (redefinirSenha)", () => {
    const command: RedefinirSenhaCommand = {
      token: "token-rec-123",
      novaSenha: "NovaSenha456!",
    };
    const mockResponse = { message: "Senha redefinida com sucesso." };

    service.redefinirSenha(command).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/redefinir-senha`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(command);
    req.flush(mockResponse);
  });

  it("deve validar token de convite via GET (validarTokenConvite)", () => {
    const token = "convite-token-xyz";
    const mockResponse: ResultadoValidacaoConviteDto = {
      valido: true,
      nome: "Colaborador Convidado",
      email: "convidado@archiflow.com",
    };

    service.validarTokenConvite(token).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/auth/convite/${encodeURIComponent(token)}`,
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("deve ativar conta via POST (ativarConta)", () => {
    const command: AtivarContaCommand = {
      token: "convite-token-xyz",
      senha: "SenhaSegura123!",
      nome: "Nome Ativado",
    };
    const mockResponse = { message: "Conta ativada com sucesso." };

    service.ativarConta(command).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/ativar-conta`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(command);
    req.flush(mockResponse);
  });
});

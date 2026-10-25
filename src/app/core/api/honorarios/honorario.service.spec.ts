import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HonorarioService } from "./honorario.service";
import { environment } from "../../../../environments/environment";
import {
  SimulacaoParametros,
  SimulacaoResultado,
  PropostaHonorario,
} from "../../models/honorario.model";
import {
  CriarPropostaCommand,
  AtualizarStatusPropostaCommand,
  AjustarValorPropostaCommand,
} from "../../../commands/honorario.commands";

describe("HonorarioService", () => {
  let service: HonorarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HonorarioService],
    });

    service = TestBed.inject(HonorarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  it("deve simular proposta via POST (simular)", () => {
    const params: SimulacaoParametros = {
      metragemQuadrada: 120,
      tipoProjeto: 1,
      padraoImovel: 2,
    };
    const mockResultado: SimulacaoResultado = {
      metragemQuadrada: 120,
      tipoProjeto: 1,
      tipoProjetoNome: "Residencial",
      padraoImovel: 2,
      padraoImovelNome: "Médio",
      valorTotalSugerido: 25000,
      valorMetroQuadrado: 208.33,
      horasEstimadasTotal: 100,
      etapas: [],
      memoriaCalculo: {} as any,
    };

    service.simular(params).subscribe((res) => {
      expect(res).toEqual(mockResultado);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/honorarios/simular`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(params);
    req.flush(mockResultado);
  });

  it("deve obter propostas via GET (obterPropostas)", () => {
    const mockPropostas: PropostaHonorario[] = [
      { id: "prop-1", titulo: "Proposta Casa 1" } as any,
    ];

    service.obterPropostas().subscribe((res) => {
      expect(res).toEqual(mockPropostas);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/propostas`);
    expect(req.request.method).toBe("GET");
    req.flush(mockPropostas);
  });

  it("deve obter proposta por id via GET (obterPropostaPorId)", () => {
    const mockProposta: PropostaHonorario = {
      id: "prop-1",
      titulo: "Proposta Casa 1",
    } as any;

    service.obterPropostaPorId("prop-1").subscribe((res) => {
      expect(res).toEqual(mockProposta);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/propostas/prop-1`);
    expect(req.request.method).toBe("GET");
    req.flush(mockProposta);
  });

  it("deve obter propostas por cliente via GET (obterPropostasPorCliente)", () => {
    service.obterPropostasPorCliente("cli-1").subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/propostas/cliente/cli-1`,
    );
    expect(req.request.method).toBe("GET");
    req.flush([]);
  });

  it("deve obter propostas por lead via GET (obterPropostasPorLead)", () => {
    service.obterPropostasPorLead("lead-1").subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/propostas/lead/lead-1`);
    expect(req.request.method).toBe("GET");
    req.flush([]);
  });

  it("deve criar proposta via POST (criarProposta)", () => {
    const cmd: CriarPropostaCommand = {
      titulo: "Nova Proposta",
      tipoProjeto: 1,
      padraoImovel: 1,
      metragemQuadrada: 100,
    };
    const mockProposta: PropostaHonorario = { id: "prop-2", ...cmd } as any;

    service.criarProposta(cmd).subscribe((res) => {
      expect(res).toEqual(mockProposta);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/propostas`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(cmd);
    req.flush(mockProposta);
  });

  it("deve atualizar status via PUT (atualizarStatus)", () => {
    const cmd: AtualizarStatusPropostaCommand = { status: 2 };

    service.atualizarStatus("prop-1", cmd).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/propostas/prop-1/status`,
    );
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(cmd);
    req.flush({} as any);
  });

  it("deve ajustar valor via PUT (ajustarValor)", () => {
    const cmd: AjustarValorPropostaCommand = {
      valorFinalAjustado: 22000,
      observacoes: "Desconto aplicado",
    };

    service.ajustarValor("prop-1", cmd).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/propostas/prop-1/ajustar-valor`,
    );
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(cmd);
    req.flush({} as any);
  });

  it("deve excluir proposta via DELETE (excluirProposta)", () => {
    service.excluirProposta("prop-1").subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/propostas/prop-1`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });
});

import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { LeadService } from "./lead.service";
import { environment } from "../../../../environments/environment";
import { Lead, HistoricoContatoLead, StatusLead } from "../../models/lead.model";
import {
  CriarLeadCommand,
  AtualizarLeadCommand,
  AtualizarStatusLeadCommand,
  RegistrarContatoLeadCommand,
} from "../../../commands/lead.commands";

describe("LeadService", () => {
  let service: LeadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeadService],
    });

    service = TestBed.inject(LeadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  it("deve obter todos os leads via GET (obterTodos)", () => {
    const mockLeads: Lead[] = [{ id: "l-1", nome: "Lead 1" } as any];

    service.obterTodos().subscribe((leads) => {
      expect(leads).toEqual(mockLeads);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/leads`);
    expect(req.request.method).toBe("GET");
    req.flush(mockLeads);
  });

  it("deve obter lead por id via GET (obterPorId)", () => {
    const mockLead: Lead = { id: "l-1", nome: "Lead 1" } as any;

    service.obterPorId("l-1").subscribe((lead) => {
      expect(lead).toEqual(mockLead);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/leads/l-1`);
    expect(req.request.method).toBe("GET");
    req.flush(mockLead);
  });

  it("deve criar lead via POST (criar)", () => {
    const cmd: CriarLeadCommand = {
      nome: "Novo Lead",
      email: "lead@teste.com",
      telefone: "11999999999",
      origemId: "org-1",
    };
    const mockLead: Lead = { id: "l-2", ...cmd, status: StatusLead.Novo, statusLabel: "Novo", criadoEm: "", historicoContatos: [] };

    service.criar(cmd).subscribe((lead) => {
      expect(lead).toEqual(mockLead);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/leads`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(cmd);
    req.flush(mockLead);
  });

  it("deve atualizar lead via PUT (atualizar)", () => {
    const cmd: AtualizarLeadCommand = {
      id: "l-1",
      nome: "Lead Atualizado",
      email: "lead@teste.com",
      telefone: "11988888888",
      origemId: "org-1",
    };
    const mockLead: Lead = { ...cmd, status: StatusLead.Novo, statusLabel: "Novo", criadoEm: "", historicoContatos: [] };

    service.atualizar(cmd).subscribe((lead) => {
      expect(lead).toEqual(mockLead);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/leads/l-1`);
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(cmd);
    req.flush(mockLead);
  });

  it("deve atualizar status via PATCH (atualizarStatus)", () => {
    const cmd: AtualizarStatusLeadCommand = {
      id: "l-1",
      status: StatusLead.EmContato,
    };
    const mockLead: Lead = { id: "l-1", status: StatusLead.EmContato } as any;

    service.atualizarStatus(cmd).subscribe((lead) => {
      expect(lead).toEqual(mockLead);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/leads/l-1/status`);
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual(cmd);
    req.flush(mockLead);
  });

  it("deve registrar contato via POST (registrarContato)", () => {
    const cmd: RegistrarContatoLeadCommand = {
      leadId: "l-1",
      canal: "WhatsApp",
      resumo: "Conversa inicial sobre o projeto",
    };
    const mockHist: HistoricoContatoLead = {
      id: "h-1",
      leadId: "l-1",
      canal: "WhatsApp",
      resumo: "Conversa inicial sobre o projeto",
      dataContato: new Date().toISOString(),
    };

    service.registrarContato(cmd).subscribe((hist) => {
      expect(hist).toEqual(mockHist);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/leads/l-1/historico`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(cmd);
    req.flush(mockHist);
  });

  it("deve excluir lead via DELETE (excluir)", () => {
    service.excluir("l-1").subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/leads/l-1`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });
});

import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { OrigemLeadService } from "./origem-lead.service";
import { environment } from "../../../../environments/environment";
import { OrigemLead } from "../../models/origem-lead.model";

describe("OrigemLeadService", () => {
  let service: OrigemLeadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrigemLeadService],
    });

    service = TestBed.inject(OrigemLeadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  it("deve obter todos via GET (obterTodos)", () => {
    const mockOrigens: OrigemLead[] = [
      { id: "org-1", descricao: "Instagram", ativo: true } as any,
    ];

    service.obterTodos().subscribe((origens) => {
      expect(origens).toEqual(mockOrigens);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/origens-lead`);
    expect(req.request.method).toBe("GET");
    req.flush(mockOrigens);
  });

  it("deve obter ativas via GET (obterAtivas)", () => {
    service.obterAtivas().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/origens-lead/ativas`);
    expect(req.request.method).toBe("GET");
    req.flush([]);
  });

  it("deve obter por id via GET (obterPorId)", () => {
    const mockOrigem: OrigemLead = {
      id: "org-1",
      descricao: "Google",
      ativo: true,
    } as any;

    service.obterPorId("org-1").subscribe((origem) => {
      expect(origem).toEqual(mockOrigem);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/origens-lead/org-1`);
    expect(req.request.method).toBe("GET");
    req.flush(mockOrigem);
  });

  it("deve criar origem via POST (criar)", () => {
    const mockOrigem: OrigemLead = {
      id: "org-2",
      descricao: "Indicação",
      ativo: true,
    } as any;

    service.criar("Indicação").subscribe((origem) => {
      expect(origem).toEqual(mockOrigem);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/origens-lead`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ descricao: "Indicação" });
    req.flush(mockOrigem);
  });

  it("deve atualizar origem via PUT (atualizar)", () => {
    const mockOrigem: OrigemLead = {
      id: "org-1",
      descricao: "Instagram Ads",
      ativo: true,
    } as any;

    service.atualizar("org-1", "Instagram Ads").subscribe((origem) => {
      expect(origem).toEqual(mockOrigem);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/origens-lead/org-1`);
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual({
      id: "org-1",
      descricao: "Instagram Ads",
    });
    req.flush(mockOrigem);
  });

  it("deve desativar origem via DELETE (desativar)", () => {
    service.desativar("org-1").subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/origens-lead/org-1`);
    expect(req.request.method).toBe("DELETE");
    req.flush({} as any);
  });

  it("deve reativar origem via POST (reativar)", () => {
    service.reativar("org-1").subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/origens-lead/org-1/reativar`,
    );
    expect(req.request.method).toBe("POST");
    req.flush({} as any);
  });
});

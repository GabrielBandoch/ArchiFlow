import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { environment } from '../../../../environments/environment';
import { DashboardMetricas, PreferenciaDashboard } from '../../../models/dashboard.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/dashboard`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch dashboard metrics (obterMetricas)', () => {
    const mockMetricas: DashboardMetricas = {
      kpis: {
        totalProjetosAtivos: 5,
        totalProjetosConcluidos: 2,
        totalLeadsAtivos: 8,
        totalLeadsConvertidos: 4,
        taxaConversaoLeads: 50,
        totalClientes: 6,
        totalPropostas: 10,
        valorTotalPropostas: 120000,
        valorMedioProposta: 12000
      },
      projetosPorStatus: [],
      projetosPorTipo: [],
      leadsPorStatus: [],
      leadsPorOrigem: [],
      propostasMensais: [],
      projetosRecentes: [],
      leadsRecentes: [],
      propostasRecentes: []
    };

    service.obterMetricas().subscribe((res) => {
      expect(res).toEqual(mockMetricas);
      expect(res.kpis.totalProjetosAtivos).toBe(5);
    });

    const req = httpMock.expectOne(`${baseUrl}/metricas`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMetricas);
  });

  it('should fetch user preferences (obterPreferencias)', () => {
    const mockPref: PreferenciaDashboard = {
      usuarioId: 'u1',
      layoutJson: '[]',
      atualizadoEm: '2026-09-22T00:00:00Z'
    };

    service.obterPreferencias().subscribe((res) => {
      expect(res).toEqual(mockPref);
    });

    const req = httpMock.expectOne(`${baseUrl}/preferencias`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPref);
  });

  it('should save user preferences to backend database (salvarPreferencias)', () => {
    const layoutJson = '[{"id":"kpi_resumo","visivel":true,"ordem":1}]';
    const mockPref: PreferenciaDashboard = {
      usuarioId: 'u1',
      layoutJson,
      atualizadoEm: '2026-09-22T00:00:00Z'
    };

    service.salvarPreferencias(layoutJson).subscribe((res) => {
      expect(res.layoutJson).toBe(layoutJson);
    });

    const req = httpMock.expectOne(`${baseUrl}/preferencias`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ layoutJson });
    req.flush(mockPref);
  });
});

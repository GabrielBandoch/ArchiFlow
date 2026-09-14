import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortalHeroComponent } from './portal-hero.component';
import { StatusProjeto, TipoProjeto } from '../../../models/projeto.model';

describe('PortalHeroComponent', () => {
  let component: PortalHeroComponent;
  let fixture: ComponentFixture<PortalHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalHeroComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PortalHeroComponent);
    component = fixture.componentInstance;
    component.projeto = {
      id: 'proj-1',
      nome: 'Residencial Aurora',
      descricao: 'Projeto residencial',
      status: StatusProjeto.Desenvolvimento,
      statusLabel: 'Desenvolvimento',
      tipo: TipoProjeto.Residencial,
      tipoLabel: 'Residencial',
      dataInicio: '2026-01-01',
      metragemTotal: 200,
      clienteId: 'cli-1',
      criadoEm: '2026-01-01',
      etapas: [],
      progressoPercentual: 50
    };
    component.statusLabel = 'Em Desenvolvimento';
    component.tipoFormatado = 'Residencial';
    component.percentualProgresso = 50;
    component.totalConcluidas = 2;
    component.totalEtapas = 4;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve formatar data corretamente', () => {
    expect(component.formatarData(null)).toBe('Não definida');
    expect(component.formatarData('2026-03-10')).toContain('2026');
  });
});

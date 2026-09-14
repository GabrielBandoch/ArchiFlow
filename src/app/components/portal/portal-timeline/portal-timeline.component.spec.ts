import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortalTimelineComponent } from './portal-timeline.component';
import { StatusEtapa } from '../../../models/projeto.model';

describe('PortalTimelineComponent', () => {
  let component: PortalTimelineComponent;
  let fixture: ComponentFixture<PortalTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalTimelineComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PortalTimelineComponent);
    component = fixture.componentInstance;
    component.etapas = [
      {
        id: 'e-1',
        projetoId: 'p-1',
        nome: 'Estudo Preliminar',
        descricao: 'Fase inicial',
        ordem: 1,
        status: StatusEtapa.Concluida,
        statusLabel: 'Concluída'
      },
      {
        id: 'e-2',
        projetoId: 'p-1',
        nome: 'Anteprojeto',
        descricao: 'Modelagem 3D',
        ordem: 2,
        status: StatusEtapa.EmAndamento,
        statusLabel: 'Em Andamento',
        tarefas: [
          { id: 't-1', etapaId: 'e-2', titulo: 'Render 3D', concluida: false }
        ]
      }
    ];
    component.etapaAtual = component.etapas[1];
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve formatar data corretamente', () => {
    expect(component.formatarData(null)).toBe('Não definida');
    expect(component.formatarData('2026-05-20')).toContain('2026');
  });
});

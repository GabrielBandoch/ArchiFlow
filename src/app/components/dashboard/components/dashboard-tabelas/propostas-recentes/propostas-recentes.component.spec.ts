import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PropostasRecentesComponent } from './propostas-recentes.component';

describe('PropostasRecentesComponent', () => {
  let component: PropostasRecentesComponent;
  let fixture: ComponentFixture<PropostasRecentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropostasRecentesComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PropostasRecentesComponent);
    component = fixture.componentInstance;
    component.propostas = [
      {
        id: 'prop1',
        titulo: 'Proposta Comercial Alpha',
        codigo: 'PROP-2026-001',
        clienteOuLeadNome: 'Acme Corp',
        metragemQuadrada: 300,
        valorFinal: 25000,
        status: 'Aprovada',
        criadoEm: '2026-09-28T00:00:00Z'
      }
    ];
    fixture.detectChanges();
  });

  it('should create and render proposal list items with formatted currency', () => {
    expect(component).toBeTruthy();
    const items = fixture.nativeElement.querySelectorAll('.compact-item');
    expect(items.length).toBe(1);

    const codeEl = fixture.nativeElement.querySelector('.badge-code');
    expect(codeEl.textContent.trim()).toBe('PROP-2026-001');

    const valueEl = fixture.nativeElement.querySelector('.prop-valor');
    expect(valueEl.textContent).toContain('25.000,00');
  });

  it('should display empty state when proposals array is empty', () => {
    component.propostas = [];
    fixture.detectChanges();

    const emptyEl = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyEl).toBeTruthy();
    expect(emptyEl.textContent).toContain('Nenhuma proposta recente');
  });

  it('should return correct badge class for each StatusProposta', () => {
    expect(component.obterBadgeStatus('Aprovada')).toBe('status-green');
    expect(component.obterBadgeStatus('Enviada')).toBe('status-blue');
    expect(component.obterBadgeStatus('Rascunho')).toBe('status-neutral');
    expect(component.obterBadgeStatus('Recusada')).toBe('status-red');
    expect(component.obterBadgeStatus('Desconhecido')).toBe('status-neutral');
  });
});

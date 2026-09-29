import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjetosRecentesComponent } from './projetos-recentes.component';

describe('ProjetosRecentesComponent', () => {
  let component: ProjetosRecentesComponent;
  let fixture: ComponentFixture<ProjetosRecentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetosRecentesComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetosRecentesComponent);
    component = fixture.componentInstance;
    component.projetos = [
      {
        id: 'p1',
        nome: 'Residência Sunset',
        clienteNome: 'Maria Souza',
        status: 'Desenvolvimento',
        tipo: 'Residencial',
        metragemTotal: 250,
        totalEtapas: 4,
        etapasConcluidas: 2,
        progressoPercentual: 50
      }
    ];
    fixture.detectChanges();
  });

  it('should create and render projects table rows', () => {
    expect(component).toBeTruthy();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);

    const nameEl = fixture.nativeElement.querySelector('td .font-weight-bold');
    expect(nameEl.textContent.trim()).toBe('Residência Sunset');
  });

  it('should display empty state when projects array is empty', () => {
    component.projetos = [];
    fixture.detectChanges();

    const emptyEl = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyEl).toBeTruthy();
    expect(emptyEl.textContent).toContain('Nenhum projeto em andamento');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LeadsRecentesComponent } from './leads-recentes.component';

describe('LeadsRecentesComponent', () => {
  let component: LeadsRecentesComponent;
  let fixture: ComponentFixture<LeadsRecentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsRecentesComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadsRecentesComponent);
    component = fixture.componentInstance;
    component.leads = [
      {
        id: 'l1',
        nome: 'Carlos Drummond',
        email: 'carlos@lit.com',
        status: 'Novo Lead',
        origemNome: 'Instagram',
        criadoEm: '2026-09-28T00:00:00Z'
      }
    ];
    fixture.detectChanges();
  });

  it('should create and render leads list', () => {
    expect(component).toBeTruthy();
    const items = fixture.nativeElement.querySelectorAll('.compact-item');
    expect(items.length).toBe(1);

    const nameEl = fixture.nativeElement.querySelector('.font-weight-bold.truncate');
    expect(nameEl.textContent.trim()).toBe('Carlos Drummond');
  });

  it('should display empty state when leads array is empty', () => {
    component.leads = [];
    fixture.detectChanges();

    const emptyEl = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyEl).toBeTruthy();
    expect(emptyEl.textContent).toContain('Nenhum lead recente');
  });
});

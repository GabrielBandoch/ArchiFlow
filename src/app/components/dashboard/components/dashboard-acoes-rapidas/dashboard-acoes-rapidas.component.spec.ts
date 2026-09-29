import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardAcoesRapidasComponent } from './dashboard-acoes-rapidas.component';

describe('DashboardAcoesRapidasComponent', () => {
  let component: DashboardAcoesRapidasComponent;
  let fixture: ComponentFixture<DashboardAcoesRapidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAcoesRapidasComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAcoesRapidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create actions component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit novoProjeto when clicking Novo Projeto button in DOM', () => {
    spyOn(component.novoProjeto, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('button.btn-quick');
    const novoProjetoBtn = Array.from(buttons).find((b: any) => b.textContent.includes('Novo Projeto')) as HTMLButtonElement;
    expect(novoProjetoBtn).toBeTruthy();

    novoProjetoBtn.click();
    expect(component.novoProjeto.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit novoLead when clicking Novo Lead button in DOM', () => {
    spyOn(component.novoLead, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('button.btn-quick');
    const novoLeadBtn = Array.from(buttons).find((b: any) => b.textContent.includes('Novo Lead')) as HTMLButtonElement;
    expect(novoLeadBtn).toBeTruthy();

    novoLeadBtn.click();
    expect(component.novoLead.emit).toHaveBeenCalledTimes(1);
  });

  it('should render navigation links to simulador and clientes', () => {
    const links = fixture.nativeElement.querySelectorAll('a.btn-quick');
    const hrefs = Array.from(links).map((l: any) => l.getAttribute('href') || l.getAttribute('ng-reflect-router-link'));
    
    const simuladorLink = Array.from(links).find((l: any) => l.textContent.includes('Simular Honorários')) as HTMLAnchorElement;
    const clientesLink = Array.from(links).find((l: any) => l.textContent.includes('Ver Clientes')) as HTMLAnchorElement;

    expect(simuladorLink).toBeTruthy();
    expect(clientesLink).toBeTruthy();
  });
});

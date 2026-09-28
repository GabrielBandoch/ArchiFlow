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

  it('should emit novoProjeto on clicking novo projeto action', () => {
    spyOn(component.novoProjeto, 'emit');
    component.novoProjeto.emit();
    expect(component.novoProjeto.emit).toHaveBeenCalled();
  });

  it('should emit novoLead on clicking novo lead action', () => {
    spyOn(component.novoLead, 'emit');
    component.novoLead.emit();
    expect(component.novoLead.emit).toHaveBeenCalled();
  });
});

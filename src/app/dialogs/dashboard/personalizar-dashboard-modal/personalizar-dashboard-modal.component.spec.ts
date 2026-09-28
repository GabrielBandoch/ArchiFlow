import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PersonalizarDashboardModalComponent } from './personalizar-dashboard-modal.component';
import { WIDGETS_DEFAULT } from '../../../models/dashboard.model';

describe('PersonalizarDashboardModalComponent', () => {
  let component: PersonalizarDashboardModalComponent;
  let fixture: ComponentFixture<PersonalizarDashboardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalizarDashboardModalComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalizarDashboardModalComponent);
    component = fixture.componentInstance;
    component.widgets = [...WIDGETS_DEFAULT];
    fixture.detectChanges();
  });

  it('should create modal component and initialize tempWidgets', () => {
    expect(component).toBeTruthy();
    expect(component.tempWidgets.length).toBe(WIDGETS_DEFAULT.length);
  });

  it('should move widget up and down correctly', () => {
    const firstId = component.tempWidgets[0].id;
    const secondId = component.tempWidgets[1].id;

    component.moverWidget(0, 'down');
    expect(component.tempWidgets[0].id).toBe(secondId);
    expect(component.tempWidgets[1].id).toBe(firstId);

    component.moverWidget(1, 'up');
    expect(component.tempWidgets[0].id).toBe(firstId);
  });

  it('should emit salvar event with current tempWidgets', () => {
    spyOn(component.salvar, 'emit');
    component.onSalvar();
    expect(component.salvar.emit).toHaveBeenCalledWith(component.tempWidgets);
  });

  it('should emit restaurar event on onRestaurarPadrao', () => {
    spyOn(component.restaurar, 'emit');
    component.onRestaurarPadrao();
    expect(component.restaurar.emit).toHaveBeenCalled();
  });

  it('should emit close event on onClose', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });
});

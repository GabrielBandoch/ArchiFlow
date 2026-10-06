import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente com valores padrão', () => {
    expect(component).toBeTruthy();
    expect(component.icon).toBe('inbox');
    expect(component.title).toBe('Nenhum registro encontrado');
  });

  it('deve emitir evento de ação ao clicar no botão', () => {
    spyOn(component.action, 'emit');
    component.actionText = 'Criar Novo';
    fixture.detectChanges();

    component.onActionClick();
    expect(component.action.emit).toHaveBeenCalled();
  });
});

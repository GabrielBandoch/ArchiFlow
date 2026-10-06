import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve formatar telefone no writeValue quando type=tel ou mask=phone', () => {
    component.type = 'tel';
    component.writeValue('47999466073');
    expect(component.value).toBe('(47) 99946-6073');
  });

  it('deve aplicar máscara de telefone no onInput', () => {
    component.mask = 'phone';
    const fakeEvent = {
      target: {
        value: '47999466073'
      }
    } as unknown as Event;

    component.onInput(fakeEvent);
    expect(component.value).toBe('(47) 99946-6073');
  });

  it('deve retornar effectiveMaxLength 15 para telefone', () => {
    component.mask = 'phone';
    expect(component.effectiveMaxLength).toBe(15);
  });
});

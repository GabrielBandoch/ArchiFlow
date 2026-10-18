import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CotuLogoComponent } from './cotu-logo.component';

describe('CotuLogoComponent', () => {
  let component: CotuLogoComponent;
  let fixture: ComponentFixture<CotuLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotuLogoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CotuLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente com valores padrão', () => {
    expect(component).toBeTruthy();
    expect(component.size).toBe(32);
    expect(component.showText).toBeTrue();
  });

  it('deve renderizar o wordmark quando showText for true', () => {
    const wordmark = fixture.nativeElement.querySelector('.wordmark');
    expect(wordmark).toBeTruthy();
    expect(wordmark.textContent.trim()).toBe('COTU');
  });

  it('não deve renderizar o wordmark quando showText for false', () => {
    component.showText = false;
    fixture.detectChanges();

    const wordmark = fixture.nativeElement.querySelector('.wordmark');
    expect(wordmark).toBeNull();
  });

  it('deve ajustar o tamanho via propriedade size', () => {
    component.size = 48;
    fixture.detectChanges();

    const logo = fixture.nativeElement.querySelector('.cotu-logo');
    expect(logo.style.getPropertyValue('--cotu-logo-size')).toBe('48px');
  });
});

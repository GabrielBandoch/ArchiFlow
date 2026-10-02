import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente com variantes padrão', () => {
    expect(component).toBeTruthy();
    expect(component.variant).toBe('neutral');
    expect(component.size).toBe('sm');
  });

  it('deve aplicar as classes corretas de variante e tamanho', () => {
    component.variant = 'success';
    component.size = 'md';
    component.text = 'Ativo';
    component.icon = 'check_circle';
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.af-badge');
    expect(el.classList).toContain('af-badge-success');
    expect(el.classList).toContain('af-badge-md');
    expect(el.textContent).toContain('Ativo');
    expect(fixture.nativeElement.querySelector('.af-badge-icon').textContent).toBe('check_circle');
  });
});

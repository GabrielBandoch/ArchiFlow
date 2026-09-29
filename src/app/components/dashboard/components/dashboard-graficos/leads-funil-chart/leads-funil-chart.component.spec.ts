import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LeadsFunilChartComponent } from './leads-funil-chart.component';

describe('LeadsFunilChartComponent', () => {
  let component: LeadsFunilChartComponent;
  let fixture: ComponentFixture<LeadsFunilChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsFunilChartComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadsFunilChartComponent);
    component = fixture.componentInstance;
    component.dados = [
      { status: 'Novo', nomeStatus: 'Novo Lead', quantidade: 4, percentual: 40 },
      { status: 'Convertido', nomeStatus: 'Convertido em Cliente', quantidade: 2, percentual: 20 }
    ];
    fixture.detectChanges();
  });

  it('should create and render funnel steps', () => {
    expect(component).toBeTruthy();
    const steps = fixture.nativeElement.querySelectorAll('.funnel-step');
    expect(steps.length).toBe(2);

    const firstFill = fixture.nativeElement.querySelector('.funnel-bar-fill') as HTMLElement;
    expect(firstFill.style.width).toBe('40%');
  });

  it('should handle empty data safely', () => {
    component.dados = [];
    fixture.detectChanges();

    const steps = fixture.nativeElement.querySelectorAll('.funnel-step');
    expect(steps.length).toBe(0);
  });
});

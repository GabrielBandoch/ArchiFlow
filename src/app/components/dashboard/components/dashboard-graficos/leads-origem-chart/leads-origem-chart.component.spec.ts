import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LeadsOrigemChartComponent } from './leads-origem-chart.component';

describe('LeadsOrigemChartComponent', () => {
  let component: LeadsOrigemChartComponent;
  let fixture: ComponentFixture<LeadsOrigemChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsOrigemChartComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadsOrigemChartComponent);
    component = fixture.componentInstance;
    component.dados = [
      { origem: 'Instagram', quantidade: 6, percentual: 60 },
      { origem: 'Direto', quantidade: 4, percentual: 40 }
    ];
    fixture.detectChanges();
  });

  it('should create and render acquisition sources', () => {
    expect(component).toBeTruthy();
    const cards = fixture.nativeElement.querySelectorAll('.source-card');
    expect(cards.length).toBe(2);

    const firstPercent = fixture.nativeElement.querySelector('.source-percent');
    expect(firstPercent.textContent.trim()).toBe('60%');
  });

  it('should handle empty data safely', () => {
    component.dados = [];
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.source-card');
    expect(cards.length).toBe(0);
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AgendaMetricasComponent } from "./agenda-metricas.component";

describe("AgendaMetricasComponent", () => {
  let component: AgendaMetricasComponent;
  let fixture: ComponentFixture<AgendaMetricasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaMetricasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaMetricasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });
});

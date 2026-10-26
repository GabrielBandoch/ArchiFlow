import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardKpisComponent } from "./dashboard-kpis.component";
import { DashboardKpis } from "../../../../core/models/dashboard.model";

describe("DashboardKpisComponent", () => {
  let component: DashboardKpisComponent;
  let fixture: ComponentFixture<DashboardKpisComponent>;

  const mockKpis: DashboardKpis = {
    totalProjetosAtivos: 5,
    totalProjetosConcluidos: 10,
    totalLeadsAtivos: 12,
    totalLeadsConvertidos: 8,
    taxaConversaoLeads: 65,
    totalClientes: 15,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardKpisComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardKpisComponent);
    component = fixture.componentInstance;
    component.kpis = mockKpis;
    fixture.detectChanges();
  });

  it("should create kpi component and render values", () => {
    expect(component).toBeTruthy();
    expect(component.kpis.totalProjetosAtivos).toBe(5);

    const values = fixture.nativeElement.querySelectorAll(".kpi-value");
    expect(values.length).toBe(4);
    expect(values[0].textContent.trim()).toBe("5");
    expect(values[1].textContent.trim()).toBe("65%");
    expect(values[2].textContent.trim()).toBe("15");
    expect(values[3].textContent.trim()).toBe("12");
  });

  it('should render semantically correct "leads ativos" label instead of "em negociação"', () => {
    const pill = fixture.nativeElement.querySelector(".pill-amber");
    expect(pill).toBeTruthy();
    expect(pill.textContent).toContain("12 leads ativos");
    expect(pill.textContent).not.toContain("em negociação");
  });

  it("should render client count correctly", () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain("Clientes Cadastrados");
    expect(text).toContain("15");
  });
});

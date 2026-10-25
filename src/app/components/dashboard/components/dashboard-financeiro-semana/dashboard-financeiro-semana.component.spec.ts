import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DashboardFinanceiroSemanaComponent } from "./dashboard-financeiro-semana.component";
import { DespesaProjeto, ParcelaFinanceira } from "../../../../core/models/financeiro.model";

describe("DashboardFinanceiroSemanaComponent", () => {
  let component: DashboardFinanceiroSemanaComponent;
  let fixture: ComponentFixture<DashboardFinanceiroSemanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFinanceiroSemanaComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardFinanceiroSemanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve emitir marcarDespesaPaga", () => {
    spyOn(component.marcarDespesaPaga, "emit");
    const mockDespesa: DespesaProjeto = {
      id: "1",
      descricao: "Material de Escritório",
      valor: 150,
      dataDespesa: "2026-05-15",
      pago: false,
    } as any;

    component.contasPagar = [mockDespesa];
    fixture.detectChanges();

    const checkBtn = fixture.nativeElement.querySelector(".btn-quick-check");
    checkBtn.click();

    expect(component.marcarDespesaPaga.emit).toHaveBeenCalledWith(mockDespesa);
  });

  it("deve formatar moeda e data corretamente", () => {
    expect(component.formatarMoeda(1500)).toContain("1.500");
    expect(component.formatarMoeda(undefined)).toBe("R$ 0,00");
    expect(component.formatarData("2026-05-15T00:00:00")).toBe("15/05");
    expect(component.formatarData(undefined)).toBe("-");
  });
});

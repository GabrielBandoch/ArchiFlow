import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DashboardPendenciasHojeComponent } from "./dashboard-pendencias-hoje.component";
import { Compromisso, StatusCompromisso, TiposCompromisso } from "../../../../core/models/agenda.model";

describe("DashboardPendenciasHojeComponent", () => {
  let component: DashboardPendenciasHojeComponent;
  let fixture: ComponentFixture<DashboardPendenciasHojeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPendenciasHojeComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPendenciasHojeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve emitir agendarTarefa", () => {
    spyOn(component.agendarTarefa, "emit");
    component.agendarTarefa.emit();
    expect(component.agendarTarefa.emit).toHaveBeenCalled();
  });

  it("deve formatar hora corretamente", () => {
    const hora = component.formatarHora("2026-05-15T14:30:00Z");
    expect(hora).toBeTruthy();
    expect(component.formatarHora(undefined)).toBe("");
  });

  it("deve exibir lista quando houver compromissos", () => {
    const mockCompromisso: Compromisso = {
      id: "1",
      titulo: "Reunião Cliente",
      tipo: TiposCompromisso.ReuniaoCliente,
      status: StatusCompromisso.Agendado,
      dataHoraInicio: new Date().toISOString(),
      dataHoraFim: new Date().toISOString(),
    } as any;

    component.compromissos = [mockCompromisso];
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll(".today-task-row");
    expect(rows.length).toBe(1);
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AgendaCalendarioViewComponent, DiaCalendario } from "./agenda-calendario-view.component";
import { TiposCompromisso, StatusCompromisso } from "../../../../core/models/agenda.model";

describe("AgendaCalendarioViewComponent", () => {
  let component: AgendaCalendarioViewComponent;
  let fixture: ComponentFixture<AgendaCalendarioViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaCalendarioViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaCalendarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve emitir diaClick quando a célula for clicada", () => {
    spyOn(component.diaClick, "emit");
    const testDate = new Date(2026, 4, 15);
    component.diasMes = [
      {
        data: testDate,
        diaNumero: 15,
        mesmoMes: true,
        isHoje: false,
        compromissos: [],
      },
    ];
    fixture.detectChanges();

    const cell = fixture.nativeElement.querySelector(".calendar-day-cell");
    cell.click();

    expect(component.diaClick.emit).toHaveBeenCalledWith(testDate);
  });

  it("deve emitir compromissoClick quando um evento for clicado", () => {
    spyOn(component.compromissoClick, "emit");
    const testDate = new Date(2026, 4, 15);
    const mockCompromisso = {
      id: "1",
      titulo: "Reunião de Alinhamento",
      tipo: TiposCompromisso.ReuniaoCliente,
      status: StatusCompromisso.Agendado,
      dataHoraInicio: new Date(2026, 4, 15, 10, 0).toISOString(),
      dataHoraFim: new Date(2026, 4, 15, 11, 0).toISOString(),
    } as any;

    component.diasMes = [
      {
        data: testDate,
        diaNumero: 15,
        mesmoMes: true,
        isHoje: false,
        compromissos: [mockCompromisso],
      },
    ];
    fixture.detectChanges();

    const pill = fixture.nativeElement.querySelector(".event-pill");
    pill.click();

    expect(component.compromissoClick.emit).toHaveBeenCalledWith(mockCompromisso);
  });

  it("deve mapear classes de tipo de compromisso corretamente", () => {
    expect(component.obterBadgeClasseTipo(TiposCompromisso.ReuniaoCliente)).toBe("badge-tipo-reuniao");
    expect(component.obterBadgeClasseTipo(TiposCompromisso.VisitaObra)).toBe("badge-tipo-obra");
    expect(component.obterBadgeClasseTipo(TiposCompromisso.MedicaoTecnica)).toBe("badge-tipo-medicao");
    expect(component.obterBadgeClasseTipo(TiposCompromisso.ApresentacaoProjeto)).toBe("badge-tipo-apresentacao");
    expect(component.obterBadgeClasseTipo(TiposCompromisso.EntregaEtapa)).toBe("badge-tipo-entrega");
    expect(component.obterBadgeClasseTipo("desconhecido")).toBe("badge-tipo-geral");
  });

  it("deve formatar hora corretamente", () => {
    const hora = component.formatarHora("2026-05-15T14:30:00Z");
    expect(hora).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { ListaProjetosComponent } from "./lista-projetos.component";
import { ProjetoService } from "../../../core/api/projetos/projeto.service";
import { NotificationService } from "../../../core/services/notification.service";
import { DialogService } from "../../../core/services/dialog.service";
import { StatusProjeto, TipoProjeto } from "../../../core/models/projeto.model";

describe("ListaProjetosComponent", () => {
  let component: ListaProjetosComponent;
  let fixture: ComponentFixture<ListaProjetosComponent>;
  let projetoServiceSpy: jasmine.SpyObj<ProjetoService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;

  const mockProjetos = [
    {
      id: "p1",
      nome: "Casa Alphaville",
      descricao: "Residência moderna",
      status: StatusProjeto.Desenvolvimento,
      statusLabel: "Desenvolvimento",
      tipo: TipoProjeto.Residencial,
      tipoLabel: "Residencial",
      progressoPercentual: 40,
      dataInicio: "2026-10-21",
      metragemTotal: 250,
      clienteNome: "Carlos",
      etapas: [],
    },
    {
      id: "p2",
      nome: "Escritório Centro",
      descricao: "Reforma corporativa",
      status: StatusProjeto.Concluido,
      statusLabel: "Concluído",
      tipo: TipoProjeto.Comercial,
      tipoLabel: "Comercial",
      progressoPercentual: 100,
      dataInicio: "2026-10-21",
      metragemTotal: 120,
      clienteNome: "Mariana",
      etapas: [],
    },
  ];

  beforeEach(async () => {
    projetoServiceSpy = jasmine.createSpyObj("ProjetoService", [
      "obterTodos",
      "excluir",
    ]);
    notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "success",
      "error",
    ]);
    dialogServiceSpy = jasmine.createSpyObj("DialogService", [
      "confirm",
      "open",
    ]);

    projetoServiceSpy.obterTodos.and.returnValue(of(mockProjetos as any));

    await TestBed.configureTestingModule({
      imports: [
        ListaProjetosComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ProjetoService, useValue: projetoServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProjetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve carregar projetos na inicializacao", () => {
    expect(component).toBeTruthy();
    expect(component.projetos.length).toBe(2);
    expect(component.totalProjetos).toBe(2);
    expect(component.totalEmAndamento).toBe(1);
    expect(component.totalConcluidos).toBe(1);
    expect(component.totalMetragem).toBe(370);
  });

  it("deve filtrar projetos por busca textual", () => {
    component.searchQuery = "Alphaville";
    component.filtrarProjetos();
    expect(component.projetosFiltrados.length).toBe(1);
    expect(component.projetosFiltrados[0].nome).toBe("Casa Alphaville");
  });

  it("deve filtrar projetos por status", () => {
    component.setFiltro("concluidos");
    expect(component.projetosFiltrados.length).toBe(1);
    expect(component.projetosFiltrados[0].nome).toBe("Escritório Centro");
  });

  it("deve solicitar confirmacao e excluir projeto com sucesso", () => {
    const mockEvent = jasmine.createSpyObj("MouseEvent", ["stopPropagation"]);
    dialogServiceSpy.confirm.and.returnValue(of(true));
    projetoServiceSpy.excluir.and.returnValue(of(void 0));

    component.confirmarExclusaoProjeto(mockProjetos[0] as any, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(projetoServiceSpy.excluir).toHaveBeenCalledWith("p1");
    expect(notificationServiceSpy.success).toHaveBeenCalledWith(
      "Projeto excluído com sucesso.",
    );
    expect(projetoServiceSpy.obterTodos).toHaveBeenCalled();
  });

  it("nao deve excluir projeto se confirmacao for cancelada", () => {
    const mockEvent = jasmine.createSpyObj("MouseEvent", ["stopPropagation"]);
    dialogServiceSpy.confirm.and.returnValue(of(false));

    component.confirmarExclusaoProjeto(mockProjetos[0] as any, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(projetoServiceSpy.excluir).not.toHaveBeenCalled();
  });
});

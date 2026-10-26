import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter, ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { DetalhesClienteComponent } from "./detalhes-cliente.component";
import { ClienteService, LeadService, ProjetoService } from "../../../core/api";
import { NotificationService } from "../../../core/services/notification.service";
import { DialogService } from "../../../core/services/dialog.service";
import { Cliente } from "../../../core/models/cliente.model";

describe("DetalhesClienteComponent", () => {
  let component: DetalhesClienteComponent;
  let fixture: ComponentFixture<DetalhesClienteComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let leadServiceSpy: jasmine.SpyObj<LeadService>;
  let projetoServiceSpy: jasmine.SpyObj<ProjetoService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let router: Router;

  const mockCliente: Cliente = {
    id: "cli-1",
    nome: "Carlos Arquiteto",
    email: "carlos@email.com",
    telefone: "11999999999",
    cpfCnpj: "123.456.789-00",
    endereco: "Rua das Flores, 123",
    ativo: true,
    projetosAtivosCount: 1,
    leadId: "lead-1",
  };

  beforeEach(async () => {
    clienteServiceSpy = jasmine.createSpyObj("ClienteService", [
      "obterPorId",
      "atualizar",
      "atualizarAcessoPortal",
    ]);
    leadServiceSpy = jasmine.createSpyObj("LeadService", ["obterPorId"]);
    projetoServiceSpy = jasmine.createSpyObj("ProjetoService", ["obterTodos"]);
    notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "success",
      "error",
      "warning",
      "info",
    ]);
    dialogServiceSpy = jasmine.createSpyObj("DialogService", ["open"]);

    clienteServiceSpy.obterPorId.and.returnValue(of(mockCliente));
    leadServiceSpy.obterPorId.and.returnValue(
      of({ id: "lead-1", nome: "Carlos", historicoContatos: [] } as any),
    );
    projetoServiceSpy.obterTodos.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DetalhesClienteComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === "id" ? "cli-1" : null),
              },
            },
          },
        },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: LeadService, useValue: leadServiceSpy },
        { provide: ProjetoService, useValue: projetoServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DetalhesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create and load client details", () => {
    expect(component).toBeTruthy();
    expect(clienteServiceSpy.obterPorId).toHaveBeenCalledWith("cli-1");
    expect(component.cliente?.nome).toBe("Carlos Arquiteto");
  });

  it("should toggle portal access", () => {
    clienteServiceSpy.atualizarAcessoPortal.and.returnValue(
      of({ id: "cli-1", ativo: false } as any),
    );
    component.toggleAcessoPortal();
    expect(clienteServiceSpy.atualizarAcessoPortal).toHaveBeenCalledWith({
      id: "cli-1",
      ativo: false,
    });
  });
});

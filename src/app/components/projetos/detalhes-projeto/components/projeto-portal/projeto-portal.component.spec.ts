import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProjetoPortalComponent } from "./projeto-portal.component";
import { ProjetoService } from "../../../../../core/api/projetos/projeto.service";
import { ClienteService } from "../../../../../core/api/clientes/cliente.service";
import { NotificationService } from "../../../../../core/services/notification.service";
import { of } from "rxjs";
import { RepresentanteCliente } from "../../../../../core/models/cliente.model";

describe("ProjetoPortalComponent", () => {
  let component: ProjetoPortalComponent;
  let fixture: ComponentFixture<ProjetoPortalComponent>;
  let projetoServiceSpy: jasmine.SpyObj<ProjetoService>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockReps: RepresentanteCliente[] = [
    {
      id: "rep-1",
      clienteId: "cli-1",
      nome: "Carlos Silva",
      email: "carlos@empresa.com",
      telefone: "1199999999",
      cargo: "Diretor",
      ativo: true,
      statusConvite: "Pendente",
      conviteAceito: false,
      criadoEm: "2026-10-01",
    },
  ];

  beforeEach(async () => {
    projetoServiceSpy = jasmine.createSpyObj("ProjetoService", [
      "convidarRepresentante",
    ]);
    clienteServiceSpy = jasmine.createSpyObj("ClienteService", [
      "reenviarConvite",
      "alterarStatusRepresentante",
      "removerRepresentante",
    ]);
    notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "success",
      "warning",
      "error",
    ]);

    await TestBed.configureTestingModule({
      imports: [ProjetoPortalComponent],
      providers: [
        { provide: ProjetoService, useValue: projetoServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetoPortalComponent);
    component = fixture.componentInstance;
    component.projetoId = "proj-1";
    component.projetoNome = "Residência Teste";
    component.clienteId = "cli-1";
    component.clienteNome = "Cliente Alpha";
    component.representantes = [...mockReps];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should open modal when abrirModalConvidar is called", () => {
    component.abrirModalConvidar();
    expect(component.modalConvidarAberto).toBeTrue();
    expect(component.form.get("enviarEmailAgora")?.value).toBeFalse();
  });

  it("should close modal when fecharModalConvidar is called", () => {
    component.modalConvidarAberto = true;
    component.fecharModalConvidar();
    expect(component.modalConvidarAberto).toBeFalse();
  });

  it("should save representative and emit change event when valid", () => {
    spyOn(component.representantesAlterados, "emit");
    projetoServiceSpy.convidarRepresentante.and.returnValue(of(mockReps[0]));

    component.abrirModalConvidar();
    component.form.patchValue({
      nome: "Carlos Silva",
      email: "carlos@empresa.com",
      cargo: "Diretor",
      telefone: "1199999999",
      enviarEmailAgora: false,
    });

    component.salvarRepresentante();

    expect(projetoServiceSpy.convidarRepresentante).toHaveBeenCalledWith(
      "proj-1",
      {
        nome: "Carlos Silva",
        email: "carlos@empresa.com",
        cargo: "Diretor",
        telefone: "1199999999",
        enviarEmailConvite: false,
      },
    );
    expect(component.modalConvidarAberto).toBeFalse();
    expect(component.representantesAlterados.emit).toHaveBeenCalled();
  });

  it("should resend invitation when reenviarConvite is called", () => {
    clienteServiceSpy.reenviarConvite.and.returnValue(of(void 0));
    const rep = { ...mockReps[0] };

    component.reenviarConvite(rep);

    expect(clienteServiceSpy.reenviarConvite).toHaveBeenCalledWith("rep-1");
    expect(rep.statusConvite).toBe("Convite Enviado");
    expect(notificationServiceSpy.success).toHaveBeenCalled();
  });

  it("should toggle representative status", () => {
    const updatedRep = { ...mockReps[0], ativo: false };
    clienteServiceSpy.alterarStatusRepresentante.and.returnValue(
      of(updatedRep),
    );
    const rep = { ...mockReps[0] };

    component.alternarStatus(rep);

    expect(clienteServiceSpy.alterarStatusRepresentante).toHaveBeenCalledWith(
      "rep-1",
      false,
    );
    expect(rep.ativo).toBeFalse();
  });

  it("should remove representative when confirmed", () => {
    spyOn(window, "confirm").and.returnValue(true);
    spyOn(component.representantesAlterados, "emit");
    clienteServiceSpy.removerRepresentante.and.returnValue(of(void 0));

    component.removerRepresentante(mockReps[0]);

    expect(clienteServiceSpy.removerRepresentante).toHaveBeenCalledWith(
      "rep-1",
    );
    expect(component.representantesAlterados.emit).toHaveBeenCalled();
  });
});

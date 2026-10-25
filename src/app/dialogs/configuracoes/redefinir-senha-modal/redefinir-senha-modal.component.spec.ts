import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RedefinirSenhaModalComponent } from "./redefinir-senha-modal.component";
import { UsuarioService } from "../../../core/api/usuarios/usuario.service";
import { NotificationService } from "../../../core/services/notification.service";
import { of, throwError } from "rxjs";
import { MembroEquipe } from "../../../core/models/usuario.model";

describe("RedefinirSenhaModalComponent", () => {
  let component: RedefinirSenhaModalComponent;
  let fixture: ComponentFixture<RedefinirSenhaModalComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockMembro: MembroEquipe = {
    id: "membro-1",
    nome: "João Silva",
    email: "joao@studio.com",
    role: "ArquitetoColaborador",
    ativo: true,
    criadoEm: "2026-01-01T00:00:00Z",
  };

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj("UsuarioService", [
      "redefinirSenha",
    ]);
    notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "success",
      "error",
    ]);

    await TestBed.configureTestingModule({
      imports: [RedefinirSenhaModalComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RedefinirSenhaModalComponent);
    component = fixture.componentInstance;
    component.membro = mockMembro;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve emitir close ao chamar onClose", () => {
    spyOn(component.close, "emit");
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it("deve redefinir senha com sucesso", () => {
    usuarioServiceSpy.redefinirSenha.and.returnValue(of(undefined as any));
    spyOn(component.saved, "emit");
    spyOn(component, "onClose");

    component.novaSenhaManual = "NovaSenha123";
    component.confirmarRedefinirSenha();

    expect(usuarioServiceSpy.redefinirSenha).toHaveBeenCalledWith(
      "membro-1",
      "NovaSenha123",
    );
    expect(notificationServiceSpy.success).toHaveBeenCalled();
    expect(component.saved.emit).toHaveBeenCalled();
    expect(component.onClose).toHaveBeenCalled();
  });

  it("deve tratar erro ao redefinir senha", () => {
    usuarioServiceSpy.redefinirSenha.and.returnValue(
      throwError(() => new Error("Erro")),
    );

    component.confirmarRedefinirSenha();

    expect(notificationServiceSpy.error).toHaveBeenCalled();
    expect(component.salvandoSenha).toBeFalse();
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { MembroEquipeModalComponent } from "./membro-equipe-modal.component";
import { UsuarioService } from "../../../core/api/usuarios/usuario.service";
import { NotificationService } from "../../../core/services/notification.service";
import { MembroEquipe } from "../../../core/models/usuario.model";

describe("MembroEquipeModalComponent", () => {
  let component: MembroEquipeModalComponent;
  let fixture: ComponentFixture<MembroEquipeModalComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj("UsuarioService", [
      "convidarMembro",
      "atualizarMembro",
    ]);
    notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "success",
      "error",
      "warning",
    ]);

    await TestBed.configureTestingModule({
      imports: [
        MembroEquipeModalComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MembroEquipeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve ser instanciado com sucesso", () => {
    expect(component).toBeTruthy();
  });

  it("deve inicializar formulario com campos obrigatorios vazios em modo criacao", () => {
    expect(component.isEditing).toBeFalse();
    expect(component.form.get("nome")).toBeTruthy();
    expect(component.form.get("email")).toBeTruthy();
    expect(component.form.get("role")?.value).toBe("ArquitetoColaborador");
  });

  it("deve chamar convidarMembro ao submeter formulario valido no modo criacao", () => {
    component.form.patchValue({
      nome: "Carlos Silva",
      email: "carlos@studio.com",
      role: "ArquitetoColaborador",
      cargo: "Arquiteto Júnior",
    });

    const mockResponse: MembroEquipe = {
      id: "user-123",
      nome: "Carlos Silva",
      email: "carlos@studio.com",
      role: "ArquitetoColaborador",
      cargo: "Arquiteto Júnior",
      ativo: true,
      criadoEm: "2026-01-01T00:00:00Z",
    };

    usuarioServiceSpy.convidarMembro.and.returnValue(of(mockResponse));
    spyOn(component.saved, "emit");
    spyOn(component.close, "emit");

    component.onSubmit();

    expect(usuarioServiceSpy.convidarMembro).toHaveBeenCalled();
    expect(notificationServiceSpy.success).toHaveBeenCalled();
    expect(component.saved.emit).toHaveBeenCalledWith(mockResponse);
  });

  it("nao deve submeter se o formulario estiver invalido", () => {
    component.form.patchValue({
      nome: "",
      email: "invalido",
    });

    component.onSubmit();

    expect(usuarioServiceSpy.convidarMembro).not.toHaveBeenCalled();
    expect(usuarioServiceSpy.atualizarMembro).not.toHaveBeenCalled();
  });

  it("deve ocultar o modulo agenda das permissoes visiveis", () => {
    const ids = component.modulosVisiveis.map((m) => m.id);
    expect(ids).not.toContain("agenda");
    expect(ids).toContain("projetos");
  });

  it("deve exibir a mensagem de erro retornada pelo backend no campo error ao atualizar membro", () => {
    component.membroParaEdicao = {
      id: "user-admin",
      nome: "Admin",
      email: "admin@studio.com",
      role: "ArquitetoAdmin",
      ativo: true,
      criadoEm: "2026-01-01T00:00:00Z",
    };
    component.ngOnInit();
    component.form.patchValue({ role: "ArquitetoColaborador" });

    usuarioServiceSpy.atualizarMembro.and.returnValue(
      throwError(() => ({
        error: {
          error: "Não é permitido remover a sua própria função de administrador.",
        },
      })),
    );

    component.onSubmit();

    expect(notificationServiceSpy.error).toHaveBeenCalledWith(
      "Não é permitido remover a sua própria função de administrador.",
    );
  });
});

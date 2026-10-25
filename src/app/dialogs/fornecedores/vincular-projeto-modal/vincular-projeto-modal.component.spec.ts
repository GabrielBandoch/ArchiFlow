import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { VincularProjetoModalComponent } from "./vincular-projeto-modal.component";
import { FornecedorService } from "../../../core/api/fornecedores/fornecedor.service";
import { NotificationService } from "../../../core/services/notification.service";
import { of, throwError } from "rxjs";
import { Fornecedor } from "../../../core/models/fornecedor.model";

describe("VincularProjetoModalComponent", () => {
  let component: VincularProjetoModalComponent;
  let fixture: ComponentFixture<VincularProjetoModalComponent>;
  let fornecedorServiceSpy: jasmine.SpyObj<FornecedorService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockFornecedor: Fornecedor = {
    id: "f-1",
    nome: "Fornecedor Teste",
    especialidade: "Marcenaria",
    email: "f@teste.com",
    avaliacaoMedia: 4.5,
    totalAvaliacoes: 2,
    ativo: true,
    dataCriacao: "",
    totalProjetosAtivos: 0,
  };

  beforeEach(async () => {
    fornecedorServiceSpy = jasmine.createSpyObj("FornecedorService", [
      "vincularProjeto",
    ]);
    notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "success",
      "error",
    ]);

    await TestBed.configureTestingModule({
      imports: [VincularProjetoModalComponent, HttpClientTestingModule],
      providers: [
        { provide: FornecedorService, useValue: fornecedorServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VincularProjetoModalComponent);
    component = fixture.componentInstance;
    component.fornecedor = mockFornecedor;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve fechar ao chamar onClose", () => {
    spyOn(component.close, "emit");
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it("nao deve salvar formulario invalido", () => {
    component.salvar();
    expect(fornecedorServiceSpy.vincularProjeto).not.toHaveBeenCalled();
  });

  it("deve salvar vinculo com sucesso", () => {
    fornecedorServiceSpy.vincularProjeto.and.returnValue(of({} as any));
    spyOn(component.vinculado, "emit");
    spyOn(component, "onClose");

    component.form.setValue({
      projetoId: "proj-1",
      funcaoNoProjeto: "Marcenaria da Suíte",
    });

    component.salvar();

    expect(fornecedorServiceSpy.vincularProjeto).toHaveBeenCalledWith(
      "f-1",
      jasmine.objectContaining({
        fornecedorId: "f-1",
        projetoId: "proj-1",
        funcaoNoProjeto: "Marcenaria da Suíte",
      }),
    );
    expect(notificationServiceSpy.success).toHaveBeenCalled();
    expect(component.vinculado.emit).toHaveBeenCalled();
    expect(component.onClose).toHaveBeenCalled();
  });

  it("deve tratar erro ao salvar vinculo", () => {
    fornecedorServiceSpy.vincularProjeto.and.returnValue(
      throwError(() => new Error("Erro")),
    );

    component.form.setValue({
      projetoId: "proj-1",
      funcaoNoProjeto: "Marcenaria da Suíte",
    });

    component.salvar();

    expect(notificationServiceSpy.error).toHaveBeenCalled();
    expect(component.salvando).toBeFalse();
  });
});

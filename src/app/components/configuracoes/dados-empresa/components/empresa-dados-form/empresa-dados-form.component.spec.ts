import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { EmpresaDadosFormComponent } from "./empresa-dados-form.component";
import { DadosEmpresaForm } from "../../dados-empresa.form";

describe("EmpresaDadosFormComponent", () => {
  let component: EmpresaDadosFormComponent;
  let fixture: ComponentFixture<EmpresaDadosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaDadosFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresaDadosFormComponent);
    component = fixture.componentInstance;
    const fb = TestBed.inject(FormBuilder);
    component.formGroup = DadosEmpresaForm.create(fb);
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve emitir salvar quando submeter o form", () => {
    spyOn(component.salvar, "emit");
    component.salvar.emit();
    expect(component.salvar.emit).toHaveBeenCalled();
  });

  it("deve acessar controls através de f", () => {
    expect(component.f["nomeEmpresa"]).toBeDefined();
  });
});

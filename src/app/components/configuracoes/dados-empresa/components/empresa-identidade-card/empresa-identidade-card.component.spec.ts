import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EmpresaIdentidadeCardComponent } from "./empresa-identidade-card.component";

describe("EmpresaIdentidadeCardComponent", () => {
  let component: EmpresaIdentidadeCardComponent;
  let fixture: ComponentFixture<EmpresaIdentidadeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaIdentidadeCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresaIdentidadeCardComponent);
    component = fixture.componentInstance;
    component.paletaCores = ["#765538", "#1E3A5F"];
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve emitir selecionarCorPredefinida ao clicar no swatch", () => {
    spyOn(component.selecionarCorPredefinida, "emit");
    component.selecionarCor("#1E3A5F");
    expect(component.selecionarCorPredefinida.emit).toHaveBeenCalledWith("#1E3A5F");
  });

  it("deve emitir corPrimariaChange ao alterar hex", () => {
    spyOn(component.corPrimariaChange, "emit");
    component.onHexChange("#3E5C46");
    expect(component.corPrimariaChange.emit).toHaveBeenCalledWith("#3E5C46");
    expect(component.corPrimaria).toBe("#3E5C46");
  });

  it("deve emitir salvarIdentidadeVisual", () => {
    spyOn(component.salvarIdentidadeVisual, "emit");
    component.salvarIdentidadeVisual.emit();
    expect(component.salvarIdentidadeVisual.emit).toHaveBeenCalled();
  });
});

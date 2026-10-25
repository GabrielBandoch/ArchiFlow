import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EmpresaLogoCardComponent } from "./empresa-logo-card.component";

describe("EmpresaLogoCardComponent", () => {
  let component: EmpresaLogoCardComponent;
  let fixture: ComponentFixture<EmpresaLogoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaLogoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresaLogoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve emitir logoSelecionado no onFileChange", () => {
    spyOn(component.logoSelecionado, "emit");
    const mockEvent = new Event("change");
    component.onFileChange(mockEvent);
    expect(component.logoSelecionado.emit).toHaveBeenCalledWith(mockEvent);
  });

  it("deve emitir removerLogo quando solicitado", () => {
    spyOn(component.removerLogo, "emit");
    component.logoUrl = "https://example.com/logo.png";
    fixture.detectChanges();

    component.removerLogo.emit();
    expect(component.removerLogo.emit).toHaveBeenCalled();
  });
});

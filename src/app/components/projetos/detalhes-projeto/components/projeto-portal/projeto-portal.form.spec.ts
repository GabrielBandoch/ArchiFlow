import { FormBuilder } from "@angular/forms";
import { ProjetoPortalForm } from "./projeto-portal.form";

describe("ProjetoPortalForm", () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it("should initialize with invalid status when nome and email are empty", () => {
    const form = ProjetoPortalForm.create(fb);
    expect(form.valid).toBeFalse();
    expect(form.get("nome")?.hasError("required")).toBeTrue();
    expect(form.get("email")?.hasError("required")).toBeTrue();
  });

  it("should fail when name has fewer than 2 characters", () => {
    const form = ProjetoPortalForm.create(fb);
    form.patchValue({
      nome: "A",
      email: "a@empresa.com",
    });
    expect(form.get("nome")?.hasError("minlength")).toBeTrue();
    expect(form.valid).toBeFalse();
  });

  it("should be valid when valid name and email are provided", () => {
    const form = ProjetoPortalForm.create(fb);
    form.patchValue({
      nome: "Alexandre Diretor",
      email: "alexandre@empresa.com",
    });
    expect(form.valid).toBeTrue();
  });
});

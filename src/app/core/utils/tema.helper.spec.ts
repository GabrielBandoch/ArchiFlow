import { TemaHelper } from "./tema.helper";

describe("TemaHelper", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("deve aplicar tema para hex valido e salvar no localStorage", () => {
    TemaHelper.aplicarTema("#123456");
    expect(
      document.documentElement.style.getPropertyValue("--af-primary"),
    ).toBe("#123456");
    expect(localStorage.getItem("cotu_primary_color")).toBe("#123456");
  });

  it("deve aplicar tema para hex de 3 digitos", () => {
    TemaHelper.aplicarTema("#abc");
    expect(
      document.documentElement.style.getPropertyValue("--af-primary"),
    ).toBe("#abc");
    expect(localStorage.getItem("cotu_primary_color")).toBe("#abc");
  });

  it("nao deve aplicar tema para hex invalido", () => {
    const corAnterior =
      document.documentElement.style.getPropertyValue("--af-primary");
    TemaHelper.aplicarTema("cor-invalida");
    expect(
      document.documentElement.style.getPropertyValue("--af-primary"),
    ).toBe(corAnterior);
  });

  it("deve carregar tema salvo do localStorage", () => {
    localStorage.setItem("cotu_primary_color", "#654321");
    TemaHelper.carregarTemaSalvo();
    expect(
      document.documentElement.style.getPropertyValue("--af-primary"),
    ).toBe("#654321");
  });
});

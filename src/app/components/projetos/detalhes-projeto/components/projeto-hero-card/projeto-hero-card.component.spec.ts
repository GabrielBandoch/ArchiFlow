import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ProjetoHeroCardComponent } from "./projeto-hero-card.component";
import {
  StatusProjeto,
  TipoProjeto,
  Projeto,
} from "../../../../../core/models/projeto.model";

describe("ProjetoHeroCardComponent", () => {
  let component: ProjetoHeroCardComponent;
  let fixture: ComponentFixture<ProjetoHeroCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetoHeroCardComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjetoHeroCardComponent);
    component = fixture.componentInstance;
    component.projeto = {
      id: "p12345678",
      nome: "Projeto Teste",
      descricao: "Descricao Teste",
      status: StatusProjeto.Desenvolvimento,
      statusLabel: "Desenvolvimento",
      tipo: TipoProjeto.Residencial,
      tipoLabel: "Residencial",
      progressoPercentual: 50,
      dataInicio: "2026-10-21",
      metragemTotal: 150,
      criadoEm: "2026-10-21",
      clienteId: "c1",
      clienteNome: "Cliente Teste",
      etapas: [],
    } as Projeto;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve emitir editarSolicitado ao chamar onEditar", () => {
    spyOn(component.editarSolicitado, "emit");
    component.onEditar();
    expect(component.editarSolicitado.emit).toHaveBeenCalled();
  });

  it("deve emitir excluirSolicitado ao chamar onExcluir", () => {
    spyOn(component.excluirSolicitado, "emit");
    component.onExcluir();
    expect(component.excluirSolicitado.emit).toHaveBeenCalled();
  });

  it("deve emitir statusAlterado ao chamar onStatusChange", () => {
    spyOn(component.statusAlterado, "emit");
    component.onStatusChange(StatusProjeto.Concluido);
    expect(component.statusAlterado.emit).toHaveBeenCalledWith(
      StatusProjeto.Concluido,
    );
  });
});

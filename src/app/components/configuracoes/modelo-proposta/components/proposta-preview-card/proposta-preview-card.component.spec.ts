import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PropostaPreviewCardComponent } from "./proposta-preview-card.component";
import { ConfiguracaoPropostaService } from "../../../../../core/services/configuracao-proposta.service";
import { CONFIGURACAO_PROPOSTA_PADRAO } from "../../../../../core/models/configuracao-proposta.model";
import { PropostaVisualizacaoData } from "../../../../../core/models/proposta-pdf.types";

describe("PropostaPreviewCardComponent", () => {
  let component: PropostaPreviewCardComponent;
  let fixture: ComponentFixture<PropostaPreviewCardComponent>;
  let configServiceSpy: jasmine.SpyObj<ConfiguracaoPropostaService>;

  const mockPreviewData: PropostaVisualizacaoData = {
    codigo: "PROP-001",
    titulo: "Projeto Teste",
    clienteNome: "Cliente Teste",
    metragemQuadrada: 120,
    valorTotalSugerido: 25000,
    valorFinalAjustado: 24000,
    criadoEm: new Date().toISOString(),
    statusNome: "Aprovada",
    etapas: [],
  };

  beforeEach(async () => {
    configServiceSpy = jasmine.createSpyObj("ConfiguracaoPropostaService", [
      "formatarMoeda",
    ]);
    configServiceSpy.formatarMoeda.and.returnValue("R$ 24.000,00");

    await TestBed.configureTestingModule({
      imports: [PropostaPreviewCardComponent],
      providers: [
        { provide: ConfiguracaoPropostaService, useValue: configServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropostaPreviewCardComponent);
    component = fixture.componentInstance;
    component.configAtual = CONFIGURACAO_PROPOSTA_PADRAO;
    component.previewData = mockPreviewData;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve emitir expandir ao clicar no botão", () => {
    spyOn(component.expandir, "emit");
    component.expandir.emit();
    expect(component.expandir.emit).toHaveBeenCalled();
  });
});

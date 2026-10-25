import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalPropostaPdfComponent } from "./modal-proposta-pdf.component";
import { Router } from "@angular/router";
import { ConfiguracaoPropostaService } from "../../../core/services/configuracao-proposta.service";
import { NotificationService } from "../../../core/services/notification.service";
import { CONFIGURACAO_PROPOSTA_PADRAO } from "../../../core/models/configuracao-proposta.model";
import { PropostaVisualizacaoData } from "../../../core/models/proposta-pdf.types";

describe("ModalPropostaPdfComponent", () => {
  let component: ModalPropostaPdfComponent;
  let fixture: ComponentFixture<ModalPropostaPdfComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let configServiceSpy: jasmine.SpyObj<ConfiguracaoPropostaService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockProposta: PropostaVisualizacaoData = {
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
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    configServiceSpy = jasmine.createSpyObj("ConfiguracaoPropostaService", [
      "getConfiguracao",
      "isConfigurado",
      "formatarMoeda",
      "gerarMensagemWhatsapp",
      "gerarLinkWhatsapp",
    ]);
    notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "warning",
      "success",
      "error",
    ]);

    configServiceSpy.getConfiguracao.and.returnValue(CONFIGURACAO_PROPOSTA_PADRAO);
    configServiceSpy.isConfigurado.and.returnValue(true);
    configServiceSpy.formatarMoeda.and.returnValue("R$ 24.000,00");
    configServiceSpy.gerarLinkWhatsapp.and.returnValue("https://wa.me/test");

    await TestBed.configureTestingModule({
      imports: [ModalPropostaPdfComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ConfiguracaoPropostaService, useValue: configServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPropostaPdfComponent);
    component = fixture.componentInstance;
    component.proposta = mockProposta;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve fechar ao chamar fechar()", () => {
    spyOn(component.close, "emit");
    spyOn(component.fechado, "emit");
    component.fechar();
    expect(component.show).toBeFalse();
    expect(component.close.emit).toHaveBeenCalled();
    expect(component.fechado.emit).toHaveBeenCalled();
  });

  it("deve navegar para configuracoes", () => {
    component.irParaConfiguracoes();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/configuracoes/empresa"]);
  });

  it("deve abrir link do WhatsApp", () => {
    spyOn(window, "open");
    component.compartilharWhatsapp();
    expect(window.open).toHaveBeenCalledWith("https://wa.me/test", "_blank");
    expect(notificationServiceSpy.success).toHaveBeenCalled();
  });
});

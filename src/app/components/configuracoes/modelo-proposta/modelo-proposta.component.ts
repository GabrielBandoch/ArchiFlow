import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ConfiguracaoPropostaService } from "../../../core/services/configuracao-proposta.service";
import {
  ConfiguracaoProposta,
  CONFIGURACAO_PROPOSTA_PADRAO,
} from "../../../core/models/configuracao-proposta.model";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { NotificationService } from "../../../core/services/notification.service";
import {
  ModalPropostaPdfComponent,
  PropostaVisualizacaoData,
} from "../../honorarios/modal-proposta-pdf/modal-proposta-pdf.component";

import { RouterLink } from "@angular/router";
import { EmpresaService } from "../../../core/api/empresa/empresa.service";
import { DadosEmpresa } from "../../../core/models/empresa.model";
import { ModeloPropostaForm } from "./modelo-proposta.form";

@Component({
  selector: "app-modelo-proposta",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    ModalPropostaPdfComponent,
  ],
  templateUrl: "./modelo-proposta.component.html",
  styleUrls: ["./modelo-proposta.component.scss"],
})
export class ModeloPropostaComponent implements OnInit {
  public form!: FormGroup;
  public abaAtiva: "identidade" | "secoes" | "textos" | "whatsapp" =
    "identidade";
  public modalPdfAberto = false;
  public empresa: DadosEmpresa | null = null;

  public previewData: PropostaVisualizacaoData = {
    codigo: "PROP-2026-084",
    titulo: "Projeto Residencial Villa Bella",
    clienteNome: "Dr. Roberto & Mariana Silveira",
    clienteEmail: "cliente@exemplo.com",
    clienteTelefone: "11987654321",
    metragemQuadrada: 285.5,
    padraoImovelNome: "Alto Padrão",
    tipoProjetoNome: "Residencial Completo",
    valorTotalSugerido: 48500.0,
    valorFinalAjustado: 45000.0,
    criadoEm: new Date().toISOString(),
    statusNome: "Aprovada",
    etapas: [
      {
        nome: "Levantamento & Briefing",
        descricao:
          "Levantamento topográfico, diagnóstico de necessidades e partido arquitetônico.",
        percentual: 10,
        valor: 4500.0,
        prazo: "10 dias úteis",
      },
      {
        nome: "Estudo Preliminar & 3D",
        descricao:
          "Plantas baixas conceituais, layout humanizado e maquete eletrônica 3D realista.",
        percentual: 30,
        valor: 13500.0,
        prazo: "20 dias úteis",
      },
      {
        nome: "Anteprojeto & Aprovação Legal",
        descricao:
          "Pranchas normativas para submissão à prefeitura e condomínio.",
        percentual: 25,
        valor: 11250.0,
        prazo: "15 dias úteis",
      },
      {
        nome: "Projeto Executivo de Arquitetura",
        descricao:
          "Caderno técnico completo de paginação, iluminação, forros e acabamentos.",
        percentual: 25,
        valor: 11250.0,
        prazo: "25 dias úteis",
      },
      {
        nome: "Detalhamento de Interiores & Marcenaria",
        descricao:
          "Detalhamento milimétrico de marcenaria sob medida e especificações.",
        percentual: 10,
        valor: 4500.0,
        prazo: "15 dias úteis",
      },
    ],
    memoriaCalculo: {
      horasEstimadasTotal: 180,
      valorHoraBase: 250,
      valorM2Base: 157.62,
      valorBase: 45000.0,
    },
  };

  constructor(
    private fb: FormBuilder,
    private configService: ConfiguracaoPropostaService,
    private notificationService: NotificationService,
    private empresaService: EmpresaService,
  ) {}

  ngOnInit(): void {
    this.initForm(this.configService.getConfiguracao());
    this.carregarDadosEmpresa();
    this.configService.carregarDoServidor().subscribe({
      next: (config) => {
        if (config) {
          this.form.patchValue(config);
        }
      },
    });
  }

  public carregarDadosEmpresa(): void {
    this.empresaService.obterDadosEmpresa().subscribe({
      next: (emp) => {
        this.empresa = emp;
        if (emp) {
          this.form.patchValue({
            nomeEscritorio: emp.nomeEmpresa,
            slogan: emp.slogan,
            registroProfissional: emp.registroProfissional,
            email: emp.email || this.form.get("email")?.value,
            telefone: emp.telefone || this.form.get("telefone")?.value,
            endereco: emp.endereco || this.form.get("endereco")?.value,
            logoUrl: emp.logoUrl || this.form.get("logoUrl")?.value,
            corPrimaria: emp.corPrimaria || this.form.get("corPrimaria")?.value,
          });
        }
      },
      error: () => {},
    });
  }

  private initForm(config: ConfiguracaoProposta): void {
    this.form = ModeloPropostaForm.create(this.fb, config);
  }

  public setAba(aba: "identidade" | "secoes" | "textos" | "whatsapp"): void {
    this.abaAtiva = aba;
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith("image/")) {
        this.notificationService.warning(
          "Por favor, selecione um arquivo de imagem válido (PNG, SVG ou JPG).",
        );
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.notificationService.warning(
          "A imagem do logotipo deve ter no máximo 2MB.",
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.form.patchValue({ logoUrl: base64 });
        this.notificationService.success("Logotipo carregado com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  }

  public removerLogotipo(): void {
    this.form.patchValue({ logoUrl: "" });
    this.notificationService.info("Logotipo removido.");
  }

  public salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.warning(
        "Por favor, preencha todos os campos obrigatórios corretamente.",
      );
      return;
    }

    const valores: ConfiguracaoProposta = this.form.value;
    this.configService.salvarConfiguracao(valores).subscribe({
      next: () => {
        this.notificationService.success(
          "Configurações do modelo de proposta salvas com sucesso!",
        );
      },
      error: () => {
        this.notificationService.error("Erro ao salvar configurações.");
      },
    });
  }

  public restaurarPadrao(): void {
    if (
      confirm(
        "Deseja restaurar todas as configurações e textos para o padrão original do COTU?",
      )
    ) {
      this.configService.resetarPadroes().subscribe({
        next: (padrao) => {
          this.form.patchValue(padrao);
          this.notificationService.info(
            "Configurações restauradas com sucesso.",
          );
        },
        error: () => {
          this.notificationService.error(
            "Erro ao restaurar configurações padrão.",
          );
        },
      });
    }
  }

  public testarImpressao(): void {
    this.modalPdfAberto = true;
  }

  public fecharModalPdf(): void {
    this.modalPdfAberto = false;
  }

  public get configAtual(): ConfiguracaoProposta {
    return this.form ? this.form.value : CONFIGURACAO_PROPOSTA_PADRAO;
  }

  public formatarMoeda(valor?: number): string {
    return this.configService.formatarMoeda(valor || 0);
  }

  public readonly paletasPredefinidas = [
    { nome: "Terracota", cor: "#765538" },
    { nome: "Grafite", cor: "#2d3238" },
    { nome: "Azul Petróleo", cor: "#1e3a47" },
    { nome: "Ocre Nobre", cor: "#946638" },
    { nome: "Verde Oliva", cor: "#37473a" },
    { nome: "Bordô", cor: "#582b2b" },
  ];

  public selecionarCor(cor: string): void {
    this.form.patchValue({ corPrimaria: cor });
  }

  public inserirTagWhatsapp(tag: string): void {
    const atual = this.form.get("templateMensagemWhatsapp")?.value || "";
    this.form.patchValue({ templateMensagemWhatsapp: atual + " " + tag });
  }

  public get previewWhatsappMsg(): string {
    return this.configService.gerarMensagemWhatsapp(
      {
        clienteNome: this.previewData.clienteNome,
        projetoTitulo: this.previewData.titulo,
        metragem: this.previewData.metragemQuadrada,
        valorFinal: this.previewData.valorFinalAjustado,
      },
      this.configAtual,
    );
  }
}

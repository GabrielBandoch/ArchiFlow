import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { EmpresaService } from "../../../core/api/empresa/empresa.service";
import { ViaCepService } from "../../../core/services/via-cep.service";
import {
  DadosEmpresa,
  SalvarDadosEmpresaCommand,
} from "../../../core/models/empresa.model";
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from "../../../shared";
import { NotificationService } from "../../../core/services/notification.service";
import { MaskUtils } from "../../../core/utils/mask-utils";
import { DadosEmpresaForm } from "./dados-empresa.form";
import { EmpresaLogoCardComponent } from "./components/empresa-logo-card/empresa-logo-card.component";
import { EmpresaIdentidadeCardComponent } from "./components/empresa-identidade-card/empresa-identidade-card.component";
import { EmpresaDadosFormComponent } from "./components/empresa-dados-form/empresa-dados-form.component";

@Component({
  selector: "app-dados-empresa",
  standalone: true,
  imports: [
    CORE_IMPORTS,
    FORM_IMPORTS,
    DESIGN_SYSTEM,
    EmpresaLogoCardComponent,
    EmpresaIdentidadeCardComponent,
    EmpresaDadosFormComponent,
  ],
  templateUrl: "./dados-empresa.component.html",
  styleUrl: "./dados-empresa.component.scss",
})
export class DadosEmpresaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaService);
  private viaCepService = inject(ViaCepService);
  private notificationService = inject(NotificationService);

  empresa: DadosEmpresa | null = null;
  carregando = true;
  salvando = false;
  salvandoCor = false;
  enviandoLogo = false;
  buscandoCep = false;

  paletaCores: string[] = [
    "#765538",
    "#1E3A5F",
    "#3E5C46",
    "#5C2434",
    "#2C3539",
    "#8C6D3B",
  ];

  empresaForm: FormGroup = DadosEmpresaForm.create(this.fb);

  get f() {
    return this.empresaForm.controls;
  }

  onCorPrimariaChange(cor: string): void {
    this.empresaForm.get("corPrimaria")?.setValue(cor);
  }

  ngOnInit(): void {
    this.carregarDados();
    this.empresaForm.get("corPrimaria")?.valueChanges.subscribe((cor) => {
      if (cor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(cor)) {
        this.empresaService.aplicarTema(cor);
      }
    });
  }

  selecionarCorPredefinida(cor: string): void {
    this.empresaForm.get("corPrimaria")?.setValue(cor);
    this.salvarIdentidadeVisual();
  }

  salvarIdentidadeVisual(): void {
    let cor = this.empresaForm.get("corPrimaria")?.value?.trim();
    if (!cor) return;
    if (!cor.startsWith("#")) {
      cor = "#" + cor;
      this.empresaForm.get("corPrimaria")?.setValue(cor, { emitEvent: false });
    }
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(cor)) {
      this.notificationService.warning(
        "Informe um código hexadecimal de cor válido (ex: #765538).",
      );
      return;
    }

    this.salvandoCor = true;
    this.empresaService.salvarCorPrimaria(cor).subscribe({
      next: (res) => {
        this.salvandoCor = false;
        if (this.empresa) {
          this.empresa.corPrimaria = res.corPrimaria;
        }
        this.notificationService.success(
          "Identidade visual salva no banco de dados com sucesso!",
        );
      },
      error: () => {
        this.salvandoCor = false;
        this.notificationService.error("Erro ao salvar cor primária no banco.");
      },
    });
  }

  carregarDados(): void {
    this.carregando = true;
    this.empresaService.obterDadosEmpresa().subscribe({
      next: (dados) => {
        this.empresa = dados;
        this.empresaForm.patchValue({
          nomeEmpresa: dados.nomeEmpresa,
          razaoSocial: dados.razaoSocial || "",
          cnpj: dados.cnpj ? MaskUtils.formatCpfCnpj(dados.cnpj) : "",
          registroProfissional: dados.registroProfissional || "",
          slogan: dados.slogan || "",
          email: dados.email || "",
          telefone: dados.telefone ? MaskUtils.formatPhone(dados.telefone) : "",
          endereco: dados.endereco || "",
          cidade: dados.cidade || "",
          estado: dados.estado || "",
          cep: dados.cep ? MaskUtils.formatCep(dados.cep) : "",
          website: dados.website || "",
          corPrimaria: dados.corPrimaria || "#765538",
        });
        this.carregando = false;
      },
      error: () => {
        this.notificationService.error("Erro ao carregar dados da empresa.");
        this.carregando = false;
      },
    });
  }

  onCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = MaskUtils.formatCpfCnpj(input.value);
    input.value = formatted;
    this.empresaForm.get("cnpj")?.setValue(formatted, { emitEvent: false });
  }

  onTelefoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = MaskUtils.formatPhone(input.value);
    input.value = formatted;
    this.empresaForm.get("telefone")?.setValue(formatted, { emitEvent: false });
  }

  onCepChange(value: string): void {
    const raw = MaskUtils.clean(value || "");
    if (raw.length === 8 && !this.buscandoCep) {
      this.consultarViaCep(raw);
    }
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = MaskUtils.clean(input.value);
    const formatted = MaskUtils.formatCep(raw);
    input.value = formatted;
    this.empresaForm.get("cep")?.setValue(formatted, { emitEvent: false });

    if (raw.length === 8) {
      this.consultarViaCep(raw);
    }
  }

  private consultarViaCep(cep: string): void {
    this.buscandoCep = true;
    this.viaCepService.buscarCep(cep).subscribe({
      next: (dados) => {
        this.buscandoCep = false;
        if (dados && !dados.erro) {
          const patchObj: any = {};
          if (dados.logradouro) patchObj.endereco = dados.logradouro;
          if (dados.localidade) patchObj.cidade = dados.localidade;
          if (dados.uf) patchObj.estado = dados.uf;
          this.empresaForm.patchValue(patchObj);
          this.notificationService.info(
            "Endereço preenchido automaticamente via CEP.",
          );
        } else {
          this.notificationService.warning(
            "CEP não encontrado na base dos Correios.",
          );
        }
      },
      error: () => {
        this.buscandoCep = false;
        this.notificationService.warning(
          "Não foi possível consultar o CEP no momento.",
        );
      },
    });
  }

  onLogoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.notificationService.error("O logotipo deve ter no máximo 5MB.");
      return;
    }

    this.enviandoLogo = true;

    this.empresaService.uploadLogo(file).subscribe({
      next: (res) => {
        if (this.empresa) {
          this.empresa.logoUrl = res.logoUrl;
        }
        this.enviandoLogo = false;
        this.notificationService.success("Logotipo atualizado com sucesso!");
      },
      error: (err: any) => {
        this.enviandoLogo = false;
        this.notificationService.error(err.error || "Erro ao enviar logotipo.");
      },
    });
  }

  removerLogo(): void {
    this.enviandoLogo = true;
    this.empresaService.removerLogo().subscribe({
      next: () => {
        if (this.empresa) {
          this.empresa.logoUrl = null;
        }
        this.enviandoLogo = false;
        this.notificationService.success("Logotipo removido com sucesso!");
      },
      error: () => {
        this.enviandoLogo = false;
        this.notificationService.error("Erro ao remover logotipo.");
      },
    });
  }

  salvar(): void {
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      this.notificationService.warning(
        "Por favor, verifique os campos com dados pendentes ou inválidos.",
      );
      return;
    }

    this.salvando = true;

    const command: SalvarDadosEmpresaCommand = {
      nomeEmpresa: this.f["nomeEmpresa"].value,
      razaoSocial: this.f["razaoSocial"].value || null,
      cnpj: this.f["cnpj"].value ? MaskUtils.clean(this.f["cnpj"].value) : null,
      registroProfissional: this.f["registroProfissional"].value || null,
      slogan: this.f["slogan"].value || null,
      email: this.f["email"].value || null,
      telefone: this.f["telefone"].value
        ? MaskUtils.clean(this.f["telefone"].value)
        : null,
      endereco: this.f["endereco"].value || null,
      cidade: this.f["cidade"].value || null,
      estado: this.f["estado"].value || null,
      cep: this.f["cep"].value ? MaskUtils.clean(this.f["cep"].value) : null,
      website: this.f["website"].value || null,
      logoUrl: this.empresa?.logoUrl || null,
      corPrimaria: this.f["corPrimaria"].value || "#765538",
    };

    this.empresaService.salvarDadosEmpresa(command).subscribe({
      next: (atualizado) => {
        this.empresa = atualizado;
        this.salvando = false;
        this.notificationService.success(
          "Dados da empresa salvos com sucesso!",
        );
      },
      error: (err: any) => {
        this.salvando = false;
        this.notificationService.error(
          err.error?.message || "Erro ao salvar dados da empresa.",
        );
      },
    });
  }
}

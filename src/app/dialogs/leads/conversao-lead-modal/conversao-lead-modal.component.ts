import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ClienteService } from '../../../core/api';
import { ViaCepService } from '../../../core/services/via-cep.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Lead } from '../../../models/lead.model';
import { ConvertLeadToClienteCommand } from '../../../commands/cliente.commands';
import { MaskUtils } from '../../../core/utils/mask-utils';
import { LeadForm } from '../../../components/leads/lead.form';

@Component({
  selector: 'app-conversao-lead-modal',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule],
  templateUrl: './conversao-lead-modal.component.html',
  styleUrl: './conversao-lead-modal.component.scss'
})
export class ConversaoLeadModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private viaCepService = inject(ViaCepService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  @Input() show = false;
  @Input() lead: Lead | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() convertedSuccess = new EventEmitter<void>();

  convertForm!: FormGroup;
  submitted = false;
  tipoPessoa: 'PF' | 'PJ' = 'PF';
  buscandoCep = false;
  
  isConverted = false;
  clienteId = '';
  clienteNome = '';
  clienteEmail = '';

  constructor() {
    this.convertForm = LeadForm.convertLead(this.fb);
  }

  ngOnInit(): void {
    if (this.lead) {
      if (!this.lead.nome || !this.lead.email || !this.lead.origemId) {
        this.notificationService.error('Não é possível converter o lead. É obrigatório ter Nome, E-mail e Origem cadastrados.');
        this.onClose();
        return;
      }

      this.convertForm.patchValue({
        telefone: MaskUtils.formatPhone(this.lead.telefone || ''),
        cpfCnpj: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
      });
    }
  }

  setTipoPessoa(tipo: 'PF' | 'PJ'): void {
    this.tipoPessoa = tipo;
    this.convertForm.get('cpfCnpj')?.setValue('');
    this.updateCpfCnpjValidators();
  }

  private updateCpfCnpjValidators(): void {
    const control = this.convertForm.get('cpfCnpj');
    if (this.tipoPessoa === 'PF') {
      control?.setValidators([Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]);
    } else {
      control?.setValidators([Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)]);
    }
    control?.updateValueAndValidity();
  }

  onCpfCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const clean = MaskUtils.clean(input.value);
    if (this.tipoPessoa === 'PF') {
      input.value = MaskUtils.formatCpf(clean);
    } else {
      input.value = MaskUtils.formatCnpj(clean);
    }
    this.convertForm.get('cpfCnpj')?.setValue(input.value, { emitEvent: false });
  }

  onTelefoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = MaskUtils.formatPhone(input.value);
    this.convertForm.get('telefone')?.setValue(input.value, { emitEvent: false });
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = MaskUtils.clean(input.value);
    input.value = MaskUtils.formatCep(raw);
    this.convertForm.get('cep')?.setValue(input.value, { emitEvent: false });

    if (raw.length === 8) {
      this.buscarEnderecoPorCep(raw);
    }
  }

  private buscarEnderecoPorCep(cep: string): void {
    this.buscandoCep = true;
    this.viaCepService.buscarCep(cep).subscribe({
      next: (dados) => {
        this.buscandoCep = false;
        if (dados && !dados.erro) {
          this.convertForm.patchValue({
            logradouro: dados.logradouro || '',
            bairro: dados.bairro || '',
            cidade: dados.localidade || '',
            uf: dados.uf || '',
            complemento: dados.complemento || ''
          });
        } else {
          this.notificationService.warning('CEP não encontrado na base dos Correios.');
        }
      },
      error: () => {
        this.buscandoCep = false;
        this.notificationService.warning('Não foi possível autocompletar o endereço pelo CEP.');
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.convertForm.invalid || !this.lead) {
      this.notificationService.warning('Preencha os campos obrigatórios corretamente.');
      return;
    }

    const formValues = this.convertForm.value;

    let enderecoCompleto: string | undefined = undefined;
    if (formValues.logradouro) {
      const parts = [
        formValues.logradouro,
        formValues.numero ? `nº ${formValues.numero}` : '',
        formValues.complemento || '',
        formValues.bairro || '',
        formValues.cidade ? `${formValues.cidade}/${formValues.uf || ''}` : '',
        formValues.cep ? `CEP: ${formValues.cep}` : ''
      ].filter(p => !!p.trim());
      enderecoCompleto = parts.join(', ');
    }

    const command: ConvertLeadToClienteCommand = {
      leadId: this.lead.id,
      cpfCnpj: formValues.cpfCnpj ? MaskUtils.clean(formValues.cpfCnpj) : undefined,
      telefone: formValues.telefone ? MaskUtils.clean(formValues.telefone) : undefined,
      endereco: enderecoCompleto
    };

    this.clienteService.converterLead(command).subscribe({
      next: (res) => {
        this.isConverted = true;
        this.clienteId = res.cliente.id;
        this.clienteNome = res.cliente.nome;
        this.clienteEmail = res.cliente.email;
        this.notificationService.success(`Lead convertido em cliente com sucesso! Credenciais enviadas.`);
        this.convertedSuccess.emit();
      },
      error: (err) => {
        const msg = err.error?.detail || err.error?.message || 'Falha ao converter lead em cliente.';
        this.notificationService.error(msg);
      }
    });
  }

  concluirERedirecionar(): void {
    this.onClose();
    if (this.clienteId) {
      this.router.navigate(['/clientes', this.clienteId]);
    } else {
      this.router.navigate(['/clientes']);
    }
  }

  onClose(): void {
    this.show = false;
    this.isConverted = false;
    this.submitted = false;
    this.convertForm.reset();
    this.close.emit();
  }
}

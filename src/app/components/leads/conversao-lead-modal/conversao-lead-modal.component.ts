import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ClienteService } from '../../../core/api/cliente.service';
import { ViaCepService } from '../../../core/services/via-cep.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Lead } from '../../../models/lead.model';
import { ConvertLeadToClienteCommand } from '../../../commands/cliente.commands';
import { MaskUtils } from '../../../core/utils/mask-utils';
import { LeadForm } from '../lead.form';

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
    
    this.tipoPessoa = 'PF';
    this.isConverted = false;
    this.clienteId = '';
    this.submitted = false;
  }

  get f() { return this.convertForm.controls; }

  setTipoPessoa(tipo: 'PF' | 'PJ'): void {
    this.tipoPessoa = tipo;
    const currentVal = this.convertForm.get('cpfCnpj')?.value || '';
    if (tipo === 'PF') {
      this.convertForm.get('cpfCnpj')?.setValue(MaskUtils.formatCpf(currentVal));
    } else {
      this.convertForm.get('cpfCnpj')?.setValue(MaskUtils.formatCnpj(currentVal));
    }
  }

  onCpfCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = this.tipoPessoa === 'PF' 
      ? MaskUtils.formatCpf(input.value) 
      : MaskUtils.formatCnpj(input.value);
    this.convertForm.get('cpfCnpj')?.setValue(formatted, { emitEvent: false });
  }

  onTelefoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = MaskUtils.formatPhone(input.value);
    this.convertForm.get('telefone')?.setValue(formatted, { emitEvent: false });
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = MaskUtils.formatCep(input.value);
    this.convertForm.get('cep')?.setValue(formatted, { emitEvent: false });

    const cepLimpo = formatted.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      this.consultarViaCep(cepLimpo);
    }
  }

  consultarViaCep(cep: string): void {
    this.buscandoCep = true;
    this.viaCepService.buscarCep(cep).subscribe({
      next: (res) => {
        this.buscandoCep = false;
        if (res) {
          this.convertForm.patchValue({
            logradouro: res.logradouro || '',
            bairro: res.bairro || '',
            cidade: res.localidade || '',
            uf: res.uf || '',
            complemento: res.complemento || ''
          });
          this.notificationService.success(`Endereço de ${res.localidade}/${res.uf} localizado pelo CEP!`);
        } else {
          this.notificationService.warning('CEP não encontrado na base do ViaCEP.');
        }
      },
      error: () => {
        this.buscandoCep = false;
        this.notificationService.error('Erro ao consultar o serviço ViaCEP.');
      }
    });
  }

  onClose(): void {
    this.close.emit();
    if (this.isConverted) {
      this.convertedSuccess.emit();
      if (this.clienteId) {
        this.router.navigate(['/clientes', this.clienteId]);
      }
    }
  }

  concluirERedirecionar(): void {
    this.close.emit();
    this.convertedSuccess.emit();
    if (this.clienteId) {
      this.router.navigate(['/clientes', this.clienteId]);
    } else {
      this.router.navigate(['/clientes']);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.convertForm.invalid || !this.lead) {
      return;
    }

    const val = this.convertForm.value;
    
    let enderecoConsolidado = '';
    if (val.logradouro || val.cidade || val.cep) {
      const partes: string[] = [];
      if (val.logradouro) {
        let rua = val.logradouro;
        if (val.numero) rua += `, ${val.numero}`;
        if (val.complemento) rua += ` (${val.complemento})`;
        partes.push(rua);
      }
      if (val.bairro) partes.push(val.bairro);
      if (val.cidade) partes.push(`${val.cidade}/${val.uf || ''}`);
      if (val.cep) partes.push(`CEP ${val.cep}`);
      enderecoConsolidado = partes.join(' - ');
    }

    const command: ConvertLeadToClienteCommand = {
      leadId: this.lead!.id,
      cpfCnpj: val.cpfCnpj || undefined,
      telefone: val.telefone || undefined,
      endereco: enderecoConsolidado || undefined
    };

    this.clienteService.converterLead(command).subscribe({
      next: (response) => {
        this.notificationService.success('Lead convertido em cliente com sucesso!');
        this.clienteId = response.cliente.id;
        this.clienteNome = response.cliente.nome;
        this.clienteEmail = response.cliente.email;
        this.isConverted = true;
      },
      error: (err) => {
        console.error('Erro ao converter lead', err);
        const errorMsg = err.error?.error || err.error?.message || 'Erro ao realizar conversão do lead.';
        this.notificationService.error(errorMsg);
      }
    });
  }
}

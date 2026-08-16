import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ClienteService } from '../../../core/api/cliente.service';
import { ViaCepService } from '../../../core/services/via-cep.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Cliente } from '../../../models/cliente.model';
import { AtualizarClienteCommand } from '../../../commands/cliente.commands';
import { MaskUtils } from '../../../core/utils/mask-utils';
import { ClienteForm } from '../cliente.form';

@Component({
  selector: 'app-editar-cliente-modal',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule],
  templateUrl: './editar-cliente-modal.component.html',
  styleUrl: './editar-cliente-modal.component.scss'
})
export class EditarClienteModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private viaCepService = inject(ViaCepService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  
  private _cliente: Cliente | null = null;
  @Input() 
  get cliente(): Cliente | null {
    return this._cliente;
  }
  set cliente(val: Cliente | null) {
    this._cliente = val;
    if (val && this.form) {
      this.carregarDadosCliente(val);
    }
  }

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Cliente>();

  form!: FormGroup;
  submitted = false;
  tipoPessoa: 'PF' | 'PJ' = 'PF';
  buscandoCep = false;

  constructor() {
    this.form = ClienteForm.create(this.fb);
  }

  ngOnInit(): void {
    if (this._cliente) {
      this.carregarDadosCliente(this._cliente);
    }
  }

  private carregarDadosCliente(cli: Cliente): void {
    const doc = cli.cpfCnpj || '';
    const docLimpo = doc.replace(/\D/g, '');
    this.tipoPessoa = docLimpo.length > 11 ? 'PJ' : 'PF';

    const maskedDoc = this.tipoPessoa === 'PF' 
      ? MaskUtils.formatCpf(doc) 
      : MaskUtils.formatCnpj(doc);

    this.form.patchValue({
      nome: cli.nome || '',
      email: cli.email || '',
      telefone: MaskUtils.formatPhone(cli.telefone || ''),
      cpfCnpj: maskedDoc,
      cep: '',
      logradouro: cli.endereco || '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: ''
    });
  }

  get f() { return this.form.controls; }

  setTipoPessoa(tipo: 'PF' | 'PJ'): void {
    this.tipoPessoa = tipo;
    const currentVal = this.form.get('cpfCnpj')?.value || '';
    if (tipo === 'PF') {
      this.form.get('cpfCnpj')?.setValue(MaskUtils.formatCpf(currentVal));
    } else {
      this.form.get('cpfCnpj')?.setValue(MaskUtils.formatCnpj(currentVal));
    }
  }

  onCpfCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = this.tipoPessoa === 'PF' 
      ? MaskUtils.formatCpf(input.value) 
      : MaskUtils.formatCnpj(input.value);
    this.form.get('cpfCnpj')?.setValue(formatted, { emitEvent: false });
  }

  onTelefoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = MaskUtils.formatPhone(input.value);
    this.form.get('telefone')?.setValue(formatted, { emitEvent: false });
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = MaskUtils.formatCep(input.value);
    this.form.get('cep')?.setValue(formatted, { emitEvent: false });

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
          this.form.patchValue({
            logradouro: res.logradouro || '',
            bairro: res.bairro || '',
            cidade: res.localidade || '',
            uf: res.uf || '',
            complemento: res.complemento || ''
          });
          this.notificationService.success(`Endereço de ${res.localidade}/${res.uf} localizado pelo CEP!`);
        } else {
          this.notificationService.warning('CEP não encontrado no ViaCEP.');
        }
      },
      error: () => {
        this.buscandoCep = false;
        this.notificationService.error('Erro ao consultar ViaCEP.');
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid || !this._cliente) {
      return;
    }

    const val = this.form.value;

    let enderecoConsolidado = val.logradouro || '';
    if (val.numero || val.bairro || val.cidade || val.cep) {
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

    const command: AtualizarClienteCommand = {
      id: this._cliente.id,
      nome: val.nome.trim(),
      email: val.email.trim(),
      telefone: val.telefone || undefined,
      cpfCnpj: val.cpfCnpj || undefined,
      endereco: enderecoConsolidado || undefined
    };

    this.clienteService.atualizar(command).subscribe({
      next: (clienteAtualizado) => {
        this.notificationService.success('Dados cadastrais atualizados com sucesso!');
        this.saved.emit(clienteAtualizado);
        this.onClose();
      },
      error: (err) => {
        console.error('Erro ao atualizar cliente', err);
        const msg = err.error?.error || err.error?.message || 'Erro ao atualizar dados do cliente.';
        this.notificationService.error(msg);
      }
    });
  }
}

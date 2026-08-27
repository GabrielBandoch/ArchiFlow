import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { LeadService } from '../../../core/api';
import { NotificationService } from '../../../core/services/notification.service';
import { Lead, StatusLead } from '../../../models/lead.model';
import { LeadForm } from '../../../components/leads/lead.form';
import { SelectOption } from '../../../shared/components/select/select.component';
import { DialogService } from '../../../core/services/dialog.service';
import { ConversaoLeadModalComponent } from '../conversao-lead-modal/conversao-lead-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalhes-lead-modal',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule],
  templateUrl: './detalhes-lead-modal.component.html',
  styleUrl: './detalhes-lead-modal.component.scss'
})
export class DetalhesLeadModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  @Input() lead: Lead | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  historyForm!: FormGroup;
  submitted = false;
  StatusLeadEnum = StatusLead;

  irParaClientes(): void {
    this.onClose();
    this.router.navigate(['/clientes']);
  }

  canalOptions: SelectOption[] = [
    { value: 'WhatsApp', label: 'WhatsApp', subLabel: 'Mensagem instantânea', icon: 'chat' },
    { value: 'Ligação', label: 'Ligação Telefônica', subLabel: 'Chamada de voz', icon: 'phone' },
    { value: 'E-mail', label: 'E-mail', subLabel: 'Mensagem formal', icon: 'mail' },
    { value: 'Reunião Online', label: 'Reunião Online', subLabel: 'Google Meet / Teams', icon: 'video_call' },
    { value: 'Presencial', label: 'Reunião Presencial', subLabel: 'Visita física', icon: 'person' },
    { value: 'Outro', label: 'Outro', subLabel: 'Outro canal de contato', icon: 'more_horiz' }
  ];

  resumoOptions: SelectOption[] = [
    { value: 'Tentativa de contato sem sucesso', label: 'Tentativa de contato sem sucesso', subLabel: 'Cliente não atendeu / não respondeu', icon: 'phone_missed' },
    { value: 'Apresentação institucional realizada', label: 'Apresentação institucional realizada', subLabel: 'Portfólio apresentado', icon: 'co_present' },
    { value: 'Proposta comercial enviada', label: 'Proposta comercial enviada', subLabel: 'Orçamento enviado', icon: 'description' },
    { value: 'Reunião de negociação agendada', label: 'Reunião de negociação agendada', subLabel: 'Próximo passo alinhado', icon: 'calendar_month' },
    { value: 'Dúvidas técnicas tiradas', label: 'Dúvidas técnicas tiradas', subLabel: 'Esclarecimentos sobre o projeto', icon: 'help' },
    { value: 'Outro', label: 'Outro (digitar resumo personalizado)', subLabel: 'Escrever texto livre', icon: 'edit_note' }
  ];

  constructor() {
    this.historyForm = LeadForm.createHistory(this.fb);
    this.historyForm.addControl('resumoOption', this.fb.control('', Validators.required));
  }

  get f() { return this.historyForm.controls; }

  ngOnInit(): void {
    this.historyForm.get('resumoOption')?.valueChanges.subscribe(val => {
      const resumoCtrl = this.historyForm.get('resumo');
      if (val === 'Outro') {
        resumoCtrl?.setValue('');
        resumoCtrl?.setValidators([Validators.required, Validators.maxLength(500)]);
      } else if (val) {
        resumoCtrl?.setValue(val);
        resumoCtrl?.clearValidators();
      }
      resumoCtrl?.updateValueAndValidity();
    });
  }

  getStatusClass(status: StatusLead): string {
    switch (status) {
      case StatusLead.Novo: return 'status-novo';
      case StatusLead.EmContato: return 'status-contato';
      case StatusLead.PropostaEnviada: return 'status-proposta';
      case StatusLead.Negociando: return 'status-negociando';
      case StatusLead.Convertido: return 'status-convertido';
      case StatusLead.Perdido: return 'status-perdido';
      default: return '';
    }
  }

  adicionarHistorico(): void {
    this.submitted = true;
    if (this.historyForm.invalid || !this.lead) {
      return;
    }

    const command = {
      leadId: this.lead.id,
      canal: this.historyForm.value.canal,
      resumo: this.historyForm.value.resumo
    };

    this.leadService.registrarContato(command).subscribe({
      next: () => {
        this.notificationService.success('Interação registrada com sucesso.');
        this.historyForm.reset();
        this.submitted = false;
        this.leadService.obterPorId(this.lead!.id).subscribe({
          next: (updated) => {
            this.lead = updated;
            this.saved.emit();
          }
        });
      },
      error: () => {
        this.notificationService.error('Erro ao registrar interação.');
      }
    });
  }

  converterParaCliente(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.lead) return;
    const currentLead = this.lead;
    this.onClose();

    const ref = this.dialogService.open(ConversaoLeadModalComponent, {
      data: { lead: currentLead }
    });

    ref.instance.convertedSuccess.subscribe(() => {
      this.saved.emit();
    });
  }

  onClose(): void {
    this.historyForm.reset();
    this.submitted = false;
    this.close.emit();
  }
}

import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { LeadService, OrigemLeadService } from '../../../core/api';
import { NotificationService } from '../../../core/services/notification.service';
import { LeadForm } from '../../../components/leads/lead.form';
import { OrigemLead } from '../../../models/origem-lead.model';
import { SelectOption } from '../../../shared/components/select/select.component';

@Component({
  selector: 'app-novo-lead-modal',
  standalone: true,
  imports: [CORE_IMPORTS, FORM_IMPORTS, DESIGN_SYSTEM, ReactiveFormsModule],
  templateUrl: './novo-lead-modal.component.html'
})
export class NovoLeadModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);
  private origemLeadService = inject(OrigemLeadService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  createForm!: FormGroup;
  submitted = false;
  origensOptions: SelectOption[] = [];

  constructor() {
    this.createForm = LeadForm.createLead(this.fb);
  }

  ngOnInit(): void {
    this.createForm.reset({
      nome: '',
      email: '',
      telefone: '',
      origemId: ''
    });
    this.submitted = false;
    this.carregarOrigens();
  }

  get f() { return this.createForm.controls; }

  carregarOrigens(): void {
    this.origemLeadService.obterAtivas().subscribe({
      next: (data) => {
        this.origensOptions = data.map(o => ({
          value: o.id,
          label: o.descricao,
          subLabel: 'Canal de entrada ativo',
          icon: 'share'
        }));
      },
      error: (err) => console.error('Erro ao carregar origens de lead', err)
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.createForm.invalid) {
      return;
    }

    const command = this.createForm.value;
    this.leadService.criar(command).subscribe({
      next: () => {
        this.notificationService.success('Lead cadastrado com sucesso!');
        this.saved.emit();
        this.onClose();
      },
      error: (err) => {
        console.error('Erro ao criar lead', err);
        const errorMsg = err.error?.error || 'Erro ao cadastrar o lead.';
        this.notificationService.error(errorMsg);
      }
    });
  }
}

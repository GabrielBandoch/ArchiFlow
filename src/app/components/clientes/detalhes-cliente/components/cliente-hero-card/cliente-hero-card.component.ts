import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../../../models/cliente.model';
import { Lead } from '../../../../../models/lead.model';
import { Projeto } from '../../../../../models/projeto.model';
import { PropostaHonorario } from '../../../../../models/honorario.model';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { WhatsAppButtonComponent } from '../../../../../shared/components/whatsapp-button/whatsapp-button.component';
import { PhoneMaskPipe } from '../../../../../core/pipes/phone-mask.pipe';

@Component({
  selector: 'app-cliente-hero-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, WhatsAppButtonComponent, PhoneMaskPipe],
  templateUrl: './cliente-hero-card.component.html',
  styleUrls: ['./cliente-hero-card.component.scss']
})
export class ClienteHeroCardComponent {
  @Input() cliente!: Cliente;
  @Input() lead?: Lead;
  @Input() projetos: Projeto[] = [];
  @Input() propostas: PropostaHonorario[] = [];
  @Input() totalMetragem = 0;
  @Input() totalInvestidoPropostas = 0;
  @Input() propostasAprovadasCount = 0;

  @Output() avatarSelected = new EventEmitter<Event>();
  @Output() removePhoto = new EventEmitter<void>();
  @Output() openWhatsApp = new EventEmitter<void>();
  @Output() openEditModal = new EventEmitter<void>();
  @Output() togglePortal = new EventEmitter<void>();
  @Output() copyText = new EventEmitter<{ text: string; label: string }>();

  onFileChange(event: Event): void {
    this.avatarSelected.emit(event);
  }

  onRemovePhoto(): void {
    this.removePhoto.emit();
  }

  onWhatsApp(): void {
    this.openWhatsApp.emit();
  }

  onEdit(): void {
    this.openEditModal.emit();
  }

  onTogglePortal(): void {
    this.togglePortal.emit();
  }

  onCopy(texto: string, label: string): void {
    this.copyText.emit({ text: texto, label });
  }
}

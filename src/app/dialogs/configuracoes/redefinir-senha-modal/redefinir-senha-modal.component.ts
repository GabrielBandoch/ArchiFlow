import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DialogComponent } from "../../../shared/components/dialog/dialog.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { MembroEquipe } from "../../../core/models/usuario.model";
import { UsuarioService } from "../../../core/api/usuarios/usuario.service";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: "app-redefinir-senha-modal",
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent, ButtonComponent],
  templateUrl: "./redefinir-senha-modal.component.html",
  styleUrl: "./redefinir-senha-modal.component.scss",
})
export class RedefinirSenhaModalComponent {
  private usuarioService = inject(UsuarioService);
  private notificationService = inject(NotificationService);

  @Input() show = true;
  @Input() membro?: MembroEquipe;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  novaSenhaManual = "";
  salvandoSenha = false;

  onClose(): void {
    this.close.emit();
  }

  confirmarRedefinirSenha(): void {
    if (!this.membro) return;

    this.salvandoSenha = true;
    const senha = this.novaSenhaManual.trim() || undefined;

    this.usuarioService.redefinirSenha(this.membro.id, senha).subscribe({
      next: () => {
        this.salvandoSenha = false;
        this.notificationService.success(
          `Senha do colaborador ${this.membro?.nome} redefinida! Notificação enviada por e-mail.`,
        );
        this.saved.emit();
        this.onClose();
      },
      error: (err) => {
        this.salvandoSenha = false;
        console.error("Erro ao redefinir senha", err);
        this.notificationService.error(
          "Erro ao redefinir a senha do colaborador.",
        );
      },
    });
  }
}

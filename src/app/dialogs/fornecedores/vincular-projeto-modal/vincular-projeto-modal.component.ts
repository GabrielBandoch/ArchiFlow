import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Fornecedor, VincularProjetoCommand } from "../../../core/models/fornecedor.model";
import { FornecedorService } from "../../../core/api/fornecedores/fornecedor.service";
import { NotificationService } from "../../../core/services/notification.service";
import { DialogComponent } from "../../../shared/components/dialog/dialog.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ProjectSearchComponent } from "../../../shared/components/project-search/project-search.component";

@Component({
  selector: "app-vincular-projeto-modal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogComponent,
    ButtonComponent,
    InputComponent,
    ProjectSearchComponent,
  ],
  templateUrl: "./vincular-projeto-modal.component.html",
  styleUrls: ["./vincular-projeto-modal.component.scss"],
})
export class VincularProjetoModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fornecedorService = inject(FornecedorService);
  private notificationService = inject(NotificationService);

  @Input() show = false;
  @Input() fornecedor?: Fornecedor;
  @Output() close = new EventEmitter<void>();
  @Output() vinculado = new EventEmitter<void>();

  form!: FormGroup;
  salvando = false;
  submitted = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      projetoId: ["", Validators.required],
      funcaoNoProjeto: ["", Validators.required],
    });
  }

  onClose(): void {
    this.close.emit();
  }

  salvar(): void {
    this.submitted = true;
    if (this.form.invalid || !this.fornecedor) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    const cmd: VincularProjetoCommand = {
      fornecedorId: this.fornecedor.id,
      projetoId: this.form.value.projetoId,
      funcaoNoProjeto: this.form.value.funcaoNoProjeto,
    };

    this.fornecedorService.vincularProjeto(this.fornecedor.id, cmd).subscribe({
      next: () => {
        this.salvando = false;
        this.notificationService.success(
          "Parceiro vinculado à obra com sucesso!",
        );
        this.vinculado.emit();
        this.onClose();
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error("Erro ao vincular parceiro à obra.");
      },
    });
  }
}

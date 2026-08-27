import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { InputComponent } from './components/input/input.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SelectComponent } from './components/select/select.component';
import { ClientSearchComponent } from './components/client-search/client-search.component';

export const CORE_IMPORTS = [
  CommonModule,
  RouterLink
] as const;

export const FORM_IMPORTS = [
  ReactiveFormsModule
] as const;

export const DESIGN_SYSTEM = [
  ButtonComponent,
  CardComponent,
  InputComponent,
  DialogComponent,
  ConfirmDialogComponent,
  SelectComponent,
  ClientSearchComponent
] as const;

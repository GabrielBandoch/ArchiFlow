import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Cliente } from '../../../../../models/cliente.model';
import { Lead } from '../../../../../models/lead.model';

@Component({
  selector: 'app-parametros-projeto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parametros-projeto.component.html',
  styleUrl: './parametros-projeto.component.scss'
})
export class ParametrosProjetoComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() padroesImovel: Array<{ valor: number; nome: string; fator: string }> = [];
  @Input() tiposProjeto: Array<{ valor: number; nome: string }> = [];
  @Input() clientes: Cliente[] = [];
  @Input() leads: Lead[] = [];
  @Output() padraoSelecionado = new EventEmitter<number>();
  @Output() vinculoAlterado = new EventEmitter<void>();

  onSelectPadrao(valor: number): void {
    this.padraoSelecionado.emit(valor);
  }

  setTipoVinculo(tipo: 'nenhum' | 'lead' | 'cliente' | 'avulso'): void {
    this.form.patchValue({
      tipoVinculo: tipo,
      clienteId: '',
      leadId: '',
      clienteNome: '',
      clienteTelefone: '',
      clienteEmail: ''
    });
    this.vinculoAlterado.emit();
  }

  onLeadChange(event: Event): void {
    const leadId = (event.target as HTMLSelectElement).value;
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) {
      this.form.patchValue({
        clienteNome: lead.nome,
        clienteTelefone: lead.telefone || '',
        clienteEmail: lead.email || ''
      });
    }
    this.vinculoAlterado.emit();
  }

  onClienteChange(event: Event): void {
    const clienteId = (event.target as HTMLSelectElement).value;
    const cliente = this.clientes.find(c => c.id === clienteId);
    if (cliente) {
      this.form.patchValue({
        clienteNome: cliente.nome,
        clienteTelefone: cliente.telefone || '',
        clienteEmail: cliente.email || ''
      });
    }
    this.vinculoAlterado.emit();
  }

  get clienteSelecionadoInfo(): { nome: string; detalhes: string } | null {
    const tipo = this.form.get('tipoVinculo')?.value;
    if (tipo === 'lead') {
      const leadId = this.form.get('leadId')?.value;
      const lead = this.leads.find(l => l.id === leadId);
      if (lead) {
        return {
          nome: lead.nome,
          detalhes: lead.telefone ? `• Tel: ${lead.telefone}` : (lead.email ? `• ${lead.email}` : '')
        };
      }
    } else if (tipo === 'cliente') {
      const clienteId = this.form.get('clienteId')?.value;
      const cli = this.clientes.find(c => c.id === clienteId);
      if (cli) {
        return {
          nome: cli.nome,
          detalhes: cli.telefone ? `• Tel: ${cli.telefone}` : (cli.email ? `• ${cli.email}` : '')
        };
      }
    } else if (tipo === 'avulso') {
      const nome = this.form.get('clienteNome')?.value;
      if (nome) {
        const tel = this.form.get('clienteTelefone')?.value;
        return {
          nome: nome,
          detalhes: tel ? `• Tel: ${tel}` : ''
        };
      }
    }
    return null;
  }
}

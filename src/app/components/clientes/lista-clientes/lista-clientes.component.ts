import { Component, OnInit, inject } from '@angular/core';
import { CORE_IMPORTS, DESIGN_SYSTEM } from '../../../shared';
import { ClienteService } from '../../../core/api/cliente.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Cliente } from '../../../models/cliente.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CORE_IMPORTS, DESIGN_SYSTEM, FormsModule],
  templateUrl: './lista-clientes.component.html',
  styleUrl: './lista-clientes.component.scss'
})
export class ListaClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  searchQuery = '';
  filtroStatus: 'todos' | 'ativos' | 'inativos' = 'todos';

  get totalClientes(): number {
    return this.clientes.length;
  }

  get totalAtivos(): number {
    return this.clientes.filter(c => c.ativo).length;
  }

  get totalProjetos(): number {
    return this.clientes.reduce((acc, c) => acc + (c.projetosAtivosCount || 0), 0);
  }

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.obterTodos().subscribe({
      next: (data) => {
        this.clientes = data;
        this.filtrarClientes();
      },
      error: (err) => {
        console.error('Erro ao carregar clientes', err);
        this.notificationService.error('Erro ao carregar a lista de clientes.');
      }
    });
  }

  setFiltro(status: 'todos' | 'ativos' | 'inativos'): void {
    this.filtroStatus = status;
    this.filtrarClientes();
  }

  filtrarClientes(): void {
    let result = this.clientes;

    // Filtro por status do portal
    if (this.filtroStatus === 'ativos') {
      result = result.filter(c => c.ativo);
    } else if (this.filtroStatus === 'inativos') {
      result = result.filter(c => !c.ativo);
    }

    // Filtro por busca textual
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(c => 
        c.nome.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) || 
        (c.cpfCnpj && c.cpfCnpj.toLowerCase().includes(q))
      );
    }

    this.clientesFiltrados = result;
  }

  toggleAcessoPortal(cliente: Cliente, event: Event): void {
    event.preventDefault();
    const novoStatus = !cliente.ativo;
    this.clienteService.atualizarAcessoPortal({ id: cliente.id, ativo: novoStatus }).subscribe({
      next: (data) => {
        cliente.ativo = data.ativo;
        this.notificationService.success(
          `Acesso ao portal de "${cliente.nome}" foi ${cliente.ativo ? 'ativado' : 'desativado'}.`
        );
        this.filtrarClientes();
      },
      error: (err) => {
        console.error('Erro ao atualizar acesso ao portal', err);
        this.notificationService.error('Não foi possível alterar o acesso ao portal.');
      }
    });
  }

  verDetalhes(clienteId: string): void {
    this.router.navigate(['/clientes', clienteId]);
  }

  irParaLeads(): void {
    this.notificationService.info('Para cadastrar um novo cliente, converta um Lead no Funil Comercial.');
    this.router.navigate(['/leads']);
  }
}

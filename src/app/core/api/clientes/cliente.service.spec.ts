import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { environment } from '../../../../environments/environment';
import { Cliente } from '../../../models/cliente.model';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/clientes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService]
    });

    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all clients (obterTodos)', () => {
    const mockClientes: Cliente[] = [
      {
        id: '1',
        nome: 'Gabriel Felipe',
        email: 'gabriel@email.com',
        ativo: true,
        projetosAtivosCount: 0
      }
    ];

    service.obterTodos().subscribe((clientes) => {
      expect(clientes.length).toBe(1);
      expect(clientes[0].nome).toBe('Gabriel Felipe');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockClientes);
  });

  it('should fetch client by ID (obterPorId)', () => {
    const mockCliente: Cliente = {
      id: '1',
      nome: 'Gabriel Felipe',
      email: 'gabriel@email.com',
      ativo: true,
      projetosAtivosCount: 1
    };

    service.obterPorId('1').subscribe((cliente) => {
      expect(cliente.id).toBe('1');
      expect(cliente.email).toBe('gabriel@email.com');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCliente);
  });

  it('should update client (atualizar)', () => {
    const command = {
      id: '1',
      nome: 'Gabriel Atualizado',
      email: 'gabriel@email.com'
    };

    const mockResponse: Cliente = {
      id: '1',
      nome: 'Gabriel Atualizado',
      email: 'gabriel@email.com',
      ativo: true,
      projetosAtivosCount: 0
    };

    service.atualizar(command).subscribe((res) => {
      expect(res.nome).toBe('Gabriel Atualizado');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(command);
    req.flush(mockResponse);
  });

  it('should toggle portal access (atualizarAcessoPortal)', () => {
    const command = {
      id: '1',
      ativo: true
    };

    const mockResponse: Cliente = {
      id: '1',
      nome: 'Gabriel',
      email: 'gabriel@email.com',
      ativo: true,
      projetosAtivosCount: 0
    };

    service.atualizarAcessoPortal(command).subscribe((res) => {
      expect(res.ativo).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/portal-access`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(command);
    req.flush(mockResponse);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortalDocumentosComponent } from './portal-documentos.component';
import { Arquivo } from '../../../models/arquivo.model';

describe('PortalDocumentosComponent', () => {
  let component: PortalDocumentosComponent;
  let fixture: ComponentFixture<PortalDocumentosComponent>;

  const mockArquivos: Arquivo[] = [
    {
      id: 'a-1',
      projetoId: 'p-1',
      nome: 'planta_baixa.dwg',
      urlStorage: 'https://storage/planta.dwg',
      tipo: 'cad',
      visivelCliente: true,
      criadoEm: '2026-01-01'
    },
    {
      id: 'a-2',
      projetoId: 'p-1',
      nome: 'memorial.pdf',
      urlStorage: 'https://storage/memorial.pdf',
      tipo: 'pdf',
      visivelCliente: true,
      criadoEm: '2026-01-02'
    },
    {
      id: 'a-3',
      projetoId: 'p-1',
      nome: 'fachada.png',
      urlStorage: 'https://storage/fachada.png',
      tipo: 'image',
      visivelCliente: true,
      criadoEm: '2026-01-03'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalDocumentosComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PortalDocumentosComponent);
    component = fixture.componentInstance;
    component.arquivos = mockArquivos;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve filtrar arquivos por categoria', () => {
    component.setFiltro('todos');
    expect(component.arquivosFiltrados.length).toBe(3);

    component.setFiltro('plantas');
    expect(component.arquivosFiltrados.length).toBe(1);
    expect(component.arquivosFiltrados[0].nome).toBe('planta_baixa.dwg');

    component.setFiltro('documentos');
    expect(component.arquivosFiltrados.length).toBe(1);
    expect(component.arquivosFiltrados[0].nome).toBe('memorial.pdf');

    component.setFiltro('imagens');
    expect(component.arquivosFiltrados.length).toBe(1);
    expect(component.arquivosFiltrados[0].nome).toBe('fachada.png');
  });

  it('deve emitir evento de download', () => {
    spyOn(component.download, 'emit');
    component.onDownload(mockArquivos[0]);
    expect(component.download.emit).toHaveBeenCalledWith(mockArquivos[0]);
  });
});

import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ConfiguracaoSistemaService } from "./configuracao-sistema.service";
import { environment } from "../../../../environments/environment";
import { OpcaoConfiguracao } from "../../models/configuracao-sistema.model";

describe("ConfiguracaoSistemaService", () => {
  let service: ConfiguracaoSistemaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfiguracaoSistemaService],
    });

    service = TestBed.inject(ConfiguracaoSistemaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  it("deve obter opcoes por categoria via GET (obterOpcoesPorCategoria)", () => {
    const mockOpcoes: OpcaoConfiguracao[] = [
      {
        id: "1",
        categoria: "tipo-projeto",
        chave: "residencial",
        rotulo: "Residencial",
        ordem: 1,
        ativo: true,
      },
    ];

    service.obterOpcoesPorCategoria("tipo-projeto").subscribe((opcoes) => {
      expect(opcoes).toEqual(mockOpcoes);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/configuracoes/opcoes/tipo-projeto`,
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockOpcoes);
  });

  it("deve obter todas as opcoes via GET (obterTodasOpcoes)", () => {
    const mockTodas: { [categoria: string]: OpcaoConfiguracao[] } = {
      "tipo-projeto": [
        {
          id: "1",
          categoria: "tipo-projeto",
          chave: "residencial",
          rotulo: "Residencial",
          ordem: 1,
          ativo: true,
        },
      ],
    };

    service.obterTodasOpcoes().subscribe((todas) => {
      expect(todas).toEqual(mockTodas);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/configuracoes/opcoes`,
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockTodas);
  });
});

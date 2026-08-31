import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TemplatesProjetoComponent } from './templates-projeto.component';
import { ProjectTemplateService } from '../../../core/services/project-template.service';
import { DialogService } from '../../../core/services/dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProjectTemplate } from '../../../models/project-template.model';

describe('TemplatesProjetoComponent', () => {
  let component: TemplatesProjetoComponent;
  let fixture: ComponentFixture<TemplatesProjetoComponent>;
  let templateServiceSpy: jasmine.SpyObj<ProjectTemplateService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockTemplates: ProjectTemplate[] = [
    {
      id: 'residencial-completo',
      codigo: 'residencial-completo',
      nome: 'Projeto Residencial',
      descricao: 'Descricao',
      icone: 'home',
      ativo: true,
      etapas: [
        { ordem: 1, nome: 'Estudo Preliminar', descricao: 'Desc', tarefas: ['Tarefa 1'] }
      ]
    }
  ];

  beforeEach(async () => {
    templateServiceSpy = jasmine.createSpyObj('ProjectTemplateService', ['obterTemplates', 'excluirTemplate']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    templateServiceSpy.obterTemplates.and.returnValue(of(mockTemplates));

    await TestBed.configureTestingModule({
      imports: [TemplatesProjetoComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: ProjectTemplateService, useValue: templateServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplatesProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso e carregar templates', () => {
    expect(component).toBeTruthy();
    expect(component.templates.length).toBe(1);
    expect(component.templates[0].nome).toBe('Projeto Residencial');
  });

  it('deve abrir modal de criacao ao chamar abrirModalCriacao', () => {
    const dialogRefMock: any = {
      instance: {
        saved: of(mockTemplates[0])
      }
    };
    dialogServiceSpy.open.and.returnValue(dialogRefMock);

    component.abrirModalCriacao();
    expect(dialogServiceSpy.open).toHaveBeenCalled();
  });

  it('deve abrir modal de edicao ao chamar editarTemplate', () => {
    const dialogRefMock: any = {
      instance: {
        saved: of(mockTemplates[0])
      }
    };
    dialogServiceSpy.open.and.returnValue(dialogRefMock);

    component.editarTemplate(mockTemplates[0]);
    expect(dialogServiceSpy.open).toHaveBeenCalled();
  });

  it('deve calcular o total de entregaveis corretamente', () => {
    const total = component.obterTotalTarefas(mockTemplates[0]);
    expect(total).toBe(1);
  });
});

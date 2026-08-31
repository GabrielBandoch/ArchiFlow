import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TemplateModalComponent } from './template-modal.component';
import { ProjectTemplateService } from '../../../core/services/project-template.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('TemplateModalComponent', () => {
  let component: TemplateModalComponent;
  let fixture: ComponentFixture<TemplateModalComponent>;
  let templateServiceSpy: jasmine.SpyObj<ProjectTemplateService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    templateServiceSpy = jasmine.createSpyObj('ProjectTemplateService', ['criarTemplate', 'atualizarTemplate']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [TemplateModalComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: ProjectTemplateService, useValue: templateServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar formulario e etapas padrao', () => {
    expect(component.form.get('nome')).toBeTruthy();
    expect(component.form.get('codigo')).toBeTruthy();
    expect(component.form.get('icone')?.value).toBe('home');
    expect(component.etapas.length).toBe(1);
  });

  it('deve adicionar e remover etapas dinamicamente', () => {
    component.adicionarEtapa();
    expect(component.etapas.length).toBe(2);
    expect(component.etapas[1].ordem).toBe(2);

    component.removerEtapa(0);
    expect(component.etapas.length).toBe(1);
    expect(component.etapas[0].ordem).toBe(1);
  });

  it('deve adicionar e remover tarefas entregaveis em uma etapa', () => {
    component.novaTarefaInputs[0] = 'Entregavel 1';
    component.adicionarTarefa(0);
    expect(component.etapas[0].tarefas).toContain('Entregavel 1');

    const index = component.etapas[0].tarefas.indexOf('Entregavel 1');
    component.removerTarefa(0, index);
    expect(component.etapas[0].tarefas).not.toContain('Entregavel 1');
  });

  it('deve selecionar icone atualizando o form', () => {
    component.selectIcon('yard');
    expect(component.form.get('icone')?.value).toBe('yard');
  });

  it('deve chamar criarTemplate ao submeter formulario valido no modo criacao', () => {
    component.form.patchValue({
      nome: 'Template Novo',
      codigo: 'template-novo',
      descricao: 'Desc',
      icone: 'home'
    });

    const mockResponse = {
      id: 'template-novo',
      codigo: 'template-novo',
      nome: 'Template Novo',
      descricao: 'Desc',
      icone: 'home',
      ativo: true,
      etapas: []
    };

    templateServiceSpy.criarTemplate.and.returnValue(of(mockResponse));
    spyOn(component.saved, 'emit');
    spyOn(component.close, 'emit');

    component.onSubmit();

    expect(templateServiceSpy.criarTemplate).toHaveBeenCalled();
    expect(notificationServiceSpy.success).toHaveBeenCalled();
    expect(component.saved.emit).toHaveBeenCalledWith(mockResponse);
  });
});

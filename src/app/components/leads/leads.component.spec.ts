import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { LeadsComponent } from './leads.component';
import { LeadService } from '../../core/api';
import { NotificationService } from '../../core/services/notification.service';
import { DialogService } from '../../core/services/dialog.service';
import { Lead, StatusLead } from '../../models/lead.model';

describe('LeadsComponent', () => {
  let component: LeadsComponent;
  let fixture: ComponentFixture<LeadsComponent>;
  let leadServiceSpy: jasmine.SpyObj<LeadService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let router: Router;

  const mockLeads: Lead[] = [
    {
      id: 'lead-1',
      nome: 'Mariana Costa',
      email: 'mariana@email.com',
      telefone: '11988887777',
      origemId: 'origem-1',
      origem: 'Instagram',
      status: StatusLead.Novo,
      statusLabel: 'Novo',
      criadoEm: '2026-01-01',
      historicoContatos: []
    }
  ];

  beforeEach(async () => {
    leadServiceSpy = jasmine.createSpyObj('LeadService', ['obterTodos', 'atualizarStatus', 'excluir']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);

    leadServiceSpy.obterTodos.and.returnValue(of(mockLeads));

    await TestBed.configureTestingModule({
      imports: [LeadsComponent],
      providers: [
        provideRouter([]),
        { provide: LeadService, useValue: leadServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load leads into columns', () => {
    expect(component).toBeTruthy();
    expect(leadServiceSpy.obterTodos).toHaveBeenCalled();
    expect(component.leads.length).toBe(1);
    expect(component.columns.length).toBe(6);
  });

  it('should navigate to simulator when simularHonorarios is clicked', () => {
    spyOn(router, 'navigate');
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation');

    component.simularHonorarios(mockLeads[0], mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/simulador'], {
      queryParams: { leadId: 'lead-1' }
    });
  });
});

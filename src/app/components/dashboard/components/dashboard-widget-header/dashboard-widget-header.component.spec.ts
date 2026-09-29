import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardWidgetHeaderComponent } from './dashboard-widget-header.component';

describe('DashboardWidgetHeaderComponent', () => {
  let component: DashboardWidgetHeaderComponent;
  let fixture: ComponentFixture<DashboardWidgetHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardWidgetHeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardWidgetHeaderComponent);
    component = fixture.componentInstance;
    component.title = 'Test Widget';
    component.icon = 'star';
    fixture.detectChanges();
  });

  it('should create and render title and icon', () => {
    expect(component).toBeTruthy();
    const titleEl = fixture.nativeElement.querySelector('.card-title');
    expect(titleEl.textContent.trim()).toBe('Test Widget');

    const iconEl = fixture.nativeElement.querySelector('.card-icon-box span');
    expect(iconEl.textContent.trim()).toBe('star');
  });

  it('should render subtitle when provided', () => {
    component.subtitle = 'My Subtitle';
    fixture.detectChanges();

    const subtitleEl = fixture.nativeElement.querySelector('.card-subtitle');
    expect(subtitleEl).toBeTruthy();
    expect(subtitleEl.textContent.trim()).toBe('My Subtitle');
  });

  it('should render action link when both actionLink and actionText are provided', () => {
    component.actionText = 'Ver Mais';
    component.actionLink = '/projetos';
    fixture.detectChanges();

    const linkEl = fixture.nativeElement.querySelector('.card-action-link');
    expect(linkEl).toBeTruthy();
    expect(linkEl.textContent).toContain('Ver Mais');
  });
});

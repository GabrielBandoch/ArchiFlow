import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir o evento com debounce ao digitar', fakeAsync(() => {
    spyOn(component.search, 'emit');
    component.onInput('Residência');
    tick(200);
    expect(component.search.emit).not.toHaveBeenCalled();

    tick(150);
    expect(component.search.emit).toHaveBeenCalledWith('Residência');
  }));

  it('deve limpar o campo ao acionar o método limpar()', () => {
    spyOn(component.search, 'emit');
    component.value = 'Busca antiga';
    component.limpar();

    expect(component.value).toBe('');
    expect(component.search.emit).toHaveBeenCalledWith('');
  });
});

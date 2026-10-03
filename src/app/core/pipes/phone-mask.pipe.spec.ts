import { PhoneMaskPipe } from './phone-mask.pipe';

describe('PhoneMaskPipe', () => {
  const pipe = new PhoneMaskPipe();

  it('deve retornar string vazia para valores nulos ou vazios', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('deve formatar celular com 11 dígitos corretamente', () => {
    expect(pipe.transform('47999466073')).toBe('(47) 99946-6073');
    expect(pipe.transform('11988887777')).toBe('(11) 98888-7777');
  });

  it('deve formatar telefone fixo com 10 dígitos corretamente', () => {
    expect(pipe.transform('4734331234')).toBe('(47) 3433-1234');
    expect(pipe.transform('1122223333')).toBe('(11) 2222-3333');
  });

  it('deve formatar números que já possuem caracteres parciais', () => {
    expect(pipe.transform('(47) 99946-6073')).toBe('(47) 99946-6073');
  });
});

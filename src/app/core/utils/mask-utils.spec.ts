import { MaskUtils } from './mask-utils';

describe('MaskUtils', () => {
  describe('clean', () => {
    it('should remove non-digit characters', () => {
      expect(MaskUtils.clean('123.456.789-00')).toBe('12345678900');
      expect(MaskUtils.clean('(47) 99999-6607')).toBe('47999996607');
      expect(MaskUtils.clean('89010-000')).toBe('89010000');
    });

    it('should return empty string for null or empty values', () => {
      expect(MaskUtils.clean('')).toBe('');
      expect(MaskUtils.clean(null as any)).toBe('');
      expect(MaskUtils.clean(undefined as any)).toBe('');
    });
  });

  describe('cpfCnpj', () => {
    it('should format 11 digits as CPF', () => {
      expect(MaskUtils.cpfCnpj('12345678900')).toBe('123.456.789-00');
    });

    it('should format 14 digits as CNPJ', () => {
      expect(MaskUtils.cpfCnpj('12345678000195')).toBe('12.345.678/0001-95');
    });

    it('should return original if not 11 or 14 digits', () => {
      expect(MaskUtils.cpfCnpj('12345')).toBe('12345');
      expect(MaskUtils.cpfCnpj('')).toBe('');
    });
  });

  describe('telefone', () => {
    it('should format 11 digits as mobile phone', () => {
      expect(MaskUtils.telefone('47999996607')).toBe('(47) 99999-6607');
    });

    it('should format 10 digits as landline phone', () => {
      expect(MaskUtils.telefone('4733334444')).toBe('(47) 3333-4444');
    });

    it('should return raw digits if length does not match phone formats', () => {
      expect(MaskUtils.telefone('123')).toBe('123');
    });
  });

  describe('cep', () => {
    it('should format 8 digits as CEP', () => {
      expect(MaskUtils.cep('89010000')).toBe('89010-000');
    });

    it('should return raw if length is not 8', () => {
      expect(MaskUtils.cep('1234')).toBe('1234');
    });
  });

  describe('formatAddress', () => {
    it('should combine address parts cleanly', () => {
      const formatted = MaskUtils.formatAddress('Rua das Flores', '123', 'Apto 4', 'Centro', 'Blumenau', 'SC', '89010-000');
      expect(formatted).toBe('Rua das Flores, 123, Apto 4 - Centro, Blumenau/SC - CEP 89010-000');
    });

    it('should return Não informado when no address parts exist', () => {
      expect(MaskUtils.formatAddress()).toBe('Não informado');
    });
  });
});

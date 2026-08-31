import { MaskUtils } from './mask-utils';

describe('MaskUtils', () => {
  describe('formatCpf', () => {
    it('should format 11 digits as CPF', () => {
      expect(MaskUtils.formatCpf('12345678900')).toBe('123.456.789-00');
    });

    it('should format partial digits correctly', () => {
      expect(MaskUtils.formatCpf('123')).toBe('123');
      expect(MaskUtils.formatCpf('1234')).toBe('123.4');
      expect(MaskUtils.formatCpf('1234567')).toBe('123.456.7');
    });

    it('should return empty string if empty or null', () => {
      expect(MaskUtils.formatCpf('')).toBe('');
      expect(MaskUtils.formatCpf(null as any)).toBe('');
    });
  });

  describe('formatCnpj', () => {
    it('should format 14 digits as CNPJ', () => {
      expect(MaskUtils.formatCnpj('12345678000195')).toBe('12.345.678/0001-95');
    });

    it('should format partial digits correctly', () => {
      expect(MaskUtils.formatCnpj('12')).toBe('12');
      expect(MaskUtils.formatCnpj('123')).toBe('12.3');
      expect(MaskUtils.formatCnpj('123456')).toBe('12.345.6');
      expect(MaskUtils.formatCnpj('123456789')).toBe('12.345.678/9');
    });

    it('should return empty string if empty or null', () => {
      expect(MaskUtils.formatCnpj('')).toBe('');
      expect(MaskUtils.formatCnpj(null as any)).toBe('');
    });
  });

  describe('formatPhone', () => {
    it('should format 11 digits as mobile phone', () => {
      expect(MaskUtils.formatPhone('47999996607')).toBe('(47) 99999-6607');
    });

    it('should format 10 digits as landline phone', () => {
      expect(MaskUtils.formatPhone('4733334444')).toBe('(47) 3333-4444');
    });

    it('should format partial digits correctly', () => {
      expect(MaskUtils.formatPhone('47')).toBe('(47');
      expect(MaskUtils.formatPhone('47999')).toBe('(47) 999');
    });

    it('should return empty string if empty or null', () => {
      expect(MaskUtils.formatPhone('')).toBe('');
      expect(MaskUtils.formatPhone(null as any)).toBe('');
    });
  });

  describe('formatCep', () => {
    it('should format 8 digits as CEP', () => {
      expect(MaskUtils.formatCep('89010000')).toBe('89010-000');
    });

    it('should format partial digits correctly', () => {
      expect(MaskUtils.formatCep('89010')).toBe('89010');
      expect(MaskUtils.formatCep('890101')).toBe('89010-1');
    });

    it('should return empty string if empty or null', () => {
      expect(MaskUtils.formatCep('')).toBe('');
      expect(MaskUtils.formatCep(null as any)).toBe('');
    });
  });
});

import { WhatsAppUtils } from './whatsapp-utils';

describe('WhatsAppUtils', () => {
  it('deve retornar string vazia para telefone nulo ou vazio', () => {
    expect(WhatsAppUtils.getWhatsAppUrl(null)).toBe('');
    expect(WhatsAppUtils.getWhatsAppUrl(undefined)).toBe('');
    expect(WhatsAppUtils.getWhatsAppUrl('')).toBe('');
  });

  it('deve adicionar DDI 55 para telefone brasileiro de 11 dígitos', () => {
    const url = WhatsAppUtils.getWhatsAppUrl('47999466073');
    expect(url).toContain('https://wa.me/5547999466073');
  });

  it('deve limpar pontuações e formatar mensagem codificada', () => {
    const url = WhatsAppUtils.getWhatsAppUrl('(47) 99946-6073', 'Olá, tudo bem?');
    expect(url).toBe('https://wa.me/5547999466073?text=Ol%C3%A1%2C%20tudo%20bem%3F');
  });
});

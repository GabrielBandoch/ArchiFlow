export class WhatsAppUtils {
  static getWhatsAppUrl(telefone: string | null | undefined, mensagem?: string): string {
    if (!telefone) return '';
    const limpo = telefone.replace(/\D/g, '');
    if (!limpo) return '';
    const ddi = limpo.length === 10 || limpo.length === 11 ? `55${limpo}` : limpo;
    const texto = mensagem ? encodeURIComponent(mensagem) : encodeURIComponent('Olá! Entro em contato através do ArchiFlow.');
    return `https://wa.me/${ddi}?text=${texto}`;
  }

  static abrirWhatsApp(telefone: string | null | undefined, mensagem?: string, event?: Event): void {
    event?.stopPropagation();
    const url = this.getWhatsAppUrl(telefone, mensagem);
    if (url && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}

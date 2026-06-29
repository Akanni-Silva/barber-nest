// src/auth/services/email.service.ts
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as emailjs from '@emailjs/nodejs';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private isInitialized = false;

  constructor() {
    try {
      const publicKey = process.env.EMAILJS_PUBLIC_KEY;
      const privateKey = process.env.EMAILJS_PRIVATE_KEY;

      if (!publicKey || !privateKey) {
        this.logger.warn('EmailJS credentials not found');
        return;
      }

      emailjs.init({
        publicKey,
        privateKey,
      });

      this.isInitialized = true;
    } catch (error) {
      this.isInitialized = false;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    name: string,
  ): Promise<void> {
    // ✅ Verificar se o serviço está inicializado
    if (!this.isInitialized) {
      throw new InternalServerErrorException(
        'Serviço de email não disponível. Tente novamente mais tarde.',
      );
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;

    if (!serviceId || !templateId) {
      throw new InternalServerErrorException(
        'Configuração de email incompleta. Contate o suporte.',
      );
    }

    try {
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

      await emailjs.send(serviceId, templateId, {
        to_email: email,
        to_name: name,
        reset_link: resetLink,
        name: name,
      });

      // ✅ Log de sucesso sem expor dados
      this.logger.log(`Email de recuperação enviado para ${email}`);
    } catch (error) {
      // ✅ Log simplificado sem expor o objeto de erro
      this.logger.error(`Falha ao enviar email para ${email}`);

      // ✅ Erros específicos do EmailJS
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if (status === 403) {
          throw new InternalServerErrorException(
            'Serviço de email não autorizado.',
          );
        }
        if (status === 404) {
          throw new InternalServerErrorException(
            'Template de email não encontrado.',
          );
        }
      }

      throw new InternalServerErrorException(
        'Erro ao enviar email de recuperação. Tente novamente mais tarde.',
      );
    }
  }
}

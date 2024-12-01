import { env } from '@repo/env';
import type {
  VercelDomainConfig,
  VercelDomainInfo,
  VercelDomainResponse,
} from './types';

export class VercelDomainService {
  private readonly headers = {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    Authorization: `Bearer ${env.VERCEL_API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  private isWebDomain(domain: string): boolean {
    return domain === env.NEXT_PUBLIC_WEB_URL.replace(/^https?:\/\//, '');
  }

  async addDomain(domain: string): Promise<VercelDomainResponse> {
    if (this.isWebDomain(domain)) {
      throw new Error('Cannot add web URL domain');
    }

    try {
      const response = await fetch(
        `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains?teamId=${env.VERCEL_TEAM_ID}`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({ name: domain }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add domain to Vercel');
      }

      return response.json();
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Error adding domain to Vercel:', error);
      throw new Error('Failed to add domain to Vercel');
    }
  }

  async verifyDomain(domain: string): Promise<VercelDomainInfo> {
    try {
      const response = await fetch(
        `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains/${domain}/verify?teamId=${env.VERCEL_TEAM_ID}`,
        {
          method: 'POST',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to verify domain');
      }

      const verificationResponse: VercelDomainInfo = await response.json();
      return verificationResponse;
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Error verifying domain:', error);
      throw new Error('Failed to verify domain');
    }
  }

  async getDomainConfiguration(domain: string): Promise<VercelDomainResponse> {
    try {
      const [configResponse, domainResponse] = await Promise.all([
        fetch(
          `${env.VERCEL_API_URL}/v6/domains/${domain}/config?teamId=${env.VERCEL_TEAM_ID}`,
          {
            method: 'GET',
            headers: this.headers,
          }
        ),
        fetch(
          `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains/${domain}?teamId=${env.VERCEL_TEAM_ID}`,
          {
            method: 'GET',
            headers: this.headers,
          }
        ),
      ]);

      if (!configResponse.ok || !domainResponse.ok) {
        throw new Error('Failed to get domain configuration');
      }

      const [config, info]: [VercelDomainConfig, VercelDomainInfo] =
        await Promise.all([configResponse.json(), domainResponse.json()]);

      /**
       * If domain is not verified, we try to verify now
       */
      let verificationResponse: VercelDomainInfo | null = null;
      if (!info.verified) {
        verificationResponse = await this.verifyDomain(domain);
      }

      if (verificationResponse?.verified) {
        /**
         * Domain was just verified
         */
        return {
          configured: !config.misconfigured,
          config,
          info: verificationResponse,
        };
      }

      return {
        configured: !config.misconfigured,
        config,
        info,
      };
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Error getting domain configuration:', error);
      throw new Error('Failed to get domain configuration');
    }
  }

  async removeDomain(domain: string): Promise<void> {
    if (this.isWebDomain(domain)) {
      throw new Error('Cannot remove web URL domain');
    }

    try {
      const response = await fetch(
        `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains/${domain}`,
        {
          method: 'DELETE',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove domain');
      }
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Error removing domain:', error);
      throw new Error('Failed to remove domain');
    }
  }
}

export const vercelDomainService = new VercelDomainService();

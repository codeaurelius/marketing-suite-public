import { env } from '@repo/env';

export interface VercelDomainResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string | null;
  redirectStatusCode?: number | null;
  gitBranch?: string | null;
  updatedAt?: number;
  createdAt?: number;
  verified: boolean;
  verification?: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}

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

  async verifyDomain(domain: string): Promise<VercelDomainResponse> {
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

      return response.json();
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Error verifying domain:', error);
      throw new Error('Failed to verify domain');
    }
  }

  async getDomainConfiguration(domain: string): Promise<any> {
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

      const configJson = await configResponse.json();
      const domainJson = await domainResponse.json();
      if (domainResponse.status !== 200) {
        return domainJson;
      }

      // TODO: check if verified. if not, do verification
      // biome-ignore lint/suspicious/noEvolvingTypes: <explanation>
      let verificationResponse = null;
      if (!domainJson.verified) {
        verificationResponse = await this.verifyDomain(domain);
      }

      if (verificationResponse?.verified) {
        return {
          configured: !configJson.misconfigured,
          ...verificationResponse,
        };
      }

      return {
        configured: !configJson.misconfigured,
        ...(verificationResponse ? { verificationResponse } : {}),
        ...configJson,
        ...domainJson,
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

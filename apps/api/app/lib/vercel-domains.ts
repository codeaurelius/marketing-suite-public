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

  async addDomain(domain: string): Promise<VercelDomainResponse> {
    try {
      const response = await fetch(
        `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains`,
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
        `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains/${domain}/verify`,
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

  async getDomainConfiguration(domain: string): Promise<VercelDomainResponse> {
    try {
      const response = await fetch(
        `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains/${domain}`,
        {
          method: 'GET',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get domain configuration');
      }

      return response.json();
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Error getting domain configuration:', error);
      throw new Error('Failed to get domain configuration');
    }
  }

  async removeDomain(domain: string): Promise<void> {
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

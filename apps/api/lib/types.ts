export interface DomainVerificationChallenge {
  type: string;
  domain: string;
  value: string;
  reason: string;
}

export interface VercelDomainConfig {
  acceptedChallenges: string[];
  configuredBy: string | null;
  misconfigured: boolean;
}

export interface VercelDomainInfo {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string | null;
  redirectStatusCode?: number | null;
  gitBranch?: string | null;
  updatedAt?: number;
  createdAt?: number;
  verified: boolean;
  verification?: DomainVerificationChallenge[];
}

export interface VercelDomainResponse {
  config: VercelDomainConfig;
  info: VercelDomainInfo;
  configured: boolean;
}

export interface VercelVerificationResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect: string | null;
  redirectStatusCode: number | null;
  gitBranch: string | null;
  updatedAt: number;
  createdAt: number;
  verified: boolean;
  verification?: DomainVerificationChallenge[];
}

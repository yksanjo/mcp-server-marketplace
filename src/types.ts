// Types for MCP Marketplace

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  repository?: string;
  category: string;
  tags: string[];
  protocol: 'stdio' | 'http' | 'websocket';
  configSchema?: Record<string, unknown>;
  dependencies?: string[];
  securityAudit?: SecurityAudit;
  usageStats?: UsageStats;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityAudit {
  auditedAt: string;
  auditor: string;
  vulnerabilities: Vulnerability[];
  score: number;
}

export interface Vulnerability {
  severity: 'critical' | 'high' | 'medium' | 'low';
  cve?: string;
  description: string;
  fixedIn?: string;
}

export interface UsageStats {
  installs: number;
  ratings: number;
  avgRating: number;
  lastUpdated: string;
}

export interface MCPConnection {
  serverId: string;
  config: Record<string, unknown>;
  status: 'active' | 'inactive' | 'error';
  lastUsed?: string;
}

export interface MCPMarketplaceOptions {
  category?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'popularity' | 'rating' | 'newest';
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface MarketplaceServer extends MCPServer {
  downloadCount: number;
  trending: boolean;
  verified: boolean;
  compatibility: string[];
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  serverCount: number;
}

export interface SearchResult {
  servers: MarketplaceServer[];
  total: number;
  page: number;
  pageSize: number;
  facets: SearchFacets;
}

export interface SearchFacets {
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
  protocols: { name: string; count: number }[];
}

export interface InstallOptions {
  version?: string;
  config?: Record<string, unknown>;
  global?: boolean;
  [key: string]: unknown;
}

export interface InstallResult {
  success: boolean;
  path?: string;
  error?: string;
}

export interface DependencyInfo {
  name: string;
  version: string;
  required: boolean;
  installed?: boolean;
}

export interface DependencyResolution {
  resolved: DependencyInfo[];
  conflicts: string[];
  warnings: string[];
}

export interface VersionInfo {
  version: string;
  releaseDate: string;
  changelog: string;
  breaking: boolean;
  downloads: number;
}

export interface ServerHealth {
  serverId: string;
  healthy: boolean;
  lastChecked: string;
  latency?: number;
  error?: string;
}

export interface MarketplaceConfig {
  registryUrl?: string;
  cacheDir?: string;
  autoUpdate?: boolean;
  verifySignatures?: boolean;
}

export interface Logger {
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
}

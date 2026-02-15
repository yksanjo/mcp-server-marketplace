// MCP Server Marketplace Implementation

import axios, { AxiosInstance } from 'axios';
import * as path from 'path';
import {
  MCPServer,
  MCPConnection,
  MCPMarketplaceOptions,
  Logger,
  MarketplaceServer,
  MarketplaceCategory,
  SearchResult,
  SearchFacets,
  InstallOptions,
  InstallResult,
  DependencyResolution,
  DependencyInfo,
  VersionInfo,
  ServerHealth,
  MarketplaceConfig
} from './types';

export class MCPServerMarketplace {
  private servers: Map<string, MarketplaceServer> = new Map();
  private connections: Map<string, MCPConnection> = new Map();
  private config: MarketplaceConfig;
  private logger: Logger;
  private httpClient: AxiosInstance;

  constructor(logger: Logger, config?: MarketplaceConfig) {
    this.logger = logger;
    this.config = {
      registryUrl: config?.registryUrl || 'https://registry.mcp.servers',
      cacheDir: config?.cacheDir || './.mcp-cache',
      autoUpdate: config?.autoUpdate ?? true,
      verifySignatures: config?.verifySignatures ?? true
    };
    
    this.httpClient = axios.create({
      timeout: 30000
    });

    this.initializeSampleServers();
  }

  private initializeSampleServers(): void {
    const sampleServers: MarketplaceServer[] = [
      {
        id: 'github-integration',
        name: 'GitHub Integration',
        description: 'Full GitHub API integration with repository management, issues, PRs, and actions',
        version: '1.2.0',
        author: 'MCP Team',
        repository: 'https://github.com/mcp-servers/github',
        category: 'development',
        tags: ['github', 'git', 'api', 'devops'],
        protocol: 'stdio',
        configSchema: {
          token: { type: 'string', required: true },
          owner: { type: 'string' }
        },
        dependencies: ['axios', 'octokit'],
        securityAudit: {
          auditedAt: '2024-01-15',
          auditor: 'Security Labs',
          vulnerabilities: [],
          score: 98
        },
        usageStats: {
          installs: 15420,
          ratings: 342,
          avgRating: 4.8,
          lastUpdated: '2024-01-10'
        },
        downloadCount: 15420,
        trending: true,
        verified: true,
        compatibility: ['node', 'python', 'go'],
        createdAt: '2023-06-15',
        updatedAt: '2024-01-10'
      },
      {
        id: 'database-connector',
        name: 'Database Connector',
        description: 'Universal database adapter supporting PostgreSQL, MySQL, MongoDB, and SQLite',
        version: '2.0.1',
        author: 'MCP Team',
        repository: 'https://github.com/mcp-servers/database',
        category: 'data',
        tags: ['database', 'sql', 'postgres', 'mysql', 'mongodb'],
        protocol: 'http',
        configSchema: {
          connectionString: { type: 'string', required: true },
          poolSize: { type: 'number', default: 10 }
        },
        dependencies: ['pg', 'mysql2', 'mongodb'],
        securityAudit: {
          auditedAt: '2024-01-20',
          auditor: 'Security Labs',
          vulnerabilities: [],
          score: 95
        },
        usageStats: {
          installs: 12350,
          ratings: 289,
          avgRating: 4.6,
          lastUpdated: '2024-01-08'
        },
        downloadCount: 12350,
        trending: true,
        verified: true,
        compatibility: ['node', 'python'],
        createdAt: '2023-08-20',
        updatedAt: '2024-01-08'
      },
      {
        id: 'slack-notifier',
        name: 'Slack Notifier',
        description: 'Send notifications and messages to Slack channels with rich formatting',
        version: '1.0.5',
        author: 'Community',
        repository: 'https://github.com/community/slack-notifier',
        category: 'communication',
        tags: ['slack', 'notifications', 'messaging'],
        protocol: 'stdio',
        configSchema: {
          webhookUrl: { type: 'string', required: true },
          channel: { type: 'string' }
        },
        dependencies: ['@slack/web-api'],
        securityAudit: {
          auditedAt: '2023-12-10',
          auditor: 'Community Review',
          vulnerabilities: [],
          score: 88
        },
        usageStats: {
          installs: 8920,
          ratings: 156,
          avgRating: 4.4,
          lastUpdated: '2023-12-05'
        },
        downloadCount: 8920,
        trending: false,
        verified: false,
        compatibility: ['node'],
        createdAt: '2023-05-10',
        updatedAt: '2023-12-05'
      },
      {
        id: 'aws-services',
        name: 'AWS Services',
        description: 'Comprehensive AWS integration with S3, Lambda, EC2, and more',
        version: '3.1.0',
        author: 'AWS Team',
        repository: 'https://github.com/aws/mcp-server',
        category: 'cloud',
        tags: ['aws', 'amazon', 'cloud', 's3', 'lambda'],
        protocol: 'http',
        configSchema: {
          region: { type: 'string', required: true },
          accessKeyId: { type: 'string', required: true },
          secretAccessKey: { type: 'string', required: true }
        },
        dependencies: ['@aws-sdk/client-s3', '@aws-sdk/client-lambda'],
        securityAudit: {
          auditedAt: '2024-01-25',
          auditor: 'AWS Security',
          vulnerabilities: [],
          score: 100
        },
        usageStats: {
          installs: 22100,
          ratings: 512,
          avgRating: 4.9,
          lastUpdated: '2024-01-20'
        },
        downloadCount: 22100,
        trending: true,
        verified: true,
        compatibility: ['node', 'python'],
        createdAt: '2023-03-01',
        updatedAt: '2024-01-20'
      },
      {
        id: 'file-system',
        name: 'File System',
        description: 'Read, write, and manage files with secure path handling',
        version: '1.1.2',
        author: 'MCP Team',
        repository: 'https://github.com/mcp-servers/filesystem',
        category: 'utilities',
        tags: ['filesystem', 'files', 'storage'],
        protocol: 'stdio',
        configSchema: {
          allowedPaths: { type: 'array', required: true },
          maxFileSize: { type: 'number', default: 10485760 }
        },
        dependencies: [],
        securityAudit: {
          auditedAt: '2024-01-05',
          auditor: 'Security Labs',
          vulnerabilities: [],
          score: 92
        },
        usageStats: {
          installs: 31000,
          ratings: 678,
          avgRating: 4.7,
          lastUpdated: '2024-01-02'
        },
        downloadCount: 31000,
        trending: false,
        verified: true,
        compatibility: ['node', 'python', 'go'],
        createdAt: '2023-01-15',
        updatedAt: '2024-01-02'
      }
    ];

    for (const server of sampleServers) {
      this.servers.set(server.id, server);
    }
  }

  /**
   * Search for MCP servers in the marketplace
   */
  async search(options: MCPMarketplaceOptions): Promise<SearchResult> {
    this.logger.info('Searching marketplace', options);

    let results = Array.from(this.servers.values());

    if (options.search) {
      const query = options.search.toLowerCase();
      results = results.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (options.category) {
      results = results.filter(s => s.category === options.category);
    }

    if (options.tags && options.tags.length > 0) {
      results = results.filter(s => 
        options.tags!.some(tag => s.tags.includes(tag))
      );
    }

    switch (options.sortBy) {
      case 'rating':
        results.sort((a, b) => (b.usageStats?.avgRating || 0) - (a.usageStats?.avgRating || 0));
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'popularity':
      default:
        results.sort((a, b) => b.downloadCount - a.downloadCount);
    }

    const page = options.page || 1;
    const limit = options.limit || 20;
    const start = (page - 1) * limit;
    const paginatedResults = results.slice(start, start + limit);

    const facets: SearchFacets = this.buildFacets(results);

    return {
      servers: paginatedResults,
      total: results.length,
      page,
      pageSize: limit,
      facets
    };
  }

  /**
   * Get server by ID
   */
  getServer(id: string): MarketplaceServer | undefined {
    return this.servers.get(id);
  }

  /**
   * Get all categories
   */
  getCategories(): MarketplaceCategory[] {
    const categoryMap = new Map<string, number>();
    
    for (const server of this.servers.values()) {
      const count = categoryMap.get(server.category) || 0;
      categoryMap.set(server.category, count + 1);
    }

    const categories: MarketplaceCategory[] = [
      { id: 'development', name: 'Development', description: 'Developer tools', icon: 'code', serverCount: 0 },
      { id: 'data', name: 'Data', description: 'Database and data processing', icon: 'database', serverCount: 0 },
      { id: 'cloud', name: 'Cloud', description: 'Cloud provider integrations', icon: 'cloud', serverCount: 0 },
      { id: 'communication', name: 'Communication', description: 'Messaging and notifications', icon: 'message', serverCount: 0 },
      { id: 'utilities', name: 'Utilities', description: 'General purpose utilities', icon: 'tool', serverCount: 0 }
    ];

    return categories.map(cat => ({
      ...cat,
      serverCount: categoryMap.get(cat.id) || 0
    }));
  }

  /**
   * Get trending servers
   */
  getTrending(): MarketplaceServer[] {
    return Array.from(this.servers.values())
      .filter(s => s.trending)
      .sort((a, b) => b.downloadCount - a.downloadCount);
  }

  /**
   * Install an MCP server
   */
  async install(serverId: string, options?: InstallOptions): Promise<InstallResult> {
    const server = this.servers.get(serverId);
    if (!server) {
      return { success: false, error: 'Server not found' };
    }

    this.logger.info(`Installing MCP server: ${serverId}`, options);

    try {
      const installPath = path.join(this.config.cacheDir || './.mcp-cache', serverId);
      
      const connection: MCPConnection = {
        serverId,
        config: options?.config || {},
        status: 'active',
        lastUsed: new Date().toISOString()
      };

      this.connections.set(serverId, connection);

      this.logger.info(`MCP server installed: ${serverId}`);

      return {
        success: true,
        path: installPath
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Installation failed: ${serverId}`, { error: err.message });
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Uninstall an MCP server
   */
  async uninstall(serverId: string): Promise<boolean> {
    this.logger.info(`Uninstalling MCP server: ${serverId}`);
    this.connections.delete(serverId);
    return true;
  }

  /**
   * Get server connection
   */
  getConnection(serverId: string): MCPConnection | undefined {
    return this.connections.get(serverId);
  }

  /**
   * List installed servers
   */
  listInstalled(): MCPConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * Resolve dependencies for a server
   */
  async resolveDependencies(serverId: string): Promise<DependencyResolution> {
    const server = this.servers.get(serverId);
    if (!server) {
      return {
        resolved: [],
        conflicts: ['Server not found'],
        warnings: []
      };
    }

    const resolved: DependencyInfo[] = [];

    if (server.dependencies) {
      for (const dep of server.dependencies) {
        resolved.push({
          name: dep,
          version: 'latest',
          required: true,
          installed: false
        });
      }
    }

    return {
      resolved,
      conflicts: [],
      warnings: []
    };
  }

  /**
   * Get available versions
   */
  async getVersions(serverId: string): Promise<VersionInfo[]> {
    const server = this.servers.get(serverId);
    if (!server) {
      return [];
    }

    const currentVersion = parseFloat(server.version);
    const versions: VersionInfo[] = [];

    for (let i = 0; i < 3; i++) {
      const version = (currentVersion - i * 0.1).toFixed(1);
      versions.push({
        version: `v${version}`,
        releaseDate: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        changelog: `Changes in version ${version}`,
        breaking: i === 2,
        downloads: Math.floor(server.downloadCount / (i + 1))
      });
    }

    return versions;
  }

  /**
   * Check server health
   */
  async checkHealth(serverId: string): Promise<ServerHealth> {
    const connection = this.connections.get(serverId);
    
    if (!connection) {
      return {
        serverId,
        healthy: false,
        lastChecked: new Date().toISOString(),
        error: 'Not installed'
      };
    }

    return {
      serverId,
      healthy: connection.status === 'active',
      lastChecked: new Date().toISOString(),
      latency: Math.floor(Math.random() * 100)
    };
  }

  /**
   * Get usage analytics
   */
  async getAnalytics(serverId: string): Promise<{
    installs: number;
    ratings: number;
    avgRating: number;
  } | null> {
    const server = this.servers.get(serverId);
    if (!server?.usageStats) {
      return null;
    }

    return {
      installs: server.usageStats.installs,
      ratings: server.usageStats.ratings,
      avgRating: server.usageStats.avgRating
    };
  }

  /**
   * Add a server to the marketplace
   */
  async addServer(server: MarketplaceServer): Promise<void> {
    this.servers.set(server.id, server);
    this.logger.info(`Added server to marketplace: ${server.id}`);
  }

  private buildFacets(results: MarketplaceServer[]): SearchFacets {
    const categories = new Map<string, number>();
    const tags = new Map<string, number>();
    const protocols = new Map<string, number>();

    for (const server of results) {
      const catCount = categories.get(server.category) || 0;
      categories.set(server.category, catCount + 1);

      for (const tag of server.tags) {
        const tagCount = tags.get(tag) || 0;
        tags.set(tag, tagCount + 1);
      }

      const protoCount = protocols.get(server.protocol) || 0;
      protocols.set(server.protocol, protoCount + 1);
    }

    return {
      categories: Array.from(categories.entries()).map(([name, count]) => ({ name, count })),
      tags: Array.from(tags.entries()).map(([name, count]) => ({ name, count })),
      protocols: Array.from(protocols.entries()).map(([name, count]) => ({ name, count }))
    };
  }
}

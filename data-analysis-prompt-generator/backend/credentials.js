/**
 * 读取本地 MCP 配置中的 Confluence 凭据。
 * 优先从用户主目录下的 .kimi/mcp.json 读取，避免将 token 写入项目文件。
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

function loadConfluenceCredentials() {
  const mcpPath = path.join(os.homedir(), '.kimi', 'mcp.json');

  if (!fs.existsSync(mcpPath)) {
    throw new Error(`找不到 MCP 配置文件：${mcpPath}`);
  }

  const mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
  const atlassian = mcpConfig?.mcpServers?.atlassian;

  if (!atlassian || !atlassian.env) {
    throw new Error('MCP 配置中缺少 atlassian 服务器配置');
  }

  const { CONFLUENCE_URL, CONFLUENCE_PERSONAL_TOKEN, CONFLUENCE_USERNAME } = atlassian.env;

  if (!CONFLUENCE_URL || !CONFLUENCE_PERSONAL_TOKEN || !CONFLUENCE_USERNAME) {
    throw new Error('MCP 配置中缺少 Confluence 凭据');
  }

  return {
    baseUrl: CONFLUENCE_URL.replace(/\/$/, ''),
    token: CONFLUENCE_PERSONAL_TOKEN,
    username: CONFLUENCE_USERNAME
  };
}

module.exports = { loadConfluenceCredentials };

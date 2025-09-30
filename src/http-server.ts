#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.all('/sse', async (req, res) => {
  const transport = new SSEServerTransport('/sse', res);
  const server = new Server({ name: 'mcp-abap-adt', version: '1.1.0' }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      { name: 'GetProgram', description: 'Retrieve ABAP program source code', inputSchema: { type: 'object', properties: { program_name: { type: 'string' }, sap_url: { type: 'string' }, sap_username: { type: 'string' }, sap_password: { type: 'string' }, sap_client: { type: 'string' } }, required: ['program_name', 'sap_url', 'sap_username', 'sap_password', 'sap_client'] } }
    ]
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return { content: [{ type: 'text', text: 'Tool executed successfully' }] };
  });

  await server.connect(transport);
});

app.listen(PORT, () => {
  console.log(`MCP ABAP ADT HTTP Server running on port ${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
});

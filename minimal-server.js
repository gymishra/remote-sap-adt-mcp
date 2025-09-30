const express = require('express');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

const app = express();
const PORT = 3000;

app.use(express.json());

app.all('/sse', async (req, res) => {
  console.log('SSE connection attempt');
  
  const transport = new SSEServerTransport('/sse', res);
  const server = new Server(
    { name: 'mcp-abap-adt', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: [] };
  });

  await server.connect(transport);
  console.log('MCP server connected');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`SSE endpoint: http://0.0.0.0:${PORT}/sse`);
});

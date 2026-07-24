import express from 'express';
import { evaluateRisk } from '@mirrorai/risk-engine';
import type { AnalyzeRequest } from '@mirrorai/shared';
import { buildAnalysisInput, buildAnalysisResponse } from './analysis.js';

const app = express();
app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/v1/analyze', (req, res) => {
  const body = req.body as Partial<AnalyzeRequest> | undefined;
  const text = typeof body?.text === 'string' ? body.text : '';
  const url = typeof body?.url === 'string' ? body.url : undefined;

  if (!text.trim()) {
    return res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: 'Field "text" must be a non-empty string.'
      }
    });
  }

  const analysisInput = url ? buildAnalysisInput({ text, url }) : buildAnalysisInput({ text });
  const assessment = evaluateRisk(analysisInput);
  const response = buildAnalysisResponse(assessment);

  return res.status(200).json(response);
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`MirrorAI API listening on port ${port}`);
});

import * as ai from '../services/aiService.js';

export const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    service: 'debate-coach-api',
    mode: ai.getMode(),
    timestamp: new Date().toISOString(),
  });
};

export const generate = async (req, res, next) => {
  try {
    const result = await ai.generateDebate(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const challenge = async (req, res, next) => {
  try {
    const result = await ai.generateChallenge(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const evaluate = async (req, res, next) => {
  try {
    const result = await ai.evaluateResponse(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const complete = async (req, res, next) => {
  try {
    const result = await ai.completeDebate(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

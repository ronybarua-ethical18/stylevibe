import express, { Router } from 'express';

// Create a factory function to generate new router instances
export const createRouter = (): Router => {
  return express.Router();
};


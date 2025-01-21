import dotenv from 'dotenv';

dotenv.config();

export function getEnvVar(varName, defaultVar) {
  const value = process.env[varName];

  if (value) {
    return value;
  }

  if (defaultVar) {
    return defaultVar;
  }

  throw new Error(`Missing: process.env['${varName}'].`);
}

import * as dotenv from "dotenv";

dotenv.config();

export function getRequired(envVar: string): string {
  const value = process.env[envVar];
  if (typeof value === "undefined") {
    throw new Error(`${envVar} should be set on the environment`);
  }
  return value;
}

export function getOptional(
  envVar: string,
  defaultValue?: string
): string | undefined {
  return process.env[envVar] ?? defaultValue;
}

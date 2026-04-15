import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const envFiles = [".env", ".env.local"];

for (const envFile of envFiles) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (!fs.existsSync(envPath)) {
    continue;
  }

  dotenv.config({
    path: envPath,
    override: envFile !== ".env",
  });
}

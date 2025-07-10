import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end("Method Not Allowed");

  const { code, image } = req.body;
  const filePath = join(process.cwd(), 'maps.json');

  let maps = [];
  if (existsSync(filePath)) {
    maps = JSON.parse(readFileSync(filePath, 'utf8'));
  }

  maps.push({ code, image });
  writeFileSync(filePath, JSON.stringify(maps, null, 2));
  res.status(200).json({ success: true });
}

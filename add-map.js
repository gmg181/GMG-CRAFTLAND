// /api/add-map.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { imgUrl, mapCode } = req.body;

  if (!imgUrl || !mapCode) {
    return res.status(400).json({ error: 'imgUrl and mapCode are required' });
  }

  const filePath = path.join(process.cwd(), 'public', 'maps.json');

  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const maps = JSON.parse(fileData);

    maps.push({ imgUrl, mapCode });

    fs.writeFileSync(filePath, JSON.stringify(maps, null, 2), 'utf8');

    res.status(200).json({ success: true, message: 'Map added successfully' });
  } catch (error) {
    console.error('Error updating maps.json:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

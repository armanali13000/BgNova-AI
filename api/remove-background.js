export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI background removal is not configured. Add REMOVE_BG_API_KEY in Vercel environment variables.',
    });
  }

  try {
    const { imageBase64 } = req.body || {};
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Missing imageBase64.' });
    }

    const base64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const formData = new FormData();
    formData.append('image_file', new Blob([buffer], { type: 'image/png' }), 'bgnova-image.png');
    formData.append('size', 'auto');
    formData.append('format', 'png');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const message = await response.text();
      return res.status(response.status).json({
        error: message || 'AI background removal failed.',
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(arrayBuffer).toString('base64');
    return res.status(200).json({
      imageBase64: `data:image/png;base64,${resultBase64}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Unexpected AI background removal error.',
    });
  }
}

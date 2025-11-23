import pool from './db.js';
import { isValidUrl, isValidCode, generateCode } from './utils.js';

export function setupRoutes(app) {
  
  // Health check endpoint
  app.get('/healthz', (req, res) => {
    res.status(200).json({ ok: true, version: '1.0' });
  });

  // Create a new short link
  app.post('/api/links', async (req, res) => {
    try {
      const { target_url, code: customCode } = req.body;

      // Validate target URL
      if (!target_url || !isValidUrl(target_url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      // Generate or validate custom code
      let code = customCode;
      if (code) {
        if (!isValidCode(code)) {
          return res.status(400).json({ error: 'Code must be 6-8 alphanumeric characters' });
        }
      } else {
        // Generate a unique code
        code = generateCode();
        let attempts = 0;
        while (attempts < 10) {
          const existing = await pool.query('SELECT id FROM links WHERE code = $1', [code]);
          if (existing.rows.length === 0) break;
          code = generateCode();
          attempts++;
        }
      }

      // Try to insert
      const result = await pool.query(
        'INSERT INTO links (code, target_url) VALUES ($1, $2) RETURNING *',
        [code, target_url]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Code already exists' });
      }
      console.error('Error creating link:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get all links
  app.get('/api/links', async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM links ORDER BY created_at DESC'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching links:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get stats for a specific code
  app.get('/api/links/:code', async (req, res) => {
    try {
      const { code } = req.params;
      const result = await pool.query(
        'SELECT * FROM links WHERE code = $1',
        [code]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Link not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching link:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete a link
  app.delete('/api/links/:code', async (req, res) => {
    try {
      const { code } = req.params;
      const result = await pool.query(
        'DELETE FROM links WHERE code = $1 RETURNING *',
        [code]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Link not found' });
      }

      res.json({ message: 'Link deleted successfully' });
    } catch (error) {
      console.error('Error deleting link:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Redirect endpoint (must be last to avoid catching other routes)
  app.get('/:code', async (req, res) => {
    try {
      const { code } = req.params;

      // Check if it's a valid code format
      if (!isValidCode(code)) {
        return res.status(404).json({ error: 'Link not found' });
      }

      // Get the link and increment click count
      const result = await pool.query(
        'UPDATE links SET total_clicks = total_clicks + 1, last_clicked_at = NOW() WHERE code = $1 RETURNING target_url',
        [code]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Link not found' });
      }

      // Perform 302 redirect
      res.redirect(302, result.rows[0].target_url);
    } catch (error) {
      console.error('Error redirecting:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
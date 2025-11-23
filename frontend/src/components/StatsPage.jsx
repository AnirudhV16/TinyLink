import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

function StatsPage() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinkStats();
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/links/${code}`);
      
      if (response.status === 404) {
        setError('Link not found');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch link stats');
      
      const data = await response.json();
      setLink(data);
      setError('');
    } catch (err) {
      setError('Failed to load link statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const url = `${BASE_URL}/${code}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Copied to clipboard!');
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="stats-page">
          <div className="alert alert-error">{error}</div>
          <Link to="/" className="btn">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="stats-page">
        <div className="breadcrumb">
          <Link to="/">← Back to Dashboard</Link>
        </div>

        <div className="stats-card">
          <h2>Link Statistics</h2>

          <div className="stats-grid">
            <div className="stat-item">
              <label>Short Code</label>
              <div className="stat-value code-value">{link.code}</div>
            </div>

            <div className="stat-item full-width">
              <label>Short URL</label>
              <div className="short-url-box">
                <code>{BASE_URL}/{link.code}</code>
                <button 
                  className="btn btn-small"
                  onClick={copyToClipboard}
                >
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="stat-item full-width">
              <label>Target URL</label>
              <a 
                href={link.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="target-url-value"
              >
                {link.target_url}
              </a>
            </div>

            <div className="stat-item">
              <label>Total Clicks</label>
              <div className="stat-value">{link.total_clicks}</div>
            </div>

            <div className="stat-item">
              <label>Created At</label>
              <div className="stat-value">
                {new Date(link.created_at).toLocaleString()}
              </div>
            </div>

            <div className="stat-item full-width">
              <label>Last Clicked</label>
              <div className="stat-value">
                {link.last_clicked_at 
                  ? new Date(link.last_clicked_at).toLocaleString()
                  : 'Never clicked yet'
                }
              </div>
            </div>
          </div>

          <div className="stats-footer">
            <a 
              href={`${BASE_URL}/${link.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              🔗 Visit Short Link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
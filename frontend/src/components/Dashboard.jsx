import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/links`);
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data);
      setError('');
    } catch (err) {
      setError('Failed to load links. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    // Validation
    if (!targetUrl.trim()) {
      setFormError('Please enter a URL');
      return;
    }

    try {
      new URL(targetUrl);
    } catch {
      setFormError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    if (customCode && !/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
      setFormError('Custom code must be 6-8 alphanumeric characters');
      return;
    }

    setFormLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_url: targetUrl,
          code: customCode || undefined
        })
      });

      const data = await response.json();

      if (response.status === 409) {
        setFormError('This code already exists. Please choose another.');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create link');
      }

      setSuccessMessage(`Link created successfully! Code: ${data.code}`);
      setTargetUrl('');
      setCustomCode('');
      fetchLinks();
      
      setTimeout(() => {
        setSuccessMessage('');
        setShowForm(false);
      }, 3000);

    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!confirm(`Delete link "${code}"?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/links/${code}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete link');
      
      fetchLinks();
    } catch (err) {
      alert('Failed to delete link');
      console.error(err);
    }
  };

  const copyToClipboard = (code) => {
    const url = `${BASE_URL}/${code}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const filteredLinks = links.filter(link => 
    link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.target_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>My Links</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Link'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h3>Create New Short Link</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="targetUrl">Target URL *</label>
                <input
                  id="targetUrl"
                  type="text"
                  className="form-input"
                  placeholder="https://example.com/very/long/url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="customCode">Custom Code (optional)</label>
                <input
                  id="customCode"
                  type="text"
                  className="form-input"
                  placeholder="e.g., docs123 (6-8 characters)"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  disabled={formLoading}
                  maxLength={8}
                />
                <small className="form-hint">Leave blank to auto-generate</small>
              </div>

              {formError && <div className="alert alert-error">{formError}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={formLoading}
              >
                {formLoading ? 'Creating...' : 'Create Short Link'}
              </button>
            </form>
          </div>
        )}

        <div className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="Search by code or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <div className="loading">Loading links...</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && filteredLinks.length === 0 && (
          <div className="empty-state">
            <p>No links found.</p>
            <p>Create your first short link to get started!</p>
          </div>
        )}

        {!loading && filteredLinks.length > 0 && (
          <div className="table-container">
            <table className="links-table">
              <thead>
                <tr>
                  <th>Short Code</th>
                  <th>Target URL</th>
                  <th>Clicks</th>
                  <th>Last Clicked</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map(link => (
                  <tr key={link.id}>
                    <td>
                      <Link to={`/code/${link.code}`} className="code-link">
                        {link.code}
                      </Link>
                    </td>
                    <td>
                      <a 
                        href={link.target_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="target-url"
                        title={link.target_url}
                      >
                        {link.target_url.length > 50 
                          ? link.target_url.substring(0, 50) + '...'
                          : link.target_url
                        }
                      </a>
                    </td>
                    <td>{link.total_clicks}</td>
                    <td>
                      {link.last_clicked_at 
                        ? new Date(link.last_clicked_at).toLocaleString()
                        : 'Never'
                      }
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-small"
                          onClick={() => copyToClipboard(link.code)}
                          title="Copy short URL"
                        >
                          📋 Copy
                        </button>
                        <button 
                          className="btn btn-small btn-danger"
                          onClick={() => handleDelete(link.code)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
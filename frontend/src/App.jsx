import { useEffect, useState } from 'react';

const STORAGE_KEY = 'url-shortener-history';

function formatNow() {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
}

export default function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  async function handleSubmit(event) {
    event.preventDefault();
    const value = input.trim();

    if (!value) {
      setError('Enter a URL to shorten.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: value }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to shorten URL.');
      }

      setHistory((current) => [
        {
          id: crypto.randomUUID(),
          code: payload.code,
          originalUrl: payload.originalUrl,
          shortUrl: payload.shortUrl,
          createdAt: formatNow(),
        },
        ...current,
      ]);
      setInput('');
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Enter a valid URL, including http:// or https://.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyToClipboard(value) {
    await navigator.clipboard.writeText(value);
  }

  async function handleDelete(item) {
    setDeletingId(item.id);
    try {
      const response = await fetch(`/api/${item.code}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 404) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to delete short link.');
      }

      setHistory((current) => current.filter((historyItem) => historyItem.id !== item.id));
      setError('');
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Failed to delete short link.',
      );
    } finally {
      setDeletingId('');
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">URL Shortener</p>
        <h1>Shorten links with a clean, focused workflow.</h1>
        <p className="lede">
          Submit a long URL, get a short link instantly, and keep a local history
          of everything you generate.
        </p>

        <form className="shorten-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="long-url">
            Long URL
          </label>
          <input
            id="long-url"
            type="url"
            placeholder="https://example.com/very/long/link"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Shortening...' : 'Shorten'}
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        <dl className="stats">
          <div>
            <dt>Generated</dt>
            <dd>{history.length}</dd>
          </div>
          <div>
            <dt>Storage</dt>
            <dd>Local only</dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Recent links</h2>
          <p>{history.length ? 'Copied or revisit any saved link.' : 'No links yet.'}</p>
        </div>

        <div className="history">
          {history.length ? (
            history.map((item) => (
              <article className="history-item" key={item.id}>
                <div>
                  <p className="label">Original</p>
                  <a href={item.originalUrl} target="_blank" rel="noreferrer">
                    {item.originalUrl}
                  </a>
                </div>
                <div className="history-row">
                  <div>
                    <p className="label">Short link</p>
                    <a href={item.shortUrl} target="_blank" rel="noreferrer">
                      {item.shortUrl}
                    </a>
                  </div>
                  <div className="history-actions">
                    <button type="button" onClick={() => copyToClipboard(item.shortUrl)}>
                      Copy
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
                <p className="meta">Created {item.createdAt}</p>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h3>Nothing here yet</h3>
              <p>Your first shortened link will appear in this panel.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { notesService } from '../services/api';

const NoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await notesService.getNote(id);
        setNote(data);
        setContent(data.content);
      } catch (err) {
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleSave = async () => {
    try {
      await notesService.updateNote(id, { ...note, content });
      setNote({ ...note, content });
      alert('Note updated!');
    } catch {
      alert('Failed to update note');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', padding: '2rem' }}>{error}</div>;
  if (!note) return <div style={{ padding: '2rem' }}>Note not found.</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '2rem' }}>
      <h2 style={{ marginTop: 0 }}>{note.title}</h2>
      <div style={{ marginBottom: '1rem', color: '#666', background: '#f5f5f5', borderRadius: '12px', padding: '0.25rem 0.5rem', display: 'inline-block' }}>{note.category}</div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={10}
        style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '1rem' }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button onClick={handleSave} style={{ padding: '0.75rem 1.5rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
      </div>
    </div>
  );
};

export default NoteDetail;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/posts', { title, content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Post</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  );
}

export default CreatePost;

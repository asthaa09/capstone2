import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PostList() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:5000/api/posts');
    setPosts(res.data);
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <div key={post._id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
          <h3>{post.title}</h3>
          <p>By: {post.author.username}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;

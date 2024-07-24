// import { Post } from '@/types/Post';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';

interface Post {
  id: number;
  title: string;
  content: string;
  coin: number;
  created_at: string;
  author?: string;
}
interface BoardItemProps {
  post: Post;
}

const BoardItem: React.FC<BoardItemProps> = ({ post }) => {
  const isAuthenticated = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [coin, setCoin] = useState(post.coin);
  const { user, signOut } = useAuth();

  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const res = await fetch('/api/board/deletePost', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: post.id }),
      });

      if (res.ok) {
        alert('게시글이 삭제되었습니다.');
        router.reload();
      } else {
        alert('본인이 작성한 게시글만 삭제할 수 있습니다.');
        console.error('Failed to delete the post');
      }
    }
  };

  const handleEdit = async () => {
    const res = await fetch('/api/board/updatePost', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: post.id, title, content, coin }),
    });

    if (res.ok) {
      alert('게시글이 수정되었습니다.');
      setIsEditing(false);
      router.reload();
    } else {
      alert('본인이 작성한 게시글만 수정할 수 있습니다.');
      console.error('Failed to update the post');
    }
  };
  interface User {
    nickname?: string;
    id: number;
    password: string;
    email: string;
    coin?: number;
    created_at?: string;
  }
  return (
    <div className='border p-4 mb-4'>
      {isEditing ? (
        <div>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border p-2 mb-2 w-full'
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='border p-2 mb-2 w-full'
          />
          <button
            onClick={handleEdit}
            className='bg-blue-500 text-white px-1 py-0.5 mr-2 text-sm rounded'
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className='bg-gray-500 text-white px-1 py-0.5 text-sm rounded'
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p className='text-sm text-gray-500'>
            <strong>Created at:</strong>
            {new Date(
              new Date(post.created_at).getTime()
            ).toLocaleString('ko-KR')}
          </p>
          <div className='flex justify-between items-center mt-2'>
            <div>
              <h2 className='text-l font-bold'>{post.title}</h2>
              <p className='text-m'>{post.content}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Nickname: {post.author}</p>
              <p>Coins: {coin}</p>
            </div>
          </div>
          {isAuthenticated && (
            <div className='flex justify-end mt-2'>
              <button
                onClick={() => setIsEditing(true)}
                className='bg-yellow-500 text-white px-1 py-0.5 mr-2 text-sm rounded'
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className='bg-red-500 text-white px-1 py-0.5 text-sm rounded'
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardItem;

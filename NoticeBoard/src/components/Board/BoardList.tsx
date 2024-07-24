import { useEffect, useState } from 'react';
import BoardItem from './BoardItem';
import Search from './Search';

interface Post {
  id: number;
  title: string;
  content: string;
  coin: number;
  created_at: string;
}

const BoardList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // 페이지 당 보여질 포스트 수
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/board?query=${encodeURIComponent(query)}`);
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // 페이지별 포스트 배열 계산
  const sortedPosts = posts.sort((a, b) =>
    a.coin === b.coin ? b.id - a.id : b.coin - a.coin
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 변경 함수
  const paginate = (pageNumber: number) => {
    if (pageNumber < 1) {
      pageNumber = 1;
    } else if (pageNumber > Math.ceil(posts.length / postsPerPage)) {
      pageNumber = Math.ceil(posts.length / postsPerPage);
    }
    setCurrentPage(pageNumber);
  };

  // 현재 페이지 기준으로 표시할 페이지 버튼의 시작과 끝 설정
  const startPage = Math.max(1, Math.floor((currentPage - 1) / 5) * 5 + 1);
  const endPage = Math.min(
    startPage + 4,
    Math.ceil(posts.length / postsPerPage)
  );

  return (
    <div>
      <Search onSearch={setQuery} />
      {currentPosts.map((post) => (
        <BoardItem key={post.id} post={post} />
      ))}

      <ul
        className='pagination'
        style={{
          display: 'flex',
          justifyContent: 'center',
          listStyleType: 'none',
          padding: 0,
          textAlign: 'center',
          width: '100%',
        }}
      >
        <li
          className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
          style={{
            display: 'inline-block',
            marginRight: '10px',
          }}
        >
          <button
            className='page-link'
            onClick={() => paginate(currentPage - 1)}
          >
            Previous
          </button>
        </li>

        {/* 페이지 번호 버튼들 */}
        {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
          const pageNumber = startPage + index;
          return (
            <li
              key={pageNumber}
              className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
              style={{
                display: 'inline-block',
                marginRight: '10px',
              }}
            >
              <button
                className='page-link'
                onClick={() => paginate(pageNumber)}
                style={{
                  textDecoration:
                    currentPage === pageNumber ? 'underline' : 'none',
                }}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        {/* 다음 버튼 */}
        <li
          className={`page-item ${currentPage === Math.ceil(posts.length / postsPerPage) ? 'disabled' : ''}`}
          style={{
            display: 'inline-block',
            marginLeft: '10px',
          }}
        >
          <button
            className='page-link'
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
};

export default BoardList;
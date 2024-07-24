import BoardList from '../../components/Board/BoardList';
import CreatePostForm from '../../components/Board/CreatePostForm';

const BoardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Board</h1>
      <CreatePostForm />
      <BoardList />
    </div>
  );
};

export default BoardPage;
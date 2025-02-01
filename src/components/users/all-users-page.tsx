import { useGetAllUsers } from "@/actions/query/user-query";
import { useNavigate } from "react-router-dom";

const AllUserList = () => {
  const { users } = useGetAllUsers();
  const navigate = useNavigate();
  if (!users) {
    return <div>Loading...</div>;
  }

  if (users.length === 0) {
    return <div>No users found.</div>;
  }

  const handleUserClick = (userId: string) => {
    navigate(`/author/${userId}`);
  };
  return (
    <div>
      {users.map((user) => (
        <div onClick={() => handleUserClick(user._id)} key={user._id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default AllUserList;

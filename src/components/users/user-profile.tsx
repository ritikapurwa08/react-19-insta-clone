import UserDetails from "./user-details";
import UserProfileImage from "./user-profile-image";

const UserProfilePage = () => {
  return (
    <div>
      <div className="py-4" id="avatar-name-email">
        <UserProfileImage />
      </div>
      <div>
        <UserDetails />
      </div>
    </div>
  );
};

export default UserProfilePage;

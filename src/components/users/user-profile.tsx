import UserDetails from "./user-details";
import UserLogOutButton from "./user-logout-button";
import UserProfileImage from "./user-profile-image";

const UserProfilePage = () => {
  return (
    <div className="pb-10">
      <div className="py-4" id="avatar-name-email">
        <UserProfileImage />
      </div>
      <div>
        <UserDetails />
      </div>
      <div>
        <UserLogOutButton />
      </div>
    </div>
  );
};

export default UserProfilePage;

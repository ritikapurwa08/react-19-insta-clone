import {
  useGetCurrentUser,
  useGetUserPrivacy,
  useGetUserProfileData,
} from "@/actions/query/user-query";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { Doc } from "@convex/_generated/dataModel";
import {
  FaUserCircle,
  FaInstagram,
  FaGlobe,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa"; // Example icons from react-icons
import { Calendar, BookOpen } from "lucide-react"; // Example icon from lucide-react

import UpdateUserDetailsButton from "./user-details-dialog";
import UserPrivacyDialog from "./user-privacy-dialog";

const UserDetails = () => {
  const user = useGetCurrentUser();
  const userId = user?._id;
  const userName = user?.name;
  const [userProfileData, setUserProfile] = useState<
    Doc<"userProfiles"> | undefined
  >(undefined);
  const [, setUserPrivacyData] = useState<Doc<"userPrivacy"> | undefined>(
    undefined
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { userPrivacy } = useGetUserPrivacy({ userId });

  const { userProfile } = useGetUserProfileData({ userId });

  useEffect(() => {
    if (userProfile && userPrivacy) {
      setUserProfile(userProfile);
      setUserPrivacyData(userPrivacy);
      setIsLoadingProfile(false);
    }
  }, [userProfile, userPrivacy]);

  useEffect(() => {
    if (userProfile === undefined) {
      setIsLoadingProfile(true);
    }
  }, [userProfile]);

  return (
    <div className="py-6">
      <div className="flex flex-row justify-between items-center px-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <FaUserCircle className="mr-2" size={28} /> User Profile
          </h1>
          <p>This is some static text that will always be shown.</p>
        </div>
        <div className="flex space-x-2">
          <UpdateUserDetailsButton userId={userId} />
          <UserPrivacyDialog userId={userId} />
        </div>
      </div>

      <div className="px-6">
        {isLoadingProfile ? (
          <div className="mt-4">
            <Skeleton className="w-48 h-6 rounded-md mb-2" />
            <Skeleton className="w-64 h-4 rounded-md mb-2" />
            <Skeleton className="w-32 h-4 rounded-md mb-2" />
            <Skeleton className="w-32 h-4 rounded-md mb-2" />
            <Skeleton className="w-32 h-4 rounded-md mb-2" />
            <Skeleton className="w-32 h-4 rounded-md mb-2" />
          </div>
        ) : userProfileData ? (
          <div className="mt-4">
            {/* User Data with Icons */}
            <div className="flex items-center mb-2">
              <FaUserCircle className="mr-2" size={20} />
              <p className="text-lg font-semibold">{userName}</p>
            </div>

            {/* Privacy-Aware Data Display */}
            {userPrivacy?.showBio && userProfileData.bio && (
              <div className="flex items-center mb-2">
                <BookOpen className="mr-2" size={20} />
                <p>Bio: {userProfileData.bio}</p>
              </div>
            )}

            {userPrivacy?.showLocation && userProfileData.location && (
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2" size={20} />
                <p>Location: {userProfileData.location}</p>
              </div>
            )}

            {userPrivacy?.showFollowers && (
              <div className="flex items-center mb-2">
                <FaUsers className="mr-2" size={20} />
              </div>
            )}

            <div className="flex items-center mb-2">
              <Calendar className="mr-2" size={20} />
              <p>
                Joined:{" "}
                {new Date(userProfileData._creationTime).toLocaleDateString()}
              </p>
            </div>

            {userPrivacy?.showEmail && user?.email && (
              <div className="flex items-center mb-2">
                <FaEnvelope className="mr-2" size={20} />
                <p>{user.email}</p>
              </div>
            )}

            {userPrivacy?.showWebsite && userProfileData.website && (
              <div className="flex items-center mb-2">
                <FaGlobe className="mr-2" size={20} />
                <a
                  href={userProfileData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userProfileData.website}
                </a>
              </div>
            )}

            {userProfileData.instagram && (
              <div className="flex items-center mb-2">
                <FaInstagram className="mr-2" size={20} />
                <a
                  href={`https://www.instagram.com/${userProfileData.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userProfileData.instagram}
                </a>
              </div>
            )}

            {/* ... other social links (Twitter, LinkedIn, etc.) ... */}
          </div>
        ) : (
          <div className="mt-4 text-red-500">User profile not found.</div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;

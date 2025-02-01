import { LoaderIcon } from "lucide-react";

const HomePageLoading = () => {
  return (
    <div className=" w-screen  flex justify-center items-center h-screen">
      <div className="flex flex-row justify-center items-center">
        <LoaderIcon className="animate-spin mr-2 text-pink-400 size-5" />
      </div>
    </div>
  );
};

export default HomePageLoading;

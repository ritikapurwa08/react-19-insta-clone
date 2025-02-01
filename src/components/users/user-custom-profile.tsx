"use client";

import { useUpdateUserCustomImage } from "@/actions/mutation/user-mutation";
import { useToast } from "@/hooks/use-toast";
import { Id } from "@convex/_generated/dataModel";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Search, UploadIcon } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

import { useDebounce } from "use-debounce";
import { Input } from "../ui/input";
import SubmitButton from "../ui/submit-button";

interface UnsplashImage {
  id: string;
  name: string;
  url: string;
}
const UserCustomProfile = ({ userId }: { userId: Id<"users"> }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(
    null
  );

  const { toast } = useToast();
  const [filteredImages, setFilteredImages] =
    useState<UnsplashImage[]>(ImagesNew);
  const { mutate: updateCustomImage, isPending: updatingCustomImage } =
    useUpdateUserCustomImage();

  const handleImageSelect = (image: UnsplashImage) => {
    setSelectedImage(image);
  };

  // here userCustomImageUrl is a string / null / undefined but if ther is a string set it and show user to instated of save image to update image
  const handleUpdateImage = () => {
    if (selectedImage) {
      updateCustomImage(
        {
          userId,
          customImage: selectedImage.url,
        },
        {
          onSuccess() {
            toast({
              title: "Custom Image Updated",
              description: "Your custom image has been updated.",
            });
            setOpen(false);
            setSelectedImage(null); // Clear selection after saving
          },
          onError(error) {
            toast({
              title: "Custom Image Update Failed",
              description: `Failed to update custom image: ${error.message}`,
            });
          },
        }
      );
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      const filtered = ImagesNew.filter((image) =>
        image.name.toLowerCase().includes(searchLower)
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(ImagesNew);
    }
  }, [debouncedSearch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="">
          <span className="flex flex-row items-center justify-center">
            <UploadIcon className="mr-2" />
            <span>Default Profiles</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Customize Your Profile</DialogTitle>
          <DialogDescription>
            Select a profile image to customize your profile.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto p-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={`relative max-w-28 max-h-28 border rounded-md overflow-hidden aspect-square cursor-pointer group ${
                selectedImage?.id === image.id
                  ? "ring-2 ring-offset-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => handleImageSelect(image)}
              aria-label={`Select image: ${image.name}`}
            >
              <img
                src={image.url}
                alt={image.name}
                className="object-cover max-h-24 min-w-full min-h-24  rounded-lg "
              />
              <div className="absolute bottom-0 w-full flex items-end justify-center pb-3 h-5 ">
                <span className="text-white bg-black w-full text-sm text-center">
                  {image.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <SubmitButton
            loadingText="updating"
            className="w-full bg-pink-400 hover:bg-pink-500"
            isLoading={updatingCustomImage}
            disabled={!selectedImage}
            type="button"
            onClick={handleUpdateImage}
          >
            Save Image
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserCustomProfile;

const ImagesNew = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1474249949617-ca9a962c876a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "BitcoinChart",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1558615126-2bfaf6926e10?q=80&w=2085&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "BitcoinChart",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1474249949617-ca9a962c876a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "DigitalWallet",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1474249949617-ca9a962c876a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "CryptoMiningRig",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1474249949617-ca9a962c876a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "BlockchainNetwork",
  },
];

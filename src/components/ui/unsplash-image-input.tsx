"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Search, Image as ImageIcon } from "lucide-react";
import {
  Control,
  FieldPath,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useController,
} from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface UnsplashImage {
  id: string;
  name: string;
  url: string;
}

interface UnsplashImageInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  className?: string;
  error?: string;
  handleSubmit?: (
    onValid: SubmitHandler<{
      customImage: string;
    }>,
    onInvalid?:
      | SubmitErrorHandler<{
          customImage: string;
        }>
      | undefined
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  labelClassName?: string;
  images: UnsplashImage[];
}

export default function UnsplashImageInput<T extends FieldValues>({
  control,
  name,
  label,
  className,
  labelClassName,
  error,
  handleSubmit,
  images: allImages,
}: UnsplashImageInputProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [filteredImages, setFilteredImages] =
    useState<UnsplashImage[]>(allImages);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(
    null
  );

  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  const handleImageSelect = (image: UnsplashImage) => {
    setSelectedImage(image);
  };

  const handleSaveImage = () => {
    if (selectedImage && handleSubmit) {
      field.onChange(selectedImage.url);
      // Update the form field value
      setOpen(false);
    }
  };

  // Filter images based on search
  useEffect(() => {
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      const filtered = allImages.filter((image) =>
        image.name.toLowerCase().includes(searchLower)
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(allImages);
    }
  }, [debouncedSearch, allImages]);

  return (
    <FormItem className={cn("flex flex-col max-w-60 gap-y-2", className)}>
      <FormLabel className={cn("text-sm font-medium", labelClassName)}>
        {label}
      </FormLabel>

      <FormControl>
        <div className="relative">
          {/* Show selected image */}
          {field.value && (
            <div className="relative w-full h-48 border-2 rounded-lg overflow-hidden mb-4">
              <img
                src={field.value}
                alt="Selected image"
                className="object-cover"
              />
            </div>
          )}

          {/* Input field with button */}
          <div className="relative">
            <Input
              placeholder="Enter image URL"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className="pr-20 hidden"
            />
            <Button
              type="button"
              variant="outline"
              className=""
              onClick={() => setOpen(true)}
            >
              <span>
                <ImageIcon className="h-4 w-4" />
              </span>
              <span>Select Image</span>
            </Button>
          </div>
        </div>
      </FormControl>

      {/* Dialog for selecting images */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Cover Image</DialogTitle>
            <DialogDescription>
              Select an image from Unsplash to use as your cover image.
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

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto py-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`relative aspect-square cursor-pointer group ${
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
                  className="object-cover rounded-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                  <span className="text-white text-sm text-center">
                    {image.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleSaveImage}
              disabled={!selectedImage}
            >
              Save Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error message */}
      <FormMessage className="text-xs text-red-600">
        {error ?? fieldError?.message}
      </FormMessage>
    </FormItem>
  );
}

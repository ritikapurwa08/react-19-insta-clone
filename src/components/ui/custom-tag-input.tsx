import { LucideIcon, X } from "lucide-react";
import { IconType } from "react-icons";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { KeyboardEvent, useState } from "react";

interface CustomTagsInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  error?: string;
  iconSrc?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
  iconClassName?: string;
  labelClassName?: string;
}

export default function CustomTagsInput<T extends FieldValues>({
  name,
  className,
  error,
  icon: Icon,
  disabled,
  label,
  control,
  iconSrc,
  defaultValue,
  iconClassName,
  labelClassName,
}: Readonly<CustomTagsInputProps<T>>) {
  const [inputValue, setInputValue] = useState("");
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
    defaultValue: defaultValue ?? ([] as PathValue<T, FieldPath<T>>),
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTags = [...field.value, inputValue.trim()];
      field.onChange(newTags);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = field.value.filter((tag: string) => tag !== tagToRemove);
    field.onChange(newTags);
  };

  return (
    <FormItem className="relative flex flex-col gap-y-0.5">
      <div className="relative">
        <FormControl className="m-0 p-0">
          <div className="relative">
            {Icon && (
              <div className="absolute flex justify-center items-center top-1/2 transform -translate-y-1/2 w-10">
                <Icon size={24} className={cn(iconClassName)} />
              </div>
            )}
            {iconSrc && (
              <div className="absolute top-1/2 transform -translate-y-1/2">
                <img
                  src={iconSrc}
                  height={24}
                  width={24}
                  alt={"icon"}
                  className="ml-2"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 p-2 border-b-2 border-b-zink-700">
              {field.value?.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1"
                >
                  {tag}
                  <X
                    size={14}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => removeTag(tag)}
                  />
                </span>
              ))}
              <Input
                id={`${name}-input`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className={cn(
                  "h-8 bg-transparent text-black placeholder:text-black/60 border-0 rounded-none focus:border-0 ring-0 focus:ring-0 focus:ring-offset-0 transition-all duration-200 focus:outline-none focus:border-none focus-visible:outline-none focus-visible:ring-0 flex-1 min-w-[120px]",
                  Icon && "pl-10",
                  iconSrc && "pl-10",
                  className
                )}
              />
            </div>
            <FormLabel
              htmlFor={`${name}-input`}
              className={cn(
                "absolute left-0 text-black/60 transform transition-all duration-200 cursor-text",
                Icon || iconSrc ? "left-10" : "left-2",
                "-translate-y-6",
                labelClassName
              )}
            >
              {label}
            </FormLabel>
          </div>
        </FormControl>
      </div>
      <FormMessage className="m-0 -mb-4 p-0 text-xs text-red-600">
        {(error ?? fieldError?.message) && (
          <span>{error ?? fieldError?.message}</span>
        )}
      </FormMessage>
    </FormItem>
  );
}

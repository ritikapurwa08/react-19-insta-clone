import { LucideIcon } from "lucide-react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export type SelectOption = {
  image?: string;
  icon?: LucideIcon;
  name: string;
};

interface CustomSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  error?: string;
  options: SelectOption[];
  onChange?: (value: string) => Promise<void>;
}

export default function CustomSelect<T extends FieldValues>({
  name,
  className,
  error,
  placeholder,
  icon: Icon,
  disabled,
  label,
  control,
  options,
  onChange,
}: Readonly<CustomSelectProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  useEffect(() => {
    if (field.value === undefined) {
      field.onChange("");
    }
  }, [field]);

  return (
    <FormItem className="relative">
      <FormLabel className="text-sm -mb-2 font-medium text-muted-foreground block">
        {label}
      </FormLabel>

      <FormControl>
        <div className="relative">
          {Icon && (
            <Icon
              size={20}
              className="absolute top-1/2 w-10 transform -translate-y-1/2 left-0 text-muted-foreground z-10"
            />
          )}

          <Select
            disabled={disabled}
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            value={field.value}
            key={field.value}
          >
            <SelectTrigger
              className={cn(
                "w-full pr-10 rounded-none border-zinc-500",
                !!Icon && "pl-10",
                className
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="">
              <div className=" grid  bg-dark-400 transition-all duration-300 ease-in-out text-light-200 sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-3 p-4 gap-4 ">
                {options.map((option) => (
                  <SelectItem
                    key={option.name}
                    value={option.name}
                    className=" cursor-pointer pl-8 animate-in border-2 border-transparent hover:border-dark-500 hover:border-2"
                  >
                    <div className="flex flex-row items-center justify-center w-fit ">
                      {option.image && (
                        <img
                          src={option.image}
                          alt={option.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      {option.icon && (
                        <option.icon
                          size={20}
                          className="text-muted-foreground"
                        />
                      )}
                      <span className="w-full ml-4 flex flex-grow">
                        {option.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
      </FormControl>

      <FormMessage className="mt-1 text-sm text-red-400 font-normal">
        {(error ?? fieldError?.message) && (
          <span>{error ?? fieldError?.message}</span>
        )}
      </FormMessage>
    </FormItem>
  );
}

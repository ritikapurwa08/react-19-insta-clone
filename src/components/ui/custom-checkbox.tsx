import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  onChange?: (checked: boolean) => Promise<void>;
}

export default function CustomCheckbox<T extends FieldValues>({
  name,
  className,
  error,
  disabled,
  label,
  control,
  onChange,
}: Readonly<CustomCheckboxProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  const handleChange = (checked: boolean) => {
    field.onChange(checked); // Update the form state
    onChange?.(checked); // Trigger the optional onChange callback
  };

  return (
    <FormItem className="relative">
      <div className="flex items-center space-x-2">
        <FormControl>
          <Checkbox
            id={name}
            checked={field.value || false}
            disabled={disabled}
            onCheckedChange={handleChange}
            className={cn("", className)}
          />
        </FormControl>
        <FormLabel
          htmlFor={name}
          className="text-sm font-medium text-muted-foreground"
        >
          {label}
        </FormLabel>
      </div>
      <FormMessage className="mt-1 text-xs text-red-400 font-normal">
        {(error ?? fieldError?.message) && (
          <span>{error ?? fieldError?.message}</span>
        )}
      </FormMessage>
    </FormItem>
  );
}

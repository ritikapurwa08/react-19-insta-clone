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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react"; // Import a check icon from Lucide or any other icon library

interface CustomRadioGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
}

export default function CustomRadioGroup<T extends FieldValues>({
  name,
  className,
  label,
  options,
  disabled,
  control,
  defaultValue,
}: Readonly<CustomRadioGroupProps<T>>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  return (
    <FormItem className={cn("flex flex-col gap-y-1", className)}>
      {/* Form Label */}
      <FormLabel className="text-sm font-medium text-gray-700">
        {label}
      </FormLabel>

      {/* Radio Group */}
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          value={field.value}
          disabled={disabled}
          className="flex gap-6"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-center space-x-2 py-2 border-dark-500 bg-dark-400 rounded-lg border transition-all",
                field.value === option.value
                  ? "border-dark-300 border bg-dark-300" // Selected state
                  : "border-dark-400 hover:border-gray-400" // Default state
              )}
            >
              <RadioGroupItem
                value={option.value}
                className="hidden" // Hide the default radio button
                id={option.value}
              />
              <Label
                htmlFor={option.value}
                className={cn(
                  "cursor-pointer relative pr-4 flex items-center gap-0.5",
                  field.value === option.value
                    ? "text-dark-600"
                    : "text-dark-700"
                )}
              >
                {/* Check icon for selected state */}
                {field.value === option.value && (
                  <Check className="size-3.5 absolute left-0 text-green-500" />
                )}
                <span className="text-light-200 pl-5 text-xs">
                  {option.label}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FormControl>

      {/* Error Message */}
      <FormMessage className="text-xs text-red-600">
        {error?.message && <span>{error.message}</span>}
      </FormMessage>
    </FormItem>
  );
}

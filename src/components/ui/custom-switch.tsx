import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

interface CustomSwitchProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

export default function CustomSwitch<T extends FieldValues>({
  name,
  className,
  label,
  control,
}: Readonly<CustomSwitchProps<T>>) {
  const {
    field: { onChange, value, ...field },
  } = useController({ name, control });

  return (
    <FormItem className="flex flex-row w-full px-2 items-center justify-between">
      <div className="space-y-0.5">
        <FormLabel className="text-white capitalize">{label}</FormLabel>
      </div>
      <FormControl>
        <Switch
          checked={value} // Directly use value
          onCheckedChange={onChange} // Directly use onChange
          aria-label={label}
          className={cn("", className)}
          {...field}
        />
      </FormControl>
    </FormItem>
  );
}

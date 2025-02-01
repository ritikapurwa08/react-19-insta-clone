// components/custom-email-input.tsx
"use client";

import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import { IconType } from "react-icons";
import { useDebounce } from "use-debounce";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { useCheckEmail } from "@/actions/query/user-query";

interface CustomEmailInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
}

interface CustomEmailInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  iconSrc?: string;
  disabled?: boolean;
  className?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
  setIsEmailAvailable: (isAvailable: boolean) => void;
  labelClassName?: string;
}

export default function CustomEmailInput<T extends FieldValues>({
  name,
  className,
  icon: Icon,
  disabled,
  label,
  control,
  defaultValue,
  iconSrc,
  setIsEmailAvailable,
}: Readonly<CustomEmailInputProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control, defaultValue });

  const [email, setEmail] = useState(field.value || "");
  const [debouncedEmail] = useDebounce(email, 100);

  const { checkEmail, isCheckingEmail } = useCheckEmail({
    email: debouncedEmail,
  });

  useEffect(() => {
    setEmail(field.value || "");
  }, [field.value]);

  useEffect(() => {
    if (debouncedEmail && checkEmail !== undefined) {
      setIsEmailAvailable(!checkEmail);
    }
  }, [checkEmail, debouncedEmail, setIsEmailAvailable]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    field.onChange(value);
  };

  return (
    <FormItem className="relative flex flex-col gap-y-0.5">
      <div>
        <div>
          <FormLabel htmlFor={`${name}-input`} className="text-pink-400">
            {label}
          </FormLabel>
        </div>
        <FormControl>
          <div className="relative">
            <div className="">
              <div id="icon-container">
                {Icon && (
                  <div className="absolute text-pink-400 flex justify-center items-center top-1/2 transform -translate-y-1/2 w-10">
                    <Icon size={24} />
                  </div>
                )}
              </div>
              <div id="img-icon-container">
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
              </div>
            </div>
            <div id="input-container">
              <Input
                id={`${name}-input`}
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                disabled={disabled}
                className={cn(
                  " border border-pink-400/30  focus:border-pink-400/60 focus:border-2 autofill-bg-transparent ",
                  Icon && "pl-10",
                  iconSrc && "pl-10",
                  className
                )}
              />
            </div>
            <div
              id="image-verification-icon"
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
            >
              {isCheckingEmail ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : debouncedEmail && checkEmail !== undefined ? (
                checkEmail ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )
              ) : null}
            </div>
          </div>
        </FormControl>
      </div>

      <FormMessage className="m-0 -mb-4  p-0 text-xs text-red-600">
        {fieldError?.message && <span>{fieldError.message}</span>}
        {debouncedEmail && checkEmail && (
          <span>This email is already registered.</span>
        )}
      </FormMessage>
    </FormItem>
  );
}

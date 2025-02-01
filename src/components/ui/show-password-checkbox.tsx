import { Checkbox } from "./checkbox";
import { Label } from "./label";

interface ShowPasswordCheckboxProps {
  setShowPassword: (showPassword: boolean) => void;
  showPassword: boolean;
}

const ShowPasswordCheckBox = ({
  setShowPassword,
  showPassword,
}: ShowPasswordCheckboxProps) => {
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-row items-center justify-start">
      <Checkbox className="" onCheckedChange={handleShowPassword} />
      <Label className="pl-2">
        {showPassword ? " Hide Password" : "Show Password"}
      </Label>
    </div>
  );
};

export default ShowPasswordCheckBox;

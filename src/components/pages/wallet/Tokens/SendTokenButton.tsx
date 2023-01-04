import { Button } from "@components/ui/input/Button";
import { IoSendOutline } from "react-icons/io5";

export const SendTokenButton = () => {
  return (
    <Button className="btn flex items-center">
      <IoSendOutline className="mr-2" /> Send
    </Button>
  );
};

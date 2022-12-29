import type { ButtonProps } from "ariakit/button";
import { Button as AriaButton } from "ariakit/button";

export const Button = (props: ButtonProps) => {
  return <AriaButton {...props} />;
};

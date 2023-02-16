import React, { HTMLAttributes } from "react";
import clsx from "clsx";

type FormProps = {
  isGrid?: boolean;
} & HTMLAttributes<HTMLFormElement>;

const Form: React.FC<FormProps> = ({
  children,
  isGrid,
  className,
  ...rest
}) => {
  return (
    <form
      className={clsx(
        isGrid
          ? "grid gap-3 sm:grid-cols-2"
          : "grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      )}
      {...rest}
    >
      {children}
    </form>
  );
};

export default Form;

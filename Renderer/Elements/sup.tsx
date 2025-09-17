import { PropsWithChildren } from "react";

export const Sup = ({children}: PropsWithChildren) => {
    return (
        <sup>
          {children}
        </sup>
    );
};

import { PropsWithChildren } from "react";

interface Props {
  __depth: number;
}

export function Title({__depth, children }: PropsWithChildren<Props>) {
  if (__depth === 1) {
    return <h1 className="text-lg font-semibold my-4 inline-block">{children}</h1>;
  }
  if (__depth === 2) {
    return <h2 className="text-base font-semibold my-4 inline-block">{children}</h2>;
  }
  if (__depth === 3) {
    return <h3 className="text-sm font-semibold my-4 inline-block">{children}</h3>;
  }
  return <h4 className="text-sm font-semibold my-4 inline-block">{children}</h4>;
}
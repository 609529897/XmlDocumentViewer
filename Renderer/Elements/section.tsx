import { PropsWithChildren } from "react";

interface Props {
    id: string;
    __depth: number
}

export const Sec = ({ id, __depth, children }: PropsWithChildren<Props>) => {
    return (
        <section id={id} data-depth={__depth}>
            {children}
        </section>
    );
};

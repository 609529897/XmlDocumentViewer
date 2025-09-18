import { PropsWithChildren } from "react";

interface Props {
    id: string;
    __depth: number
}

export const Paragraph = ({ id, __depth, children }: PropsWithChildren<Props>) => {
    const isText = typeof children === "string";
    const Wrapper = isText ? "p" : "div";
    return (
        <Wrapper className="text-sm leading-7" id={id} data-depth={__depth}>
            {children}
        </Wrapper>
    );
};

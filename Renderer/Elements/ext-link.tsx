import { PropsWithChildren } from "react";

interface Props {
    node: Element
}

export const ExtLink = ({ children, node }: PropsWithChildren<Props>) => {
    // const type = xpath.select('string(@ext-link-type)', node).toString();
    return (
        <a
            // data-ext-link-type={type}
            target="blank"
            referrerPolicy="same-origin"
            className="text-blue-600"
            href={node.textContent || ""}
        >
            {children}
        </a>
    );
};

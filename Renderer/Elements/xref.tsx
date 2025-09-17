import { PropsWithChildren } from "react";

interface Props {
    rid: string;
    'ref-type': string;
}

export const XRef = ({ rid, 'ref-type': type, children }: PropsWithChildren<Props>) => {

    if (type === 'fn') {
        // 备注
        // if (notNode(backNode)) {
        //     return <span className="article-notes">{textContent(node)}</span>;
        // }

        // return (
        //     <CustomTooltip
        //         content={textContent(xpath.select1(`./fn-group/fn[@id="${id}"]/p`, backNode))}
        //         position="bottom"
        //         className="article-notes-tooltip"
        //     >
        //         <span className="article-notes">{textContent(node)}</span>
        //     </CustomTooltip>
        // );
        return <span>{children}</span>;
    } else {
        // 参考文献
        return (
            <a
                className="text-blue-600"
                href={`#${rid}`}
                data-type={type}
                data-id={rid}
            >
                {children}
            </a>
        );
    }
};

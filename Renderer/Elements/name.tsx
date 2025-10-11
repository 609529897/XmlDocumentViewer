import { PropsWithChildren } from "react";

export const Name = ({children }: PropsWithChildren) => {
    // const { node } = props;
    // const nameStyle = select1('string(@name-style)', node);
    // const surname = getNodesText(select1('./surname', node));
    // const givenNames = getNodesText(select1('./given-names', node));

    // if (!surname && !givenNames) {
    //     return <span className="name">{getNodesText(node)}</span>;
    // }
    // if (nameStyle === 'western') {
    //     return (
    //         <span className="name">
    //             {givenNames} {surname}
    //         </span>
    //     );
    // }

    return (
        <span className="name">
            {/* {surname} {givenNames} */}
            {children}
        </span>
    );
};

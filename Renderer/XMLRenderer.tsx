import { PropsWithChildren } from "react";

export function XMLRenderer({
  node,
  tagMap = {},
  depth = 0,
  index = 0,
}: {
  node: Node | Element | string;
  tagMap?: Record<string, (props: PropsWithChildren<any>) => JSX.Element>;
  depth?: number;
  index?: number;
}): JSX.Element {

  if (typeof node === 'string') {
    return <>{node}</>;
  }

  if (node.nodeType === 3) {
    // 文本节点
    return node.nodeValue?.trim() ? <>{node.nodeValue}</> : <></>;
  }

  if (node.nodeType === 1) {
    const tagName = node.nodeName.toLowerCase();
    const children = Array.from(node.childNodes).map((child, i) => (
      <XMLRenderer
        key={`${depth + 1}-${i}`}
        node={child}
        tagMap={tagMap}
        depth={depth + 1}
        index={i}
      />
    ));

    // 如果用户提供了映射表，就用自定义组件
    if (tagMap[tagName]) {
      const CustomComponent = tagMap[tagName];
      const props: Record<string, any> = { __depth: depth, node };

      // 把 XML 节点的属性塞进 props
      if ((node as Element).attributes) {
        for (let attr of Array.from((node as Element).attributes)) {
          props[attr.name] = attr.value;
        }
      }

      return (
        <CustomComponent key={`${depth}-${index}`} {...props}>
          {children}
        </CustomComponent>
      );
    }

    const TagName = node.nodeName.toLowerCase() as keyof JSX.IntrinsicElements;

    // 打印当前标签名称
    // console.warn('当前渲染的标签名:', TagName);

    // 默认渲染逻辑
    return (
      <TagName key={`${depth}-${index}`} data-depth={depth}>
        {children}
      </TagName>
    );
  }

  return <></>;
}

export default XMLRenderer;

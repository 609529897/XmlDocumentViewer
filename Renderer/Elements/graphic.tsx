import { useActions } from "../../hooks";

const parseAttrNumber = (attr: Attr | null | undefined) =>
  parseFloat(attr?.nodeValue?.toString() ?? '');

interface Props {
  href: string;
  width: string;
  height: string
}

export function Graphic({
  href,
  width: propsWidth,
  height: propsHeight,
}: Props) {
  // const width = parseAttrNumber(propsWidth);
  // const height = parseAttrNumber(propsHeight);

  const { getResourceUrl } = useActions();
  const src = getResourceUrl(href);

  return (
    <img
      alt="pic"
      loading="lazy"
      src={src}
      // width={width ? zoom * width : 'auto'}
      // height={height ? zoom * height : 'auto'}
      // width={width ? width : 'auto'}
      // height={height ? height : 'auto'}
    />
  );
}
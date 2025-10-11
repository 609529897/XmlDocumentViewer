import { Graphic } from "./graphic";

interface Props {
  href: string;
  width: string;
  height: string
}

export const InlineGraphic = (props: Props) => {
  return <Graphic {...props} />;
};

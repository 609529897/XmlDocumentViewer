import { SvgIcon } from "@/components/SvgIcon";
import { hasCount } from "../utils";

type AuthorXrefItem = {
  rid: string; // 引用ID
  content: string; // 引用内容
};

type AuthorXrefMap = {
  aff?: AuthorXrefItem[]; // affiliations
  fn?: AuthorXrefItem[]; // footnotes
  corresp?: AuthorXrefItem[]; // corresponding marks
  [key: string]: AuthorXrefItem[] | undefined;
};

export interface AuthorDetail {
  id: string;
  affiliations: string[];
  email: string;
  name: string;
  stid: string;
  xrefs?: AuthorXrefMap;
}

interface AuthorProps {
  item: Omit<AuthorDetail, "email"> & { email: string[] };
  affiliationIndex?: string;
  last: boolean;
  renderName: React.ReactNode;
}

export const Author: React.FC<AuthorProps> = ({
  item,
  affiliationIndex,
  last,
  renderName,
}) => {
  return (
    <div className="text-sm text-[var(--kx-text-1)] flex gap-1">
      {renderName}
      <sup className="flex items-center gap-1 text-[var(--kx-text-2)]">
        {affiliationIndex && (
          <span className="flex items-center justify-center text-sm">
            {affiliationIndex}
          </span>
        )}
        {item.stid && (
          <span className="h-4 w-4 bg-[var(--kx-AIblue-4)] text-white text-[10px] flex items-center justify-center rounded-full">
            iD
          </span>
        )}
        {hasCount(item.email) &&
          item.email.map((item) => (
            <SvgIcon
              key={item}
              icon="icon-youjian"
              className="w-4 h-4 text-[var(--kx-fill-5)] cursor-pointer"
            />
          ))}
        {hasCount(item.xrefs?.corresp || []) &&
          item.xrefs?.corresp?.map((item) => (
            <a data-type="corresp" href={`#${item.rid}`} key={item.rid}>
              {item.content}
            </a>
          ))}

        {hasCount(item.xrefs?.fn || []) &&
          item.xrefs?.fn?.map((item) => (
            <a data-type="fn" href={`#${item.rid}`} key={item.rid}>
              {item.content}
            </a>
          ))}
      </sup>
      {!last && "，"}
    </div>
  );
};

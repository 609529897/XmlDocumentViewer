import { SvgIcon } from "@/components/SvgIcon";
import { hasCount } from "../utils";

export interface AuthorDetail {
  id: string;
  affiliations: string[];
  email: string;
  name: string;
  stid: string;
  corresp?: string[]
}


interface AuthorProps {
  item: Omit<AuthorDetail, 'email'> & { email: string[] };
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
    <div className="text-sm text-[var(--kx-text-1)] flex">
      {renderName}
      <span className="flex -mt-1 text-[var(--kx-text-2)] gap-1 ml-1">
        {affiliationIndex && <span className="-mt-0.5">{affiliationIndex}</span>}
        {item.stid && (
          <span className="h-4 w-4 bg-[var(--kx-AIblue-4)] text-white text-[10px] flex items-center justify-center rounded-full">
            iD
          </span>
        )}
        {hasCount(item.email) && (
          <div className="flex gap-1 items-center -mt-2">
            {item.email.map((item) => (
              <SvgIcon
                key={item}
                icon="icon-youjian"
                className="w-4 h-4 text-[var(--kx-fill-5)] cursor-pointer"
              />
            ))}
          </div>
        )}
        {hasCount(item.corresp || []) && (
          <div className="flex gap-1 items-center -mt-2">
            {item.corresp?.map((item) => (
              <a data-type="corresp" href={ `#${item}`} key={item}>*</a>
            ))}
          </div>
        )}
      </span>
      {!last && '，'}
    </div>
  );
};

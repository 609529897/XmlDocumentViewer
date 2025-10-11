import { useState } from "react";
import { Author } from "./Author";
import {
  hasCount,
  generateAffiliationId,
  generateAuthorId,
} from "../utils";
import { SvgIcon } from "@/components/SvgIcon";
import { Divider } from "./Divider";

const Title = ({ title }: { title: string }) => (
  <div className="flex items-center text-[var(--kx-text-1)] font-semibold text-base mb-4">
    <div className="w-[3px] h-[14px] bg-blue-600 mr-3"></div>
    {title}
  </div>
);

const AuthorsAndInstitutionsContent = ({ title, children, showCollapsed = false }: { title: string; children: React.ReactNode; showCollapsed?: boolean;}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Title title={title} />
        {showCollapsed && (
          <span
            className="text-blue-600 text-sm cursor-pointer flex items-center gap-1"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "展开所有" : "收起所有"}
            <SvgIcon
              className="w-4 h-4"
              icon={collapsed ? "icon-down-circle" : "icon-up-circle"}
            />
          </span>
        )}
      </div>
      {!collapsed && children}
    </div>
  );
};

const AuthorsSection = ({ authors }: { authors: any[] }) => (
  <AuthorsAndInstitutionsContent title="作者信息" showCollapsed>
    <div className="flex flex-col gap-6">
      {authors.map((a, i) => (
        <div key={i} id={generateAuthorId(i)}>
          <Author
            affiliationIndex={a.affiliationIndex}
            item={a}
            last
            renderName={<span className="font-semibold">{a.fullName}</span>}
          />
          {a.detail && (
            <div className="text-[var(--kx-text-2)] text-xs leading-5">{a.detail}</div>
          )}
        </div>
      ))}
    </div>
  </AuthorsAndInstitutionsContent>
);

const AffiliationsSection = ({ affiliations }: { affiliations: any[] }) => (
  <AuthorsAndInstitutionsContent title="机构信息" showCollapsed>
    <div className="flex flex-col gap-4">
      {affiliations.map((a, i) => (
        <div key={i} id={generateAffiliationId(i)}>
          <div className="text-[var(--kx-text-1)] text-sm font-semibold">
            {i + 1}. {a.name}
          </div>
          <div className="text-[var(--kx-text-2)] text-xs">{a.address}</div>
        </div>
      ))}
    </div>
  </AuthorsAndInstitutionsContent>
);

const CorrespondingSection = ({ corresp }: { corresp: string[] }) => (
  <AuthorsAndInstitutionsContent title="通讯作者">
    <div className="text-[var(--kx-text-2)] text-xs">{corresp.join(", ")}</div>
  </AuthorsAndInstitutionsContent>
);

const NotesSection = ({ notes }: { notes: { id: string; text: string }[] }) => (
  <AuthorsAndInstitutionsContent title="作者备注">
    <div className="text-[var(--kx-text-2)] text-xs flex flex-col gap-2">
      {notes.map((n) => (
        <div key={n.id} id={n.id}>
          {n.text}
        </div>
      ))}
    </div>
  </AuthorsAndInstitutionsContent>
);

const ContributionsSection = ({ contributions }: { contributions: string[] }) => (
  <AuthorsAndInstitutionsContent title="作者贡献">
    <div className="text-[var(--kx-text-2)] text-xs">{contributions.join(", ")}</div>
  </AuthorsAndInstitutionsContent>
);

export function AuthorsAndInstitutions({ data }: { data: any }) {

  const { authors, affiliations, correspAuthors, notes, contributions } = data;

  return (
    <div className="flex flex-col">
      {hasCount(authors) && (
        <>
          <AuthorsSection authors={authors} />
          <Divider />
        </>
      )}
      {hasCount(affiliations) && (
        <>
          <AffiliationsSection affiliations={affiliations} />
          <Divider />
        </>
      )}
      {hasCount(correspAuthors) && (
        <>
          <CorrespondingSection corresp={correspAuthors} />
          <Divider />
        </>
      )}
      {hasCount(notes) && (
        <>
          <NotesSection notes={notes} />
          <Divider />
        </>
      )}
      {hasCount(contributions) && (
        <ContributionsSection contributions={contributions} />
      )}
    </div>

  );
}
import { hasContent, when } from "../utils";
import { FormatArticleDataResult } from "../utils/map";
import { Divider } from "./Divider";

const Title = ({ title }: { title: string }) => (
  <div className="flex items-center text-[var(--kx-text-1)] font-semibold text-base mb-4">
    <div className="w-[3px] h-[14px] bg-blue-600 mr-3"></div>
    {title}
  </div>
);

const Section = ({
  title,
  children,
  withDivider,
}: {
  title: string;
  children: React.ReactNode;
  withDivider?: boolean;
}) => (
  <div>
    <Title title={title} />
    <div className="text-[var(--kx-text-2)] text-sm leading-[26px]">{children}</div>
    {withDivider && <Divider />}
  </div>
);

type Section = {
  title: string;
  content: React.ReactNode;
};

export function mapData(data: FormatArticleDataResult) {
  const {
    publicationDates,
    journalName,
    articleMeta,
    back,
    doi,
    cstr,
    conflict,
    column,
  } = data;
  
  const { fundingStatement, permissions } = articleMeta || {
    fundingStatement: "",
    permissions: {},
  };
  
  const acknowledgments = back?.acknowledgments ?? [];

  const sections = [
    when(
      hasContent(journalName) || hasContent(column) || hasContent(doi) || hasContent(cstr),
      {
        title: "基本信息",
        content: (
          <div className="flex flex-col gap-1">
            {journalName && <span>所在期刊：{journalName}</span>}
            {column && <span>栏目：{column}</span>}
            {doi && <span>DOI：{doi}</span>}
            {cstr && <span>CSTR：{cstr}</span>}
          </div>
        ),
      }
    ),

    when(publicationDates.length > 0, {
      title: "出版历史",
      content: (
        <div className="flex flex-col gap-1">
          {publicationDates.map((d) => (
            <span key={d.label}>
              {d.label}：{d.value}
            </span>
          ))}
        </div>
      ),
    }),

    when(hasContent(fundingStatement), {
      title: "基金信息",
      content: <>{fundingStatement}</>,
    }),

    when(
      hasContent(permissions?.license?.text) ||
        hasContent(permissions?.license?.type) ||
        hasContent(permissions?.license?.url) ||
        hasContent(permissions?.copyrightStatement),
      {
        title: "版权信息",
        content: (
          <>
            {permissions.license?.text} {permissions.license?.type}{" "}
            {permissions.license?.url} {permissions.copyrightStatement}
          </>
        ),
      }
    ),

    when(hasContent(conflict), {
      title: "利益冲突",
      content: <>{conflict}</>,
    }),

    when(acknowledgments.length > 0, {
      title: "致谢",
      content: (
        <>
          {acknowledgments.map((a, i) => (
            <div key={i}>{a.text}</div>
          ))}
        </>
      ),
    }),
  ].filter((s) => !!s);

  return sections;
}

export function ArticleBasic({ data }: { data: FormatArticleDataResult }) {
  const sections = mapData(data);

  return (
    <div>
      {sections.map((s, i) => s ? (
        <Section
          key={s.title}
          title={s.title}
          withDivider={i < sections.length - 1}
        >
          {s.content}
        </Section>
      ) : null)}
    </div>
  );
}

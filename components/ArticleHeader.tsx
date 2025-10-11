import { Link } from "react-router-dom";
import {
  hasCount,
  generateAuthorId,
  generateAffiliationId,
  mapMetaData,
} from "../utils";
import { Author } from "./Author";
import { LanguageOptions } from "./LanguageOptions";
import { MetaDrawer } from "./MetaDrawer";
import { useState, ReactNode } from "react";
import { XMLParserResult } from "../Parser";
import { SvgIcon } from "@/components/SvgIcon";
import { FormatArticleDataResult } from "../utils/map";
import { XmlDocumentViewerProps } from "..";
import { TranslationIndicator } from "./TranslationIndicator";

interface ArticleHeaderProps {
  data: FormatArticleDataResult;
  parsedData: XMLParserResult;
  actions?: ReactNode;
  pdf?: XmlDocumentViewerProps["pdf"];
  width: string;
}

interface MetaState {
  open: boolean;
  lang: string;
}

export function ArticleHeader({
  data,
  parsedData,
  actions,
  pdf,
  width,
}: ArticleHeaderProps) {
  const { title, otherLanguages, authors, affiliations } = data;
  const [metaState, setMetaState] = useState<MetaState>({
    open: false,
    lang: "",
  });

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          {title && (
            <>
              <h1
                className={`text-2xl font-semibold text-[var(--kx-text-1)] ${
                  actions ? "w-[80%]" : "w-full"
                }`}
                dangerouslySetInnerHTML={{ __html: title }}
              />
              {/* <TranslationIndicator content={title} /> */}
            </>
          )}

          {actions}
        </div>

        {/* 作者信息 */}
        {hasCount(authors) && (
          <div className="flex flex-wrap">
            {authors.map((a, idx) => (
              <Author
                key={idx}
                item={{
                  id: `${idx}`,
                  name: a.fullName,
                  affiliations: [],
                  email: a.email,
                  stid: a.stid || "",
                  xrefs: a.xrefs || {},
                }}
                last={idx === authors.length - 1}
                affiliationIndex={a.affiliationIndex}
                renderName={
                  <Link to={`#${generateAuthorId(idx)}`} data-type="author">
                    {a.fullName}
                  </Link>
                }
              />
            ))}
          </div>
        )}

        {hasCount(affiliations) && (
          <div className="flex gap-x-2 flex-col md:flex-row gap-y-1 text-sm text-[var(--kx-text-2)] flex-wrap">
            {affiliations.map((aff, idx) => (
              <Link
                key={idx}
                to={`#${generateAffiliationId(idx)}`}
                data-type="affiliation"
              >
                {idx + 1}. {aff.institutions?.join("")}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-y-6 md:gap-y-0 justify-between border-t border-b border-[var(--kx-border-2)] py-4">
        {hasCount(otherLanguages) ? (
          <div className="flex items-center text-[var(--kx-text-2)]">
            <span className="text-sm mr-2">其他语种元数据</span>
            <LanguageOptions
              langs={otherLanguages}
              onSelect={(lang) => setMetaState({ open: true, lang })}
            />
          </div>
        ) : (
          <div />
        )}
        <div className="flex gap-4">
          {pdf?.onPreview && (
            <button
              className="border w-full  md:w-[136px] h-10 md:h-11 rounded-lg border-blue-600 text-blue-600 hover:border-blue-700 flex items-center justify-center gap-2 text-sm"
              onClick={pdf.onPreview}
            >
              <SvgIcon icon="icon-pdf-3" className="w-5 h-5" /> PDF 在线阅读
            </button>
          )}
          {pdf?.onDownload && (
            <button
              className="border w-full md:w-[136px] h-10 md:h-11 rounded-lg border-blue-600 text-blue-600 hover:border-blue-700 flex items-center justify-center gap-2 text-sm"
              onClick={pdf?.onDownload}
            >
              <SvgIcon icon="icon-xiazai2" className="w-5 h-5" /> PDF 下载
            </button>
          )}
        </div>
      </div>

      {metaState.open && (
        <MetaDrawer
          data={mapMetaData({ ...parsedData, mainLang: metaState.lang })}
          open={metaState.open}
          onClose={() => setMetaState({ open: false, lang: "" })}
          width={width}
        />
      )}
    </>
  );
}

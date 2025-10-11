import { PropsWithChildren } from "react";
import { Drawer, DrawerProps, Spin } from "antd";
import {Author} from "./Author";
import {Abstracts } from "./Abstracts";
import {ArticleBasicInfoSection } from "./ArticleBasicInfoSection";
import { Divider } from "./Divider";
import { References } from "./References";
import { Keywords } from "./Keywords";
import { SvgIcon } from "@/components/SvgIcon";

// 标题组件
const Title: React.FC<PropsWithChildren> = ({ children }) => (
  <h3 className="m-0 text-xl mb-4 text-[var(--kx-text-1)] font-semibold">
    {children}
  </h3>
);

interface Data {
  institutions: { id: string; name: string }[];
  title: string;
  authors: any[];
  keywords: { keyword: string }[];
  abstract: any[];
  refList: { text: string; id: string }[];
  journalName: string; 
  journalId: string; 
  volume: string; 
  issue: string; 
  column: string;
  year: string;
  doi: string;
  cstr: string;
  printPublicationDate: string;
  onlinePublicationDate: string;
  fundInformation: string;
}

export const MetaDrawer: React.FC<PropsWithChildren<DrawerProps & { data: Data; }>> = ({
  loading,
  data,
  ...rest
}) => {
  const { title, authors, abstract, keywords = [], institutions } =
    data;

  return (
    <Drawer
      placement="right"
      className="relative"
      closeIcon={false}
      title={
        <div className="flex justify-between">
          <div className="text-[var(--kx-text-1)] text-base font-semibold">
            其他语言元数据
          </div>
          <button onClick={rest.onClose}>
            <SvgIcon icon="icon-guanbi-da" className="w-4 h-4" />
          </button>
        </div>
      }
      styles={{
        header: {
          background: "var(--kx-fill-1)",
          height: 48,
        },
        mask: {
          position: "fixed",
          zIndex: 10,
        },
      }}
      {...rest}
    >
      {loading ? (
        <Spin />
      ) : (
        <>
          <div className="flex flex-col gap-y-8">
            <section className="flex flex-col gap-y-4">
              {title && (
                <h2 className="text-2xl text-[var(--kx-text-1)] font-semibold">
                  {title}
                </h2>
              )}
              {authors.length > 0 ? (
                <div className="flex">
                  {authors.map((author, idx, self) => (
                    <Author
                      key={idx}
                      item={author}
                      last={idx === self.length - 1}
                      affiliationIndex={author.affiliationIndex}
                      renderName={author.fullName}
                    />
                  ))}
                </div>
              ) : null}

              {institutions.length > 0 ? (
                <div className="flex gap-x-2 gap-y-1 flex-wrap text-[var(--kx-text-2)] text-sm">
                  {institutions.map((item, idx) => (
                    <div key={idx}>
                      {idx + 1}.{item.name}
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            {abstract.length > 0 && (
              <section>
                <Title>摘要</Title>
                <Abstracts data={abstract} />
              </section>
            )}

            {keywords.length > 0 ? (
              <section>
                <Title>关键词</Title>
                <Keywords keywords={keywords.map((item) => item.keyword)} />
              </section>
            ) : null}
          </div>

          <Divider />

          <Title>文章信息</Title>
          <ArticleBasicInfoSection data={data} />

          {/* <Divider /> */}

          {/* <Title>参考文献</Title>
          <References data={refList} /> */}
        </>
      )}
    </Drawer>
  );
};

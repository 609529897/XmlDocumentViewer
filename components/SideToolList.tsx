import { Drawer } from "antd";
import { hasCount, scrollToElement } from "../utils";
import { useMemo, useState } from "react";
import { useHashLinkNavigation } from "../hooks";
import { RelatedResources  } from "./RelatedResources";
import { References } from "./References";
import { Images } from "./Images";
import { Tables } from "./Tables";
import { ArticleInfo } from "./ArticleInfo";
import { ToolList } from "./ToolList";
import { SvgIcon } from "@/components/SvgIcon";
import type { FormatArticleDataResult } from "../utils";

export function SideToolList ({ data }: { data: FormatArticleDataResult }) {

  const {
  figures, tables, refList
  } = data;

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [activeKey, setActiveKey] = useState(0);

   useHashLinkNavigation({
    "bibr": (id) => {
      setCurrentIndex(4);
      scrollToElement(id);
    },
    "ref": (id) => {
      setCurrentIndex(4);
      scrollToElement(id);
    },
    "author": (id) => {
      setCurrentIndex(0);
      setActiveKey(1);
      scrollToElement(id);
    },
    "affiliation": (id) => {
      setCurrentIndex(0);
      setActiveKey(1);
      scrollToElement(id);
    },
    "corresp": (id) =>  {
      setCurrentIndex(0);
      setActiveKey(1);
      scrollToElement(id);
    }
  });

    const TOOL_LIST = useMemo(
    () => [
      {
        icon: "icon-cuowutishi",
        title: "文章与作者机构信息",
        disabled: false,
        content: (
          <ArticleInfo
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            data={data}
          />
        ),
      },
      {
        icon: "icon-tupian",
        title: "图片",
        disabled: !hasCount(figures),
        content: (
          <Images
            data={figures}
          />
        ),
      },
      {
        icon: "icon-jiandanbiaoge",
        title: "表格",
        disabled: !hasCount(tables),
        content: (
          <Tables
            data={tables}
          />
        ),
      },
      {
        icon: "icon-inline-a",
        title: "关联资源",
        disabled: true,
        content: <RelatedResources />,
      },
      {
        icon: "icon-wenxian2",
        title: "参考文献",
        disabled: !hasCount(refList),
        content: <References data={refList} />,
      },
    ],
    [activeKey, data, figures, tables, refList]
  );

  return (
    <>
          <ToolList
        items={TOOL_LIST.map((item) => ({ ...item, onClick: setCurrentIndex }))}
        activeKey={currentIndex}
        className="sticky top-12"
      />

            {currentIndex >= 0 && (
        <Drawer
          placement="right"
          open
          onClose={() => setCurrentIndex(-1)}
          width={540}
          title={
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {TOOL_LIST[currentIndex].title}
              </span>
              <button onClick={() => setCurrentIndex(-1)}>
                <SvgIcon icon="icon-guanbi-da" className="w-4 h-4" />
              </button>
            </div>
          }
          styles={{
            header: { background: "var(--kx-fill-1)", height: 48 },
            mask: { position: "fixed", zIndex: 10 },
          }}
          closeIcon={false}
        >
          {TOOL_LIST[currentIndex].content}
                <ToolList
                  items={TOOL_LIST.map((item) => ({ ...item, onClick: setCurrentIndex }))}
                  activeKey={currentIndex}
                  className="fixed top-[48px] right-[568px] z-50 border-none"
                />
        </Drawer>
      )}
    </>
  )
}
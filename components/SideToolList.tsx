import { Drawer } from "antd";
import { hasCount, scrollToElement } from "../utils";
import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useHashLinkNavigation } from "../hooks";
import { RelatedResources } from "./RelatedResources";
import { References } from "./References";
import { Images } from "./Images";
import { Tables } from "./Tables";
import { ArticleInfo } from "./ArticleInfo";
import { ToolList } from "./ToolList";
import { SvgIcon } from "@/components/SvgIcon";
import type { FormatArticleDataResult } from "../utils";

// 工具列表索引常量
const TOOL_INDEX = {
  ARTICLE_INFO: 0,
  IMAGES: 1,
  TABLES: 2,
  REFERENCES: 3,
} as const;

export function SideToolList({ data }: { data: FormatArticleDataResult }) {
  const { figures, tables, refList } = data;

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [activeKey, setActiveKey] = useState<number>(0);

  // hash 跳转
  useHashLinkNavigation({
    bibr: (id) => {
      setCurrentIndex(TOOL_INDEX.REFERENCES);
      scrollToElement(id);
    },
    ref: (id) => {
      setCurrentIndex(TOOL_INDEX.REFERENCES);
      scrollToElement(id);
    },
    author: (id) => {
      setCurrentIndex(TOOL_INDEX.ARTICLE_INFO);
      setActiveKey(1);
      scrollToElement(id);
    },
    affiliation: (id) => {
      setCurrentIndex(TOOL_INDEX.ARTICLE_INFO);
      setActiveKey(1);
      scrollToElement(id);
    },
    corresp: (id) => {
      setCurrentIndex(TOOL_INDEX.ARTICLE_INFO);
      setActiveKey(1);
      scrollToElement(id);
    },
  });

  // 工具列表
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
        content: <Images data={figures} />,
      },
      {
        icon: "icon-jiandanbiaoge",
        title: "表格",
        disabled: !hasCount(tables),
        content: <Tables data={tables} />,
      },
      // {
      //   icon: "icon-inline-a",
      //   title: "关联资源",
      //   disabled: true,
      //   content: <RelatedResources />,
      // },
      {
        icon: "icon-wenxian2",
        title: "参考文献",
        disabled: !hasCount(refList),
        content: <References data={refList} />,
      },
    ],
    [activeKey, data, figures, tables, refList]
  );

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentIndex]); // 每次切换 currentIndex 都重置 scrollTop

  const current = currentIndex >= 0 ? TOOL_LIST[currentIndex] : null;

  // 点击切换工具
  const handleClick = useCallback((index: number) => {
    setCurrentIndex(index);
    setActiveKey(0);
  }, []);

  return (
    <>
      <ToolList
        items={TOOL_LIST.map((item, index) => ({
          ...item,
          onClick: () => handleClick(index),
        }))}
        activeKey={currentIndex}
        className="sticky top-12"
      />

      {current && (
        <Drawer
          placement="right"
          open
          onClose={() => setCurrentIndex(-1)}
          width={540}
          title={
            <div className="flex justify-between items-center">
              <span className="font-semibold">{current.title}</span>
              <button onClick={() => setCurrentIndex(-1)}>
                <SvgIcon icon="icon-guanbi-da" className="w-4 h-4" />
              </button>
            </div>
          }
          styles={{
            header: { background: "var(--kx-fill-1)", height: 48 },
            body: { padding: 0 },
            mask: { position: "fixed", zIndex: 1000 }, // 修复遮罩层可能被覆盖的问题
          }}
          closeIcon={false}
        >
          <div ref={contentRef} className="h-full overflow-y-auto p-6">
            {current.content}
          </div>
          <ToolList
            items={TOOL_LIST.map((item, index) => ({
              ...item,
              onClick: () => setCurrentIndex(index),
            }))}
            activeKey={currentIndex}
            className="fixed top-[48px] right-[568px] z-50 border-none"
          />
        </Drawer>
      )}
    </>
  );
}

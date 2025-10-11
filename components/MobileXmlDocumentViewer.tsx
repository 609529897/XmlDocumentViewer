import {
  ArticleHeader,
  ArticleSummary,
  ArticleReferences,
  SideAnchor,
  ResourceReader,
  GoBack,
  RelatedResources,
  References,
  Images,
  Tables,
  ArticleInfo,
} from ".";

import { CommonProps } from "..";
import { Renderer } from "../Renderer";
import { useConfigMathMl } from "../hooks";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Drawer, Dropdown } from "antd";
import { hasCount } from "../utils";
import { SvgIcon } from "@/components/SvgIcon";

export function MobileXmlDocumentViewer(props: CommonProps): JSX.Element {
  const {
    fullScreen,
    onFullScreen,
    data,
    parsedData,
    actions,
    pdf,
    scrollContainer,
  } = props;
  const { figures, tables, refList } = data;

  useConfigMathMl();

  const [showTitleList, setShowTitleList] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [activeKey, setActiveKey] = useState(0);
  const [openToolList, setOpenToolList] = useState(false);

  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

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
      //   icon: 'icon-inline-a',
      //   title: '关联资源',
      //   disabled: true,
      //   content: <RelatedResources />,
      // },
      {
        icon: "icon-wenxian2",
        title: "参考文献",
        disabled: !hasCount(refList),
        content: <References data={refList} />,
      },
      {
        icon: "icon-guanbi-da",
        title: "关闭",
      },
    ],
    [activeKey, data, figures, tables, refList]
  );

  return (
    <>
      <div className="flex flex-col items-start py-6 px-4 mx-auto">
        <div className="flex justify-between mb-4 w-full">
          <GoBack onClick={handleGoBack} />
          {actions}
        </div>
        <div className="flex-1 flex gap-10 flex-col text-[var(--kx-text-1)]">
          <ArticleHeader
            pdf={pdf}
            data={data}
            parsedData={parsedData}
            width="80%"
          />
          <ArticleSummary data={data} />
          {parsedData.bodyNode && <Renderer node={parsedData.bodyNode} />}
          <ArticleReferences data={data} />
        </div>
      </div>

      <div className="fixed bottom-10 right-4 flex flex-col gap-2">
        <Dropdown
          trigger={["click"]}
          open={openToolList}
          onOpenChange={setOpenToolList}
          popupRender={() => (
            <div className="flex rounded-full border border-[var(--kx-border-2)] shadow-lg bg-white">
              {TOOL_LIST.map((item, index) => (
                <div
                  className="w-10 h-10 flex justify-center items-center"
                  key={item.title}
                  onClick={() => {
                    if (item.title === "关闭") {
                      setOpenToolList(false);
                      return;
                    }
                    setOpenToolList(false);
                    setCurrentIndex(index);
                  }}
                >
                  <SvgIcon className="w-5 h-5 text-blue-600" icon={item.icon} />
                </div>
              ))}
            </div>
          )}
          placement="topLeft"
        >
          <button className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
            <SvgIcon className="w-5 h-5 text-white" icon="icon-gongneng" />
          </button>
        </Dropdown>
        <button
          className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center"
          onClick={() => setShowTitleList(true)}
        >
          <SvgIcon className="w-5 h-5 text-white" icon="icon-content" />
        </button>
      </div>

      {fullScreen.id && (
        <ResourceReader
          current={fullScreen}
          setCurrent={onFullScreen}
          data={data}
        />
      )}

      <Drawer
        placement="right"
        open={showTitleList}
        onClose={() => setShowTitleList(false)}
        width={"80%"}
        title={
          <div className="flex justify-between items-center">
            <span className="font-semibold">文章目录</span>
            <button onClick={() => setShowTitleList(false)}>
              <SvgIcon icon="icon-guanbi-da" className="w-4 h-4" />
            </button>
          </div>
        }
        styles={{
          header: { background: "var(--kx-fill-1)", height: 48, padding: 16 },
          body: { padding: 16 },
        }}
        closeIcon={false}
      >
        <SideAnchor data={data} scrollContainer={scrollContainer} />
      </Drawer>

      {currentIndex >= 0 && (
        <Drawer
          placement="right"
          open
          onClose={() => setCurrentIndex(-1)}
          width="80%"
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
            header: { background: "var(--kx-fill-1)", height: 48, padding: 16 },
            body: { padding: 16 },
          }}
          closeIcon={false}
        >
          {TOOL_LIST[currentIndex].content}
        </Drawer>
      )}
    </>
  );
}

import { Divider } from "./Divider";
import { ParsedFigure } from "../Parser/parseFigures";
import { useActions, useGraphicUrl } from "../hooks";
import { SvgIcon } from "@/components/SvgIcon";

// 基础图片容器组件
const BaseFigure: React.FC<{ item: ParsedFigure; children: React.ReactNode }> = ({ item, children }) => {
  return (
    <div className="flex gap-4 flex-col">
      {item.label && (
        <div className="text-[var(--kx-text-1)] text-sm font-semibold">
          {item.label}
        </div>
      )}
      {item.caption && (
        <div className="text-[var(--kx-text-2)] text-sm leading-[22px]">
          {item.caption}
        </div>
      )}
      {children}
    </div>
  );
};

// 单个图片组件
const Fig: React.FC<{ item: ParsedFigure }> = ({ item }) => {

  const src = useGraphicUrl(item.graphics, 'use');

  return (
    <BaseFigure item={item}>
      <div className="rounded border border-[var(--kx-border-2)] w-full p-4">
        <img key={item.id} src={src} alt={item.caption} />
      </div>
    </BaseFigure>
  );
};

// 图片组组件
const FigGroup: React.FC<{ item: ParsedFigure }> = ({ item }) => {
  return (
    <BaseFigure item={item}>
      <div className="flex flex-col gap-4">
        {item.children?.map((child) => (
          <Fig 
            item={child} 
            key={child.id} 
          />
        ))}
      </div>
    </BaseFigure>
  );
};

// 图片展示容器组件
interface ImagesProps {
  data: ParsedFigure[];
}

export const Images: React.FC<ImagesProps> = ({ data }) => {

  const { onFullScreen } = useActions();

  // 抽取全屏按钮组件
  const FullScreenButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
      className="text-blue-600 text-sm flex gap-1 items-center"
      onClick={onClick}
    >
      <SvgIcon icon="icon-quanpingzhankai" className="w-4 h-4" /> 
      全屏查看
    </button>
  );

  return (
    <>
      {data.map((item, index, self) => (
        <div key={item.id}>
          {item.type === 'fig-group' ? (
            <FigGroup
              item={item}
            />
          ) : (
            <Fig
              item={item}
            />
          )}

          <div className="flex justify-end mt-4">
            <FullScreenButton onClick={() => onFullScreen?.({ id: item.id, type: "image" })} />
          </div>

          {index !== self.length - 1 && <Divider />}
        </div>
      ))}
    </>
  );
};
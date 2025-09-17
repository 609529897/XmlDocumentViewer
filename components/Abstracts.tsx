import { useActions, useGraphicUrl } from "../hooks";
import { ParsedAbstract } from "../Parser/parseAbstracts";
import { Divider } from "./Divider";

// 渲染段落内容的公共组件
const ParagraphContent = ({ paragraphs }: { paragraphs: string[] }) => (
  <div className="mb-2">
    {paragraphs.map((paragraph, idx) => (
      <div key={idx}>{paragraph}</div>
    ))}
  </div>
);

// 图片抽象内容组件
const GraphicAbstract = ({
  paragraphs,
  graphics,
}: {
  paragraphs: string[];
  graphics: any[];
}) => {


  const src = useGraphicUrl(graphics, 'use');

  return (
    <div>
      <ParagraphContent paragraphs={paragraphs} />
      <div className="border border-[var(--kx-border-2)] min-h-[200px]">
        <img
          src={src}
          className="w-full h-full object-contain"
          alt="图片内容"
        />
      </div>
    </div>
  );
};

// 媒体抽象内容组件
const MediaAbstract = ({
  paragraphs,
  media = [],
}: {
  paragraphs: string[];
  media: ParsedAbstract['media'];
}) => {

  const { getResourceUrl } = useActions();

  return (
    <div>
      <ParagraphContent paragraphs={paragraphs} />
      {media.map((mediaItem, key) => {
        const src = getResourceUrl(mediaItem.href || "");
        return (
          <video width="100%" controls className="h-96 rounded-lg border border-[var(--kx-border-2)]" key={key}>
            {["video/ogg", "video/mp4", "video/webm"].map((type) => (
              <source key={type} src={src} type={type} />
            ))}
            <object data={src} width="100%">
              <embed width="100%" src={src} />
            </object>
          </video>
        );
      })}
    </div>
  );
};

// 默认抽象内容组件
const DefaultAbstract = ({ paragraphs }: { paragraphs: string[] }) => (
  <div className="text-sm text-[var(--kx-text-2)] leading-7">
    <ParagraphContent paragraphs={paragraphs} />
  </div>
);

// 抽象内容项组件
const AbstractItem = ({
  item,
}: {
  item: ParsedAbstract;
  index: number;
}) => {
  switch (item.type) {
    case "graphic":
    case "graphical":
      return (
        <GraphicAbstract
          paragraphs={item.paragraphs}
          graphics={item.graphics || []}
        />
      );
    case "media":
      return (
        <MediaAbstract
          paragraphs={item.paragraphs}
          media={item.media}
        />
      );
    default:
      return <DefaultAbstract paragraphs={item.paragraphs} />;
  }
};

// 抽象内容列表组件
export function Abstracts({
  data,
}: {
  data: ParsedAbstract[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index, self) => (
        <div key={index}>
          <AbstractItem
            item={item}
            index={index}
          />
          {self.length - 1 !== index && <Divider />}
        </div>
      ))}
    </div>
  );
}
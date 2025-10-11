import { FormatArticleDataResult } from "../utils/map";
import { ArticleBasic } from "./ArticleBasic";
import { AuthorsAndInstitutions } from "./AuthorsAndInstitutions";

interface Props {
  data: FormatArticleDataResult;
  activeKey: number;
  setActiveKey: (activeKey: number) => void;
}

export const ArticleInfo = (props: Props) => {
  const { setActiveKey, activeKey, data } = props;

  const items = [
    { label: "文章信息", content: <ArticleBasic data={data} /> },
    { label: "作者机构信息", content: <AuthorsAndInstitutions data={data} /> },
  ];

  return (
    <div>
      <div className="w-full flex h-[42px] rounded-full border-[var(--kx-border-3)] border mb-6">
        {items.map((item, i) => (
          <div
            key={item.label}
            onClick={() => setActiveKey(i)}
            className={`flex-1 flex justify-center items-center text-base text-[var(--kx-text-3)] rounded-full cursor-pointer ${
              activeKey === i ? "bg-blue-600 text-white" : ""
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div>{items[activeKey].content}</div>
    </div>
  );
};

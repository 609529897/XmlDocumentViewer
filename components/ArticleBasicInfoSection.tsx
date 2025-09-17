import { Link } from "react-router-dom";

export interface ArticleBasic {
  journalName: string; 
  journalId: string; 
  volume: string; 
  issue: string; 
  column: string;
  doi: string;
  cstr: string;
  printPublicationDate: string;
  onlinePublicationDate: string;
  fundInformation: string;
}

export const ArticleBasicInfoSection = ({ data }: { data: ArticleBasic }) => {


  const articleInfoItems = [
    {
      key: '所在期刊',
      value: data.journalId ? (
        <Link to={`/detail/${data.journalId}?type=journal`} target="_blank" onClick={(e) => {
          e.preventDefault();
          window.open(`/detail/${data.journalId}?type=journal`, '_blank');
        }}>
          {data.journalName}
        </Link>
      ) : data.journalName,
    },
    {
      key: '年卷期',
      value: data.volume && data.issue ? `Vol.${data.volume}, No.${data.issue}` : '',
    },
    {
      key: '栏目',
      value: data.column,
    },
    {
      key: 'DOI',
      value: data.doi,
    },
    {
      key: 'CSTR',
      value: data.cstr,
    },
    {
      key: '纸质出版',
      value: data.printPublicationDate,
    },
    {
      key: '网络出版',
      value: data.onlinePublicationDate,
    },
    {
      key: '基金信息',
      value: data.fundInformation,
    },
  ];

  return (
    <section className="flex flex-col gap-3">
      {articleInfoItems.map(
        (item) =>
          item.value && (
            <div
              key={item.key}
              className="flex text-sm text-[var(--kx-text-2)]"
            >
              <span className="text-[var(--kx-text-1)]">
                {item.key}：
              </span>
              <span>{item.value}</span>
            </div>
          ),
      )}
    </section>
  );
};

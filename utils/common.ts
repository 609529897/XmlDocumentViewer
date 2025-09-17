export const formatDate = (date?: { year: string; month: string; day: string }) =>
  date ? `${date.year}-${date.month}-${date.day}` : '';

export const filterByLang = <T extends { lang?: string }>(data: T[], lang: string) => {
  return data.filter((item) => item.lang === lang);
};

export const uniqueArray = <T>(arr: T[]): T[] => Array.from(new Set(arr));

export const scrollToElement = (id: string) => {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add('highlight');
    setTimeout(() => el.classList.remove('highlight'), 2000);
  }, 500);
};


export const hasCount = <T>(content: T[]) => (Array.isArray(content) ? content.length > 0 : !!content);
export const hasContent = (value: undefined | null | string) => value !== undefined && value !== null && value !== "";

const SIZE = 'big';

export const findBySize = <T>(graphics: T[], key: keyof T): T =>
  graphics.find(item => item[key] === SIZE) || graphics[0]

export const generateAuthorId = (index: number) => 'au-' + index;

export const generateAffiliationId = (index: number) => 'aff-' + index;


export function when<T>(condition: boolean, value: T): T | undefined {
  return condition ? value : undefined;
}
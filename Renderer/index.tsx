import XMLRenderer from "./XMLRenderer";
import { Sec } from "./Elements/section";
import { Title } from "./Elements/title";
import { Paragraph } from "./Elements/paragraph";
import { XRef } from "./Elements/xref";
import { ExtLink } from './Elements/ext-link';
import { Name } from './Elements/name';
import { Fig } from './Elements/fig';
// import { Graphic } from './Elements/graphic';
import { TableWrap } from './Elements/table-wrap';
import { FigGroup } from "./Elements/fig-group";
import { InlineGraphic } from "./Elements/inline-graphic";
import { Media } from './Elements/media';
// import { TexMath } from './tex-math';

// import { Alternatives } from './Elements/alternatives';
// import { ForEach } from './for-each';
// import { Paragraph } from './paragraph';
// import { ReferenceForEach } from './reference-for-each';

function cleanMathML(xmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");

  function processNode(node: Element) {
    Array.from(node.children).forEach(child => processNode(child));

    if (node.prefix === "mml") {
      const newEl = document.createElement(node.localName);
      Array.from(node.attributes).forEach(attr => newEl.setAttribute(attr.name, attr.value));
      while (node.firstChild) {
        newEl.appendChild(node.firstChild);
      }
      node.replaceWith(newEl);
    }
  }

  processNode(doc.documentElement);
  return new XMLSerializer().serializeToString(doc.documentElement);
}

function FormulaRenderer({ node, inline = true }: { node: Element, inline?: boolean }) {
  const mathEl = node.querySelector('math');
  if (!mathEl) return null;
  const label = node.querySelector('label')?.textContent;
  const html = cleanMathML(mathEl.outerHTML);

  if (inline) {
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <div className="flex justify-center items-center my-4">
      <div className="flex-1 flex justify-center items-center" dangerouslySetInnerHTML={{ __html: html }} />
      {label && <span>{label}</span>}
    </div>
  );
}

const defaultTag = (role?: string) => ({ children, ...props }: any) => (
  <span {...props} data-role={role}>{children}</span>
);

export function Renderer({ node }: { node: Element | string }) {
  return (
    <XMLRenderer
      node={node}
      tagMap={{
        body: ({ children, ...props }) => <div {...props}>{children}</div>,
        'article-title': defaultTag('article-title'),
        'journal-title': defaultTag('journal-title'),
        'ref-list': ({ children, ...props }) => <dl {...props} data-role="ref-list">{children}</dl>,
        fn: defaultTag('fn'),
        media: (props) => <Media {...props} />,
        'table-wrap': (props) => <TableWrap {...props} />,
        'inline-graphic': (props) => <InlineGraphic {...props} />,
        'fig-group': (props) => <FigGroup {...props} />,
        fig: (props) => <Fig  {...props} />,
        name: Name,
        sup: ({ children, ...props }) => <sup {...props}>{children}</sup>,
        sub: ({ children, ...props }) => <sub {...props}>{children}</sub>,
        italic: ({ children, ...props }) => <i {...props}>{children}</i>,
        bold: ({ children, ...props }) => <b {...props}>{children}</b>,
        xref: XRef,
        'ext-link': ExtLink,
        uri: ExtLink,
        source: defaultTag('source'),
        year: defaultTag('year'),
        volume: defaultTag('volume'),
        fpage: defaultTag('fpage'),
        lpage: defaultTag('lpage'),
        issue: defaultTag('issue'),
        collab: defaultTag('collab'),
        etal: defaultTag('etal'),
        surname: defaultTag('surname'),
        comment: defaultTag('comment'),
        label: ({ children, ...props }: any) => <span className="font-semibold mr-1" {...props} data-role={'label'}>{children}</span>,
        'object-id': ({ children, value }) => <data value={value ?? ''} data-role="object-id">{children}</data>,
        heading: ({ children }) => <span className="head-2">{children}</span>,
        title: Title,
        sec: Sec,
        p: Paragraph,
        'disp-formula': (props) => <FormulaRenderer {...props} inline={false} />,
        'inline-formula': (props) => <FormulaRenderer {...props} inline />,
      }}
    />
  );
}
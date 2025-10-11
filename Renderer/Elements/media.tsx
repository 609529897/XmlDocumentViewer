import { PropsWithChildren } from "react";
import { useActions } from "../../hooks";

const Video = ({ href }: { href: string }) => {
  const { getResourceUrl } = useActions();
  const src = getResourceUrl(href);

  return (
    <div 
      data-role="media" 
      className="flex flex-col border border-gray-300 rounded-lg overflow-hidden my-6" 
    >
        <video width="100%" controls>
            <source src={src} type="video/ogg" />
            <source src={src} type="video/mp4" />
            <source src={src} type="video/webm" />
            <object data={src} width="100%">
                <embed width="100%" src={src} />
            </object>
        </video>
    </div>
  );
};

interface Props {
  mimetype: string;
  'xlink:href': string;
}

export function Media({ mimetype, 'xlink:href': href }: PropsWithChildren<Props>) {
    switch (mimetype) {
        case 'video':
            return <Video href={href} />;
        default:
            return null;
    }
}

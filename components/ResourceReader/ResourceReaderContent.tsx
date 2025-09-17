import cx from 'classnames';
import { TableView } from './TableView';
import { TransformComponent } from 'react-zoom-pan-pinch';
import { useMemo } from 'react';
import { useGraphicUrl } from '../../hooks';
import { SvgIcon } from '@/components/SvgIcon';

const ImageView = (props: any) => {
    const current = props.current;
    const width = props.width;
   const src = useGraphicUrl(current.graphics);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <TransformComponent>
                {src ? (
                    <img 
                        className="inline-block h-screen object-contain" 
                        style={{ width }} 
                        src={src} 
                        alt="Content image"
                    />
                ) : (
                    <span></span>
                )}
            </TransformComponent>
        </div>
    );
};

interface Props {
    max: number;
    visibleDetails: boolean;
    visibleList: boolean;
    current: any;
    // tableMode: any;
    currentList: any[];
    type: "image" | "table";
    id: string
    setCurrent: (current: { id: string; type: "image" | "table" }) => void;
}

export default function ResourceReaderContent(props: Props) {
    const { max, visibleDetails, visibleList, current, currentList, setCurrent, type, id } = props;

    const currentIndex = useMemo(() => {
        return currentList.findIndex((item) => item.id === id);
    }, [currentList, id]);


    const handlePrev = () => {
        setCurrent({
            id: currentList[currentIndex - 1].id,
            type,
        });
    };

    const handleNext = () => {
        setCurrent({
            id: currentList[currentIndex + 1].id,
            type,
        });
    };

    const width = useMemo(() => {
        if (visibleDetails && visibleList) {
            return 'calc(100vw - 500px)';
        }
        if (visibleDetails) {
            return 'calc(100vw - 300px)';
        }
        if (visibleList) {
            return 'calc(100vw - 200px)';
        }

        return '100vw';
    }, [visibleDetails, visibleList]);

    return (
        <div className="flex-1 relative">
            {type === 'image' && (
                <div className="h-full w-full">
                    <ImageView
                        current={current}
                        width={width}
                    />
                </div>
            )}

            {type === 'table' && (
                <div className="h-full w-full">
                        <TableView 
                        current={current} 
                        width={width}
                        />
                </div>
            )}

            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
                <div
                    className={cx('absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 w-[50px] h-[80px] flex items-center justify-center hover:bg-gray-500', {
                        'cursor-pointer': currentIndex !== 0,
                        'pointer-events-none': currentIndex === 0,
                    })}
                    onClick={handlePrev}
                >
                    <SvgIcon className={cx('text-white', {
                        'text-gray-300': currentIndex === 0,
                    })} icon="icon-xiangzuo" />
                </div>
                <div
                    className={cx('absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 w-[50px] h-[80px] flex items-center justify-center hover:bg-gray-500', {
                        'cursor-pointer': currentIndex !== max,
                        'pointer-events-none': currentIndex === max,
                    })}
                    onClick={handleNext}
                >
                    <SvgIcon className={cx('text-white', {
                        'text-gray-300': currentIndex === max,
                    })} icon="icon-xiangyou" />
                </div>
            </div>
        </div>
    );
}
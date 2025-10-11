import React, { useState } from 'react';
import { defaultScale, maxScale, minScale } from './const';
import { useControls, useTransformEffect } from 'react-zoom-pan-pinch';
import { Tooltip } from 'antd';
import { SvgIcon } from '@/components/SvgIcon';


const Divider = () => {
    return                 <div className='h-3 border-r border-[var(--kx-text-w40)] mx-4'>
                </div>
}

function IconWrapper(props: any) {
    return (
        <Tooltip
            title={props.tooltip}
        >
            <button
                onClick={props.onClick}
                style={props.style}
                className={`relative w-9 h-9 flex items-center rounded-lg justify-center mr-2 ${props.active ? 'bg-blue-600' : "hover:bg-[var(--kx-fill-tsp4)]"} ${props.disabled ? 'pointer-events-none' : ''}`}
            >
                <SvgIcon 
                    icon={props.icon} 
                    className={`
                        text-base text-white
                        ${props.disabled ? 'text-gray-400' : ''}
                        ${props.className || ''}
                    `} 
                />
            </button>
        </Tooltip>
    );
}

interface ResourceReaderHeaderProps {
    visibleDetails: boolean;
    visibleList: boolean;
    setVisibleList: React.Dispatch<React.SetStateAction<boolean>>;
    setVisibleDetails: React.Dispatch<React.SetStateAction<boolean>>;

    current: any;
    onClose: () => void;
    title: any;
    type: "image" | "table";
    doi: string;
}

const ResourceReaderHeader = (props: ResourceReaderHeaderProps) => {
    const {
        visibleDetails,
        setVisibleDetails,
        setVisibleList,
        visibleList,
        onClose,
        title,
    } = props;

    // const getSuffix = () => {
    //     const arr = src?.split('.');
    //     const suffix = arr[arr.length - 1];
    //     return suffix;
    // };

    // const getFileName = () => {
    //     if (doi) {
    //         return doi + '.' + getSuffix();
    //     }
    //     const arr = src?.split('/');
    //     return arr[arr.length - 1];
    // };

    const controls = useControls();
    const [scale, setScale] = useState(defaultScale);

    useTransformEffect((ref) => {
        if (scale !== ref.state.scale) {
            setScale(ref.state.scale);
        }
    });

    return (
        <header
            className={`
                h-16 px-6 flex items-center justify-between w-full absolute z-10 box-border
                border-b border-[var(--kx-fill-6)] bg-[var(--kx-fill-7)]
                ${visibleDetails || visibleList ? 'border-b' : ''}
            `}
        >
            <div className="flex items-center text-white text-sm font-normal">
                <div 
                    onClick={onClose} 
                    className="cursor-pointer flex items-center py-2 px-3 rounded-lg whitespace-nowrap hover:bg-blue-600"
                >
                    <SvgIcon icon="icon-chexiao" className="text-base mr-1.5" />
                    返回文章
                </div>
                <Divider />
                <IconWrapper
                    icon="icon-zuocesuolvetu"
                    tooltip={<div>查看所有</div>}
                    onClick={() => {
                        setVisibleList((pre) => !pre);
                    }}
                    style={{
                        margin: '0',
                    }}
                />
            </div>
            <div className="text-white text-sm px-12 whitespace-nowrap overflow-hidden text-ellipsis">
                {title}
            </div>
            <div className="flex items-center text-white text-sm font-normal">
                <IconWrapper
                    icon="icon-tips"
                    active={visibleDetails}
                    onClick={() => {
                        setVisibleDetails((pre) => !pre);
                    }}
                    tooltip="备注"
                />
                { <>
                
                                        <IconWrapper
                            icon="icon-suoxiaochakan"
                            onClick={() => controls.zoomOut()}
                            tooltip='缩小'
                            disabled={scale === minScale}
                        />
                        <IconWrapper
                            icon="icon-fangdachakan"
                            onClick={() => controls.zoomIn()}
                            tooltip="放大"
                            disabled={scale === maxScale}
                        />
                </>}
                {/* {type === 'table' && (
                    <IconWrapper
                        disabled={!current?.src}
                        // tooltip={t(
                        //     tableMode === TableMode.dom ? 'convertToImage' : 'convertToTable'
                        // )}
                        icon={
                            tableMode === TableMode.dom
                                ? 'icon-zhinengfuzhuyuedu'
                                : 'icon-zhinengfuzhuyuedu'
                        }
                        onClick={() => {
                            setTableMode(
                                tableMode === TableMode.dom ? TableMode.image : TableMode.dom
                            );
                        }}
                    />
                )} */}
                {/* <Divider />
                <IconWrapper
                    icon="icon-xiazai"
                    disabled={!src}
                    onClick={() => downloadFileNoSuffix(src, getFileName())}
                    tooltip="下载"
                    style={{
                        margin: '0',
                    }}
                /> */}
            </div>
        </header>
    );
};

export default ResourceReaderHeader;
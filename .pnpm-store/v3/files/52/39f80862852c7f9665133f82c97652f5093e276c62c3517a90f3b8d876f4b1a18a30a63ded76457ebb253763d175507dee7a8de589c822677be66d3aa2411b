/// <reference types="react" />
import type { DataType, ReachMoveFunction, ReachFunction, PhotoTapFunction, BrokenElementParams, ExposedProperties } from './types';
import './PhotoBox.less';
export interface PhotoBoxProps {
    item: DataType;
    visible: boolean;
    speed: number;
    easing: string;
    wrapClassName?: string;
    className?: string;
    style?: object;
    loadingElement?: JSX.Element;
    brokenElement?: JSX.Element | ((photoProps: BrokenElementParams) => JSX.Element);
    onPhotoTap: PhotoTapFunction;
    onMaskTap: PhotoTapFunction;
    onReachMove: ReachMoveFunction;
    onReachUp: ReachFunction;
    onPhotoResize: () => void;
    expose: (state: ExposedProperties) => void;
    isActive: boolean;
}
export default function PhotoBox({ item: { src, render, width: customWidth, height: customHeight, originRef }, visible, speed, easing, wrapClassName, className, style, loadingElement, brokenElement, onPhotoTap, onMaskTap, onReachMove, onReachUp, onPhotoResize, isActive, expose, }: PhotoBoxProps): JSX.Element;

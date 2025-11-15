/**
 * 响应式工具函数
 */

import { Dimensions, PixelRatio } from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

/**
 * 设计稿基准宽度
 */
const BASE_WIDTH = 375

/**
 * 根据屏幕宽度进行响应式缩放
 */
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size
}

/**
 * 垂直方向缩放
 */
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / 812) * size
}

/**
 * 适度缩放（在 scale 的基础上减少缩放程度）
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor
}

/**
 * 屏幕尺寸断点
 */
export const breakpoints = {
  xs: 320,
  sm: 375,
  md: 414,
  lg: 768,
  xl: 1024,
}

/**
 * 判断是否为平板
 */
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= breakpoints.lg
}

/**
 * 获取像素比
 */
export const getPixelRatio = (): number => {
  return PixelRatio.get()
}

/**
 * 屏幕尺寸
 */
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
}

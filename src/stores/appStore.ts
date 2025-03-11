import type { ThemeConfig } from 'antd'

import { theme as antdTheme } from 'antd'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  DEFAULT_LOCALE,
  HEADER_HEIGHT,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_WIDTH,
} from '@/constants/app'
import { projectSign } from '@/utils/string'

interface AppState {
  // Layout
  headerHeight: number
  sidebarWidth: number
  sidebarCollapsedWidth: number
  sidebarCollapsed: boolean
  toggleSidebarCollapsed: () => void

  // Theme
  isDark: boolean
  antdTheme: ThemeConfig
  toggleTheme: () => void
  setTheme: (dark: boolean) => void

  // Locale
  currentLocale: string
  setLocale: (locale: string) => void
}

// 检测系统主题偏好
function getSystemThemePreference(): boolean {
  if (typeof window !== 'undefined') {
    return window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      // Layout
      headerHeight: HEADER_HEIGHT,
      sidebarWidth: SIDEBAR_WIDTH,
      sidebarCollapsedWidth: SIDEBAR_COLLAPSED_WIDTH,
      sidebarCollapsed: false,
      toggleSidebarCollapsed: () => set(state => ({
        sidebarCollapsed: !state.sidebarCollapsed,
      })),

      // Theme
      isDark: getSystemThemePreference(),
      antdTheme: {
        algorithm: getSystemThemePreference()
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
      },
      toggleTheme: () => set((state) => {
        const newIsDark = !state.isDark
        return {
          isDark: newIsDark,
          antdTheme: {
            algorithm: newIsDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          },
        }
      }),
      setTheme: (dark: boolean) => set({
        isDark: dark,
        antdTheme: {
          algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        },
      }),

      // Locale
      currentLocale: DEFAULT_LOCALE,
      setLocale: (locale: string) => set({ currentLocale: locale }),
    }),
    {
      name: projectSign('app-storage'), // localStorage 中的键名
      partialize: state => ({
        // 只持久化这些字段
        sidebarCollapsed: state.sidebarCollapsed,
        isDark: state.isDark,
        currentLocale: state.currentLocale,
      }),
    },
  ),
)

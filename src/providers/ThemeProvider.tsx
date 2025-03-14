import type { ReactNode } from 'react'

import { ConfigProvider, theme } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useAppStore } from '@/stores'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isDark, currentLocale } = useAppStore(
    useShallow(state => ({
      isDark: state.isDark,
      currentLocale: state.currentLocale,
    })),
  )

  useEffect(() => {
    // 根据主题状态在 HTML 元素上添加或移除 dark 类
    const root = window.document.documentElement

    if (isDark) {
      root.classList.add('dark')
    }
    else {
      root.classList.remove('dark')
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      useAppStore.getState().setTheme(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [isDark])

  return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }} locale={currentLocale === 'zh-CN' ? zhCN : enUS}>
      {children}
    </ConfigProvider>
  )
}

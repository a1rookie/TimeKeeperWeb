/**
 * TimeKeeper - React Native 应用主入口
 * 提供全局 Provider 和应用初始化逻辑
 */

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { queryClient } from './providers/query-client'

// TODO: 导入导航容器
// import { NavigationContainer } from '@react-navigation/native'
// import RootNavigator from './navigation/RootNavigator'

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {/* TODO: 添加导航容器 */}
          {/* <NavigationContainer>
            <RootNavigator />
          </NavigationContainer> */}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App

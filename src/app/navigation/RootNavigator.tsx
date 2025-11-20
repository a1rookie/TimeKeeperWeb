/**
 * 根导航器
 * 管理认证流程和主应用之间的切换
 */

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuthStore } from '@app/providers/auth.store'
import { LinkingConfiguration, type RootStackParamList } from './types'
import { AuthNavigator } from './AuthNavigator'
import { MainNavigator } from './MainNavigator'
import {
  TemplateMarketScreen,
  MyTemplatesScreen,
  TemplateDetailScreen,
  CreateTemplateScreen,
} from '@features/template/screens'

const Stack = createNativeStackNavigator<RootStackParamList>()

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore(
    (state: { isAuthenticated: boolean }) => state.isAuthenticated
  )

  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            {/* 模板相关页面 */}
            <Stack.Group screenOptions={{ headerShown: true, presentation: 'card' }}>
              <Stack.Screen
                name="TemplateMarket"
                component={TemplateMarketScreen}
                options={{ title: '模板市场' }}
              />
              <Stack.Screen
                name="MyTemplates"
                component={MyTemplatesScreen}
                options={{ title: '我的模板' }}
              />
              <Stack.Screen
                name="TemplateDetail"
                component={TemplateDetailScreen}
                options={{ title: '模板详情' }}
              />
              <Stack.Screen
                name="CreateTemplate"
                component={CreateTemplateScreen}
                options={{ title: '创建模板' }}
              />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

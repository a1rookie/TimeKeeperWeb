/**
 * 主应用导航器
 * 底部 Tab 导航
 */

import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { MainTabParamList } from './types'
import { RemindersNavigator } from './RemindersNavigator'
import { FamilyNavigator } from './FamilyNavigator'
import { ProfileNavigator } from './ProfileNavigator'

const Tab = createBottomTabNavigator<MainTabParamList>()

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="RemindersTab"
        component={RemindersNavigator}
        options={{
          tabBarLabel: '提醒',
          tabBarIcon: () => null, // 图标稍后实现
        }}
      />
      <Tab.Screen
        name="FamilyTab"
        component={FamilyNavigator}
        options={{
          tabBarLabel: '家庭',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  )
}

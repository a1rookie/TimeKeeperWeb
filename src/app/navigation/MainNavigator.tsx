/**
 * 主应用导航器
 * 底部 Tab 导航
 */

import React from 'react'
import { } from 'react-native'
import { TabIcon } from '@shared/components/TabIcon'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { MainTabParamList } from './types'
import { RemindersNavigator } from './RemindersNavigator'
import { FamilyNavigator } from './FamilyNavigator'
import { ProfileNavigator } from './ProfileNavigator'

const Tab = createBottomTabNavigator<MainTabParamList>()

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          height: 66,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
        },
        tabBarIcon: ({ focused }) => {
          // 使用自定义 TabIcon，使图标更美观
          if (route.name === 'RemindersTab') return <TabIcon icon="🔔" active={focused} />
          if (route.name === 'FamilyTab') return <TabIcon icon="🏡" active={focused} />
          if (route.name === 'ProfileTab') return <TabIcon icon="👤" active={focused} />
          return null
        },
      })}
    >
      <Tab.Screen
        name="RemindersTab"
        component={RemindersNavigator}
        options={{
          tabBarLabel: '提醒',
        }}
      />
      <Tab.Screen
        name="FamilyTab"
        component={FamilyNavigator}
        options={{
          tabBarLabel: '家庭',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: '我的',
        }}
      />
    </Tab.Navigator>
  )
}

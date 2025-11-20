/**
 * 个人中心导航器
 */

import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  ProfileHomeScreen,
  EditProfileScreen,
  SettingsScreen,
  AboutScreen,
} from '@features/profile/screens'
import type { ProfileStackParamList } from './types'

const Stack = createNativeStackNavigator<ProfileStackParamList>()

export const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} options={{ title: '我的' }} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: '编辑资料' }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '设置' }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: '关于' }} />
    </Stack.Navigator>
  )
}

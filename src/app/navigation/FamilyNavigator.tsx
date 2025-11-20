/**
 * 家庭模块导航器
 */

import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { FamilyStackParamList } from './types'
import {
  FamilyListScreen,
  FamilyDetailScreen,
  CreateFamilyScreen,
  EditFamilyScreen,
  InviteMemberScreen,
  InvitationsScreen,
} from '@features/family/screens'

const Stack = createNativeStackNavigator<FamilyStackParamList>()

export const FamilyNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="FamilyList" component={FamilyListScreen} options={{ title: '家庭组' }} />
      <Stack.Screen
        name="FamilyDetail"
        component={FamilyDetailScreen}
        options={{ title: '家庭详情' }}
      />
      <Stack.Screen
        name="CreateFamily"
        component={CreateFamilyScreen}
        options={{ title: '创建家庭组' }}
      />
      <Stack.Screen
        name="EditFamily"
        component={EditFamilyScreen}
        options={{ title: '编辑家庭组' }}
      />
      <Stack.Screen
        name="InviteMember"
        component={InviteMemberScreen}
        options={{ title: '邀请成员' }}
      />
      <Stack.Screen
        name="Invitations"
        component={InvitationsScreen}
        options={{ title: '我的邀请' }}
      />
    </Stack.Navigator>
  )
}

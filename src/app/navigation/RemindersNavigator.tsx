/**
 * 提醒模块导航器
 */

import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  ReminderListScreen,
  ReminderDetailScreen,
  CreateReminderScreen,
  EditReminderScreen,
  CompletionRecordsScreen,
} from '@features/reminders/screens'
import type { RemindersStackParamList } from './types'

const Stack = createNativeStackNavigator<RemindersStackParamList>()

export const RemindersNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ReminderList"
        component={ReminderListScreen}
        options={{ title: '我的提醒' }}
      />
      <Stack.Screen
        name="ReminderDetail"
        component={ReminderDetailScreen}
        options={{ title: '提醒详情' }}
      />
      <Stack.Screen
        name="CreateReminder"
        component={CreateReminderScreen}
        options={{ title: '创建提醒' }}
      />
      <Stack.Screen
        name="EditReminder"
        component={EditReminderScreen}
        options={{ title: '编辑提醒' }}
      />
      <Stack.Screen
        name="CompletionRecords"
        component={CompletionRecordsScreen}
        options={{ title: '完成记录' }}
      />
    </Stack.Navigator>
  )
}

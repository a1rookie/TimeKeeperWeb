/**
 * TimeKeeper Mobile App - 应用入口文件
 * @format
 */

import React from 'react'
import { AppRegistry } from 'react-native'
import App from './src/app/App'
import { name as appName } from './app.json'

// 注册主应用组件
AppRegistry.registerComponent(appName, () => App)

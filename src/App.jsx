import React from 'react'
import Dashboard from '@/pages/dashboard.jsx'
import { $w } from './wedaMock.js'

export default function App() {
  return <Dashboard $w={$w} />
}
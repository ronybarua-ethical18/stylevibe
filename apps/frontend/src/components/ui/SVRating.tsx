"use client"

import { Rate } from 'antd'
import React from 'react'

export default function SVRating({ value }: { value: number }) {
  return <Rate allowHalf defaultValue={value} style={{color:"#6a9cff"}} />
}

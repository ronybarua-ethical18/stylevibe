import React from 'react'
import SVSectionTitle from '../SVSectionTitle'
import { Col, Row } from 'antd'
import { dummyBlogs } from '@/utils/dummyServices'
import Image from 'next/image'
import dummyImage from '@/assets/5.jpg'
import moment from 'moment'
import { FaEdit } from 'react-icons/fa'
import SVButton from '../SVButton'
import SVCollapse from './SVCollapse'

export default function SVFAQ() {
  return (
    <div className=" w-2/4 m-auto">
      <SVSectionTitle title1="FREQUENTLY ASKED" title2="QUESTIONS" />
      <SVCollapse />
    
    </div>
  )
}

import { Col, Row } from 'antd';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';
import { FaEdit } from 'react-icons/fa';

import dummyImage from '../../../public/5.jpg';
import SVButton from '../SVButton';
import SVSectionTitle from '../SVSectionTitle';

import { dummyBlogs } from '@/utils/dummyServices';

export default function SVLatestBlogs() {
  return (
    <div className="">
      <SVSectionTitle title1="OUR LATEST" title2="BLOGS" />
      <div className="w-3/4 m-auto">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {dummyBlogs.map((blog, index) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={8}
              xl={8}
              key={index}
              className="mb-8 w-full h-full"
            >
              <div className="p-4 w-full h-full shadow-review-card">
                <div className="relative overflow-hidden">
                  <Image
                    src={dummyImage}
                    style={{ objectFit: 'cover' }}
                    alt=""
                    className="transform transition-all duration-500 hover:scale-110 hover:-rotate-1"
                  />
                </div>
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center">
                    <FaEdit className="text-gray-600" />
                    <h6 className="text-gray-600 font-normal ml-2">
                      {blog.author}
                    </h6>
                  </div>
                  <h6 className="text-gray-600 font-normal">
                    {moment(blog.createdAt).format('YYYY-MM-DD')}
                  </h6>
                </div>
                <h2 className="text-2xl font-normal">{blog.title}</h2>
                <p className="mt-8">{blog.content}</p>
                <div className="flex flex-wrap mt-8">
                  {blog.tags.map((tag, index) => (
                    <p
                      key={index}
                      className="p-2 rounded-md border border-customPrimary-800 text-customPrimary-800 mr-2 mt-2"
                    >
                      {' '}
                      {tag}
                    </p>
                  ))}
                </div>
                <SVButton
                  title="Learn more"
                  className="w-full mt-10"
                  style={{ background: '#4d3ca3' }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

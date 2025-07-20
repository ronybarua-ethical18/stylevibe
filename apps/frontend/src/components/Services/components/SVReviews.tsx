import Image from 'next/image';
import React from 'react';
import moment from 'moment';
import { reviews } from '@/utils/dummyServices';
import SVRating from '@/components/ui/SVRating';

export default function SVReviews() {
  return reviews.map((review: any) => (
    <div className="flex items-center mb-10" key={review.id}>
      <div className="flex mr-14 items-center w-[200px]">
        <Image
          src={review.user.img}
          alt="user image"
          width={40}
          height={40}
          className="rounded-full object-cover"
          style={{ width: '50px', height: '50px' }}
        />
        <div className="ml-5">
          <h1 className="font-medium my-0">
            {review.user.firstName + ' ' + review.user.lastName}
          </h1>
          <div className="bg-[#f6f5fb] px-2 py-1 rounded-md text-gray-700 mt-1">
            <strong className="text-xs font-medium text-[#8895a5]">
              {review.user.role}
            </strong>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full">
        <div>
          <SVRating value={review.rating} />
          <p className="mt-2">{review.comment}</p>
        </div>
        <p className="text-xs text-[#8895a5] font-light">
          {moment(review.date).format('MMMM Do YYYY, h:mm:ss a')}
        </p>
      </div>
    </div>
  ));
}

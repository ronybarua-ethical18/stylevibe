/* eslint-disable jsx-a11y/alt-text */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SVServiceCard from './SVServiceCard';
import SVTypesOfServices from './SVTypesOfServices';
import SVHowItWorks from './SVHowItWorks';
import SVTotalClients from './SVTotalClients';
import SVClientReview from './SVClientReview';
import SVLatestBlogs from './SVLatestBlogs';
import SVFAQ from './SVFAQ';
import SVNewsLetter from './SVNewsLetter';
import SVFooter from './SVFooter';
import SVHeroSection from './SVHeroSection';
import SVNavMenus from './SVNavMenus';
import SVHeaderCarousel from './SVHeaderCarousel';
import AuthButton from '@/app/components/AuthButton';
import { getUserInfo } from '@/services/auth.service';
import { BiLogOut } from 'react-icons/bi';
import { removeUserInfo } from '@/utils/handleLocalStorage';
import { authKey } from '@/constants/authKey';
import { useGetTopServicesQuery } from '@/redux/api/services';

export default function LandingPage() {
  const userInfo: any = getUserInfo();
  const role = userInfo?.role;
  const router = useRouter();
  const { data: services, isLoading: servicesLoading } = useGetTopServicesQuery(
    {}
  );

  return (
    <div>
      <div className="bg-customPrimary-800 h-screen">
        <div className="flex justify-between z-50">
          <div className="w-2/4 pt-10 pl-[13%] pr-[2%]">
            <SVNavMenus />
            <SVHeroSection />
          </div>

          <div
            className="logo bg-white w-2/4 pt-10 text-right pr-[13%] pl-[3%]"
            style={{
              borderRadius: '49% 0% 0% 50% / 49% 18% 10% 51%',
              overflow: 'hidden',
            }}
          >
            {/* Place your logo here */}
            <div className="flex justify-end items-center">
              <h1 className="mr-5">
                <strong className="text-customPrimary-800 text-3xl font-semibold">
                  Style
                </strong>
                <span className="text-customPrimary-800 text-3xl font-thin">
                  Vibe
                </span>
              </h1>
              {role ? (
                <div className="flex items-center">
                  <Link
                    className="text-customPrimary-800"
                    href={`/${role}/dashboard`}
                  >
                    Dashboard
                  </Link>{' '}
                  <BiLogOut
                    className="ml-5 text-xl cursor-pointer text-customPrimary-800"
                    onClick={() => {
                      removeUserInfo(authKey);
                      router.push('/login');
                    }}
                  />
                </div>
              ) : (
                <AuthButton />
              )}
            </div>
            <div className="h-screen mt-20">
              <div>
                <SVHeaderCarousel />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SVServiceCard services={services?.data} loading={servicesLoading} />
      <SVHowItWorks />
      <SVTypesOfServices />
      <SVTotalClients />
      <SVClientReview />
      <SVLatestBlogs />
      <SVFAQ />
      <SVNewsLetter />
      <SVFooter />
    </div>
  );
}

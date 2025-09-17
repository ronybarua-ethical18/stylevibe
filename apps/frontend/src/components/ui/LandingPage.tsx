'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { BiLogOut } from 'react-icons/bi';

import SVClientReview from './SVClientReview';
import SVFAQ from './SVFAQ';
import SVFooter from './SVFooter';
import SVHeaderCarousel from './SVHeaderCarousel';
import SVHeroSection from './SVHeroSection';
import SVHowItWorks from './SVHowItWorks';
import SVLatestBlogs from './SVLatestBlogs';
import SVNavMenus from './SVNavMenus';
import SVNewsLetter from './SVNewsLetter';
import SVServiceCard from './SVServiceCard';
import SVTotalClients from './SVTotalClients';
import SVTypesOfServices from './SVTypesOfServices';

import AuthButton from '@/app/components/AuthButton';
import { authKey } from '@/constants/authKey';
import { useGetTopServicesQuery } from '@/redux/api/services';
import { removeUserInfo } from '@/utils/handleLocalStorage';
import { useUserInfo } from '@/hooks/useUserInfo';
import { NavigationService } from '@/services/navigation.service';

export default function LandingPage() {
  const { userInfo } = useUserInfo();
  const role = userInfo?.role;
  const router = useRouter();

  // Compute needsRoleSelection using NavigationService
  const needsRoleSelection =
    NavigationService.shouldRedirectToRoleSelection(userInfo);

  const { data: services, isLoading: servicesLoading } = useGetTopServicesQuery(
    {}
  );

  useEffect(() => {
    if (needsRoleSelection) {
      router.push('/select-role');
    }
  }, [needsRoleSelection]);

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

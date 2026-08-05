'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import SVClientReview from './SVClientReview';
import SVFAQ from './SVFAQ';
import SVFooter from './SVFooter';
import SVForProfessionals from './SVForProfessionals';
import SVHeroSection from './SVHeroSection';
import SVHowItWorks from './SVHowItWorks';
import SVNavMenus from './SVNavMenus';
import SVNewsLetter from './SVNewsLetter';
import SVServiceCard from './SVServiceCard';
import SVTypesOfServices from './SVTypesOfServices';
import SVWhyStyleVibe from './SVWhyStyleVibe';
import { useGetTopServicesQuery } from '@/redux/api/services';
import { useUserInfo } from '@/hooks/useUserInfo';
import { NavigationService } from '@/services/navigation.service';

export default function LandingPage() {
  const { userInfo } = useUserInfo();
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
    <div className="max-w-[1950px] mx-auto">
      {/* Sticky Navbar */}
      <SVNavMenus />

      {/* Hero */}
      <SVHeroSection />

      {/* Rest of the landing page content */}
      <SVServiceCard services={services?.data} loading={servicesLoading} />
      <SVHowItWorks />
      <SVTypesOfServices />
      <SVWhyStyleVibe />
      <SVClientReview />
      <SVForProfessionals />
      <SVFAQ />
      <SVNewsLetter />
      <SVFooter />
    </div>
  );
}

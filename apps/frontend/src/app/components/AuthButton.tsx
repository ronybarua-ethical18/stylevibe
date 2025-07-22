import Link from 'next/link';
import { useSession, signOut, signIn } from 'next-auth/react';
import { FaUser } from 'react-icons/fa';

import { getFromLocalStorage } from '@/utils/handleLocalStorage';
import { authKey } from '@/constants/authKey';

export default function AuthButton() {
  const { data: session } = useSession();
  const userInfo: any = getFromLocalStorage(authKey);
  console.log('userInfo', userInfo);

  if (session || userInfo?.role) {
    return (
      <>
        <div
          onClick={() => signOut()}
          className="mr-5 rounded-3xl py-2 px-4 border border-customPrimary-800 text-customPrimary-800 flex items-center"
        >
          <FaUser className="text-customPrimary-800 mr-2" />
          Sign Out
        </div>
        {/* <Button onClick={() => signOut()}>Sign out</Button> */}
      </>
    );
  }
  return (
    <>
      <Link
        href="/login"
        onClick={() => signIn()}
        className="mr-5 rounded-3xl py-2 px-4 border border-customPrimary-800 text-customPrimary-800 flex items-center"
      >
        <FaUser className="text-customPrimary-800 mr-2" />
        Sign In
      </Link>
    </>
  );
}

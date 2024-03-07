'use client';

import Image from 'next/image';
import loginPage from '../../public/images/login-page.jpeg';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const handleRegisterClick = () => {
    router.push('/register');
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-blue-100">
      <Image
        src={loginPage}
        alt="login-page"
        className="h-[68%] w-[200%] object-cover object-right"
      />

      <div className="mt-6 h-[30%] w-full max-w-screen-sm text-center">
        <h1 className="text-blue-text mb-6 px-5 text-left text-xl font-bold leading-7">
          Register to Journie
        </h1>
        <button
          onClick={handleRegisterClick}
          className="text-blue-text text-16 border-blue-border mb-2 h-12 w-[94%] rounded-[5px] border bg-white px-5 font-medium"
        >
          Register
        </button>
        <button className="text-blue-text text-16 mx-10 mb-2 h-12 font-medium">
          Already have an account
        </button>
        <button className="bg-blue-text text-16 rounded-5 h-12 w-[94%] rounded-[5px]  border text-center font-medium text-white">
          Login
        </button>
      </div>
    </div>
  );
}

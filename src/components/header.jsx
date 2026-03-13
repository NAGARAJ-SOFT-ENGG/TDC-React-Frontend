import { Bell, User } from 'lucide-react';
import { LOGO } from '@assets';

export const Header = () => {
  return (
   <header className="bg-headerBG shadow-md border-b border-gray-200 h-16 z-10">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <img src={LOGO} alt="Logo" className="w-10 h-10 animate-spin-slow" />
          <h1 className=" text-[#005AC7] font-bold text-2xl font-[Oswald] hidden sm:block">
            Tour de Cabs
          </h1>
        </div>
        <div className="flex items-center space-x-3">
           <div className="w-8 h-8 bg-headerBG rounded-full flex items-center justify-center cursor-pointer">
             <Bell className="w-5 h-5 text-white hover:text-icon" />
          </div>
          <div className="w-8 h-8 bg-headerBG rounded-full flex items-center justify-center cursor-pointer ">
            <User className="w-5 h-5 text-white hover:text-icon" />
          </div>
        </div>
      </div>
    </header>
  );
};
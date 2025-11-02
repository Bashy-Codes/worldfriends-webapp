import { Bell, Store, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="mx-4 mt-4 mb-6">
      <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and App Name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WF</span>
            </div>
            <h1 className="text-xl font-semibold text-white">
              WorldFriends
            </h1>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Store className="w-5 h-5 text-gray-300" />
            </button>
            
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
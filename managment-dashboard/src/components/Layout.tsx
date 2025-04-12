// import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAtom } from 'jotai';
// import { authAtom } from '@/model/atoms';
// import { logout } from '@/utils/authUtils';

// const Layout = () => {
//   const [auth] = useAtom(authAtom);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const isActive = (path: string) => {
//     return location.pathname === path ? 'bg-gray-800' : '';
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header */}
//       <header className="bg-gray-900 text-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//           <Link to="/" className="text-xl font-bold">Dashboard</Link>
//           <div className="flex items-center gap-4">
//             <span className="text-sm">{auth?.username}</span>
//             <button
//               onClick={handleLogout}
//               className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-md transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="w-64 bg-gray-900 text-white">
//           <nav className="py-4">
//             <ul className="space-y-1">
//               <li>
//                 <Link
//                   to="/"
//                   className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive('/')}`}
//                 >
//                   <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                   </svg>
//                   Dashboard
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/region"
//                   className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive('/region')}`}
//                 >
//                   <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
//                   </svg>
//                   Regions
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/account"
//                   className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive('/account')}`}
//                 >
//                   <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                   Account
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 bg-gray-100">
//           <div className="p-6">
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-400 py-4">
//         <div className="max-w-7xl mx-auto px-4 text-center text-sm">
//           &copy; {new Date().getFullYear()} Dashboard App. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Layout;

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ApiService } from "@/lib/api"
import { emailAtom, refreshTokenAtom, roleAtom, tokenAtom, usernameAtom } from "@/model/atoms"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { Outlet, useLocation, useNavigation } from "react-router"
import { AppSidebar } from "./app-sidebar"
import {data} from "@/components/app-sidebar"

const Layout = () => {
  return (
    <div className="w-full p-0">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="">
          <header className="w-full flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  {location.pathname}``
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage></BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <Outlet />
        </SidebarInset>

      </SidebarProvider>
    </div>
  )
}

export default Layout

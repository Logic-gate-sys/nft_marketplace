import React, { useState } from "react";
import Logo from "../../assets/logo.svg";
import {
  FileOutlined,
  UserOutlined,
  SettingOutlined,
  MenuOutlined,
  HomeOutlined,
  AppstoreOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const navLinks = [
  { label: "Explore", path: "/", icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z" /></svg> },
  
  { label: "Market Place", path: "/marketplace", icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="M440-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240v720Zm-80-80v-560H200v560h160Zm160-320v-320h240q33 0 56.5 23.5T840-760v240H520Zm80-80h160v-160H600v160Zm-80 480v-320h320v240q0 33-23.5 56.5T760-120H520Zm80-80h160v-160H600v160ZM360-480Zm240-120Zm0 240Z" /></svg> },
  
  { label: "Studio", path: "/studio", icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="M160-120v-170l527-526q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L330-120H160Zm80-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-36-19-62t-51-45l-59 59q23 10 36 22t13 26q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM183-426l60-60q-20-8-31.5-16.5T200-520q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-11 13-9 29t15 26q13 11 29 9t27-13q14-14 31-20t42-6q41 0 60.5 12t19.5 28q0 14-17.5 25.5T262-654q-80 35-111 63.5T120-520q0 32 17 54.5t46 39.5Z" /></svg> },
  
  { label: "Profile", path: "/profile", icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" /></svg> },
  
  { label: "Settings", path: "/settings", icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" /></svg> },
  
  { label: "FAQs", path: "/faqs", icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="m480-80-10-120h-10q-142 0-241-99t-99-241q0-142 99-241t241-99q71 0 132.5 26.5t108 73q46.5 46.5 73 108T800-540q0 75-24.5 144t-67 128q-42.5 59-101 107T480-80Zm80-146q71-60 115.5-140.5T720-540q0-109-75.5-184.5T460-800q-109 0-184.5 75.5T200-540q0 109 75.5 184.5T460-280h100v54Zm-101-95q17 0 29-12t12-29q0-17-12-29t-29-12q-17 0-29 12t-12 29q0 17 12 29t29 12Zm-29-127h60q0-30 6-42t38-44q18-18 30-39t12-45q0-51-34.5-76.5T460-720q-44 0-74 24.5T344-636l56 22q5-17 19-33.5t41-16.5q27 0 40.5 15t13.5 33q0 17-10 30.5T480-558q-35 30-42.5 47.5T430-448Zm30-65Z" /></svg> },
];

const Nav: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mouseOnIt, setMouseOnIt] = useState<boolean>(false);

  return (
    <nav>
      {/* Mobile View */}
      <div className="flex items-center md:hidden z-50 bg-os-bg-tertiary border-b border-os-border">
        <div className="flex items-center gap-2 p-3">
          <button 
            className="p-2 rounded-lg hover:bg-os-bg-hover transition-colors"
            onClick={() => setIsMobile(!isMobile)}
          >
            <MenuOutlined className="text-xl text-os-text-primary" />
          </button>
          <img src={Logo} alt="logo" height={30} width={30} />
          <h1 className="font-bold text-os-text-primary text-lg">Memora</h1>
        </div>

        {isMobile && (
          <div 
            className="modal-overlay"
            onClick={() => setIsMobile(false)}
          >
            <div 
              className="h-full w-64 bg-os-bg-tertiary flex flex-col p-4 shadow-os-lg animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 px-3 py-4 border-b border-os-border mb-2">
                <img src={Logo} alt="logo" height={32} width={32} />
                <h1 className="font-bold text-os-text-primary text-lg">Memora</h1>
              </div>

              <nav className="space-y-1">
                {navLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.path}
                    onClick={() => setIsMobile(false)}
                    className={({ isActive }) =>
                      isActive ? 'nav-link-active' : 'nav-link'
                    }
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-sm font-medium">{link.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div
        className="hidden md:flex flex-col h-screen bg-os-bg-tertiary border-r border-os-border transition-all duration-300"
        style={{ width: mouseOnIt ? '240px' : '72px' }}
        onMouseEnter={() => setMouseOnIt(true)}
        onMouseLeave={() => setMouseOnIt(false)}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-os-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <img src={Logo} alt="logo" height={32} width={32} className="flex-shrink-0" />
            <h1 
              className={`font-bold text-gradient-blue text-lg whitespace-nowrap transition-opacity duration-300 ${
                mouseOnIt ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Memora
            </h1>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                isActive ? 'nav-link-active' : 'nav-link'
              }
            >
              <span className="text-xl flex-shrink-0">{link.icon}</span>
              <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
                mouseOnIt ? 'opacity-100' : 'opacity-0'
              }`}>
                {link.label}
              </span>
            </NavLink>
          ))}
        </div>

        {/* Footer Stats */}
        <div className={`px-4 py-4 border-t border-os-border transition-opacity duration-300 ${
          mouseOnIt ? 'opacity-100' : 'opacity-0'
          }`}>
          {/* --- -------------->>> _______________------ */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-os-text-tertiary">
              <span>Gas Price</span>
              <span className="text-os-text-primary font-semibold">12 gwei</span>
            </div>
            <div className="flex justify-between text-os-text-tertiary">
              <span>ETH Price</span>
              <span className="text-os-text-primary font-semibold">$3,500</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

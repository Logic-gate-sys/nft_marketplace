import React, { useState } from "react";
import Logo from "../../assets/logo.svg";
import { Typography } from "antd";
import {
  FileOutlined,
  UserOutlined,
  SettingOutlined,
  MenuOutlined,
  HomeOutlined,
  AppstoreOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Text, Title } = Typography;

const Nav: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mouseOnIt, setMouseOnIt] = useState<boolean>(false);

  // Toggle mobile menu
  const openNav = () => setIsMobile((prev) => !prev);

  return (
    <nav
      id="nav-container"
      className={!isMobile ? "sticky" : "h-full sticky"}
    >
      {/* Mobile View */}
      <div className="flex items-center md:hidden z-99" id="mobile-view-nav">
        <div className="flex items-center gap-1 mr-auto md:hidden" id="menu-and-logo">
          <MenuOutlined
            className="p-3 text-3xl active:scale-95"
            onClick={openNav}
          />
          <img src={Logo} alt="logo" height={30} width={30} />
          <h1 className="font-extrabold text-white">Mint-Muse</h1>
        </div>

        {isMobile && (
          <div
            id="mobile-menus"
            className="absolute top-13 md:hidden z-990"
          >
            <div className="h-[55rem] w-64 bg-gray-900 flex flex-col gap-5" id="menu-contents">
              <div className="flex gap-1.5 items-center rounded-xs hover:bg-gray-500/50">
                <HomeOutlined className="p-3 text-xl" />
                <Link to="/" onClick={() => setIsMobile(false)} className="text-xl">
                  Home
                </Link>
              </div>
              <div className="flex items-center gap-1 rounded-xs hover:bg-gray-500/50">
                <AppstoreOutlined className="p-3 text-xl" />
                <Link to="/nft-market" onClick={() => setIsMobile(false)} className="text-xl">
                  Discover
                </Link>
              </div>
              <div className="flex items-center gap-1 rounded-xs hover:bg-gray-500/50">
                <FileOutlined className="p-3 text-xl" />
                <Link to="/upload" onClick={() => setIsMobile(false)} className="text-xl">
                  Upload/Mint
                </Link>
              </div>
              <div className="flex items-center gap-1 rounded-xs hover:bg-gray-500/50">
                <UserOutlined className="p-3 text-xl" />
                <Link to="/profile" onClick={() => setIsMobile(false)} className="text-xl">
                  Profile
                </Link>
              </div>
              <div className="flex items-center gap-1 rounded-xs hover:bg-gray-500/50">
                <SettingOutlined className="p-3 text-xl" />
                <Link to="/settings" onClick={() => setIsMobile(false)} className="text-xl">
                  Settings
                </Link>
              </div>
              <div className="flex items-center gap-1 rounded-xs hover:bg-gray-500/50">
                <QuestionOutlined className="p-3 text-xl" />
                <Link to="/faqs" onClick={() => setIsMobile(false)} className="text-xl">
                  FAQs
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div
        id="desktop-view"
        className="flex-col hidden p-2 text-white md:h-screen md:w-max md:bg-gray-900 md:flex shadow-3xl"
        onMouseEnter={() => setMouseOnIt(true)}
        onMouseLeave={() => setMouseOnIt(false)}
      >
        <div id="menu-contents" className="flex flex-col gap-3 pt-2 mb-auto font-bold">
          <div id="logo" className="flex items-center gap-1">
            <img src={Logo} alt="logo" height={30} width={30} className="p-1" />
            <h1 className={mouseOnIt ? "text-md font-bold" : "hidden"}>Mint-Muse</h1>
          </div>

          {[
            { icon: <HomeOutlined className="p-3 text-lg" />, path: "/", label: "Home" },
            { icon: <AppstoreOutlined className="p-3 text-lg" />, path: "/nft-market", label: "Discover" },
            { icon: <FileOutlined className="p-3 text-lg" />, path: "/upload", label: "Studio" },
            { icon: <UserOutlined className="p-3 text-lg" />, path: "/profile", label: "Profile" },
            { icon: <SettingOutlined className="p-3 text-lg" />, path: "/settings", label: "Settings" },
            { icon: <QuestionOutlined className="p-3 text-lg" />, path: "/faqs", label: "FAQs" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-1 rounded-xs hover:bg-gray-500/50">
              {item.icon}
              <Link to={item.path} onClick={() => setMouseOnIt(false)} className={mouseOnIt ? "text-md" : "hidden"}>
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Nav;

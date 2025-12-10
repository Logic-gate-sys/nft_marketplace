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

const navLinks = [
  { label: "Explore", path: "/", icon: <HomeOutlined className="p-3 text-xl md:text-lg" /> },
  { label: "Market Place", path: "/nft-market", icon: <AppstoreOutlined className="p-3 text-xl md:text-lg" /> },
  { label: "Studio", path: "/upload", icon: <FileOutlined className="p-3 text-xl md:text-lg" /> },
  { label: "Profile", path: "/profile", icon: <UserOutlined className="p-3 text-xl md:text-lg" /> },
  { label: "Settings", path: "/settings", icon: <SettingOutlined className="p-3 text-xl md:text-lg" /> },
  { label: "FAQs", path: "/faqs", icon: <QuestionOutlined className="p-3 text-xl md:text-lg" /> },
];

const Nav: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mouseOnIt, setMouseOnIt] = useState<boolean>(false);

  const openNav = () => setIsMobile((prev) => !prev);

  const renderLinks = (onClickHandler: () => void) =>
    navLinks.map((link, index) => (
      <div key={index} className="flex items-center gap-1 rounded-xs hover:bg-gray-500/50">
        {link.icon}
        <Link to={link.path} onClick={onClickHandler} className={mouseOnIt ? "text-md" : "text-xl md:hidden"}>
          {link.label}
        </Link>
      </div>
    ));

  return (
    <nav id="nav-container" className={!isMobile ? "sticky" : "h-full sticky"}>
      {/* Mobile View */}
      <div className="flex items-center md:hidden z-99" id="mobile-view-nav">
        <div className="flex items-center gap-1 mr-auto md:hidden" id="menu-and-logo">
          <MenuOutlined className="p-3 text-3xl active:scale-95" onClick={openNav} />
          <img src={Logo} alt="logo" height={30} width={30} />
          <h1 className="font-extrabold text-white">Memora</h1>
        </div>

        {isMobile && (
          <div id="mobile-menus" className="absolute top-13 md:hidden z-990">
            <div className="h-[55rem] w-64 bg-gray-900 flex flex-col gap-5" id="menu-contents">
              {renderLinks(() => setIsMobile(false))}
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
            <h1 className={mouseOnIt ? "text-lg text-pink-800 font-extra-bold" : "hidden"}>Memora</h1>
          </div>

          {renderLinks(() => setMouseOnIt(false))}
        </div>
      </div>
    </nav>
  );
};

export default Nav;

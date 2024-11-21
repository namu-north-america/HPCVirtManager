import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import LogoMark from "../../assets/images/svg/LogoMark.svg";
import LogoText from "../../assets/images/svg/LogoText.svg";

export default function LogoMenuItem({ isCollapsed }) {
  const navigate = useNavigate();

  const onLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <div 
      className={classNames("sidebar-item logo-menu-item", { 'collapsed': isCollapsed })}
      onClick={onLogoClick}
    >
      <div className="flex align-items-center">
        <img src={LogoMark} alt="Logo Mark" className="logo-icon" />
        {!isCollapsed && (
          <img src={LogoText} alt="Logo Text" className="logo-text ml-2" />
        )}
      </div>
    </div>
  );
} 
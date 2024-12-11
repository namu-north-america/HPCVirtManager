import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import classNames from "classnames";
import { Tooltip } from 'primereact/tooltip';

export default function SidebarItem(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const _title = props.title;
  const _items = props.items;
  const _onClick = props.onClick;
  const _link = props.link;
  const _icon = props.icon;
  const [isOpen, setIsOpen] = useState(false);

  const itemRef = useRef(null);

  const handleToggle = () => {
    if (!props.isCollapsed) {
      setIsOpen(!isOpen);
    }
  };

  const onItemClick = () => {
    if (_items && _items.length) {
      handleToggle();
      return;
    }
    if (_link) {
      navigate(_link);
      return;
    }

    if (_onClick) {
      _onClick();
      return;
    }
  };

  const getActive = (path) => {
    return path === location.pathname;
  };
  return (
    <>
      <div
        ref={itemRef}
        className={classNames("sidebar-item", {
          active: isOpen || getActive(_link),
        })}
        onClick={onItemClick}
        data-pr-tooltip={props.isCollapsed ? _title : null}
      >
        <div className="flex align-items-center">
          {_icon && typeof _icon === 'string' ? (
            <i className={`${_icon} text-lg`} />
          ) : (
            <span className="flex items-center justify-center w-[1.2rem]">{_icon}</span>
          )}
          <span className="ml-2">{_title}</span>
        </div>
        {_items?.length > 0 && !props.isCollapsed && (
          <i className={classNames("open-icon pi pi-angle-right", { open: isOpen })} />
        )}
      </div>
      <Tooltip target={itemRef} position="right" />
      
      {isOpen && !props.isCollapsed && _items && (
        <div className="menu-items">
          {_items.map((item, i) => (
            <MenuItem
              key={i}
              Svg={item?.icon}
              title={item?.title}
              items={item?.items}
              link={_link + item?.link}
              isCollapsed={props.isCollapsed}
            />
          ))}
        </div>
      )}
    </>
  );
}

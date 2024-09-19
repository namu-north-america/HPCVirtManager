import classNames from "classnames";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MenuItem(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const _title = props.title;
  const _items = props.items;
  const _onClick = props.onClick;
  const _link = props.link;
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
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

  const onLinkClick = ({ link, onClick }) => {
    if (link) {
      navigate(link);
      return;
    }

    if (onClick) {
      onClick();
      return;
    }
  };

  const getActive = (path) => {
    return path === location.pathname;
  };

  return (
    <>
      <div
        className={classNames("flex justify-content-between", {
          active: getActive(_link),
        })}
        onClick={onItemClick}
      >
        {_title}
        {_items && _items.length && (
          <i
            className={classNames("open-icon pi pi-chevron-right text-xs", {
              open: isOpen,
            })}
          />
        )}
      </div>

      {isOpen && (
        <div className="menu-links">
          {_items.map((item, i) => {
            let _newLink = _link ? _link + item?.link : item?.link;
            return (
              <div
                key={i}
                className={classNames({ active: getActive(_newLink) })}
                onClick={() =>
                  onLinkClick({
                    link: _newLink,
                    onClick: item?.onClick,
                  })
                }
              >
                {item?.title}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

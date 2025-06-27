import { div } from "@tensorflow/tfjs";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ highlight }) => {
  return (
    <>
      <div
        className="fixed left-0 flex flex-col gap-12 justify-center items-center w-14 h-[calc(100vh-4rem)] bg-neutral-600/70 text-xs sm:gap-25 sm:w-20"
        id="sidebar"
      >
        <Link to="/" className="sidebar-icon">
          {highlight == "home" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              aria-hidden="true"
              style={{
                pointerEvents: "none",
                display: "inherit",
                width: "100%",
                height: "100%",
              }}
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5H14v-8h-4v8H5.5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              aria-hidden="true"
              style={{
                pointerEvents: "none",
                display: "inherit",
                width: "100%",
                height: "100%",
              }}
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5h-5v-7h-3v7h-5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146ZM18.5 9.621l-6.5-6.5-6.5 6.5V19.5H9V13a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v6.5h3.5V9.621Z"
              />
            </svg>
          )}

          <p className="hidden sm:block">Home</p>
        </Link>

        <Link to="/subscriptions" className="sidebar-icon">
          {highlight == "subscriptions" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              aria-hidden="true"
              style={{
                pointerEvents: "none",
                display: "inherit",
                width: "100%",
                height: "100%",
              }}
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M5.5 3A1.5 1.5 0 004 4.5h16A1.5 1.5 0 0018.5 3h-13ZM2 7.5A1.5 1.5 0 013.5 6h17A1.5 1.5 0 0122 7.5v11a1.5 1.5 0 01-1.5 1.5h-17A1.5 1.5 0 012 18.5v-11Zm8 2.87a.5.5 0 01.752-.431L16 13l-5.248 3.061A.5.5 0 0110 15.63v-5.26Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              aria-hidden="true"
              style={{
                pointerEvents: "none",
                display: "inherit",
                width: "100%",
                height: "100%",
              }}
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5H4Zm16.5 3h-17v11h17v-11ZM3.5 6A1.5 1.5 0 002 7.5v11A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0020.5 6h-17Zm7.257 4.454a.5.5 0 00-.757.43v4.233a.5.5 0 00.757.429L15 13l-4.243-2.546Z"
              />
            </svg>
          )}
          <p className="hidden sm:block">Subscription</p>
        </Link>

        <Link to="/liked" className="sidebar-icon">
          {highlight == "liked" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              aria-hidden="true"
              style={{
                pointerEvents: "none",
                display: "inherit",
                width: "100%",
                height: "100%",
              }}
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M8 21V9.282a4 4 0 01.745-2.325L13 1l.551.33a3 3 0 011.351 3.363L14 8h5.192a2.722 2.722 0 012.334 4.123L21 13l.165.413a4 4 0 01-.514 3.885l-.151.202v.5a3 3 0 01-3 3H8ZM4.5 9A1.5 1.5 0 003 10.5v9A1.5 1.5 0 004.5 21H7V9H4.5Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              aria-hidden="true"
              style={{
                pointerEvents: "none",
                display: "inherit",
                width: "100%",
                height: "100%",
              }}
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M14.813 5.018 14.41 6.5 14 8h5.192c.826 0 1.609.376 2.125 1.022.711.888.794 2.125.209 3.101L21 13l.165.413c.519 1.296.324 2.769-.514 3.885l-.151.202v.5c0 1.657-1.343 3-3 3H5c-1.105 0-2-.895-2-2v-8c0-1.105.895-2 2-2h2v.282c0-.834.26-1.647.745-2.325L12 1l1.1.472c1.376.59 2.107 2.103 1.713 3.546ZM7 10.5H5c-.276 0-.5.224-.5.5v8c0 .276.224.5.5.5h2v-9Zm10.5 9h-9V9.282c0-.521.163-1.03.466-1.453l3.553-4.975c.682.298 1.043 1.051.847 1.77l-.813 2.981c-.123.451-.029.934.255 1.305.284.372.725.59 1.192.59h5.192c.37 0 .722.169.954.459.32.399.357.954.094 1.393l-.526.876c-.241.402-.28.894-.107 1.33l.165.412c.324.81.203 1.73-.32 2.428l-.152.202c-.195.26-.3.575-.3.9v.5c0 .828-.672 1.5-1.5 1.5Z"
              />
            </svg>
          )}
          <p className="hidden sm:block">Liked</p>
        </Link>
      </div>
      <div className="h-[calc(100vh-4rem)] mr-14 sm:mr-20"></div>
    </>
  );
};

export default Sidebar;

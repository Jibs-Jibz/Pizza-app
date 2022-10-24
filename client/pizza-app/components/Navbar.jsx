import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="sticky justify-evenly text-[#black] bg-[#8B9A46] flex py-4 ">
      <div className="flex items-center gap-4 ">
        <div className="flex justify-center items-center rounded-full bg-[#fff]  h-9 w-9 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 128 128"
          >
            <path
              fill="#8B9A46"
              d="M24.1 1.68C11.08 10.61-.7 20.41.86 32.01C2.5 44.44 17.34 71.87 36.74 91.27c19.4 19.39 46.8 34.22 59.26 35.88c11.6 1.55 21.39-10.23 30.32-23.25c1.39-1.82 1.27-4.44-.39-6.1c-.2-.2-.42-.36-.63-.52v-.04L98.11 77.82h-.03c-1.83-1.33-4.38-1.2-6.03.46c-.17.16-.3.35-.43.52c-.01 0-.01.01-.01.01c-.08.12-.15.23-.23.33c-1.82 2.62-1.8 2.95-3.28 5.21c-2.08 3.29-4.5 8.36-6.89 14.1c-7.63-1.16-19-7.79-31.43-20.23C37.33 65.8 30.7 54.43 29.53 46.79c5.76-2.39 10.82-4.8 14.1-6.89c2.27-1.48 2.6-1.46 5.21-3.28c.12-.07.23-.15.33-.23c.19-.13.37-.28.53-.43a4.62 4.62 0 0 0 .45-6.03l.02-.04L30.76 2.72l-.03-.01c-.15-.22-.32-.44-.51-.63a4.657 4.657 0 0 0-6.12-.4"
            />
            <path
              fill="#fff"
              d="M111.03 95.04c1.14.63 2.61 1.76 3.11 2.06c1.01.61 1.98 1.16 2.95 1.84c2.16 1.53 3 3.55 1.42 5.83c-2.1 3.02-7.55 9.38-11.72 7.37c-1.54-.76 1.19-7.8 1.46-9.03c.38-1.7.32-9.42 2.78-8.07zM30.87 38.31c-.33-.72.19-1.96.92-2.91c.7-.9 1.62-1.76 2.19-2.74c1.29-2.21-.39-11.4 1.89-11.4c1.21 0 2.62 1.56 3.29 2.4c1.03 1.28 1.62 2.88 2.62 4.21c.71.95 1.74 1.96 2.02 3.14c.62 2.61-2.32 3.7-4.13 4.78c-2.21 1.31-4.6 2.85-7.23 3.09c-.89.09-1.38-.15-1.57-.57z"
            />
          </svg>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-medium">ORDER NOW!</p>
          <a className="text-xl font-bold" href="tel:+0123456789">
            012 345 6789
          </a>
        </div>
      </div>
      <ul className="flex items-center gap-6">
        <li className="p-0 font-medium list-none ">Homepage</li>
        <li className="p-0 font-medium list-none ">Products</li>
        <li className="p-0 font-medium list-none ">Menu</li>
        <Image
          src="/img/logo.png"
          width="150"
          height="60"
          //  layout="fill"
        />
        <li className="p-0 font-medium list-none ">Events</li>
        <li className="p-0 font-medium list-none ">Blog</li>
        <li className="p-0 font-medium list-none ">Contact</li>
      </ul>
      <div className="relative flex items-center p-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M4 6.414L.757 3.172l1.415-1.415L5.414 5h15.242a1 1 0 0 1 .958 1.287l-2.4 8a1 1 0 0 1-.958.713H6v2h11v2H5a1 1 0 0 1-1-1V6.414zM6 7v6h11.512l1.8-6H6zm-.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm12 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
        <p className="absolute top-3 -right-2 min-w-[1rem] w-fit h-4 rounded-full flex justify-center items-center text-sm  text-[#8B9A46] font-medium  bg-[#EEEEEE] ">
          10
        </p>
      </div>
    </div>
  );
};

export default Navbar;

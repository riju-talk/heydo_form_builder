import Link from "next/link";
import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <Link href={"/"}>
      <Image src={"/Logo.png"} width={1000} height={1000} alt="HeydoTech Logo" className="w-28"/>
    </Link>
  );
}

export default Logo;

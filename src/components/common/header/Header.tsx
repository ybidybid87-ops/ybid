import Image from "next/image";
import HeaderUserMenu from "./HeaderUserMenu";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-10 border-b bg-white px-10">
      <div className="flex items-center justify-between px-4 py-4">
        <Image src="/images/ybid-logo.png" alt="YBID" width={60} height={20} priority />

        <HeaderUserMenu />
      </div>
    </header>
  );
}

"use client";
import { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";

const Header = () => {
  /* LOGO */ 
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/log1.png"
            alt="welth logo"
            width={50}
            height={50}
            className="object-contain"
            priority
          />
        </Link>
           {/* left hand site of logo */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href={"/dashboard"} className="text-gray-700 hover:text-blue-900 flex items-center gap-2 ">
            <Button variant="outline">
              <LayoutDashboard size={18}/>
              <span className="hidden md:inline"> Dashboard </span>
            </Button>
            </Link>

             <Link href={"/transaction/create"}>
            <Button  className="flex items-center gap-2">
              <PenBox size={18}/>
              <span className="hidden md:inline"> Add Transaction </span>
            </Button>
            </Link>

          </SignedIn>
          {/* Sign In , Sign Up */}
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-green-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-800 rounded-md hover:bg-blue-50 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          {/* Account logo */}
          <SignedIn>
            <UserButton appearance={
              {
                elements:{
                  avatarBox: "w-10 h-10 ",
                }
              }
            } />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;

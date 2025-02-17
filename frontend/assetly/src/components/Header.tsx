'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ConnectButton, useAccount } from '@particle-network/connectkit';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isConnected } = useAccount();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/ai-chats', label: 'ChatBot' },
    { href: '/prop-firm', label: 'Pool' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm supports-[backdrop-filter]:bg-inherit">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="https://i.imgur.com/IcF1dcF.png" 
              alt="Logo" 
              width={50} 
              height={50} 
              className="h-10 w-10"
              priority={true}
              unoptimized={true}
            />
            {/* <span className="text-xl font-bold text-purple-600">Assetly</span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <div className="rounded-md backdrop-blur-md bg-white/30 px-3 py-1.5 shadow-sm border border-white/50">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className="relative px-4 py-2 text-base font-medium text-gray-900 rounded-md hover:text-purple-600 hover:bg-gray-200 transition-all duration-200 group"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </nav>

          {/* Desktop Connect Wallet Button */}
          <div className="hidden md:block">
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    Connected <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <ConnectButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ConnectButton label="Connect Wallet" />
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link 
                      href={link.href}
                      className="w-full flex items-center px-2 py-2"
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="focus:bg-transparent">
                  {isConnected ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full rounded-full">
                          Connected <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <ConnectButton />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <ConnectButton label="Connect Wallet" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default Header;
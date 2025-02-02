import React from "react";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-white backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="animate-spin">
        <Image
              src="/logo.png"
              alt="Login illustration"
              width={800}
              height={800}
              priority={true}
              className="w-full h-full object-cover"
            />
        </div>
        <p className="mt-8 text-3xl font-bold text-gray-800">TRU-MART</p>
      </div>
    </div>
  );
};

export default Loading;

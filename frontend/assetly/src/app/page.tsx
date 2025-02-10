import Header from "@/components/Header";
import UserOnboarding from "@/components/UserOnBoarding";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Header />
      <div className="flex flex-col gap-8 mb-20">
        <div className="text-center pt-8 pb-4 -mb-24">
          <h1 className="text-4xl font-bold text-white">WELCOME TO SCROLL/DeFAI</h1>
        </div>
        <UserOnboarding />
      </div>
    </div>
  );
}
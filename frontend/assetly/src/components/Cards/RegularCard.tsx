import { cn } from "@/lib/utils";

interface RegularCardProps {
  width?: string;
  height?: string;
  border?: string;
  borderRadius?: string;
  backgroundColor?: string;
  children: React.ReactNode;
  className?: string;
}

const RegularCard = ({
  width = "w-full",
  height = "h-full",
  border = "border",
  borderRadius = "rounded-xl",
  backgroundColor = "bg-white",
  children,
  className,
}: RegularCardProps) => {
  return (
    <div
      className={cn(
        width,
        height,
        border,
        borderRadius,
        backgroundColor,
        "overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};

export default RegularCard;

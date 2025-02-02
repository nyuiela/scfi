import { Skeleton } from "@/components/ui/skeleton";
import { RegularCard } from ".";

const CardPlaceholder = () => {
  return (
    <RegularCard className="bg-white">
      <div className="relative aspect-square w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4">
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-1/3" />
        </div>
      </div>
    </RegularCard>
  );
};

export default CardPlaceholder;

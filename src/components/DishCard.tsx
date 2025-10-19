import Link from "next/link";
import ShimmerImage from "./ui/ShimmerImage";

type Props = {
  id: string | number;
  name: string;
  img: string;
  price: number;
  cuisineType: string[];
  chefName: string;
};

export default function DishCard({ id, name, img, price, cuisineType, chefName }: Props) {
  return (
    <Link 
      href={`/dishes/${id}`} 
      className="mb-4 block break-inside-avoid rounded-lg bg-white shadow hover:shadow-md overflow-hidden transition-shadow"
    >
      <div className="relative h-56 w-full">
        <ShimmerImage 
          src={img} 
          alt={name} 
          width={800}
          height={600}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" 
          fallbackSrc="/file.svg"
        />
        <div className="absolute top-2 right-2 rounded-full bg-white px-3 py-1 text-sm font-semibold shadow">
          ${price}
        </div>
      </div>
      <div className="p-3">
        <div className="font-medium">{name}</div>
        <div className="mt-1 text-xs text-gray-500">{cuisineType.join(', ')}</div>
        <div className="mt-1 text-sm text-gray-600">by {chefName}</div>
      </div>
    </Link>
  );
}

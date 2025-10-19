import Link from "next/link";
import ShimmerImage from "./ui/ShimmerImage";

type Props = {
  id: number | string;
  name: string;
  specialties: string;
  img: string;
};

export default function ChefCard({ id, name, specialties, img }: Props) {
  return (
    <Link href={`/discover/${id}`} className="mb-4 block break-inside-avoid rounded-lg bg-white shadow hover:shadow-md overflow-hidden">
      <div className="relative h-56 w-full">
        <ShimmerImage 
          src={img} 
          alt={name} 
          width={800}
          height={600}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" 
          fallbackSrc="/file.svg"
        />
      </div>
      <div className="p-3">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-600">{specialties}  4.{Math.floor(5 + (Number(id) % 4))}</div>
      </div>
    </Link>
  );
}

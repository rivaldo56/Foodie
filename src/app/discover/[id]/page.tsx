import Image from "next/image";

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ChefProfile({ params }: PageProps) {
  const id = params.id;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative h-80 w-full">
            <Image src={`https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop`} alt={`Chef ${id}`} fill className="object-cover rounded-lg" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Chef {id}</h1>
          <p className="mt-2 text-gray-700">Specializes in fusion and seasonal menus. Loves intimate dinners and event catering. Serves customizable menus for families and corporate events.</p>
        </div>
        <aside className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow">
            <div className="text-sm text-gray-600">Rating</div>
            <div className="mt-1 text-2xl font-bold">4.8</div>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow">
            <div className="text-sm text-gray-600">Starting from</div>
            <div className="mt-1 text-2xl font-bold">$120</div>
          </div>
          <a href="/book" className="block rounded bg-black px-4 py-3 text-center text-white">Book now</a>
        </aside>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Menu & Dishes</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="relative h-40 w-full">
                <Image src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop`} alt={`dish-${i}`} fill className="object-cover" />
              </div>
              <div className="p-3">
                <div className="font-medium">Dish {i + 1}</div>
                <div className="text-sm text-gray-600">A short description of the dish.</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

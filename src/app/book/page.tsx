export default function BookPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Quick Book</h1>
      <form className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input type="date" className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Time</label>
            <input type="time" className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Guests</label>
            <input type="number" min={1} defaultValue={4} className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Budget</label>
            <select className="mt-1 w-full rounded border px-3 py-2">
              <option>$$</option>
              <option>$$$</option>
              <option>$$$$</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Cuisine preferences</label>
          <input type="text" className="mt-1 w-full rounded border px-3 py-2" placeholder="Italian, Swahili, Vegan" />
        </div>
        <button className="w-full rounded bg-black px-4 py-2 text-white">Find Chefs</button>
      </form>
      <p className="text-sm text-gray-600">This will use chef availability + Google Calendar sync + Stripe checkout in MVP.</p>
    </div>
  );
}

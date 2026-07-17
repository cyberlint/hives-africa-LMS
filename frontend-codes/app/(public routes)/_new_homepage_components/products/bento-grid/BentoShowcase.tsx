import BentoCard from "./BentoCard";
import { productShowcase } from "./product-showcase.data";

export default function BentoShowcase() {
  return (
    <section className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-neutral-900">
            Explore the NextHive Platform
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-600">
            From interactive learning experiences to collaborative workspaces
            and innovation programs, discover how every part of NextHive works
            together.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
          {productShowcase.map((item) => (
            <BentoCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
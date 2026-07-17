"use client";

import ProductCarousel from "./ProductCarousel";
import { products } from "./products.data";

export default function Products() {
  return (
    <section className="overflow-hidden">

      <div className="mx-auto mb-5 max-w-3xl px-6 text-center">

        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          One Platform.
          <br />
          Multiple Experiences.
        </h2>

      </div>

      <ProductCarousel products={products} />

    </section>
  );
}
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";

import ProductSlide from "./ProductSlide";
import { Product } from "./products.data";

interface Props {
  products: Product[];
}

const AUTOPLAY_DELAY = 4500;

export default function ProductCarousel({ products }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
    skipSnaps: false,
  });

const [scrollProgress, setScrollProgress] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (!emblaApi) return;

    stop();

    timer.current = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_DELAY);
  }, [emblaApi, stop]);

  useEffect(() => {
    if (!emblaApi) return;

    play();

    emblaApi.on("pointerDown", stop);
    emblaApi.on("pointerUp", play);

    return () => {
      stop();

      emblaApi.off("pointerDown", stop);
      emblaApi.off("pointerUp", play);
    };
  }, [emblaApi, play, stop]);

  useEffect(() => {
  if (!emblaApi) return;

  play();

  emblaApi.on("pointerDown", stop);
  emblaApi.on("pointerUp", play);

  return () => {
    stop();

    emblaApi.off("pointerDown", stop);
    emblaApi.off("pointerUp", play);
  };
}, [emblaApi, play, stop]);

useEffect(() => {
  if (!emblaApi) return;

  const update = () => {
    setScrollProgress(
      emblaApi.scrollProgress()
    );
  };

  update();

  emblaApi.on("scroll", update);
  emblaApi.on("reInit", update);

  return () => {
    emblaApi.off("scroll", update);
    emblaApi.off("reInit", update);
  };
}, [emblaApi]);

  return (
  <div className="overflow-hidden py-12">
    <div
      ref={emblaRef}
      className="overflow-visible"
      onMouseEnter={stop}
      onMouseLeave={play}
    >
      <div
        className="
          flex
          items-center
          gap-12
          px-[8vw]
        "
      >
        {products.map((product, index) => {
  const total = products.length;

const snaps = emblaApi?.scrollSnapList() ?? [];

const snap = snaps[index] ?? 0;

let distance =
  snap - scrollProgress;

  if (distance > total / 2) distance -= total;

  if (distance < -total / 2) distance += total;

  return (
    <div
      key={product.id}
      className="
        shrink-0
        basis-[72%]
        sm:basis-[50%]
        lg:basis-[34%]
        xl:basis-[28%]
      "
    >
      <ProductSlide
        product={product}
        distance={distance}
      />
    </div>
  );
})}
      </div>
    </div>
  </div>
);
}
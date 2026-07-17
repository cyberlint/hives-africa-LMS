"use client";

import { motion } from "motion/react";

import ProductCard from "./ProductCard";
import { Product } from "./products.data";
import { getSlideTransform } from "./carousel.utils";

interface Props {
  product: Product;
  distance: number;
}

export default function ProductSlide({
  product,
  distance,
}: Props) {
  const transform = getSlideTransform(distance);

  return (
    <motion.div
      animate={{
        scale: transform.scale,
        y: transform.translateY,
        rotate: transform.rotate,
        opacity: transform.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 26,
      }}
      style={{
        zIndex: transform.zIndex,
      }}
      className="relative will-change-transform"
    >
      <ProductCard product={product} />
    </motion.div>
  );
}
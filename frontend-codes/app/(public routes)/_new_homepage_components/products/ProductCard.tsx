"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { Product } from "./products.data";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={product.href} className="group block">
      <motion.div
        whileHover={{
          y: -10,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 24,
        }}
        className="will-change-transform"
      >
        <div
          className="
            relative
            aspect-[2/3]
            overflow-hidden
            rounded-[28px]
          "
        >
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(max-width:768px) 70vw,
                   (max-width:1200px) 45vw,
                   28vw"
            className="
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.025]
            "
          />
        </div>
      </motion.div>
    </Link>
  );
}
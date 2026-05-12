"use client";

import { Star, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discount = product.discountPercent ?? 0;
  const discountedPrice = product.price * (1 - discount / 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-3 shadow-[0_12px_30px_-20px_rgba(0,0,0,0.4)]"
    >
      {discount > 0 ? (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#dbf45f] px-2 py-1 text-xs font-bold text-[#294210]">
          -{discount}%
        </span>
      ) : null}

      {!product.inStock ? (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/45 text-sm font-semibold text-white">
          Out of stock
        </div>
      ) : null}

      <div className="relative mb-3 h-40 overflow-hidden rounded-xl bg-(--sand-100)">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <p className="text-xs font-medium text-(--ink-500)">{product.category}</p>
      <h3 className="mt-1 line-clamp-1 text-base font-semibold text-(--ink-900)">{product.name}</h3>
      <p className="line-clamp-1 text-xs text-(--ink-500)">{product.description}</p>

      <div className="mt-2 flex items-center gap-2 text-xs text-(--ink-500)">
        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        <span>{product.rating.toFixed(1)}</span>
        <span>•</span>
        <span>{product.unit}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-(--ink-900)">{formatCurrency(discountedPrice)}</p>
          {discount > 0 ? (
            <p className="text-xs text-(--ink-400) line-through">{formatCurrency(product.price)}</p>
          ) : null}
        </div>

        <Button onClick={() => onAddToCart(product)} disabled={!product.inStock}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
    </motion.article>
  );
}

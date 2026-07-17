type BentoCardProps = {
  title: string;
  description: string;
  image: string;
  alt: string;
  className?: string;
};

export default function BentoCard({
  title,
  description,
  image,
  alt,
  className,
}: BentoCardProps) {
  const isLarge = className?.includes("col-span-2");

  return (
  <div
    className={`group rounded-[32px] border border-black/[0.04] dark:border-white/[0.06] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ${className ?? ""}`}
  >
    <div className="relative overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-800">
  <img
    src={image}
    alt={alt}
    className="h-[300px] w-full object-cover object-top"
  />
</div>

    <div className="mt-4">
      <div className={isLarge ? "lg:max-w-[60%]" : ""}>
        <h3
          className={`font-medium leading-tight tracking-tight text-neutral-900 ${
            isLarge ? "text-2xl lg:text-[28px]" : "text-xl"
          }`}
        >
          {title}
        </h3>

        <p className="mt-2 text-[15px] leading-6 text-neutral-500">
          {description}
        </p>
      </div>
    </div>
  </div>
);
}
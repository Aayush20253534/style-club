export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span aria-hidden className="relative inline-flex h-8 w-9 items-center font-serif text-[31px] italic leading-none">
        <span className="absolute left-0 top-[-2px]">S</span>
        <span className="absolute left-[13px] top-[5px] text-[27px]">C</span>
      </span>
      <span className="display text-[21px] tracking-[0.03em] sm:text-[23px]">Style Club</span>
    </span>
  );
}

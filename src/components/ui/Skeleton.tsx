export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-mh-border/40 ${className}`}
    />
  )
}

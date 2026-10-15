import { platformLogo } from "@/lib/market";

/** Platform logo from public/logos, or a letter badge for platforms without one. */
export function PlatformBadge({ id, name }: { id: string; name: string }) {
  const logo = platformLogo(id);
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element -- tiny static logos, next/image adds nothing here
    return <img src={logo} alt="" className="h-9 w-9 flex-none rounded-[10px] border border-line object-cover" />;
  }
  return (
    <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-[#E3EEFB] text-sm font-bold text-brand" aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

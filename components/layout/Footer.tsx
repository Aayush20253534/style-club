import InstagramIcon from "@/components/ui/InstagramIcon";
import { contact, stores } from "@/lib/data";

export default function Footer() {
  return (
    <footer id="footer" className="on-dark bg-ink pt-20 text-paper md:pt-28">
      <div className="container-x">
        <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-[34px] italic leading-tight md:text-[42px]">Style that moves with you.</p>
            <a
              href={contact.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-[14px] text-paper/80 transition-colors hover:text-white"
            >
              <InstagramIcon /> <span className="link-draw">{contact.instagram.handle}</span>
            </a>
          </div>
          <nav aria-label="Stores" className="md:col-span-4">
            <p className="eyebrow text-paper/45">Stores</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[14px]">
              {stores.map((s) => (
                <li key={s.id}>
                  <a href={s.mapUrl} target="_blank" rel="noreferrer" className="link-draw text-paper/80 hover:text-white">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="eyebrow text-paper/45">Call</p>
            <ul className="mt-5 space-y-2.5 text-[14px]">
              {contact.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="link-draw text-paper/80 hover:text-white">
                    {p.display}
                  </a>
                  <span className="ml-2 text-paper/40">{p.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p aria-hidden className="display select-none whitespace-nowrap pt-10 text-center text-[min(20.5vw,330px)] leading-[0.8] text-paper md:pt-14">
          Style Club
        </p>

        <div className="flex flex-col gap-2 py-8 text-[12px] text-paper/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Style Club, Prayagraj. All rights reserved.</p>
          <p>Men’s · Women’s · Kidswear</p>
        </div>
      </div>
    </footer>
  );
}

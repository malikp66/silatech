"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";
import { gsap } from "gsap";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, Phone } from "lucide-react";

type MaintenancePageProps = {
  deadline: string;
};

type Countdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const ZERO_STATE: Countdown = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
};

const TIMER_LABELS = ["Days", "Hours", "Minutes", "Seconds"] as const;

export function MaintenancePage({ deadline }: MaintenancePageProps) {
  const targetTime = useMemo(() => new Date(deadline).getTime(), [deadline]);
  const [countdown, setCountdown] = useState<Countdown>(ZERO_STATE);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const buttonWrapperRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const timerRefs = useRef<Array<HTMLDivElement | null>>(
    Array(TIMER_LABELS.length).fill(null),
  );

  useEffect(() => {
    function updateCountdown() {
      const now = Date.now();
      const diff = Math.max(targetTime - now, 0);
      if (!Number.isFinite(diff) || diff <= 0) {
        setCountdown(ZERO_STATE);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setCountdown({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    }

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [targetTime]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      tl.from(containerRef.current, { opacity: 0, duration: 1 })
        .from(overlayRef.current, { opacity: 0, duration: 1.2 }, "<")
        .from(headerRef.current, { y: -40, opacity: 0 }, "-=0.6")
        .from(
          mainRef.current?.querySelectorAll("[data-animate='headline']") ?? [],
          { y: 36, opacity: 0, stagger: 0.15 },
          "-=0.4",
        )
        .from(
          timerRefs.current.filter(Boolean),
          { y: 30, opacity: 0, stagger: 0.12 },
          "-=0.4",
        )
        .from(buttonWrapperRef.current, { scale: 0.9, opacity: 0 }, "-=0.3")
        .from(footerRef.current, { y: 24, opacity: 0 }, "-=0.2");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const isPastDeadline = targetTime <= Date.now();

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-foreground"
      style={{
        backgroundImage: "url('/candi.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,18,0.55)_0%,rgba(8,13,18,0.65)_35%,rgba(8,13,18,0.6)_100%)]"
      />
      <div className="relative z-10 flex min-h-screen w-full max-w-6xl flex-col px-5 py-10 sm:px-9 lg:px-16">
        <header
          ref={headerRef}
          className="flex items-center justify-between text-[0.55rem] uppercase tracking-[0.28rem] text-primary/80 sm:text-xs sm:tracking-[0.35rem]"
        >
          <span className="font-semibold tracking-[0.35rem] sm:tracking-[0.45rem]">
            PT SILATECH INDONESIA
          </span>
          <nav className="hidden gap-6 text-[0.65rem] tracking-[0.25rem] text-muted-foreground sm:flex sm:text-xs sm:tracking-[0.35rem]">
            <Link className="transition-colors hover:text-primary" href="#about">
              About
            </Link>
            <Link
              className="transition-colors hover:text-primary"
              href="#contact"
            >
              Contact
            </Link>
          </nav>
        </header>

        <main
          ref={mainRef}
          className="flex flex-1 flex-col items-center justify-center gap-7 text-center text-sm sm:gap-8 sm:text-base"
        >
          <div className="space-y-4 sm:space-y-6">
            <p
              data-animate="headline"
              className="text-[0.6rem] uppercase tracking-[0.32rem] text-primary/70 sm:text-xs sm:tracking-[0.55rem]"
            >
              PLATFORM IP BUDAYA INDONESIA
            </p>
            <h1
              data-animate="headline"
              className="text-3xl font-semibold uppercase tracking-[0.45rem] text-primary drop-shadow sm:text-4xl sm:tracking-[0.6rem] md:text-6xl md:tracking-[0.8rem]"
            >
              Silatech is Coming Soon
            </h1>
            <p
              data-animate="headline"
              className="mx-auto max-w-xl text-pretty text-xs text-muted-foreground sm:max-w-2xl sm:text-sm"
            >
              PT Silatech Indonesia adalah platform lisensi IP budaya yang
              mendigitalisasi dan mengkurasi cerita rakyat, mitologi, dan desain
              tradisional Indonesia agar siap digunakan secara etis oleh film,
              game, fashion, dan media global. Hitung mundur ini menuju
              peluncuran awal <span className="font-semibold">silatech.id</span>{" "}
              pada <span className="font-semibold">16 November 2025</span>.
              Gunakan tombol di bawah untuk menjadwalkan diskusi atau meminta
              materi kolaborasi untuk tim Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {TIMER_LABELS.map((label, index) => {
              const value = countdown[label.toLowerCase() as keyof Countdown];

              return (
                <div
                  key={label}
                  ref={(element) => {
                    timerRefs.current[index] = element;
                  }}
                  className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-primary backdrop-blur sm:h-28 sm:w-28"
                >
                  <span className="text-2xl font-semibold tracking-tight sm:text-4xl">
                    {value}
                  </span>
                  <span className="mt-1 text-[0.58rem] uppercase tracking-[0.28rem] text-muted-foreground sm:text-xs sm:tracking-[0.4rem]">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div ref={buttonWrapperRef} className="mt-1">
            <Button
              className="flex items-center gap-2 rounded-full border border-primary/70 bg-transparent px-6 py-3 text-primary hover:border-primary hover:bg-primary/10"
              variant="outline"
              asChild
            >
              <Link href="mailto:yessikurniawan.mr@gmail.com">
                <Mail className="h-4 w-4" />
                Contact Silatech
              </Link>
            </Button>
          </div>

          {isPastDeadline && (
            <span className="text-xs uppercase tracking-[0.35rem] text-destructive">
              Countdown selesai — silatech.id siap untuk presentasi klien.
            </span>
          )}
        </main>

        <footer
          ref={footerRef}
          className="flex flex-col gap-5 pt-10 text-[0.6rem] uppercase tracking-[0.25rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-xs sm:tracking-[0.35rem]"
        >
          <span>
            © 2025 PT Silatech Indonesia — Jembatan IP budaya ke pasar global.
          </span>
          <div className="flex items-center justify-center gap-4 text-primary sm:gap-5">
            <SocialLink
              ariaLabel="Hubungi kami via telepon"
              href="tel:+628112119718"
              icon={Phone}
            />
            <SocialLink
              ariaLabel="Kirim email ke Silatech"
              href="mailto:yessikurniawan.mr@gmail.com"
              icon={Mail}
            />
          </div>
        </footer>
      </div>
    </div>
  );
}

type SocialLinkProps = {
  href: string;
  icon: ElementType;
  ariaLabel: string;
};

function SocialLink({ href, icon: Icon, ariaLabel }: SocialLinkProps) {
  const isExternal = /^https?:\/\//.test(href);

  return (
    <Link
      aria-label={ariaLabel}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-primary transition-colors hover:border-primary hover:bg-primary/10",
      )}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}

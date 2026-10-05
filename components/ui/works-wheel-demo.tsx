"use client";

import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";

// High-resolution curated SYC-oriented stock imagery from Unsplash
export const SYC_WORKS_WHEEL_ITEMS: WorksWheelItem[] = [
  {
    title: "Mindful Web Platforms",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop", // Modern code & engineering
    href: "/apply?domain=tech",
  },
  {
    title: "Editorial Design & Typography",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1000&auto=format&fit=crop", // Swiss design & Figma
    href: "/apply?domain=design",
  },
  {
    title: "Cinematic Event Reels",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop", // Camera & video filmmaking
    href: "/apply?domain=video",
  },
  {
    title: "Sunrise Yoga & Pranayama",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000&auto=format&fit=crop", // Mindful meditation & yoga
    href: "/apply?domain=ops",
  },
  {
    title: "Campus Hackathons & Pods",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop", // Team collaboration & tech sprint
    href: "/apply?domain=tech",
  },
  {
    title: "SYC Wellness Week",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop", // Large wellness gathering
    href: "/apply?domain=design",
  },
  {
    title: "Sound Design & Motion",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop", // Audio mixing & production
    href: "/apply?domain=video",
  },
  {
    title: "Community Vitality & Growth",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop", // Dynamic students & leaders
    href: "/apply",
  },
];

export default function WorksWheelDemo() {
  return (
    <div className="bg-background text-foreground w-full h-[650px] rounded-3xl overflow-hidden border border-[#E8E4DC]">
      <WorksWheel items={SYC_WORKS_WHEEL_ITEMS} label="SYC '25" action="Explore Wing" />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PackApp } from "@/components/pack/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <PackApp />;
}

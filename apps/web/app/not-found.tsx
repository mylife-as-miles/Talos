import { SearchX } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return (
    <AppShell>
      <EmptyState
        icon={SearchX}
        title="Page not found"
        description="The page you requested does not exist."
        action={{ label: "Back to dashboard", href: "/dashboard" }}
      />
    </AppShell>
  );
}

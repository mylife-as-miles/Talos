import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function ShellNotFound() {
  return (
    <EmptyState
      icon={SearchX}
      title="Page not found"
      description="The resource you requested does not exist or may have been removed from the local incident store."
      action={{ label: "Back to dashboard", href: "/dashboard" }}
      secondaryAction={{ label: "View incidents", href: "/dashboard/incidents" }}
    />
  );
}

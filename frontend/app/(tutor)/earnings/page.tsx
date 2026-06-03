import { IndianRupee, TrendingUp, WalletCards } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const earningStats = [
  { label: "This month", value: "Rs 42,000", icon: IndianRupee },
  { label: "Platform fee", value: "Rs 4,200", icon: WalletCards },
  { label: "Growth", value: "+18%", icon: TrendingUp }
];

export default function EarningsPage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-3">
        {earningStats.map((item) => {
          const Icon = item.icon;
          return (
          <Card key={item.label}>
            <CardContent className="p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">{item.label}</p>
              <p className="font-heading text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
          );
        })}
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Phase 2 Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Razorpay orders, UPI, cards, and net banking fields are scaffolded in the backend and database. Enable keys before switching this dashboard to live payout data.</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}

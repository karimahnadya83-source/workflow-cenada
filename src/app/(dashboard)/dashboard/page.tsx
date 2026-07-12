import { Users, CalendarCheck, Trophy, Wallet } from "lucide-react";
import { startOfMonth, endOfMonth, startOfDay, addDays } from "date-fns";

import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { LeadsBySourceChart } from "@/components/dashboard/leads-by-source-chart";
import { ContactsByStageChart } from "@/components/dashboard/contacts-by-stage-chart";

const STAGE_LABELS: Record<string, string> = {
  NEW_LEAD: "New Lead",
  CONTACTED: "Contacted",
  TRIAL_SCHEDULED: "Trial Scheduled",
  TEST_DONE: "Test Done",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
};

async function getKpiData() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const sevenDaysLater = addDays(todayStart, 7);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [totalLeads, trialThisWeek, closedWonThisMonth] = await Promise.all([
    prisma.contact.count({
      where: { stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } },
    }),
    prisma.schedule.count({
      where: {
        type: "TRIAL_CLASS",
        scheduledAt: { gte: todayStart, lte: sevenDaysLater },
      },
    }),
    prisma.contact.count({
      where: {
        stage: "CLOSED_WON",
        updatedAt: { gte: monthStart, lte: monthEnd },
      },
    }),
  ]);

  return { totalLeads, trialThisWeek, closedWonThisMonth };
}

async function getLeadsBySource() {
  const grouped = await prisma.contact.groupBy({
    by: ["source"],
    _count: { _all: true },
  });

  return grouped.map((item) => ({
    source: item.source,
    total: item._count._all,
  }));
}

async function getContactsByStage() {
  const grouped = await prisma.contact.groupBy({
    by: ["stage"],
    _count: { _all: true },
  });

  return grouped.map((item) => ({
    stage: STAGE_LABELS[item.stage] ?? item.stage,
    total: item._count._all,
  }));
}

export default async function DashboardPage() {
  const [{ totalLeads, trialThisWeek, closedWonThisMonth }, leadsBySource, contactsByStage] =
    await Promise.all([getKpiData(), getLeadsBySource(), getContactsByStage()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Ringkasan aktivitas sales Anda hari ini.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Leads Aktif"
          value={totalLeads}
          icon={Users}
          description="Belum closing menang/kalah"
        />
        <KpiCard
          title="Trial Minggu Ini"
          value={trialThisWeek}
          icon={CalendarCheck}
          description="7 hari ke depan"
        />
        <KpiCard
          title="Deal Closing"
          value={closedWonThisMonth}
          icon={Trophy}
          description="Bulan ini"
        />
        <KpiCard
          title="Revenue"
          value="Rp 0"
          icon={Wallet}
          description="Fitur nominal belum aktif"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LeadsBySourceChart data={leadsBySource} />
        <ContactsByStageChart data={contactsByStage} />
      </div>
    </div>
  );
}
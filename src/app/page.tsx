import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Users, ClipboardCheck, Settings } from 'lucide-react';

const dashboardItems = [
  { href: "/planner", title: "Training Plan Management", icon: Calendar, description: "Plan your training year schedule by dragging and dropping lessons." },
  { href: "/reports", title: "WRO Reports", icon: FileText, description: "Generate PDF routine orders for a specific training night." },
  { href: "/cadets", title: "Cadet Management", icon: Users, description: "Add, view, and manage your corps' cadet roster." },
  { href: "/attendance", title: "Attendance Management", icon: ClipboardCheck, description: "Mark and track attendance for training nights." },
  { href: "/settings", title: "Settings", icon: Settings, description: "Configure corps information, instructors, and classrooms." },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome to your training planner. Select a module to get started."
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item) => (
          <Link href={item.href} key={item.href} className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <Card className="h-full transition-colors border-2 border-transparent group-hover:border-primary/50 group-hover:bg-muted/30">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-xl font-bold">
                            {item.title}
                        </CardTitle>
                        <item.icon className="h-8 w-8 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

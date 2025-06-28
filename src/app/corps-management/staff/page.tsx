
"use client";

import { PageHeader } from "@/components/page-header";
import { useSettings } from "@/hooks/use-settings";
import type { StaffMember } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { StaffManager } from "@/components/settings/staff-manager";
import { DutyRoster } from "@/components/settings/duty-roster";
import { Card, CardContent } from "@/components/ui/card";

export default function StaffManagementPage() {
  const { settings, saveSettings } = useSettings();
  const { toast } = useToast();

  const handleStaffChange = (newStaff: StaffMember[]) => {
    saveSettings({ staff: newStaff });
    toast({
        title: "Staff Roster Updated",
        description: "Your changes have been saved.",
    });
  };

  return (
    <>
      <PageHeader
        title="Staff Management"
        description="Manage staff roster and parade night duties."
      />
      <div className="mt-6 space-y-8">
          <Card>
              <CardContent className="pt-6">
                  <StaffManager staff={settings.staff || []} onStaffChange={handleStaffChange} />
              </CardContent>
          </Card>
           <Card>
              <CardContent className="pt-6">
                  <DutyRoster />
              </CardContent>
          </Card>
      </div>
    </>
  );
}

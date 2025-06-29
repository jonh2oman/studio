
"use client";

import { PageHeader } from "@/components/page-header";
import { useSettings } from "@/hooks/use-settings";
import type { StaffMember } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { DutyRoster } from "@/components/settings/duty-roster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo, useCallback } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddStaffForm } from "@/components/corps-management/add-staff-form";
import { StaffList } from "@/components/corps-management/staff-list";
import { useAuth } from "@/hooks/use-auth";

export default function StaffManagementPage() {
  const { user } = useAuth();
  const { settings, saveSettings } = useSettings();
  const { toast } = useToast();
  
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [newOfficerRank, setNewOfficerRank] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newCafDress, setNewCafDress] = useState("");

  const permanentRoles = useMemo(() => [
    'Commanding Officer',
    'Training Officer',
    'Administration Officer',
    'Supply Officer'
  ], []);

  const handleListChange = useCallback((key: keyof typeof settings, newList: any[]) => {
    saveSettings({ [key]: newList });
     toast({
      title: "Settings Saved",
      description: "Your changes have been automatically saved.",
    });
  }, [saveSettings, toast]);

  const handleSettingChange = useCallback((key: keyof typeof settings, value: any) => {
    saveSettings({ [key]: value });
     toast({
      title: "Settings Saved",
      description: "Your changes have been automatically saved.",
    });
  }, [saveSettings, toast]);

  const handleAddOfficerRank = () => {
    const officerRanks = settings.officerRanks || [];
    if (newOfficerRank.trim() && !officerRanks.includes(newOfficerRank.trim())) {
      handleListChange('officerRanks', [...officerRanks, newOfficerRank.trim()]);
      setNewOfficerRank("");
    }
  };

  const handleRemoveOfficerRank = (rank: string) => {
    const officerRanks = settings.officerRanks || [];
    handleListChange('officerRanks', officerRanks.filter(r => r !== rank));
  };

  const handleAddStaffRole = () => {
    const staffRoles = settings.staffRoles || [];
    if (newStaffRole.trim() && !staffRoles.includes(newStaffRole.trim())) {
      handleListChange('staffRoles', [...staffRoles, newStaffRole.trim()]);
      setNewStaffRole("");
    }
  };

  const handleRemoveStaffRole = (role: string) => {
    if (permanentRoles.includes(role)) {
        toast({
            variant: "destructive",
            title: "Action Not Allowed",
            description: "This is a permanent role and cannot be removed.",
        });
        return;
    }
    const staffRoles = settings.staffRoles || [];
    handleListChange('staffRoles', staffRoles.filter(r => r !== role));
  };

  const handleAddCafDress = () => {
    const ordersOfDress = settings.ordersOfDress || { caf: [], cadets: [] };
    if (newCafDress.trim() && !ordersOfDress.caf.includes(newCafDress.trim())) {
      handleSettingChange('ordersOfDress', { ...ordersOfDress, caf: [...ordersOfDress.caf, newCafDress.trim()] });
      setNewCafDress("");
    }
  };

  const handleRemoveCafDress = (dress: string) => {
    const ordersOfDress = settings.ordersOfDress || { caf: [], cadets: [] };
    handleSettingChange('ordersOfDress', { ...ordersOfDress, caf: ordersOfDress.caf.filter(d => d !== dress) });
  };


  const handleStaffChange = (newStaff: StaffMember[]) => {
    saveSettings({ staff: newStaff });
    toast({
        title: "Staff Roster Updated",
        description: "Your changes have been saved.",
    });
  };

  const handleRemoveStaff = (id: string) => {
    const updatedStaff = (settings.staff || []).filter(s => s.id !== id);
    handleStaffChange(updatedStaff);
  }
  
  const handleCancelEdit = () => {
    setEditingStaff(null);
  }

  return (
    <>
      <PageHeader
        title="Staff Management"
        description="Manage staff roster and duties."
      />
      <div className="mt-6 space-y-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <AddStaffForm 
                    staff={settings.staff || []}
                    onStaffChange={handleStaffChange}
                    editingStaff={editingStaff}
                    onCancelEdit={handleCancelEdit}
                />
            </div>
            <div className="md:col-span-2">
                 <Card>
                  <CardHeader>
                      <CardTitle>Staff Roster</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <StaffList 
                          staff={settings.staff || []}
                          onEditStaff={setEditingStaff}
                          onRemoveStaff={handleRemoveStaff}
                      />
                  </CardContent>
              </Card>
            </div>
          </div>
        
           <Card>
              <CardContent className="pt-6">
                  <DutyRoster />
              </CardContent>
          </Card>
        
          <Accordion type="single" collapsible className="w-full">
            <Card>
                <AccordionItem value="staff-settings" className="border-b-0">
                    <AccordionTrigger className="p-6 text-xl">
                        Staff Settings
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Officer Ranks</CardTitle>
                                    <CardDescription>Add or remove staff ranks.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input value={newOfficerRank} onChange={(e) => setNewOfficerRank(e.target.value)} placeholder="New officer rank" />
                                        <Button onClick={handleAddOfficerRank}>Add</Button>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(settings.officerRanks || []).map(rank => (
                                            <div key={rank} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                <span>{rank}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveOfficerRank(rank)}><X className="h-4 w-4"/></Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                             <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Staff Roles</CardTitle>
                                    <CardDescription>Add or remove staff roles, except permanent ones.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} placeholder="New staff role name"/>
                                        <Button onClick={handleAddStaffRole}>Add</Button>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(settings.staffRoles || []).map(role => (
                                            <div key={role} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                <span>{role}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveStaffRole(role)} disabled={permanentRoles.includes(role)} aria-label={permanentRoles.includes(role) ? "Permanent role" : "Remove role"} >
                                                    <X className={cn("h-4 w-4", permanentRoles.includes(role) && "opacity-30")}/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage CAF Orders of Dress</CardTitle>
                                    <CardDescription>Add or remove orders of dress for CAF Staff.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input value={newCafDress} onChange={(e) => setNewCafDress(e.target.value)} placeholder="New staff dress" />
                                        <Button onClick={handleAddCafDress}>Add</Button>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(settings.ordersOfDress?.caf || []).map(dress => (
                                            <div key={dress} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                <span>{dress}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCafDress(dress)}><X className="h-4 w-4"/></Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Card>
          </Accordion>
      </div>
    </>
  );
}

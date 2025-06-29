
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
import { X, MailPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddStaffForm } from "@/components/corps-management/add-staff-form";
import { StaffList } from "@/components/corps-management/staff-list";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function StaffManagementPage() {
  const { user } = useAuth();
  const { settings, saveSettings, corpsId } = useSettings();
  const { toast } = useToast();
  
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [newOfficerRank, setNewOfficerRank] = useState("");
  const [newPoNcmRank, setNewPoNcmRank] = useState("");
  const [newOfficerRole, setNewOfficerRole] = useState("");
  const [newPoNcmRole, setNewPoNcmRole] = useState("");
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
  
  const handleAddPoNcmRank = () => {
    const poNcmRanks = settings.cadetRanks || [];
    if (newPoNcmRank.trim() && !poNcmRanks.includes(newPoNcmRank.trim())) {
      handleListChange('cadetRanks', [...poNcmRanks, newPoNcmRank.trim()]);
      setNewPoNcmRank("");
    }
  };

  const handleRemovePoNcmRank = (rank: string) => {
    const poNcmRanks = settings.cadetRanks || [];
    handleListChange('cadetRanks', poNcmRanks.filter(r => r !== rank));
  };

  const handleAddOfficerRole = () => {
    const officerRoles = settings.staffRoles || [];
    if (newOfficerRole.trim() && !officerRoles.includes(newOfficerRole.trim())) {
      handleListChange('staffRoles', [...officerRoles, newOfficerRole.trim()]);
      setNewOfficerRole("");
    }
  };

  const handleRemoveOfficerRole = (role: string) => {
    if (permanentRoles.includes(role)) {
        toast({
            variant: "destructive",
            title: "Action Not Allowed",
            description: "This is a permanent role and cannot be removed.",
        });
        return;
    }
    const officerRoles = settings.staffRoles || [];
    handleListChange('staffRoles', officerRoles.filter(r => r !== role));
  };

  const handleAddPoNcmRole = () => {
    const poNcmRoles = settings.poNcmRoles || [];
    if (newPoNcmRole.trim() && !poNcmRoles.includes(newPoNcmRole.trim())) {
      handleListChange('poNcmRoles', [...poNcmRoles, newPoNcmRole.trim()]);
      setNewPoNcmRole("");
    }
  };

  const handleRemovePoNcmRole = (role: string) => {
    const poNcmRoles = settings.poNcmRoles || [];
    handleListChange('poNcmRoles', poNcmRoles.filter(r => r !== role));
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


  const handleStaffChange = async (newStaff: StaffMember[]) => {
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

  const handleInviteStaff = async (staffMember: StaffMember) => {
    if (!staffMember.email) {
        toast({ variant: "destructive", title: "No Email", description: "Cannot send an invite without an email address." });
        return;
    }
    if (!corpsId || !db) {
        toast({ variant: "destructive", title: "Error", description: "Corps ID not found. Unable to create invite." });
        return;
    }

    try {
        const inviteRef = doc(db, 'invites', staffMember.email);
        
        // This is the core fix: We no longer check if an invite exists first, as that caused a
        // permission error. We simply create or overwrite the invitation document.
        await setDoc(inviteRef, { corpsId: corpsId });
        
        const subject = `Invitation to join ${settings.corpsName || 'your team'} on Corps/Sqn Manager`;
        const body = `
Hi ${staffMember.firstName},

You've been invited to collaborate on our training plan using the Corps/Sqn Manager application.

Please use the link below to sign up with this email address (${staffMember.email}) to get access.

Application Link: ${window.location.origin}

Thank you!
        `;
        const mailtoLink = `mailto:${staffMember.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.open(mailtoLink, '_blank');
        
        toast({ 
            title: "Email Client Opened", 
            description: "Your email client has been opened with a pre-filled invitation. Please send the email to complete the invitation process." 
        });

    } catch (error) {
        console.error("Error creating invite:", error);
        toast({ variant: "destructive", title: "Invite Failed", description: `Could not create invite for ${staffMember.email}.` });
    }
  };

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
                          onInviteStaff={handleInviteStaff}
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
                                    <CardDescription>Add or remove staff ranks for Officers.</CardDescription>
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
                                    <CardTitle>Manage PO/NCM Ranks</CardTitle>
                                    <CardDescription>Add or remove ranks for PO/NCM staff.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input value={newPoNcmRank} onChange={(e) => setNewPoNcmRank(e.target.value)} placeholder="New PO/NCM rank" />
                                        <Button onClick={handleAddPoNcmRank}>Add</Button>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(settings.cadetRanks || []).map(rank => (
                                            <div key={rank} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                <span>{rank}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemovePoNcmRank(rank)}><X className="h-4 w-4"/></Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                             <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Officer Roles</CardTitle>
                                    <CardDescription>Add or remove staff roles, except permanent ones.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input value={newOfficerRole} onChange={(e) => setNewOfficerRole(e.target.value)} placeholder="New officer role name"/>
                                        <Button onClick={handleAddOfficerRole}>Add</Button>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(settings.staffRoles || []).map(role => (
                                            <div key={role} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                <span>{role}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveOfficerRole(role)} disabled={permanentRoles.includes(role)} aria-label={permanentRoles.includes(role) ? "Permanent role" : "Remove role"} >
                                                    <X className={cn("h-4 w-4", permanentRoles.includes(role) && "opacity-30")}/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                             <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage PO/NCM Roles</CardTitle>
                                    <CardDescription>Add or remove roles for PO/NCM staff.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input value={newPoNcmRole} onChange={(e) => setNewPoNcmRole(e.target.value)} placeholder="New PO/NCM role name"/>
                                        <Button onClick={handleAddPoNcmRole}>Add</Button>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(settings.poNcmRoles || []).map(role => (
                                            <div key={role} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                <span>{role}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemovePoNcmRole(role)}>
                                                    <X className="h-4 w-4"/>
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

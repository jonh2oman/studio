
"use client";

import { useSettings } from "@/hooks/use-settings";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback, useMemo } from "react";
import { X, PlusCircle, Calendar as CalendarIcon, FileDown, FileUp, Loader2 } from "lucide-react";
import { useTrainingYear } from "@/hooks/use-training-year";
import { NewYearDialog } from "@/components/settings/new-year-dialog";
import { Label } from "@/components/ui/label";
import type { WeeklyActivity, Settings, StaffMember, CustomEO, GoogleDriveFile } from "@/lib/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format as formatDate } from 'date-fns';
import { cn } from "@/lib/utils";
import { StaffManager } from "@/components/settings/staff-manager";
import { DutyRoster } from "@/components/settings/duty-roster";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useSave } from "@/hooks/use-save-context";
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleIcon } from '@/components/icons/google-icon';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const DRIVE_API_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const BACKUP_FILE_NAME_PREFIX = 'cadet-planner-backup-v1';


export default function SettingsPage() {
  const { settings: globalSettings, saveSettings: globalSaveSettings, isLoaded: settingsLoaded } = useSettings();
  const { toast } = useToast();
  const { registerSave } = useSave();
  
  const [localSettings, setLocalSettings] = useState<Settings>(globalSettings);
  
  const [newClassroom, setNewClassroom] = useState("");
  const [newCadetRank, setNewCadetRank] = useState("");
  const [newOfficerRank, setNewOfficerRank] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newCadetRole, setNewCadetRole] = useState("");
  const [newCafDress, setNewCafDress] = useState("");
  const [newCadetDress, setNewCadetDress] = useState("");
  const [newCustomEo, setNewCustomEo] = useState({ id: "", title: "", periods: 1 });
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importedData, setImportedData] = useState<string | null>(null);
  const [resetConfirmation, setResetConfirmation] = useState("");
  const [newActivity, setNewActivity] = useState<{
    activity: string;
    dayOfWeek?: number;
    startDate?: Date;
    endDate?: Date;
    startTime: string;
    endTime: string;
    location: string;
    dress: string;
    opi: string;
  }>({
    activity: '',
    startTime: '',
    endTime: '',
    location: '',
    dress: '',
    opi: '',
  });

  const { currentYear, trainingYears, setCurrentYear, isLoaded: yearsLoaded } = useTrainingYear();
  const [isNewYearDialogOpen, setIsNewYearDialogOpen] = useState(false);
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // --- Google Drive State ---
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isGoogleOpInProgress, setIsGoogleOpInProgress] = useState(false);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadFromDriveOpen, setIsLoadFromDriveOpen] = useState(false);

  const permanentRoles = useMemo(() => [
    'Commanding Officer',
    'Training Officer',
    'Administration Officer',
    'Supply Officer'
  ], []);

  const commandingOfficer = useMemo(() => {
    return localSettings.staff.find(s => s.primaryRole === 'Commanding Officer');
  }, [localSettings.staff]);

  const trainingOfficer = useMemo(() => {
    return localSettings.staff.find(s => s.primaryRole === 'Training Officer');
  }, [localSettings.staff]);

  useEffect(() => {
    if (settingsLoaded) {
      setLocalSettings(globalSettings);
    }
  }, [globalSettings, settingsLoaded]);

  const handleSettingChange = useCallback((key: keyof Settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const handleListChange = useCallback((key: keyof Settings, newList: any[]) => {
    handleSettingChange(key, newList);
  }, [handleSettingChange]);
  
  const handleSave = useCallback(() => {
    globalSaveSettings(localSettings);
    toast({
      title: "Settings Saved",
      description: "Your changes have been saved successfully.",
    });
  }, [localSettings, globalSaveSettings, toast]);

  const hasUnsavedChanges = JSON.stringify(localSettings) !== JSON.stringify(globalSettings);

  useEffect(() => {
    if (hasUnsavedChanges) {
      registerSave(handleSave);
    } else {
      registerSave(null);
    }
    return () => registerSave(null);
  }, [hasUnsavedChanges, registerSave, handleSave]);


  const handleAddClassroom = () => {
    const classrooms = localSettings.classrooms || [];
    if (newClassroom.trim() && !classrooms.includes(newClassroom.trim())) {
      handleListChange('classrooms', [...classrooms, newClassroom.trim()]);
      setNewClassroom("");
    }
  };

  const handleRemoveClassroom = (classroom: string) => {
    const classrooms = localSettings.classrooms || [];
    handleListChange('classrooms', classrooms.filter(c => c !== classroom));
  };

  const handleAddCadetRank = () => {
    const cadetRanks = localSettings.cadetRanks || [];
    if (newCadetRank.trim() && !cadetRanks.includes(newCadetRank.trim())) {
      handleListChange('cadetRanks', [...cadetRanks, newCadetRank.trim()]);
      setNewCadetRank("");
    }
  };

  const handleRemoveCadetRank = (rank: string) => {
    const cadetRanks = localSettings.cadetRanks || [];
    handleListChange('cadetRanks', cadetRanks.filter(r => r !== rank));
  };
  
  const handleAddOfficerRank = () => {
    const officerRanks = localSettings.officerRanks || [];
    if (newOfficerRank.trim() && !officerRanks.includes(newOfficerRank.trim())) {
      handleListChange('officerRanks', [...officerRanks, newOfficerRank.trim()]);
      setNewOfficerRank("");
    }
  };

  const handleRemoveOfficerRank = (rank: string) => {
    const officerRanks = localSettings.officerRanks || [];
    handleListChange('officerRanks', officerRanks.filter(r => r !== rank));
  };

  const handleAddStaffRole = () => {
    const staffRoles = localSettings.staffRoles || [];
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
    const staffRoles = localSettings.staffRoles || [];
    handleListChange('staffRoles', staffRoles.filter(r => r !== role));
  };

  const handleAddCadetRole = () => {
    const cadetRoles = localSettings.cadetRoles || [];
    if (newCadetRole.trim() && !cadetRoles.includes(newCadetRole.trim())) {
      handleListChange('cadetRoles', [...cadetRoles, newCadetRole.trim()]);
      setNewCadetRole("");
    }
  };

  const handleRemoveCadetRole = (role: string) => {
    const cadetRoles = localSettings.cadetRoles || [];
    handleListChange('cadetRoles', cadetRoles.filter(r => r !== role));
  };

  const handleAddCafDress = () => {
    const ordersOfDress = localSettings.ordersOfDress || { caf: [], cadets: [] };
    if (newCafDress.trim() && !ordersOfDress.caf.includes(newCafDress.trim())) {
      handleSettingChange('ordersOfDress', { ...ordersOfDress, caf: [...ordersOfDress.caf, newCafDress.trim()] });
      setNewCafDress("");
    }
  };

  const handleRemoveCafDress = (dress: string) => {
    const ordersOfDress = localSettings.ordersOfDress || { caf: [], cadets: [] };
    handleSettingChange('ordersOfDress', { ...ordersOfDress, caf: ordersOfDress.caf.filter(d => d !== dress) });
  };

  const handleAddCadetDress = () => {
    const ordersOfDress = localSettings.ordersOfDress || { caf: [], cadets: [] };
    if (newCadetDress.trim() && !ordersOfDress.cadets.includes(newCadetDress.trim())) {
      handleSettingChange('ordersOfDress', { ...ordersOfDress, cadets: [...ordersOfDress.cadets, newCadetDress.trim()] });
      setNewCadetDress("");
    }
  };

  const handleRemoveCadetDress = (dress: string) => {
    const ordersOfDress = localSettings.ordersOfDress || { caf: [], cadets: [] };
    handleSettingChange('ordersOfDress', { ...ordersOfDress, cadets: ordersOfDress.cadets.filter(d => d !== dress) });
  };

  const handleAddActivity = () => {
    if (!newActivity.activity || newActivity.dayOfWeek === undefined || !newActivity.startDate || !newActivity.endDate) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please provide an activity name, day of week, start date, and end date." });
        return;
    }
    if (newActivity.endDate < newActivity.startDate) {
        toast({ variant: "destructive", title: "Invalid Dates", description: "The end date cannot be before the start date." });
        return;
    }

    const newActivityToAdd: WeeklyActivity = {
        id: crypto.randomUUID(),
        activity: newActivity.activity,
        dayOfWeek: newActivity.dayOfWeek,
        startDate: formatDate(newActivity.startDate, 'yyyy-MM-dd'),
        endDate: formatDate(newActivity.endDate, 'yyyy-MM-dd'),
        startTime: newActivity.startTime,
        endTime: newActivity.endTime,
        location: newActivity.location,
        dress: newActivity.dress,
        opi: newActivity.opi,
    };
    const weeklyActivities = localSettings.weeklyActivities || [];
    handleListChange('weeklyActivities', [...weeklyActivities, newActivityToAdd]);
    setNewActivity({ activity: '', startTime: '', endTime: '', location: '', dress: '', opi: '' });
  };

  const handleRemoveActivity = (id: string) => {
    const weeklyActivities = localSettings.weeklyActivities || [];
    handleListChange('weeklyActivities', weeklyActivities.filter(a => a.id !== id));
  };
  
  const handleAddCustomEo = () => {
    const customEOs = localSettings.customEOs || [];
    if (newCustomEo.id.trim() && newCustomEo.title.trim() && !customEOs.some(eo => eo.id === newCustomEo.id.trim())) {
        handleListChange('customEOs', [...customEOs, { ...newCustomEo, id: newCustomEo.id.trim(), title: newCustomEo.title.trim() }]);
        setNewCustomEo({ id: "", title: "", periods: 1 });
    } else {
        toast({ variant: "destructive", title: "Invalid Input", description: "EO ID and Title are required, and the ID must be unique." });
    }
  };

  const handleRemoveCustomEo = (id: string) => {
      const customEOs = localSettings.customEOs || [];
      handleListChange('customEOs', customEOs.filter(eo => eo.id !== id));
  };
  
  const handleStaffChange = (newStaff: StaffMember[]) => {
      handleListChange('staff', newStaff);
  }

  const getFullBackupData = () => {
    const allData: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('firebase:authUser')) {
            try {
                allData[key] = JSON.parse(localStorage.getItem(key)!);
            } catch {
                allData[key] = localStorage.getItem(key);
            }
        }
    }
    return {
        exportFormatVersion: '1.0.0',
        exportDate: new Date().toISOString(),
        data: allData
    };
  };

  const restoreFromBackup = (dataToRestore: any) => {
    const keysToClear: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('firebase:authUser')) {
             keysToClear.push(key);
        }
    }
    keysToClear.forEach(key => localStorage.removeItem(key));

    for (const key in dataToRestore) {
        if (Object.prototype.hasOwnProperty.call(dataToRestore, key)) {
            const value = dataToRestore[key];
            localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
    }
    toast({
        title: "Import Successful",
        description: "Your data has been restored. The application will now reload.",
    });
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleExport = () => {
    try {
        const dataToExport = getFullBackupData();
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `${BACKUP_FILE_NAME_PREFIX}-${dateStr}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: "Export Successful" });
    } catch (error) {
        toast({ variant: "destructive", title: "Export Failed" });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              const content = e.target?.result as string;
              setImportedData(content);
              setIsImportDialogOpen(true);
          };
          reader.readAsText(file);
      }
      event.target.value = '';
  };

  const handleImportConfirm = () => {
      if (!importedData) return;
      try {
          const parsedBackup = JSON.parse(importedData);
          if (!parsedBackup.data || !parsedBackup.exportFormatVersion) {
              throw new Error("Invalid backup file format.");
          }
          restoreFromBackup(parsedBackup.data);
      } catch (error: any) {
          toast({ variant: "destructive", title: "Import Failed", description: error.message });
      } finally {
          setImportedData(null);
          setIsImportDialogOpen(false);
      }
  };
  
  // --- Google Drive Logic ---
  const googleLogin = CLIENT_ID ? useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setGoogleToken(tokenResponse.access_token);
      toast({ title: 'Google Sign-In Successful' });
    },
    onError: () => toast({ variant: 'destructive', title: 'Google Sign-In Failed' }),
    scope: DRIVE_API_SCOPE,
  }) : () => {};

  const getDriveHeaders = useCallback(() => {
    if (!googleToken) throw new Error('Not authenticated with Google');
    return { 'Authorization': `Bearer ${googleToken}` };
  }, [googleToken]);

  const handleSaveToDrive = async () => {
    setIsGoogleOpInProgress(true);
    toast({ title: "Saving to Google Drive..." });
    try {
      const headers = getDriveHeaders();
      const backupData = getFullBackupData();
      const backupJson = JSON.stringify(backupData, null, 2);
      
      const fileName = `${BACKUP_FILE_NAME_PREFIX}-${new Date().toISOString().split('T')[0]}.json`;

      const metadata = {
        name: fileName,
        mimeType: 'application/json',
        parents: ['appDataFolder']
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([backupJson], { type: 'application/json' }));

      // Check if file exists to update, otherwise create. For simplicity, we create a new file each time.
      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { 'Authorization': headers.Authorization },
        body: form,
      });

      if (!res.ok) throw new Error(`Google Drive API responded with ${res.status}`);
      toast({ title: "Save Successful", description: `Backup saved as ${fileName} in your Google Drive.` });

    } catch (e: any) {
      toast({ variant: 'destructive', title: "Save Failed", description: e.message });
    } finally {
      setIsGoogleOpInProgress(false);
    }
  };

  const handleListDriveFiles = async () => {
    setIsGoogleOpInProgress(true);
    toast({ title: "Loading backups from Google Drive..." });
    try {
      const headers = getDriveHeaders();
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime)`, { headers });
      if (!res.ok) throw new Error(`Google Drive API responded with ${res.status}`);
      const body = await res.json();
      setDriveFiles(body.files || []);
      setIsLoadFromDriveOpen(true);
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Failed to load files", description: e.message });
    } finally {
      setIsGoogleOpInProgress(false);
    }
  };

  const handleLoadFromDrive = async (fileId: string) => {
    setIsLoadFromDriveOpen(false);
    setIsGoogleOpInProgress(true);
    toast({ title: "Restoring backup..." });
    try {
      const headers = getDriveHeaders();
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers });
      if (!res.ok) throw new Error(`Google Drive API responded with ${res.status}`);
      const backupData = await res.json();
      if (!backupData.data || !backupData.exportFormatVersion) {
        throw new Error("Invalid backup file format from Google Drive.");
      }
      restoreFromBackup(backupData.data);
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Restore Failed", description: e.message });
    } finally {
      setIsGoogleOpInProgress(false);
    }
  };


  const isLoading = !settingsLoaded || !yearsLoaded;

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure the application to your corps' needs."
      >
      </PageHeader>
      <div className="mt-8 space-y-6">
        <Accordion type="multiple" defaultValue={["general", "personnel", "resources"]} className="w-full space-y-6">
            <Card className="border">
                <AccordionItem value="general" className="border-b-0">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <h2 className="text-2xl font-bold tracking-tight">General Settings</h2>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <p className="text-muted-foreground mb-6">High-level settings for the application and training year.</p>
                        <div className="grid gap-8">
                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Training Year Management</CardTitle>
                                    <CardDescription>Select the active training year or create a new one to begin planning.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1">
                                        <Label htmlFor="training-year-select">Active Training Year</Label>
                                        <Select value={currentYear || ''} onValueChange={setCurrentYear}>
                                            <SelectTrigger id="training-year-select">
                                                <SelectValue placeholder="Select a year..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {trainingYears.map(year => (
                                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button onClick={() => setIsNewYearDialogOpen(true)} className="w-full sm:w-auto mt-4 sm:mt-0 self-end">
                                        <PlusCircle className="mr-2" />
                                        Create New Year
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Corps Information</CardTitle>
                                    <CardDescription>
                                    Set the primary training night and corps information. These settings are global across all training years.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                    <p>Loading settings...</p>
                                    ) : (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <Label htmlFor="corpsName">Corps Name</Label>
                                            <Input 
                                                id="corpsName"
                                                placeholder="e.g., RCSCC 288 ARDENT"
                                                value={localSettings.corpsName}
                                                onChange={(e) => handleSettingChange('corpsName', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Weekly Training Night</Label>
                                            <Select 
                                                value={String(localSettings.trainingDay)}
                                                onValueChange={(value) => handleSettingChange('trainingDay', Number(value))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a day" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {weekDays.map((day, index) => (
                                                        <SelectItem key={index} value={String(index)}>
                                                            {day}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="coDisplay">Commanding Officer</Label>
                                            <Input 
                                                id="coDisplay"
                                                readOnly
                                                value={commandingOfficer ? `${commandingOfficer.rank} ${commandingOfficer.firstName} ${commandingOfficer.lastName}` : 'Not Assigned'}
                                                className="font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="toDisplay">Training Officer</Label>
                                            <Input 
                                                id="toDisplay"
                                                readOnly
                                                value={trainingOfficer ? `${trainingOfficer.rank} ${trainingOfficer.firstName} ${trainingOfficer.lastName}` : 'Not Assigned'}
                                                className="font-medium"
                                            />
                                        </div>
                                    </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Card>
            
            <Card className="border">
                <AccordionItem value="personnel" className="border-b-0">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <h2 className="text-2xl font-bold tracking-tight">Personnel Management</h2>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <p className="text-muted-foreground mb-6">Manage staff members and assign their parade night duties.</p>
                        <div className="grid gap-8">
                            <StaffManager staff={localSettings.staff || []} onStaffChange={handleStaffChange} />
                            <DutyRoster />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Card>

            <Card className="border">
                <AccordionItem value="resources" className="border-b-0">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <h2 className="text-2xl font-bold tracking-tight">Planning Resources</h2>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <p className="text-muted-foreground mb-6">Customize lists and recurring events used throughout the planners and reports.</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Classrooms</CardTitle>
                                    <CardDescription>Add or remove classrooms and locations.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                    <Input 
                                        value={newClassroom}
                                        onChange={(e) => setNewClassroom(e.target.value)}
                                        placeholder="New classroom name"
                                    />
                                    <Button onClick={handleAddClassroom}>Add</Button>
                                    </div>
                                    <div className="space-y-2">
                                    {(localSettings.classrooms || []).map(classroom => (
                                        <div key={classroom} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <span>{classroom}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveClassroom(classroom)}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>
                            
                             <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Staff Roles</CardTitle>
                                    <CardDescription>Add or remove staff roles, except for permanent roles.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                    <Input 
                                        value={newStaffRole}
                                        onChange={(e) => setNewStaffRole(e.target.value)}
                                        placeholder="New staff role name"
                                    />
                                    <Button onClick={handleAddStaffRole}>Add</Button>
                                    </div>
                                    <div className="space-y-2">
                                    {(localSettings.staffRoles || []).map(role => (
                                        <div key={role} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <span>{role}</span>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6" 
                                            onClick={() => handleRemoveStaffRole(role)}
                                            disabled={permanentRoles.includes(role)}
                                            aria-label={permanentRoles.includes(role) ? "Permanent role" : "Remove role"}
                                        >
                                            <X className={cn("h-4 w-4", permanentRoles.includes(role) && "opacity-30")}/>
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>

                             <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Cadet Roles</CardTitle>
                                    <CardDescription>Add or remove optional cadet roles.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                    <Input 
                                        value={newCadetRole}
                                        onChange={(e) => setNewCadetRole(e.target.value)}
                                        placeholder="New cadet role name"
                                    />
                                    <Button onClick={handleAddCadetRole}>Add</Button>
                                    </div>
                                    <div className="space-y-2">
                                    {(localSettings.cadetRoles || []).map(role => (
                                        <div key={role} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <span>{role}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCadetRole(role)}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Cadet Ranks</CardTitle>
                                    <CardDescription>Add or remove cadet ranks from the list available in the app.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                    <Input 
                                        value={newCadetRank}
                                        onChange={(e) => setNewCadetRank(e.target.value)}
                                        placeholder="New cadet rank name"
                                    />
                                    <Button onClick={handleAddCadetRank}>Add</Button>
                                    </div>
                                    <div className="space-y-2">
                                    {(localSettings.cadetRanks || []).map(rank => (
                                        <div key={rank} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <span>{rank}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCadetRank(rank)}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Officer Ranks</CardTitle>
                                    <CardDescription>Add or remove staff ranks from the list available in the app.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                    <Input 
                                        value={newOfficerRank}
                                        onChange={(e) => setNewOfficerRank(e.target.value)}
                                        placeholder="New officer rank"
                                    />
                                    <Button onClick={handleAddOfficerRank}>Add</Button>
                                    </div>
                                    <div className="space-y-2">
                                    {(localSettings.officerRanks || []).map(rank => (
                                        <div key={rank} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <span>{rank}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveOfficerRank(rank)}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Custom EOs</CardTitle>
                                    <CardDescription>Add or remove corps-specific activities.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border p-3 rounded-md">
                                        <Input value={newCustomEo.id} onChange={(e) => setNewCustomEo(prev => ({ ...prev, id: e.target.value }))} placeholder="EO ID (e.g., CS032)" />
                                        <Input value={newCustomEo.title} onChange={(e) => setNewCustomEo(prev => ({ ...prev, title: e.target.value }))} placeholder="EO Title" />
                                        <Input value={newCustomEo.periods} onChange={(e) => setNewCustomEo(prev => ({ ...prev, periods: Number(e.target.value) }))} type="number" min="1" placeholder="Periods" />
                                    </div>
                                    <Button onClick={handleAddCustomEo} className="w-full">Add Custom EO</Button>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {(localSettings.customEOs || []).map(eo => (
                                        <div key={eo.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                            <div>
                                                <span className="font-semibold">{eo.id}</span> - <span>{eo.title}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCustomEo(eo.id)}>
                                                <X className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card className="lg:col-span-2 border">
                                <CardHeader>
                                    <CardTitle>Manage Orders of Dress</CardTitle>
                                    <CardDescription>Add or remove orders of dress for CAF Staff and Cadets.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">CAF Staff Dress</h4>
                                        <div className="flex gap-2">
                                            <Input value={newCafDress} onChange={(e) => setNewCafDress(e.target.value)} placeholder="New staff dress" />
                                            <Button onClick={handleAddCafDress}>Add</Button>
                                        </div>
                                        <div className="space-y-2">
                                            {(localSettings.ordersOfDress?.caf || []).map(dress => (
                                                <div key={dress} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                    <span>{dress}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCafDress(dress)}>
                                                        <X className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">Cadet Dress</h4>
                                        <div className="flex gap-2">
                                            <Input value={newCadetDress} onChange={(e) => setNewCadetDress(e.target.value)} placeholder="New cadet dress" />
                                            <Button onClick={handleAddCadetDress}>Add</Button>
                                        </div>
                                        <div className="space-y-2">
                                            {(localSettings.ordersOfDress?.cadets || []).map(dress => (
                                                <div key={dress} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                    <span>{dress}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCadetDress(dress)}>
                                                        <X className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-2 border">
                                <CardHeader>
                                    <CardTitle>Manage Weekly Activities</CardTitle>
                                    <CardDescription>Define recurring weekly activities with start and end dates.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 p-4 border rounded-md">
                                        <h4 className="font-semibold">Add New Recurring Activity</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2"><Label>Activity</Label><Input value={newActivity.activity} onChange={e => setNewActivity(prev => ({...prev, activity: e.target.value}))} /></div>
                                            
                                            <div className="flex flex-col space-y-1.5">
                                                <Label>Day of Week</Label>
                                                <Select value={newActivity.dayOfWeek?.toString()} onValueChange={val => setNewActivity(prev => ({ ...prev, dayOfWeek: parseInt(val)}))}>
                                                    <SelectTrigger><SelectValue placeholder="Select a day..." /></SelectTrigger>
                                                    <SelectContent>
                                                        {weekDays.map((day, index) => <SelectItem key={day} value={index.toString()}>{day}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div/>

                                            <div className="flex flex-col space-y-1.5">
                                                <Label>Start Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant={"outline"} className={cn("justify-start text-left font-normal", !newActivity.startDate && "text-muted-foreground")}>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {newActivity.startDate ? formatDate(newActivity.startDate, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newActivity.startDate} onSelect={(d) => setNewActivity(prev => ({...prev, startDate: d}))} initialFocus /></PopoverContent>
                                                </Popover>
                                            </div>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label>End Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant={"outline"} className={cn("justify-start text-left font-normal", !newActivity.endDate && "text-muted-foreground")}>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {newActivity.endDate ? formatDate(newActivity.endDate, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newActivity.endDate} onSelect={(d) => setNewActivity(prev => ({...prev, endDate: d}))} initialFocus /></PopoverContent>
                                                </Popover>
                                            </div>

                                            <div><Label>Start Time</Label><Input type="time" value={newActivity.startTime} onChange={e => setNewActivity(prev => ({...prev, startTime: e.target.value}))} /></div>
                                            <div><Label>End Time</Label><Input type="time" value={newActivity.endTime} onChange={e => setNewActivity(prev => ({...prev, endTime: e.target.value}))} /></div>
                                            
                                            <div><Label>Location</Label><Input value={newActivity.location} onChange={e => setNewActivity(prev => ({...prev, location: e.target.value}))} /></div>
                                            <div><Label>Dress</Label><Input value={newActivity.dress} onChange={e => setNewActivity(prev => ({...prev, dress: e.target.value}))} /></div>
                                            <div className="md:col-span-2"><Label>OPI</Label><Input value={newActivity.opi} onChange={e => setNewActivity(prev => ({...prev, opi: e.target.value}))} /></div>
                                        </div>
                                        <Button onClick={handleAddActivity} className="mt-4">Add Recurring Activity</Button>
                                    </div>
                                    <div className="mt-6">
                                        <h4 className="font-semibold mb-2">Scheduled Recurring Activities</h4>
                                        <div className="border rounded-lg">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Activity</TableHead>
                                                        <TableHead>Recurs On</TableHead>
                                                        <TableHead>OPI</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(localSettings.weeklyActivities || []).length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No weekly activities defined.</TableCell></TableRow>}
                                                    {(localSettings.weeklyActivities || []).map(act => (
                                                        <TableRow key={act.id}>
                                                            <TableCell>
                                                                <p className="font-medium">{act.activity}</p>
                                                                <p className="text-xs text-muted-foreground">{act.startTime} - {act.endTime} @ {act.location}</p>
                                                            </TableCell>
                                                            <TableCell>
                                                                <p className="font-medium">{weekDays[act.dayOfWeek]}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {formatDate(new Date(act.startDate.replace(/-/g, '/')), "MMM d, yyyy")} - {formatDate(new Date(act.endDate.replace(/-/g, '/')), "MMM d, yyyy")}
                                                                </p>
                                                            </TableCell>
                                                            <TableCell>{act.opi}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveActivity(act.id)}>
                                                                    <X className="h-4 w-4"/>
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Card>
        </Accordion>
        
        <Card className="border">
            <CardHeader>
                <CardTitle>Local Data Management</CardTitle>
                <CardDescription>
                    Export a complete backup of all your application data to a single JSON file. This backup includes all training years, schedules, cadet rosters, attendance records, awards, and settings. You can use this file to restore your data on a different computer or after a major update.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleExport} variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export All Data
                </Button>
                <Button asChild variant="outline">
                    <Label htmlFor="import-file" className="cursor-pointer">
                        <FileUp className="mr-2 h-4 w-4" />
                        Import from File
                    </Label>
                </Button>
                <Input 
                    id="import-file" 
                    type="file" 
                    className="hidden" 
                    accept=".json"
                    onChange={handleFileSelect}
                />
            </CardContent>
        </Card>

        <Card className="border">
            <CardHeader>
                <CardTitle>Cloud Data Management (Google Drive)</CardTitle>
                <CardDescription>Save or load your application data from your Google Drive.</CardDescription>
            </CardHeader>
            <CardContent>
                {!CLIENT_ID ? (
                    <p className="text-muted-foreground text-sm">This feature is not configured. An administrator must provide a Google Client ID.</p>
                ) : googleToken ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={handleSaveToDrive} disabled={isGoogleOpInProgress}>
                            {isGoogleOpInProgress ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                            Save to Drive
                        </Button>
                         <Button onClick={handleListDriveFiles} variant="outline" disabled={isGoogleOpInProgress}>
                            {isGoogleOpInProgress ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                            Load from Drive
                        </Button>
                        <Button onClick={() => setGoogleToken(null)} variant="ghost">Sign Out</Button>
                    </div>
                ) : (
                    <Button onClick={() => googleLogin()} variant="outline">
                        <GoogleIcon className="mr-2 h-4 w-4" />
                        Sign in with Google
                    </Button>
                )}
            </CardContent>
        </Card>

        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                    These actions are irreversible. Please proceed with caution.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={() => setIsResetDialogOpen(true)}>
                    Reset Application
                </Button>
            </CardContent>
        </Card>
      </div>
      
      {isNewYearDialogOpen && (
        <NewYearDialog onOpenChange={setIsNewYearDialogOpen} />
      )}
      
      <AlertDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to import?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This will overwrite all existing data in the application with the contents of the backup file. This action cannot be undone. Are you sure you want to continue?
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setImportedData(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleImportConfirm}>
                      Import Data
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

       <AlertDialog open={isLoadFromDriveOpen} onOpenChange={setIsLoadFromDriveOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Load Backup from Google Drive</AlertDialogTitle>
                  <AlertDialogDescription>
                      Select a backup file to restore. This will overwrite all current data in the application.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="max-h-60 overflow-y-auto border rounded-md my-4">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>File Name</TableHead>
                              <TableHead>Last Modified</TableHead>
                              <TableHead></TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                        {driveFiles.length === 0 ? (
                           <TableRow><TableCell colSpan={3} className="text-center h-24 text-muted-foreground">No backup files found.</TableCell></TableRow>
                        ) : driveFiles.map(file => (
                          <TableRow key={file.id}>
                            <TableCell>{file.name}</TableCell>
                            <TableCell>{formatDate(new Date(file.modifiedTime), "PPP p")}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" onClick={() => handleLoadFromDrive(file.id)}>Load</Button>
                            </TableCell>
                          </TableRow>  
                        ))}
                      </TableBody>
                  </Table>
              </div>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action is permanent and cannot be undone. It will delete all your corps data, including schedules, cadets, staff, and settings, and reset the application to its default state.
                    <br /><br />
                    To confirm, please type <strong>reset</strong> into the box below.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
                <Input
                    id="reset-confirm"
                    value={resetConfirmation}
                    onChange={(e) => setResetConfirmation(e.target.value)}
                    placeholder='Type "reset" to confirm'
                />
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setResetConfirmation("")}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    variant="destructive"
                    disabled={resetConfirmation !== "reset"}
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                >
                    Reset Application
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

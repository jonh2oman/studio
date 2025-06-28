
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCog, Loader2, AlertTriangle, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const profileSchema = z.object({
  rank: z.string().min(1, "Rank is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const { settings, saveSettings, isLoaded: settingsLoaded, forceSetOwner, dataOwnerId } = useSettings();
    const { toast } = useToast();
    const [isOwnerAlertOpen, setIsOwnerAlertOpen] = useState(false);

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const staffProfile = settings.staff.find(s => s.email === user?.email);

    useEffect(() => {
        if (staffProfile) {
            form.reset({
                rank: staffProfile.rank,
                firstName: staffProfile.firstName,
                lastName: staffProfile.lastName,
                phone: staffProfile.phone || "",
            });
        }
    }, [staffProfile, form]);

    const onSubmit = (data: ProfileFormData) => {
        if (!user || !staffProfile) return;

        const updatedStaffList = settings.staff.map(s => 
            s.id === staffProfile.id ? { ...s, ...data } : s
        );
        
        saveSettings({ staff: updatedStaffList });

        toast({
            title: "Profile Updated",
            description: "Your information has been successfully saved.",
        });
    };
    
    const isLoading = authLoading || !settingsLoaded;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }
    
    const availableRanks = staffProfile?.type === 'Officer' ? settings.officerRanks : settings.cadetRanks;
    const isDataOwner = user && dataOwnerId === user.uid;

    return (
        <>
            <PageHeader
                title="Profile Management"
                description="Update your personal information and preferences."
            />
            
            {staffProfile ? (
                 <div className="mt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserCog className="h-6 w-6" />
                                        Edit Your Profile
                                    </CardTitle>
                                    <CardDescription>
                                        Changes made here will be reflected throughout the application. Your email and roles are managed by the Training Officer in Settings.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="rank"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Rank</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your rank" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {availableRanks.map(rank => (
                                                                <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div>
                                            <Label>Email</Label>
                                            <Input value={user?.email || ''} disabled />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </Form>
                </div>
            ) : (
                <Alert variant="destructive" className="mt-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Profile Not Found</AlertTitle>
                    <AlertDescription>
                        Your user account ({user?.email}) does not have a corresponding staff profile in the system. Please contact your Training Officer to have your profile created on the Staff Management page.
                    </AlertDescription>
                </Alert>
            )}
            
            <div className="mt-8">
                <Card className="border-amber-500/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-600">
                            <ShieldAlert className="h-6 w-6" />
                            Ownership Actions
                        </CardTitle>
                        <CardDescription>
                            {isDataOwner 
                                ? "If you are having permission issues (e.g., cannot invite users), use this tool to re-sync your ownership status and fix your data."
                                : "If you are viewing shared data and want to switch back to your own personal data set, use this tool."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                            <AlertDialog open={isOwnerAlertOpen} onOpenChange={setIsOwnerAlertOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    {isDataOwner ? "Re-sync Ownership" : "Become Owner of My Data"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {isDataOwner
                                            ? "This action will reset your user permissions to fix any inconsistencies, ensuring you are correctly set as the data owner. This should resolve issues like being unable to invite users."
                                            : "This will disconnect you from any shared data and create a new, personal data set where you are the owner. This action is intended for development and testing."
                                        }
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={forceSetOwner}
                                    >
                                        {isDataOwner ? "Yes, re-sync" : "Yes, take ownership"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

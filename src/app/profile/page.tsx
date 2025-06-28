
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCog } from "lucide-react";

export default function ProfilePage() {
    return (
        <>
            <PageHeader
                title="Profile Management"
                description="Update your personal information and preferences."
            />
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCog className="h-6 w-6" />
                            User Profile
                        </CardTitle>
                        <CardDescription>
                            Profile management features are under construction.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Soon, you will be able to update your name, rank, and other personal details here.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

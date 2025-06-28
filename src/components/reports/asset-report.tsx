
"use client";
import { useSettings } from "@/hooks/use-settings";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import type { Asset } from "@/lib/types";

export function AssetReport() {
    const { settings, isLoaded } = useSettings();
    const assets = settings.assets || [];
    
    const handlePrint = () => {
        window.print();
    }
    
    const getStatusBadgeVariant = (status: Asset['status']) => {
        switch (status) {
            case 'In Stock': return 'default';
            case 'Deployed': return 'secondary';
            case 'In Repair': return 'destructive';
            case 'Decommissioned': return 'outline';
            default: return 'secondary';
        }
    };
  
    const getConditionBadgeClass = (condition: Asset['condition']) => {
        switch (condition) {
            case 'New': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Poor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return '';
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Corps Asset Report</CardTitle>
                        <CardDescription>A complete list of all corps-owned assets.</CardDescription>
                    </div>
                    <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden"><Printer className="mr-2 h-4 w-4" />Print</Button>
                </div>
            </CardHeader>
            <CardContent>
                {!isLoaded ? (
                     <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : assets.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">No assets have been added.</p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>S/N</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Condition</TableHead>
                                    <TableHead>Location</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assets.sort((a,b) => a.name.localeCompare(b.name)).map(asset => (
                                    <TableRow key={asset.id}>
                                        <TableCell>{asset.name}</TableCell>
                                        <TableCell>{asset.category}</TableCell>
                                        <TableCell>{asset.serialNumber || 'N/A'}</TableCell>
                                        <TableCell><Badge variant={getStatusBadgeVariant(asset.status)}>{asset.status}</Badge></TableCell>
                                        <TableCell><Badge className={cn('border-transparent', getConditionBadgeClass(asset.condition))}>{asset.condition}</Badge></TableCell>
                                        <TableCell>{asset.location}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

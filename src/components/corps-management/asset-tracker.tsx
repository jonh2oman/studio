
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X, Pencil, Loader2 } from "lucide-react";
import type { Asset } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { cn } from "@/lib/utils";

interface AssetTrackerProps {
  assets: Asset[];
  isLoaded: boolean;
  onEditAsset: (asset: Asset) => void;
  onRemoveAsset: (id: string) => void;
}

export function AssetTracker({ assets, isLoaded, onEditAsset, onRemoveAsset }: AssetTrackerProps) {
  
  const getStatusBadgeVariant = (status: Asset['status']) => {
    switch (status) {
        case 'In Stock': return 'default';
        case 'Deployed': return 'secondary';
        case 'In Repair': return 'destructive';
        case 'On Loan': return 'outline';
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
            <CardTitle>Asset Tracker</CardTitle>
        </CardHeader>
        <CardContent>
            {!isLoaded ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : assets.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">No assets have been added yet.</p>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.sort((a,b) => a.name.localeCompare(b.name)).map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell className="font-mono text-xs">{asset.assetId}</TableCell>
                                <TableCell className="font-medium">{asset.name}</TableCell>
                                <TableCell>{asset.category}</TableCell>
                                <TableCell><Badge variant={getStatusBadgeVariant(asset.status)}>{asset.status}</Badge></TableCell>
                                <TableCell><Badge className={cn('border-transparent', getConditionBadgeClass(asset.condition))}>{asset.condition}</Badge></TableCell>
                                <TableCell>{asset.location}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => onEditAsset(asset)}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit Asset</span>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="ghost" size="icon">
                                                <X className="h-4 w-4 text-destructive" />
                                                <span className="sr-only">Remove Asset</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This will permanently delete the asset "{asset.name}". This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction variant="destructive" onClick={() => onRemoveAsset(asset.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
    </Card>
  );
}

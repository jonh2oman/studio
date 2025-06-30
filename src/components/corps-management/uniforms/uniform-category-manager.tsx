"use client";
import { useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UniformCategoryManager() {
    const { settings, saveSettings } = useSettings();
    const { toast } = useToast();
    const [newCategory, setNewCategory] = useState("");

    const handleAddCategory = () => {
        const categories = settings.uniformCategories || [];
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            saveSettings({ uniformCategories: [...categories, newCategory.trim()] });
            setNewCategory("");
            toast({ title: "Category Added", description: `"${newCategory.trim()}" has been added.`});
        }
    };

    const handleRemoveCategory = (category: string) => {
        const categories = settings.uniformCategories || [];
        saveSettings({ uniformCategories: categories.filter(c => c !== category) });
        toast({ title: "Category Removed", description: `"${category}" has been removed.`, variant: "destructive"});
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Uniform Categories</CardTitle>
                <CardDescription>Add or remove categories for uniform parts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name"
                    />
                    <Button onClick={handleAddCategory}>Add</Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(settings.uniformCategories || []).map(category => (
                        <div key={category} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                            <span>{category}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCategory(category)}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

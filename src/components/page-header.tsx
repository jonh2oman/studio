import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
}

export function PageHeader({ title, description, className, children, ...props }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center md:justify-between gap-4", className)} {...props}>
            <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-headline text-accent-foreground">{title}</h1>
                {description && <p className="text-accent-foreground/80 mt-1">{description}</p>}
            </div>
            {children && <div className="flex-shrink-0">{children}</div>}
        </div>
    );
}

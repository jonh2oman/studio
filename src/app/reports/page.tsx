import { PageHeader } from "@/components/page-header";
import { WroForm } from "@/components/reports/wro-form";

export default function ReportsPage() {
    return (
        <>
            <PageHeader
                title="Weekly Routine Orders (WRO)"
                description="Generate a PDF of the routine orders for a specific training night."
            />
            <div className="mt-6">
                <WroForm />
            </div>
        </>
    );
}

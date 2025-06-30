
import { redirect } from 'next/navigation';

// This page now redirects to the new, more specific PO/EO library page.
export default function PlanningRedirectPage() {
    redirect('/planning/eos-pos');
}

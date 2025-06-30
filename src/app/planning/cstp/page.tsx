
import { redirect } from 'next/navigation';

// This page now redirects to the new annual planner page.
export default function CstpRedirectPage() {
    redirect('/planning/annual');
}

import { redirect } from 'next/navigation';

// This page now redirects to the new, more specific asset management page.
export default function CorpsManagementRedirectPage() {
    redirect('/corps-management/assets');
}


"use client";

import { BiathlonTeamList } from './biathlon-team-list';
import { BiathlonResultForm } from './biathlon-result-form';

export function BiathlonTeamManagement() {
    return (
        <div className="space-y-8">
            <BiathlonTeamList />
            <BiathlonResultForm />
        </div>
    )
}

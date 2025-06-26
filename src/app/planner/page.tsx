import { PageHeader } from '@/components/page-header';
import Planner from '@/components/planner/planner';

export default function PlannerPage() {
  return (
    <>
      <PageHeader
        title="Training Planner"
        description="Drag and drop lessons to build your training year schedule."
      />
      <div className="mt-6">
        <Planner />
      </div>
    </>
  );
}

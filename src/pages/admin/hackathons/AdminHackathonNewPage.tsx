import { useNavigate } from "react-router-dom";
import { useCreateHackathon } from "@/hooks/useHackathonAdmin";
import type { BigEventWrite } from "@/dtos/hackathon";
import { AdminShell, BackLink, PageHeader } from "@/components/hackathon/Shells";
import { EventSettingsForm } from "@/components/hackathon/admin/EventSettingsForm";

export default function AdminHackathonNewPage() {
  const navigate = useNavigate();
  const create = useCreateHackathon();

  const submit = async (payload: BigEventWrite) => {
    const created = await create.mutateAsync(payload);
    navigate(`/admin/hackathons/${created.id}?tab=cases`, { replace: true });
    return created;
  };

  return (
    <AdminShell>
      <div className="mx-auto max-w-3xl">
        <BackLink to="/admin/hackathons">All hackathons</BackLink>
        <PageHeader
          title="New hackathon"
          description="It's saved as a draft, so nothing is public until you set the status to Published."
        />
        <EventSettingsForm submitLabel="Create hackathon" onSubmit={submit} />
      </div>
    </AdminShell>
  );
}

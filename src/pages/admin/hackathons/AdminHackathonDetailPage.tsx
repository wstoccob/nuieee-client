import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { errorMessage, errorStatus } from "@/api/client";
import { useAdminHackathon, useDeleteHackathon, useUpdateHackathon } from "@/hooks/useHackathonAdmin";
import { formatDateRange } from "@/lib/datetime";
import type { BigEventAdmin } from "@/dtos/hackathon";
import { AdminShell, BackLink, PageHeader } from "@/components/hackathon/Shells";
import { EventBadges } from "@/components/hackathon/admin/EventBadges";
import { EventSettingsForm } from "@/components/hackathon/admin/EventSettingsForm";
import { TeamsTab } from "@/components/hackathon/admin/TeamsTab";
import { Button, ButtonLink } from "@/components/hackathon/ui/Button";
import { Card, CardHeader } from "@/components/hackathon/ui/Card";
import { ConfirmDialog } from "@/components/hackathon/ui/Dialog";
import { EmptyState, ErrorState, PageLoader } from "@/components/hackathon/ui/states";
import { TabPanel, Tabs } from "@/components/hackathon/ui/Tabs";
import { CalendarIcon, ExternalIcon, TrashIcon } from "@/components/hackathon/ui/icons";

type TabId = "settings" | "teams";
const TAB_IDS: TabId[] = ["settings", "teams"];

function SettingsTab({ event }: { event: BigEventAdmin }) {
  const navigate = useNavigate();
  const update = useUpdateHackathon(event.id);
  const remove = useDeleteHackathon();
  const [confirming, setConfirming] = useState(false);

  const confirmDelete = async () => {
    try {
      await remove.mutateAsync(event.id);
      toast.success(`Deleted ${event.title}`);
      navigate("/admin/hackathons", { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, "Couldn't delete the hackathon."));
    }
  };

  return (
    <div className="space-y-8">
      <EventSettingsForm key={event.id} initial={event} submitLabel="Save changes" onSubmit={(payload) => update.mutateAsync(payload)} />

      <Card className="border-red-400/20 bg-red-500/[0.04]">
        <CardHeader
          title="Delete this hackathon"
          description="Deletes the event and every team registered for it. This can't be undone."
          action={
            <Button variant="danger" onClick={() => setConfirming(true)}>
              <TrashIcon />
              Delete
            </Button>
          }
        />
      </Card>

      <ConfirmDialog
        open={confirming}
        title={`Delete ${event.title}?`}
        description={`This permanently deletes ${event.teamCount} ${event.teamCount === 1 ? "team" : "teams"} and their members.`}
        confirmText={event.title}
        confirmLabel="Delete hackathon"
        busy={remove.isPending}
        onConfirm={confirmDelete}
        onClose={() => setConfirming(false)}
      />
    </div>
  );
}

function EventAdmin({ event }: { event: BigEventAdmin }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab") as TabId | null;
  const tab: TabId = requested && TAB_IDS.includes(requested) ? requested : "settings";
  const selectTab = (id: TabId) => setParams({ tab: id }, { replace: true });

  return (
    <>
      <BackLink to="/admin/hackathons">All hackathons</BackLink>
      <PageHeader
        eyebrow={<EventBadges event={event} />}
        title={event.title}
        description={
          <>
            {formatDateRange(event.startsAt, event.endsAt)} · {event.teamCount}{" "}
            {event.teamCount === 1 ? "team" : "teams"}
          </>
        }
        actions={
          event.status === "published" && (
            <ButtonLink to={`/hackathon/${event.slug}`} target="_blank" rel="noopener" variant="secondary">
              Public page
              <ExternalIcon />
            </ButtonLink>
          )
        }
      />
      <Tabs
        idPrefix="hackathon"
        value={tab}
        onChange={selectTab}
        tabs={[
          { id: "settings", label: "Settings" },
          { id: "teams", label: `Teams (${event.teamCount})` },
        ]}
      />
      <TabPanel idPrefix="hackathon" id={tab}>
        {tab === "settings" && <SettingsTab event={event} />}
        {tab === "teams" && <TeamsTab event={event} />}
      </TabPanel>
    </>
  );
}

export default function AdminHackathonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isPending, error, refetch, isFetching } = useAdminHackathon(id);

  return (
    <AdminShell>
      {event ? (
        <EventAdmin event={event} />
      ) : isPending ? (
        <PageLoader label="Loading the hackathon…" />
      ) : errorStatus(error) === 404 ? (
        <EmptyState
          icon={<CalendarIcon />}
          title="This hackathon doesn't exist"
          description="It may have been deleted."
          action={<ButtonLink to="/admin/hackathons" variant="secondary">All hackathons</ButtonLink>}
        />
      ) : (
        <ErrorState message={errorMessage(error, "Couldn't load the hackathon.")} onRetry={() => refetch()} retrying={isFetching} />
      )}
    </AdminShell>
  );
}

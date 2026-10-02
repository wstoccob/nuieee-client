import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { errorMessage, errorStatus } from "@/api/client";
import type { BigEvent } from "@/dtos/hackathon";
import { ButtonLink } from "./ui/Button";
import { EmptyState, ErrorState, PageLoader } from "./ui/states";
import { CalendarIcon } from "./ui/icons";

interface EventGateProps {
  query: UseQueryResult<BigEvent>;
  children: (event: BigEvent) => ReactNode;
}

export function EventGate({ query, children }: EventGateProps) {
  if (query.isPending) return <PageLoader label="Loading the event…" />;
  // A failed background refetch keeps the last good data; never swap a live page for an error.
  if (query.data) return <>{children(query.data)}</>;
  if (query.error && errorStatus(query.error) === 404) {
    return (
      <EmptyState
        icon={<CalendarIcon />}
        title="We couldn't find this event"
        description="The link may be mistyped, or the event is not public yet."
        action={<ButtonLink to="/hackathon" variant="secondary">Go to the current hackathon</ButtonLink>}
      />
    );
  }
  return (
    <ErrorState
      message={errorMessage(query.error, "The event could not be loaded. Check your connection.")}
      onRetry={() => query.refetch()}
      retrying={query.isFetching}
    />
  );
}

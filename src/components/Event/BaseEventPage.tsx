import type { Event, EventPhoto } from "@/dtos/event";
import { formatDateTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { BackLink } from "@/components/hackathon/Shells";
import { ButtonAnchor } from "@/components/hackathon/ui/Button";
import { ExternalIcon } from "@/components/hackathon/ui/icons";
import { focusRing } from "@/components/hackathon/ui/styles";

function GalleryPhoto({ photo }: { photo: EventPhoto }) {
  return (
    <li className="reveal">
      <figure>
        {/* Thumbnails are cropped, so the link opens the whole photo. */}
        <a
          href={photo.photoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]", focusRing)}
        >
          <img
            src={photo.photoUrl}
            alt={photo.altText || "Event photo"}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 hover:scale-[1.03] motion-reduce:transition-none"
          />
        </a>
        {photo.altText && <figcaption className="mt-2 text-sm text-zinc-400">{photo.altText}</figcaption>}
      </figure>
    </li>
  );
}

export function BaseEventPage({ event }: { event: Event }) {
  const photos = event.photos.filter((photo) => photo.photoUrl);

  return (
    <article>
      <BackLink to="/events">All events</BackLink>

      <header>
        <time dateTime={event.startsAt} className="text-sm font-medium text-hk-accent-fg">
          {formatDateTime(event.startsAt)}
        </time>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
          {event.title || "Untitled event"}
        </h1>
        {event.registrationLink && (
          <ButtonAnchor href={event.registrationLink} size="lg" className="mt-6 w-full sm:w-auto">
            Register now
            <ExternalIcon />
          </ButtonAnchor>
        )}
      </header>

      {event.description && (
        <p className="mt-8 max-w-prose text-base leading-relaxed whitespace-pre-line text-zinc-300">
          {event.description}
        </p>
      )}

      {photos.length > 0 && (
        <section aria-labelledby="gallery-title" className="mt-12 border-t border-white/10 pt-12">
          <h2 id="gallery-title" className="text-2xl font-semibold text-white sm:text-3xl">
            Gallery
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <GalleryPhoto key={photo.id} photo={photo} />
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

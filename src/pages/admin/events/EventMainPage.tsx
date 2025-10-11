import { createContext, useContext, useEffect, useMemo, useState, type ReactNode, type ComponentType } from "react";
import { createPortal } from "react-dom";
import {
  Link,
  useNavigate,
  useParams,
  BrowserRouter,
  MemoryRouter,
  useInRouterContext,
  Routes,
  Route,
} from "react-router-dom";

// =============================================================
// Events Store (Context) — localStorage-backed demo CRUD
// =============================================================
export type EventItem = {
  id: number;
  name: string;
  description: string;
  datetime: string; // ISO string
  photos: string[]; // data URLs (in real app, use URLs from your backend)
  slug: string; // /event/:slug
};

export type CreateEventInput = {
  name: string;
  description: string;
  datetime: string; // ISO from <input type="datetime-local">
  photos: string[]; // data URLs
};

type EventsApi = {
  events: EventItem[];
  add: (input: CreateEventInput) => EventItem;
  update: (id: number, patch: Partial<EventItem>) => void;
  remove: (id: number) => void;
  getBySlug: (slug: string) => EventItem | undefined;
};

const EventsCtx = createContext<EventsApi | null>(null);

const LS_KEY = "demo.events.list";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function uniqueSlug(base: string, taken: Set<string>) {
  let s = slugify(base);
  if (!taken.has(s)) return s;
  let i = 2;
  while (taken.has(`${s}-${i}`)) i++;
  return `${s}-${i}`;
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
      return raw ? (JSON.parse(raw) as EventItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(events));
    } catch {
      // ignore quota/unavailable errors in private windows
    }
  }, [events]);

  const api: EventsApi = {
    events,
    add(input) {
      const id = events.length ? Math.max(...events.map((e) => e.id)) + 1 : 1;
      const slug = uniqueSlug(input.name, new Set(events.map((e) => e.slug)));
      const item: EventItem = { id, slug, ...input };
      setEvents((prev) => [item, ...prev]);
      return item;
    },
    update(id, patch) {
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    },
    remove(id) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    },
    getBySlug(slug) {
      return events.find((e) => e.slug === slug);
    },
  };

  return <EventsCtx.Provider value={api}>{children}</EventsCtx.Provider>;
}

/**
 * RouterBoundary — wraps children with a Router only if there isn't one already.
 * Uses BrowserRouter in the browser, MemoryRouter otherwise (SSR/tests).
 */
function RouterBoundary({ children }: { children: ReactNode }) {
  const inRouter = useInRouterContext();
  if (inRouter) return <>{children}</>;
  const hasDOM = typeof window !== "undefined" && !!window.document;
  const Wrapper: ComponentType<{ children: ReactNode }> = hasDOM
    ? (BrowserRouter as unknown as ComponentType<{ children: ReactNode }>)
    : (MemoryRouter as unknown as ComponentType<{ children: ReactNode }>);
  return <Wrapper>{children}</Wrapper>;
}

/**
 * EnsureEventsProvider — wraps children with EventsProvider if missing.
 * This avoids crashes when a route forgets to include the provider.
 */
function EnsureEventsProvider({ children }: { children: ReactNode }) {
  const ctx = useContext(EventsCtx);
  if (ctx) return <>{children}</>;
  return <EventsProvider>{children}</EventsProvider>;
}

// =============================================================
// Modal (Portal-based, ESC to close, body scroll lock)
// =============================================================
function PortalModal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  const isBrowser = typeof document !== "undefined";
  useEffect(() => {
    if (!isBrowser) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isBrowser, onClose]);

  const node = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40" />
      <div className="relative z-[1001] w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b px-6 py-4 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="rounded p-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Close">✕</button>
        </div>
        <div className="px-6 py-5 text-slate-900 dark:text-slate-100">{children}</div>
      </div>
    </div>
  );

  return isBrowser ? createPortal(node, document.body) : node;
}

// =============================================================
// Helpers
// =============================================================
async function filesToDataUrls(files: FileList | null): Promise<string[]> {
  if (!files || !files.length) return [];
  const toUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  const arr: string[] = [];
  for (const f of Array.from(files)) arr.push(await toUrl(f));
  return arr;
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// =============================================================
// Event Form (Create/Edit)
// =============================================================
function EventForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: Partial<CreateEventInput>;
  onCancel: () => void;
  onSubmit: (data: CreateEventInput) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [datetime, setDatetime] = useState(initial?.datetime ?? new Date().toISOString().slice(0, 16)); // yyyy-MM-ddTHH:mm
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const urls = await filesToDataUrls(e.target.files);
    setPhotos((p) => [...p, ...urls]);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, description, datetime: new Date(datetime).toISOString(), photos });
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Event name</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Description</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Date & time</label>
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400"
            value={datetime.slice(0, 16)}
            onChange={(e) => setDatetime(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          {!!photos.length && (
            <div className="mt-2 grid grid-cols-6 gap-2">
              {photos.map((src, i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  <img src={src} alt="preview" className="h-20 w-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold leading-none text-black hover:bg-slate-100 focus:outline-none focus:ring focus:ring-slate-300"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-black hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  );
}

// =============================================================
// Event Main Page — table style like the screenshot (no ticks; inline actions)
// =============================================================
export function EventMainPage() {
  // SELF-HEALING GUARD: if no Router or Provider, auto-wrap and re-render once.
  const inRouter = useInRouterContext();
  const ctx = useContext(EventsCtx);
  if (!inRouter || !ctx) {
    return (
      <RouterBoundary>
        <EnsureEventsProvider>
          <EventMainPage />
        </EnsureEventsProvider>
      </RouterBoundary>
    );
  }

  // Safe to use hooks that require Router/Provider now
  const { events, add, update, remove } = ctx;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => [e.name, e.description, e.slug].some((t) => t.toLowerCase().includes(q)));
  }, [events, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  const start = (page - 1) * rowsPerPage;
  const paged = filtered.slice(start, start + rowsPerPage);

  function handleCreate(data: CreateEventInput) {
    const created = add(data);
    setShowCreate(false);
    navigate(`/event/${created.slug}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-white">
          <span className="font-medium">Events:</span> {events.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-black hover:bg-blue-700"
            onClick={() => setShowCreate(true)}
          >
            + Add new event
          </button>
          <input
            placeholder="Search events…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-blue-400"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                <th className="w-1/3 px-3 py-3">Event</th>
                <th className="w-1/5 px-3 py-3">Date & Time</th>
                <th className="w-1/6 px-3 py-3">Photos</th>
                <th className="w-1/6 px-3 py-3">URL</th>
                <th className="w-1/6 px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((e) => (
                <tr key={e.id} className="border-t text-sm dark:border-slate-700">
                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      {e.photos[0] ? (
                        <img src={e.photos[0]} alt="" className="h-10 w-10 rounded object-cover ring-2 ring-white" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-slate-100 ring-2 ring-white dark:bg-slate-700" />
                      )}
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">{e.name}</div>
                        <div className="line-clamp-1 text-xs text-slate-600 dark:text-slate-400">{e.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-middle text-slate-900 dark:text-slate-200">{formatDateTime(e.datetime)}</td>
                  <td className="px-3 py-3 align-middle text-slate-900 dark:text-slate-200">{e.photos.length} photo(s)</td>
                  <td className="px-3 py-3 align-middle">
                    <Link to={`/event/${e.slug}`} className="text-blue-700 hover:underline dark:text-blue-400">
                      /event/{e.slug}
                    </Link>
                  </td>
                  <td className="px-3 py-3 align-middle text-right">
                    <button
                      className="mr-2 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setEditing(e)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-black hover:bg-rose-700"
                      onClick={() => {
                        if (confirm(`Delete “${e.name}”?`)) remove(e.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!paged.length && (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-sm text-slate-600 dark:text-slate-400">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <label>Rows per page</label>
            <select
              className="rounded border border-slate-300 px-2 py-1 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="ml-2">
              {filtered.length ? `${start + 1}-${Math.min(start + rowsPerPage, filtered.length)}` : 0} of {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="rounded border px-2 py-1 disabled:opacity-50 dark:border-slate-600"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              {"«"}
            </button>
            <button
              className="rounded border px-2 py-1 disabled:opacity-50 dark:border-slate-600"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              {"‹"}
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`rounded border px-2 py-1 dark:border-slate-600 text-black ${
                  page === n ? "bg-blue-600 border-blue-600" : "bg-white dark:bg-slate-900"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              className="rounded border px-2 py-1 disabled:opacity-50 dark:border-slate-600"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              {"›"}
            </button>
            <button
              className="rounded border px-2 py-1 disabled:opacity-50 dark:border-slate-600"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              {"»"}
            </button>
          </div>
        </div>
      </div>

      {/* Create & Edit modals */}
      <PortalModal open={showCreate} title="Create event" onClose={() => setShowCreate(false)}>
        <EventForm onCancel={() => setShowCreate(false)} onSubmit={handleCreate} />
      </PortalModal>

      <PortalModal open={!!editing} title={editing ? `Edit — ${editing.name}` : ""} onClose={() => setEditing(null)}>
        {editing && (
          <EventForm
            initial={{
              name: editing.name,
              description: editing.description,
              datetime: editing.datetime,
              photos: editing.photos,
            }}
            onCancel={() => setEditing(null)}
            onSubmit={(data) => {
              update(editing.id, data);
              setEditing(null);
            }}
          />
        )}
      </PortalModal>
    </div>
  );
}

// Provider/Router-wrapped, safe-to-use exports
export function EventMainPageWithProvider() {
  return (
    <RouterBoundary>
      <EnsureEventsProvider>
        <EventMainPage />
      </EnsureEventsProvider>
    </RouterBoundary>
  );
}

// =============================================================
// Event details page — /event/:slug
// =============================================================
export function EventPage() {
  // SELF-HEALING GUARD
  const inRouter = useInRouterContext();
  const ctx = useContext(EventsCtx);
  if (!inRouter || !ctx) {
    return (
      <RouterBoundary>
        <EnsureEventsProvider>
          <EventPage />
        </EnsureEventsProvider>
      </RouterBoundary>
    );
  }

  const { slug } = useParams();
  const ev = slug ? ctx.getBySlug(slug) : undefined;

  if (!ev) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-2 text-2xl font-semibold">Event not found</h1>
        <p className="text-slate-700 dark:text-slate-300">No event matches the URL you opened.</p>
        <div className="mt-4">
          <Link to="/events" className="text-blue-700 hover:underline dark:text-blue-400">
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{ev.name}</h1>
          <div className="mt-1 text-slate-700 dark:text-slate-300">{formatDateTime(ev.datetime)}</div>
        </div>
        <Link
          to="/events"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Manage events
        </Link>
      </div>
      <p className="whitespace-pre-wrap text-slate-900 dark:text-slate-100">{ev.description}</p>

      {!!ev.photos.length && (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {ev.photos.map((src, i) => (
            <img key={i} src={src} alt="event" className="aspect-video w-full rounded-lg object-cover" />
          ))}
        </div>
      )}

      <div className="mt-8 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        Public URL: <code className="rounded bg-white px-1 py-0.5 dark:bg-slate-900">/event/{ev.slug}</code>
      </div>
    </div>
  );
}

export function EventPageWithProvider() {
  return (
    <RouterBoundary>
      <EnsureEventsProvider>
        <EventPage />
      </EnsureEventsProvider>
    </RouterBoundary>
  );
}

// Option A — ready-to-use Router with provider-wrapped pages
export function EventsOptionARouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/events" element={<EventMainPageWithProvider />} />
        <Route path="/event/:slug" element={<EventPageWithProvider />} />
      </Routes>
    </BrowserRouter>
  );
}

// Make the safe main page the default export to reduce foot-guns
export default EventMainPageWithProvider;

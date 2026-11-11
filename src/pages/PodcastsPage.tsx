import { formatDate } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { PageHeader, PublicShell } from "@/components/hackathon/Shells";
import { ExternalIcon } from "@/components/hackathon/ui/icons";
import { focusRing } from "@/components/hackathon/ui/styles";

interface Podcast {
  title: string;
  description: string;
  youtubeId: string;
  date: string;
}

// Newest first.
const PODCASTS: Podcast[] = [
  {
    title: "Podcast with Professor Prashant Kumar Jamwal",
    description: "Discussion with Prof. Jamwal about robotics and engineering education at NU.",
    youtubeId: "fEW1X9M_L34",
    date: "2025-11-21",
  },
  {
    title: "Podcast with Professor Huseyin Atakan Varol",
    description: "Conversation about robotics, prosthetics, and research at Nazarbayev University.",
    youtubeId: "oiV5tpRNWTk",
    date: "2025-05-10",
  },
  {
    title: "Podcast with Alumna Akzharkyn Izbassarova",
    description: "Journey of Akzharkyn from NU student to alumna and her career path.",
    youtubeId: "2uWgJbQyeIs",
    date: "2025-02-28",
  },
  {
    title: "Podcast with Professor Kabylkas",
    description: "Talking about research, teaching, and student life in engineering.",
    youtubeId: "CCjooeYHrko",
    date: "2024-12-21",
  },
  {
    title: "Podcast with Professor Tosi",
    description: "Insights into biomedical engineering and ongoing projects at NU.",
    youtubeId: "UFfP3o29uVw",
    date: "2024-04-19",
  },
  {
    title: "Podcast with Professor Akhan",
    description: "Discussion about control systems, research interests, and advice for students.",
    youtubeId: "sSHb-lBtPrA",
    date: "2023-11-12",
  },
  {
    title: "Podcast with Professor Akhtar",
    description: "Conversation on electrical engineering, research, and industry experience.",
    youtubeId: "HNnJzJghXnE",
    date: "2023-04-14",
  },
];

function PodcastCard({ podcast }: { podcast: Podcast }) {
  return (
    <li className="reveal">
      <a
        href={`https://www.youtube.com/watch?v=${podcast.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-hk-accent-fg/40",
          focusRing
        )}
      >
        <div className="aspect-video overflow-hidden bg-hk-accent/10">
          <img
            src={`https://img.youtube.com/vi/${podcast.youtubeId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <time dateTime={podcast.date} className="text-sm font-medium text-hk-accent-fg">
            {formatDate(podcast.date)}
          </time>
          <h2 className="mt-1 text-lg font-semibold text-white">{podcast.title}</h2>
          <p className="mt-2 text-sm text-zinc-400">{podcast.description}</p>
          <p className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">
            Watch on YouTube
            <ExternalIcon />
          </p>
        </div>
      </a>
    </li>
  );
}

export default function PodcastsPage() {
  return (
    <PublicShell size="wide">
      <PageHeader
        title="Podcasts"
        description="Conversations with NU professors, alumni and other guests. All episodes are on our YouTube channel."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PODCASTS.map((podcast) => (
          <PodcastCard key={podcast.youtubeId} podcast={podcast} />
        ))}
      </ul>
    </PublicShell>
  );
}

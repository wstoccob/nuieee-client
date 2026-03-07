import { MainLayout } from "@/components/Layouts/MainLayout/MainLayout";

const PODCASTS = [
  {
    id: "1",
    title: "Podcast with Professor Prashant Kumar Jamwal",
    description: "Discussion with Prof. Jamwal about robotics and engineering education at NU.",
    youtubeId: "fEW1X9M_L34",
    date: "2025-11-21",
  },
  {
    id: "2",
    title: "Podcast with Professor Huseyin Atakan Varol",
    description: "Conversation about robotics, prosthetics, and research at Nazarbayev University.",
    youtubeId: "oiV5tpRNWTk",
    date: "2025-05-10",
  },
  {
    id: "3",
    title: "Podcast with Alumna Akzharkyn Izbassarova",
    description: "Journey of Akzharkyn from NU student to alumna and her career path.",
    youtubeId: "2uWgJbQyeIs",
    date: "2025-02-28",
  },
  {
    id: "4",
    title: "Podcast with Professor Kabylkas",
    description: "Talking about research, teaching, and student life in engineering.",
    youtubeId: "CCjooeYHrko",
    date: "2024-12-21",
  },
  {
    id: "5",
    title: "Podcast with Professor Tosi",
    description: "Insights into biomedical engineering and ongoing projects at NU.",
    youtubeId: "UFfP3o29uVw",
    date: "2024-04-19",
  },
  {
    id: "6",
    title: "Podcast with Professor Akhan",
    description: "Discussion about control systems, research interests, and advice for students.",
    youtubeId: "sSHb-lBtPrA",
    date: "2023-11-12",
  },
  {
    id: "7",
    title: "Podcast with Professor Akhtar",
    description: "Conversation on electrical engineering, research, and industry experience.",
    youtubeId: "HNnJzJghXnE",
    date: "2023-04-14",
  },
];

const PodcastsPage = () => {
  return (
    <MainLayout>
      <main className="bg-black min-h-screen text-white pt-28 pb-16 lg:pt-40 lg:pb-24">
        <div className="container mx-auto px-4">
          <header className="mb-12">
            <h1 className="text-[clamp(40px,6vw,72px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-4">
              podcasts
            </h1>
            <p className="text-gray-300 max-w-2xl">
              Listen to conversations with NU professors, alumni, and other guests.
              All episodes are available on our YouTube channel.
            </p>
          </header>

          {(() => {
            const sorted = PODCASTS.slice().sort(
              (a, b) =>
                new Date(b.date as string).getTime() -
                new Date(a.date as string).getTime()
            );
            const midpoint = Math.ceil(sorted.length / 2);
            const leftColumn = sorted.slice(0, midpoint);
            const rightColumn = sorted.slice(midpoint);

            const renderCard = (podcast: (typeof PODCASTS)[number]) => {
              const youtubeUrl = `https://www.youtube.com/watch?v=${podcast.youtubeId}`;
              const thumbnailUrl = `https://img.youtube.com/vi/${podcast.youtubeId}/hqdefault.jpg`;

              return (
                <a
                  key={podcast.id}
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-ieee-blue transition-colors duration-200 flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={thumbnailUrl}
                      alt={podcast.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-medium text-white">
                      <span className="inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 uppercase tracking-wide text-[10px]">
                        YouTube
                      </span>
                      <span className="text-zinc-200">Watch episode</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      {new Date(podcast.date as string).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <h2 className="text-lg font-semibold group-hover:text-ieee-blue transition-colors">
                      {podcast.title}
                    </h2>
                    <p className="text-sm text-gray-300">
                      {podcast.description}
                    </p>
                  </div>
                </a>
              );
            };

            return (
              <section className="grid gap-8 md:grid-cols-2">
                <div className="space-y-8">
                  {leftColumn.map(renderCard)}
                </div>
                <div className="space-y-8">
                  {rightColumn.map(renderCard)}
                </div>
              </section>
            );
          })()}
        </div>
      </main>
    </MainLayout>
  );
};

export default PodcastsPage;


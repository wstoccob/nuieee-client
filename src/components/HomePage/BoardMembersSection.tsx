import { releasePointer, trackPointer } from "@/lib/pointerEffects";

interface BoardMember {
  name: string;
  role: string;
  photo: string;
}

const BOARD: BoardMember[] = [
  { name: "Bekzat Bekenuly", role: "President", photo: "bekzat" },
  { name: "Dariga Suleimenova", role: "Vice-President", photo: "dariga" },
  { name: "Yerassyl Shaimoldayev", role: "Secretary", photo: "yerassyl" },
  { name: "Maxat Alpamyssov", role: "Treasurer", photo: "maxat" },
  { name: "Miraiya Kospanova", role: "HR Head", photo: "miraiya" },
  { name: "Ruana Bayakhmetova", role: "PR Head", photo: "ruana" },
  { name: "Madina Suleimenova", role: "Event Head", photo: "madina" },
  { name: "Alinur Seisekov", role: "Web Development Head", photo: "alinur" },
];

export default function BoardMembersSection() {
  return (
    <section aria-labelledby="board-title" className="border-t border-white/10 py-12 sm:py-16">
      <div className="reveal">
        <h2 id="board-title" className="text-2xl font-semibold text-white sm:text-3xl">
          Board
        </h2>
        <p className="mt-2 text-zinc-400">The students running NU IEEE this year.</p>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {BOARD.map((member) => (
          <li key={member.name} className="reveal">
            <div
              onPointerMove={trackPointer}
              onPointerLeave={releasePointer}
              className="spotlight tilt overflow-hidden rounded-2xl bg-white/[0.03]"
            >
              <img
                src={`/images/board/${member.photo}.webp`}
                alt={member.name}
                width={640}
                height={800}
                loading="lazy"
                className="aspect-[4/5] h-auto w-full object-cover"
              />
            </div>
            <p className="mt-3 text-base font-semibold text-white">{member.name}</p>
            <p className="text-sm text-zinc-400">{member.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

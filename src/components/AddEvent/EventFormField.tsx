interface Props {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const EventFormField = ({ label, error, children }: Props) => (
  <div>
    <label className="block text-white text-xl font-inter font-semibold mb-2">
      {label}
    </label>
    {children}
    {error && <p className="text-red-400 text-m font-semibold mt-1">{error}</p>}
  </div>
);

export const fieldClassName =
  "w-full rounded-md border-2 border-[#555] hover:border-ieee-blue bg-black text-white px-4 py-3 text-lg font-inter focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue placeholder-white/50 transition-colors";

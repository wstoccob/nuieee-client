export const EventsSpinner = () => (
  <div className="flex justify-center py-32">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ieee-blue" />
  </div>
);

export const EventsError = ({ message }: { message: string }) => (
  <div className="bg-red-900/30 border-2 border-red-500 text-red-400 p-8 rounded-lg mb-8">
    <h3 className="text-2xl font-bold mb-2">Error Loading Events</h3>
    <p className="text-lg">{message}</p>
  </div>
);

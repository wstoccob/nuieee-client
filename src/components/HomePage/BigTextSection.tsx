const bigWords = [
    'technologies',
    'future',
    'engineering',
    'network',
    'knowledge'
];

export const BigTextSection = () => {
    return (
        <section className="bg-black text-white px-4 py-8 md:px-12 mb-8">
            <div className="max-w-screen-xl mx-auto">
                {bigWords.map((word, idx) => (
                    <h2
                        key={idx}
                        className="w-full whitespace-nowrap font-bold leading-none text-white"
                        style={{
                            fontSize: 'clamp(2.5rem, 10vw, 8rem)',
                            lineHeight: 1.05
                        }}
                    >
                        {word}
                    </h2>
                ))}
            </div>
        </section>
    );
};

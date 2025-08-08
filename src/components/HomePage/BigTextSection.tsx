import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const bigWords = [
    'technologies',
    'future',
    'engineering',
    'network',
    'knowledge'
];

export const BigTextSection = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section
            ref={ref}
            className="bg-black text-white w-screen px-4 py-8 md:px-12 mb-8 overflow-hidden"
        >
            <div className="max-w-none mx-auto">
                {bigWords.map((word, idx) => (
                    <motion.h2
                        key={idx}
                        className="whitespace-nowrap font-bold leading-none text-white"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={inView ? { x: 0, opacity: 1 } : {}}
                        transition={{
                            duration: 0.8,
                            ease: 'easeOut',
                            delay: idx * 0.15,
                        }}
                        style={{
                            fontSize: 'clamp(2.5rem, 10vw, 8rem)',
                            lineHeight: 1.05,
                        }}
                    >
                        {word}
                    </motion.h2>
                ))}
            </div>
        </section>
    );
};

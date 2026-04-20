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
            className="bg-black text-white py-16 lg:py-24"
        >
            {/* MATCHED WRAPPER: Exact same classes as the AboutUsSection div */}
            <div className="container mx-auto px-4 text-left">
                {bigWords.map((word, idx) => (
                    <motion.h2
                        key={idx}
                        // Added font-inter and font-extrabold here to match your 'about us' typography!
                        className="whitespace-nowrap font-inter font-bold leading-none text-white lowercase"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={inView ? { x: 0, opacity: 1 } : {}}
                        transition={{
                            duration: 0.8,
                            ease: 'easeOut',
                            delay: idx * 0.15,
                        }}
                        style={{
                            fontSize: 'clamp(2.5rem, 5.vw, 8rem)',
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
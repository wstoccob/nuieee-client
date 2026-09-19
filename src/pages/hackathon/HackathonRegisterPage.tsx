import { errorMessage } from "@/api/client";
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { hackathonApi } from '@/api/hackathonApi.ts';
import { MainLayout } from '../../components/Layouts/MainLayout/MainLayout';

// Validation schema
const teamMemberSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    nuId: z.string().min(1, 'NU ID is required'),
    iin: z.string().min(12, 'IIN must be 12 digits').max(12, 'IIN must be 12 digits'),
    email: z.string().email('Invalid email address'),
    yearOfStudy: z.string().min(1, 'Year of study is required'),
    major: z.string().min(1, 'Major is required'),
});

const registerTeamSchema = z.object({
    teamName: z.string().min(1, 'Team name is required').max(50, 'Team name must be less than 50 characters'),
    members: z.array(teamMemberSchema)
        .min(2, 'At least 2 team members are required')
        .max(5, 'Maximum 5 team members allowed'),
});

type RegisterTeamFormData = z.infer<typeof registerTeamSchema>;

export default function HackathonRegisterPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<RegisterTeamFormData>({
        resolver: zodResolver(registerTeamSchema),
        defaultValues: {
            teamName: '',
            members: [
                { fullName: '', nuId: '', iin: '', email: '', yearOfStudy: '', major: '' },
                { fullName: '', nuId: '', iin: '', email: '', yearOfStudy: '', major: '' }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'members'
    });

    const onSubmit = async (data: RegisterTeamFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await hackathonApi.registerTeam(data);
            setSubmitSuccess(true);
            reset();
        } catch (error) {
            setSubmitError(errorMessage(error, 'Registration failed. Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const addMember = () => {
        if (fields.length < 5) {
            append({ fullName: '', nuId: '', iin: '', email: '', yearOfStudy: '', major: '' });
        }
    };

    const removeMember = (index: number) => {
        if (fields.length > 2) {
            remove(index);
        }
    };

    if (submitSuccess) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-black flex items-center justify-center px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="text-green-400 text-6xl mb-6">✓</div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Registration Successful!
                        </h1>
                        <p className="text-gray-300 text-lg mb-8">
                            Your team has been successfully registered for the hackathon.
                        </p>
                        <button
                            onClick={() => setSubmitSuccess(false)}
                            className="bg-ieee-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Register Another Team
                        </button>
                    </motion.div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-black text-white py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-ieee-blue">Hackathon</span> 2.0 Registration
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Machine Learning • Nazarbayev University • 13-14 September, 2025
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        {/* Team Name */}
                        <div className="bg-gray-900 p-6 rounded-lg">
                            <label className="block text-lg font-semibold mb-3">
                                Team Name *
                            </label>
                            <input
                                {...register('teamName')}
                                type="text"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-ieee-blue focus:outline-none"
                                placeholder="Enter your team name"
                            />
                            {errors.teamName && (
                                <p className="text-red-400 text-sm mt-2">{errors.teamName.message}</p>
                            )}
                        </div>

                        {/* Team Members */}
                        <div className="bg-gray-900 p-6 rounded-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">
                                    Team Members ({fields.length}/5)
                                </h2>
                                {fields.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={addMember}
                                        className="bg-ieee-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        + Add Member
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {fields.map((field, index) => (
                                    <motion.div
                                        key={field.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="border border-gray-700 rounded-lg p-6"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">
                                                Member {index + 1}
                                            </h3>
                                            {fields.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMember(index)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    {...register(`members.${index}.fullName`)}
                                                    type="text"
                                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-ieee-blue focus:outline-none"
                                                    placeholder="Full name"
                                                />
                                                {errors.members?.[index]?.fullName && (
                                                    <p className="text-red-400 text-xs mt-1">
                                                        {errors.members[index]?.fullName?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    NU ID *
                                                </label>
                                                <input
                                                    {...register(`members.${index}.nuId`)}
                                                    type="text"
                                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-ieee-blue focus:outline-none"
                                                    placeholder="NU ID"
                                                />
                                                {errors.members?.[index]?.nuId && (
                                                    <p className="text-red-400 text-xs mt-1">
                                                        {errors.members[index]?.nuId?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    IIN *
                                                </label>
                                                <input
                                                    {...register(`members.${index}.iin`)}
                                                    type="text"
                                                    maxLength={12}
                                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-ieee-blue focus:outline-none"
                                                    placeholder="12-digit IIN"
                                                />
                                                {errors.members?.[index]?.iin && (
                                                    <p className="text-red-400 text-xs mt-1">
                                                        {errors.members[index]?.iin?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Email *
                                                </label>
                                                <input
                                                    {...register(`members.${index}.email`)}
                                                    type="email"
                                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-ieee-blue focus:outline-none"
                                                    placeholder="Email address"
                                                />
                                                {errors.members?.[index]?.email && (
                                                    <p className="text-red-400 text-xs mt-1">
                                                        {errors.members[index]?.email?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Year of Study *
                                                </label>
                                                <select
                                                    {...register(`members.${index}.yearOfStudy`)}
                                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-ieee-blue focus:outline-none"
                                                >
                                                    <option value="">Select year</option>
                                                    <option value="1">1st Year</option>
                                                    <option value="2">2nd Year</option>
                                                    <option value="3">3rd Year</option>
                                                    <option value="4">4th Year</option>
                                                    <option value="5">5th Year</option>
                                                    <option value="6">6th Year</option>
                                                </select>
                                                {errors.members?.[index]?.yearOfStudy && (
                                                    <p className="text-red-400 text-xs mt-1">
                                                        {errors.members[index]?.yearOfStudy?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Major *
                                                </label>
                                                <input
                                                    {...register(`members.${index}.major`)}
                                                    type="text"
                                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-ieee-blue focus:outline-none"
                                                    placeholder="Major/Program"
                                                />
                                                {errors.members?.[index]?.major && (
                                                    <p className="text-red-400 text-xs mt-1">
                                                        {errors.members[index]?.major?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {errors.members && (
                                <p className="text-red-400 text-sm mt-4">{errors.members.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            {submitError && (
                                <p className="text-red-400 text-sm mb-4">{submitError}</p>
                            )}
                            
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-ieee-blue text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Registering...' : 'Register Team'}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </MainLayout>
    );
}

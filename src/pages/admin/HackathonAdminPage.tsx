import { errorMessage } from "@/api/client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { hackathonApi } from '@/api/hackathonApi';
import type {HackathonTeam} from '@/dtos/Hackathon/HackathonTeam';
import AdminHeader from '@/components/Layouts/AdminPageLayout/AdminHeader';

export default function HackathonAdminPage() {
    const [teams, setTeams] = useState<HackathonTeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const data = await hackathonApi.getHackathonTeams();
            setTeams(data);
        } catch (err) {
            setError(errorMessage(err, 'Failed to fetch teams'));
        } finally {
            setLoading(false);
        }
    };

    const filteredTeams = teams.filter(team =>
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.members.some(member =>
            member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.nuId.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const toggleTeamExpansion = (teamName: string) => {
        setExpandedTeam(expandedTeam === teamName ? null : teamName);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <AdminHeader />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading teams...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <AdminHeader />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchTeams}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader />
            
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Hackathon Teams
                        </h1>
                        <p className="text-gray-600">
                            View all registered teams for Hackathon 2.0
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Teams</p>
                                    <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Participants</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {teams.reduce((total, team) => total + team.members.length, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avg Team Size</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {teams.length > 0 
                                            ? (teams.reduce((total, team) => total + team.members.length, 0) / teams.length).toFixed(1)
                                            : '0'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search teams, members, emails, or NU IDs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Teams List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {filteredTeams.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📋</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? 'No teams found' : 'No teams registered yet'}
                                </h3>
                                <p className="text-gray-600">
                                    {searchTerm ? 'Try adjusting your search terms' : 'Teams will appear here once they register'}
                                </p>
                            </div>
                        ) : (
                            filteredTeams.map((team, index) => (
                                <motion.div
                                    key={team.teamName}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                                >
                                    {/* Team Header */}
                                    <div 
                                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleTeamExpansion(team.teamName)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold">
                                                        {team.teamName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {team.teamName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-gray-500">
                                                    Team #{index + 1}
                                                </span>
                                                <svg 
                                                    className={`w-5 h-5 text-gray-400 transition-transform ${
                                                        expandedTeam === team.teamName ? 'rotate-180' : ''
                                                    }`} 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Team Members (Expandable) */}
                                    {expandedTeam === team.teamName && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-gray-200"
                                        >
                                            <div className="p-6">
                                                <h4 className="text-md font-semibold text-gray-900 mb-4">
                                                    Team Members
                                                </h4>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {team.members.map((member, memberIndex) => (
                                                        <div 
                                                            key={memberIndex}
                                                            className="bg-gray-50 p-4 rounded-lg"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <h5 className="font-medium text-gray-900 mb-1">
                                                                        {member.fullName}
                                                                    </h5>
                                                                    <div className="space-y-1 text-sm text-gray-600">
                                                                        <p><span className="font-medium">NU ID:</span> {member.nuId}</p>
                                                                        <p><span className="font-medium">Email:</span> {member.email}</p>
                                                                        <p><span className="font-medium">IIN:</span> {member.iin}</p>
                                                                        <p><span className="font-medium">Year:</span> {member.yearOfStudy}</p>
                                                                        <p><span className="font-medium">Major:</span> {member.major}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4 text-xs text-gray-400">
                                                                    Member {memberIndex + 1}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

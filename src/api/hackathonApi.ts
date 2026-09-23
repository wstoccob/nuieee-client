import axiosInstance from './client';
import type {RegisterTeamCommand} from '../dtos/Hackathon/HackathonTeam';

export const hackathonApi = {
    registerTeam: async (teamData: RegisterTeamCommand) => {
        const response = await axiosInstance.post('/hackathon/register-team', teamData);
        return response.data;
    },
    
    getHackathonTeams: async () => {
        const response = await axiosInstance.get('/hackathon/get-hackathon-teams');
        return response.data;
    }
};

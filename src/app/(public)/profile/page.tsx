"use server";
import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditProfile from './form';

const Profile: React.FC = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('authorization');

    const url = `${process.env.NEXT_PUBLIC_API}/student/profile`;

    if (!token) {
        // Redirect to login if the token is missing
        redirect('/auth?route=login');
        return null;  // Return null to prevent further execution
    }

    try {
        // Fetch the user profile data
        const { data } = await axios.get(url, {
            headers: { Authorization: `Bearer ${token.value}` }
        });

        // Render the profile form with the fetched data
        return <EditProfile data={data} token={token.value} />;
    } catch (error) {
        // Handle different scenarios where the request might fail
        if (axios.isAxiosError(error)) {
            console.error('Failed to fetch profile data:', error.response?.data || error.message);

            // If the error is due to authorization, redirect to login
            if (error.response?.status === 403) {
                redirect('/auth?route=login');
            }
        } else {
            console.error('Unexpected error:', error);
        }

        // Optionally, you could return an error component or message
        return <div>Failed to load profile. Please try again later.</div>;
    }
};

export default Profile;

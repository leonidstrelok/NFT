import axios from 'axios';

const ADDRESS = process.env.CLUB_PUBLIC_SERVER_ADDRESS || 'https://goldor-back/' + 'api/v1/user';

export default async function register(username: string, email: string, password: string, referal: string, wallets: string[]) {
    try {
        const { data } = await axios.post(ADDRESS, { username, email, password, referal, wallets });
        return data;
    } catch (error) {
        console.log(error);
    }
}

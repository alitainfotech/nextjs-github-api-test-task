import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import GithubCred from '../configs/githubCred';

type Data = {
    message: string
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        GithubCred.GITHUB_OWNER = '';
        GithubCred.GITHUB_AUTH_TOKEN = '';
        GithubCred.GITHUB_REPOSITORY = '';
        res.status(200).json({ message: 'GitHub config removed successfully.' });
    } catch (error: Error | any) {
        res.status(500).json({ message: error });
    }
}
export default handler
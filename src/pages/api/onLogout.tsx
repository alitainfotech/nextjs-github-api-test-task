import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { GithubCredVal } from '../../configs/githubCred';

type Data = {
    message: string
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        GithubCredVal.GITHUB_OWNER = '';
        GithubCredVal.GITHUB_AUTH_TOKEN = '';
        GithubCredVal.GITHUB_REPOSITORY = '';
        res.status(200).json({ message: 'GitHub config removed successfully.' });
    } catch (error: Error | any) {
        res.status(500).json({ message: error });
    }
}
export default handler
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { GithubCredVal } from '../configs/githubCred';

type Data = {
    message: string
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { owner, apiKey, repository } = JSON.parse(req.body);
        GithubCredVal.GITHUB_OWNER = owner;
        GithubCredVal.GITHUB_AUTH_TOKEN = apiKey;
        GithubCredVal.GITHUB_REPOSITORY = repository;
        res.status(200).json({ message: 'GitHub config saved successfully.' });
    } catch (error: Error | any) {
        res.status(500).json({ message: error });
    }
}

export default handler

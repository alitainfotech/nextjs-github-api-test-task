import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import GithubCred from '../configs/githubCred';

type Data = {
    message: string
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { owner, apiKey, repository } = JSON.parse(req.body);
        GithubCred.GITHUB_OWNER = owner;
        GithubCred.GITHUB_AUTH_TOKEN = apiKey;
        GithubCred.GITHUB_REPOSITORY = repository;
        res.status(200).json({ message: 'GitHub config saved successfully.' });
    } catch (error: Error | any) {
        res.status(500).json({ message: error });
    }
}

export default handler

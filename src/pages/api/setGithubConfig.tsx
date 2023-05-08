import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { owner, apiKey, repository } = JSON.parse(req.body);
        process.env.GITHUB_OWNER = owner as any;
        process.env.GITHUB_AUTH_TOKEN = apiKey as any;
        process.env.GITHUB_REPOSITORY = repository as any;
        res.status(200).json({ message: 'GitHub config saved successfully.' });
    } catch (error: Error | any) {
        res.status(500).json({ message: error });
    }
}

export default handler

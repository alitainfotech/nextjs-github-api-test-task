import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        process.env.GITHUB_OWNER = '';
        process.env.GITHUB_AUTH_TOKEN = '';
        process.env.GITHUB_REPOSITORY = '';
        res.status(200).json({ message: 'GitHub config removed successfully.' });
    } catch (error: Error | any) {
        res.status(500).json({ message: error });
    }
}
export default handler
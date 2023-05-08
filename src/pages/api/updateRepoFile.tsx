import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const owner = process.env.GITHUB_OWNER
const apiKey = process.env.GITHUB_AUTH_TOKEN
const repository = process.env.GITHUB_REPOSITORY

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { path, sha, message, code } = JSON.parse(req.body)
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repository}/contents${path ? "/" + path : ""
            }`,
            {
                method: 'put',
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization:
                        `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    sha: sha,
                    message: message.toString(),
                    content: code
                })
            }
        );
        console.log(response)
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status} and ${response.statusText}`);
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export default handler;

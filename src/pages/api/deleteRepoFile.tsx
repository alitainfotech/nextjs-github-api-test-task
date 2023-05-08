import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import GithubCred from "../configs/githubCred";


const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const owner = GithubCred.GITHUB_OWNER
    const apiKey = GithubCred.GITHUB_AUTH_TOKEN
    const repository = GithubCred.GITHUB_REPOSITORY

    const { path, sha, message } = JSON.parse(req.body)
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repository}/contents${path ? "/" + path : ""
            }`,
            {
                method: 'delete',
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization:
                        `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    sha: sha,
                    message: message.toString()
                })
            }
        );
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

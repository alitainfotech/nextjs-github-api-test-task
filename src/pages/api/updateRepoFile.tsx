import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { path, sha, message, code, owner, apiKey, repository } = JSON.parse(req.body)
    console.log({ path, sha, message, code, owner, apiKey, repository })
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repository}/contents${path ? '/' + path : ""
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

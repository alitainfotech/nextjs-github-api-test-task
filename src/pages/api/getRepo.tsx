import { NextApiHandler } from "next";

const owner = process.env.GITHUB_OWNER
const apiKey = process.env.GITHUB_AUTH_TOKEN
const repository = process.env.GITHUB_REPOSITORY

const handler: NextApiHandler = async (req, res) => {
  const { path } = req.query
  // if (!owner && !apiKey && !repository) {
  //   // res.status(500).json({ message: 'Invalid credential' })
  //   return
  // }
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repository}/contents${path ? "/" + path : ""
      }`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization:
            `Bearer ${apiKey}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status} and ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;

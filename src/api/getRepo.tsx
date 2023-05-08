import { NextApiHandler } from "next";
import { GithubCredVal } from "../configs/githubCred";


const handler: NextApiHandler = async (req, res) => {
  const owner = GithubCredVal.GITHUB_OWNER
  const apiKey = GithubCredVal.GITHUB_AUTH_TOKEN
  const repository = GithubCredVal.GITHUB_REPOSITORY

  const { path } = req.query
  console.log({ owner, apiKey, repository })
  if (!owner && !apiKey && !repository) {
    res.status(500).json({ message: 'Invalid credential' })
    return
  }
  console.log(`https://api.github.com/repos/${owner}/${repository}/contents${path ? "/" + path : ""
    }`)
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
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;

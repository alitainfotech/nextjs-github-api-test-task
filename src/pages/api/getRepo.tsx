import { NextApiHandler } from "next";
const handler: NextApiHandler = async (req, res) => {
  const { path, owner, apiKey, repository } = JSON.parse(req.body)

  console.log({ owner, apiKey, repository, path })
  if (!owner && !apiKey && !repository) {
    res.status(500).json({ message: 'Invalid credential' })
    return
  }
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

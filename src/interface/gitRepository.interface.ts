export interface GithubCred {
    owner: string;
    apiKey: string;
    repository: string
    settingCred?: boolean;
}

export interface ErrorInterface {
    status: number,
    message: string,
}

export interface GitRepositoryInterface {
    name: string,
    path: string,
    sha: string,
    size: string,
    url: string,
    html_url: string,
    git_url: string,
    download_url: string,
    type: string,
    _links: string,
    self: string,
    git: string,
    html: string,
}
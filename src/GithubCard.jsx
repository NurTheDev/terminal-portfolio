import React from "react";

/*
  GithubCard - renders a GitHub user card inside the terminal output.
  Expects `data` object from https://api.github.com/users/:username
*/
export default function GithubCard({ data }) {
    if (!data) return null;
    return (
        <div className="gh-card" role="region" aria-label={`GitHub profile ${data.login}`}>
            <div className="gh-avatar">
                <img src={data.avatar_url} alt={data.login} />
            </div>
            <div className="gh-info">
                <div className="gh-row">
                    <span className="gh-key">login</span>
                    <span className="gh-val">{data.login}</span>
                </div>
                <div className="gh-row">
                    <span className="gh-key">name</span>
                    <span className="gh-val">{data.name || "—"}</span>
                </div>
                <div className="gh-row">
                    <span className="gh-key">bio</span>
                    <span className="gh-val">{data.bio || "—"}</span>
                </div>
                <div className="gh-row">
                    <span className="gh-key">location</span>
                    <span className="gh-val">{data.location || "—"}</span>
                </div>
                <div className="gh-row">
                    <span className="gh-key">repos</span>
                    <span className="gh-val">{data.public_repos}</span>
                </div>
                <div className="gh-row">
                    <span className="gh-key">followers</span>
                    <span className="gh-val">{data.followers}</span>
                </div>
                <div className="gh-row">
                    <span className="gh-key">following</span>
                    <span className="gh-val">{data.following}</span>
                </div>
                <div className="gh-row">
                    <span className="gh-key">url</span>
                    <a className="gh-link" href={data.html_url} target="_blank" rel="noreferrer">
                        {data.html_url}
                    </a>
                </div>
            </div>
        </div>
    );
}
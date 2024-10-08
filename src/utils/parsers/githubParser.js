import axios from 'axios';

export async function parseGithub(content) {
  const lines = content.split('\n');
  const githubUrls = lines.filter(line => line.trim().startsWith('https://github.com/'));
  
  return githubUrls.map(url => {
    const [, owner, repo] = url.match(/https:\/\/github\.com\/([^\/]+)\/([^\/\s]+)/);
    return {
      title: `${owner}/${repo}`,
      link: url,
      description: 'Loading...',
      parser: 'GitHub',
      isLoading: true
    };
  });
}

export async function fetchGithubData(card) {
  const [, owner, repo] = card.link.match(/https:\/\/github\.com\/([^\/]+)\/([^\/\s]+)/);
  
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
    const { stargazers_count, description } = response.data;
    
    return {
      ...card,
      description: `⭐ ${stargazers_count}\n\n${description || 'No description available.'}`,
      isLoading: false
    };
  } catch (error) {
    console.error(`Error fetching data for ${card.link}:`, error);
    return {
      ...card,
      description: 'Failed to fetch repository data',
      isLoading: false
    };
  }
}
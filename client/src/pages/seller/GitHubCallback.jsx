import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner'; // ✅ Added toast

const GitHubCallback = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    const getAccessToken = async () => {
      const code = new URLSearchParams(window.location.search).get('code');

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/github/callback?code=${code}`);
      const data = await res.json();

      if (data.accessToken) {
        setAccessToken(data.accessToken);

        const reposRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/github/repos`, {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        });

        const reposData = await reposRes.json();
        setRepos(reposData);
      }
    };

    getAccessToken();
  }, []);

  const handleCollaborate = async () => {
    if (!selectedRepo || !accessToken) return;

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/github/collaborate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ repo: selectedRepo }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem('githubRepo', selectedRepo);
      toast.success('Collaborator added successfully!');
      navigate('/seller/upload');
    } else {
      toast.error('Failed to add collaborator');
    }
  };

  return (
    <div className="p-10 max-w-3xl mx-auto mt-16 mb-16">
      <h2 className="text-3xl font-bold text-primary mb-4">Choose a GitHub Repository</h2>
      <p className="text-muted-foreground mb-6">
        Select the repository you want to submit. You will grant full collaborator access for deployment.
      </p>

      {repos.length === 0 ? (
        <p className="text-muted-foreground">Loading repositories...</p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto rounded-lg border p-4 shadow-sm">
          {repos.map((repo) => (
            <Card
              key={repo.id}
              onClick={() => setSelectedRepo(repo.full_name)}
              className={`p-4 cursor-pointer border-2 transition-all duration-150 ${
                selectedRepo === repo.full_name
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <div className="font-semibold text-lg text-foreground">{repo.full_name}</div>
              <div className="text-sm text-muted-foreground">{repo.description || 'No description'}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Display selected repo */}
      {selectedRepo && (
        <Card className="mt-6 border border-green-500 bg-green-50 dark:bg-green-950">
          <div className="p-4 space-y-1">
            <h4 className="font-medium text-green-700 dark:text-green-300">Selected Repository</h4>
            <p className="text-sm text-green-800 dark:text-green-400">
              <code className="bg-muted px-2 py-0.5 rounded">{selectedRepo}</code>
            </p>
            <p className="text-xs text-muted-foreground">
              This repository will be linked to your template submission.
            </p>
          </div>
        </Card>
      )}

      <Button
        className="mt-6 w-full"
        onClick={handleCollaborate}
        disabled={!selectedRepo}
      >
        Collaborate with us
      </Button>
    </div>
  );
};

export default GitHubCallback;

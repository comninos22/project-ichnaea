import express from 'express';
import { GitService } from '../services/git.service';
import { Dataset } from '../models/dataset.model';
import mongoose from 'mongoose';
import { join } from 'path';
const router = express.Router();
const gitRepoDir = join(__dirname, '/assets/git');
const clientFilesDir = join(__dirname, '/git/assets/datasets');
console.log('gitRepoDir', gitRepoDir);
console.log('clientFilesDir', clientFilesDir);

const gitService = new GitService(gitRepoDir, clientFilesDir);

// GET /datasets - List all datasets
router.get('/datasets', async (req, res) => {
  try {
    const datasets = await Dataset.find();
    res.json(datasets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /datasets/:id - Get details of a specific dataset
router.get('/datasets/:id', async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return res.status(404).json({ error: 'Dataset not found' });
    res.json(dataset);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /datasets - Add a new dataset
router.post('/datasets', async (req, res) => {
  const { url, name } = req.body;

  if (!url || !name) {
    return res.status(400).json({ error: 'Name and URL are required' });
  }

  try {
    // Step 1: Handle the file via GitService
    const fileHash = await gitService.handleClientFile(url, name);
    const commitHash = (await gitService.git.log()).latest?.hash;

    if (!commitHash) {
      return res.status(500).json({ error: 'Failed to retrieve commit hash' });
    }

    // Step 2: Save metadata to MongoDB
    const dataset = new Dataset({ name, url, fileHash, commitHash });
    await dataset.save();

    // Step 3: Publish metadata to Ethereum contract
    await gitService.publishMetadataToContract(
      'http://localhost:8545',
      '0x1234567890123456789012345678901234567890',
      [],
      { fileHash, fileName: name, commitHash }
    );

    // Step 4: Respond with the created dataset
    res.status(201).json(dataset);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /datasets/:id/diff?commit1=abc&commit2=def - Get version diff for a dataset
router.get('/datasets/:id/diff', async (req, res) => {
  const { commit1, commit2 } = req.query;

  if (!commit1 || !commit2) {
    return res
      .status(400)
      .json({ error: 'Both commit1 and commit2 are required' });
  }

  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return res.status(404).json({ error: 'Dataset not found' });

    const diff = await gitService.getGitDiff(
      commit1 as string,
      commit2 as string
    );
    res.json({ diff });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

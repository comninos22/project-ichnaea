import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ethers } from 'ethers';
import simpleGit, { SimpleGit } from 'simple-git';

export class GitService {
  private gitRepoDir: string;
  private clientFilesDir: string;
  public git: SimpleGit;
  private branchName: string;

  constructor(
    gitRepoDir: string,
    clientFilesDir: string,
    branchName = 'master'
  ) {
    this.gitRepoDir = gitRepoDir;
    this.clientFilesDir = clientFilesDir;
    this.branchName = branchName;
    this.git = simpleGit({ baseDir: gitRepoDir });
  }

  async downloadFile(url: string, filePath: string): Promise<string> {
    try {
      const writer = fs.createWriteStream(filePath);
      const hash = crypto.createHash('sha256');

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      });

      response.data.pipe(hash); // Pipe the stream into the hash function
      response.data.pipe(writer);

      return new Promise<string>((resolve, reject) => {
        writer.on('finish', () => {
          const fileHash = hash.digest('hex');
          resolve(fileHash);
        });
        writer.on('error', reject);
      });
    } catch (error: any) {
      throw new Error(`Error downloading or hashing file: ${error.message}`);
    }
  }

  async addFileToGitAndCommit(
    filePath: string,
    commitMessage: string
  ): Promise<void> {
    try {
      await this.git.add(filePath);
      await this.git.commit(commitMessage);
      console.log(`Committed: ${filePath}`);

      await this.git.push('origin', this.branchName);
      console.log(`Pushed changes to ${this.branchName}`);
    } catch (error: any) {
      throw new Error(`Error committing to Git: ${error.message}`);
    }
  }

  async publishMetadataToContract(
    providerUrl: string,
    contractAddress: string,
    abi: any,
    metadata: { fileHash: string; fileName: string; commitHash: string }
  ): Promise<void> {
    try {
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const signer = await provider.getSigner(); // Assumes signer is set up (e.g., via private key)
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.storeMetadata(
        metadata.fileHash,
        metadata.fileName,
        metadata.commitHash
      );
      await tx.wait(); // Wait for transaction to be mined
      console.log('Metadata published to contract:', tx.hash);
    } catch (error: any) {
      throw new Error(
        `Error interacting with Ethereum contract: ${error.message}`
      );
    }
  }

  async handleClientFile(url: string, fileName: string): Promise<string> {
    try {
      const filePath = path.join(this.clientFilesDir, fileName);

      // Step 1: Download and hash the file
      console.log(`Downloading file from: ${url}`);
      const fileHash = await this.downloadFile(url, filePath);
      console.log(`File downloaded and hashed: ${fileHash}`);

      // Step 2: Copy the downloaded file to the Git repository folder
      const gitFilePath = path.join(this.gitRepoDir, fileName);
      fs.copyFileSync(filePath, gitFilePath);
      console.log(`File copied to Git repository: ${gitFilePath}`);

      // Step 3: Add/update the file in Git and commit
      await this.addFileToGitAndCommit(
        fileName,
        `Add or update file: ${fileName} with hash: ${fileHash}`
      );

      return fileHash; // Return the hash for further use
    } catch (error: any) {
      console.error(`Error handling client file: ${error.message}`);
      throw error;
    }
  }

  async getGitDiff(commitHash1: string, commitHash2: string): Promise<string> {
    try {
      const diff = await this.git.diff([commitHash1, commitHash2]);
      console.log(`Diff between ${commitHash1} and ${commitHash2}:\n${diff}`);
      return diff;
    } catch (error: any) {
      throw new Error(`Error computing git diff: ${error.message}`);
    }
  }
}

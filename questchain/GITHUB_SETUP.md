# Setting Up a GitHub Repository for QuestChain Academy

Follow these steps to create a GitHub repository for the QuestChain Academy project:

## 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Enter "questchain" as the repository name
4. Add a description: "A 2-D play-to-learn RPG on Sui blockchain with dynamic NFT avatars"
5. Choose "Public" visibility (or Private if you prefer)
6. Check "Add a README file"
7. Choose "MIT License" from the "Add a license" dropdown
8. Click "Create repository"

## 2. Clone the Repository Locally

```bash
git clone https://github.com/YOUR_USERNAME/questchain.git
cd questchain
```

## 3. Copy Project Files

1. Copy all the files from your current project directory to the cloned repository directory
2. Make sure to include:
   - All source code files
   - Configuration files
   - Documentation
   - README.md
   - LICENSE
   - CONTRIBUTING.md

## 4. Commit and Push Changes

```bash
# Add all files to git
git add .

# Commit the changes
git commit -m "Initial commit: QuestChain Academy project"

# Push to GitHub
git push origin main
```

## 5. Set Up GitHub Pages (Optional)

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "GitHub Pages"
4. Select "main" branch and "/docs" folder as the source
5. Click "Save"

## 6. Set Up GitHub Actions (Optional)

1. Create a `.github/workflows` directory if it doesn't exist
2. Copy the CI workflow files to this directory
3. Commit and push these changes

Your QuestChain Academy project is now hosted on GitHub and ready for collaboration!

## Repository URL

Once you've completed these steps, your repository will be available at:
`https://github.com/YOUR_USERNAME/questchain`

Replace `YOUR_USERNAME` with your actual GitHub username.

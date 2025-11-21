# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versions, changelogs, and publishing.

## What are changesets?

A changeset is a piece of information about changes made in a branch or commit. It holds three key bits of information:

1. What needs to be released
2. What version bump should happen (major, minor, or patch)
3. A changelog entry for the released packages

## How to use changesets

### Adding a changeset

When you make changes that should be released, run:

```bash
yarn changeset
```

This will:
1. Ask which packages have changed (in this monorepo setup, typically just the main package)
2. Ask what type of change this is (major, minor, or patch)
3. Ask for a summary of the changes

The changeset will be saved in the `.changeset` directory and should be committed with your PR.

### Version bumping

When ready to release, run:

```bash
yarn changeset:version
```

This will:
1. Update the version in `package.json`
2. Update the `CHANGELOG.md` file
3. Delete the changeset files that were used

### Publishing

To publish the package (if applicable):

```bash
yarn changeset:publish
```

## Changeset types

- **Major** (breaking changes): `1.0.0` → `2.0.0`
- **Minor** (new features): `1.0.0` → `1.1.0`
- **Patch** (bug fixes): `1.0.0` → `1.0.1`

## Examples

### Patch (Bug Fix)
```bash
yarn changeset
# Select: patch
# Summary: "Fix user authentication bug"
```

### Minor (New Feature)
```bash
yarn changeset
# Select: minor
# Summary: "Add user profile search functionality"
```

### Major (Breaking Change)
```bash
yarn changeset
# Select: major
# Summary: "Restructure API endpoints for better REST compliance"
```

## Workflow

1. Make your changes
2. Run `yarn changeset` and describe your changes
3. Commit the changeset file along with your code
4. When ready to release:
   - Run `yarn changeset:version` to bump versions and update changelogs
   - Commit the version changes
   - Run `yarn changeset:publish` if publishing to npm (optional for private repos)

## Configuration

Configuration is stored in `.changeset/config.json`:
- `baseBranch`: Set to `master` (main branch for version comparison)
- `commit`: Set to `false` (manual commit control)
- `access`: Set to `restricted` (private package, change to `public` if publishing)

For more information, visit: https://github.com/changesets/changesets

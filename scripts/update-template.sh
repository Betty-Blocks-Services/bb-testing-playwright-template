#!/usr/bin/env bash

# =============================================
# Script to sync your fork with the master template
# Upstream URL: https://github.com/Betty-Blocks-Services/bb-testing-playwright-template.git
# =============================================

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print functions
echo_success() {
	echo -e "${GREEN}$1${NC}"
}
echo_error() {
	echo -e "${RED}$1${NC}" 1>&2
}
echo_info() {
	echo -e "${YELLOW}$1${NC}"
}

# Desired upstream URL
UPSTREAM_URL="https://github.com/Betty-Blocks-Services/bb-testing-playwright-template.git"

# Step 1: Ensure we're inside a Git repository
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
	echo_error "Not a git repository. Please run this from your project directory."
	exit 1
fi
echo_success "✔ Git repository detected."

# Step 2: Add or update upstream remote
current_url=$(git remote get-url upstream 2>/dev/null || true)
if [[ -z "$current_url" ]]; then
	if git remote add upstream "$UPSTREAM_URL"; then
		echo_success "✔ Added upstream remote: $UPSTREAM_URL"
	else
		echo_error "Failed to add upstream remote."
		exit 1
	fi
else
	if [[ "$current_url" != "$UPSTREAM_URL" ]]; then
		if git remote set-url upstream "$UPSTREAM_URL"; then
			echo_success "✔ Updated upstream URL to: $UPSTREAM_URL"
		else
			echo_error "Failed to update upstream URL."
			exit 1
		fi
	else
		echo_info "Upstream remote already set to $UPSTREAM_URL"
	fi
fi

# Step 3: Verify remotes
echo_info "Remotes configured:" && git remote -v

# Step 4: Fetch upstream changes
if git fetch upstream; then
	echo_success "✔ Fetched changes from upstream."
else
	echo_error "Failed to fetch from upstream."
	exit 1
fi

# Step 5: Determine default branch of upstream
default_branch=$(git remote show upstream | awk '/HEAD branch/ {print $NF}')
if [[ -z "$default_branch" ]]; then
	echo_error "Could not detect upstream default branch."
	exit 1
fi
echo_info "Upstream default branch: $default_branch"

# Step 6: Checkout default branch
if git checkout "$default_branch"; then
	echo_success "✔ Checked out $default_branch."
else
	echo_error "Failed to checkout $default_branch."
	exit 1
fi

# Step 7: Merge upstream into local
if git merge --allow-unrelated-histories "upstream/$default_branch"; then
	echo_success "✔ Merged upstream/$default_branch into $default_branch successfully."
else
	echo_error "Merge conflicts detected. Please resolve the conflicts marked by <<<<<<<, =======, >>>>>>> and then run:\n  git add . && git commit"
	exit 1
fi

# Prompt before pushing
echo_info "Would you like to push the merged changes to origin/$default_branch? (y/N)"
read -r REPLY
if [[ "$REPLY" =~ ^[Yy]$ ]]; then
	# Step 8: Push to origin
	if git push origin "$default_branch"; then
		echo_success "✔ Pushed updates to origin/$default_branch."
	else
		echo_error "Failed to push to origin/$default_branch."
		exit 1
	fi
else
	echo_info "Push skipped. You can push manually with:"
	echo_info "  git push origin $default_branch"
fi

# Completion message
echo_success "Repository successfully updated with upstream template!"

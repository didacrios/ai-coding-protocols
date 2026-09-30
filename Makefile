.PHONY: ai help install-skills install-oak install-opencode-overlay install-pi purge-gentle-ai

OAK_VERSION := 1.1.1
OPENCODE_DIR := $(HOME)/.config/opencode

help:
	@echo "Usage:"
	@echo "  make ai <path>                  Vendor skills+blueprints+template to <path>/.ai/"
	@echo "  make install-skills             Install third-party skills from skills.json (via npx skills add)"
	@echo "  make install-oak                Install the OAK kit (OpenCode harness) globally, pinned to $(OAK_VERSION)"
	@echo "  make install-opencode-overlay   Merge harness/*-overlay.json into live opencode.json, package.json, tui.json (see blueprints/opencode.md)"
	@echo "  make install-pi                 Convert + install the harness to ~/.pi/agent"
	@echo "  make purge-gentle-ai            Dry-run: report gentle-ai residue in $(OPENCODE_DIR)"

AI_DEST := $(word 2, $(MAKECMDGOALS))

ai:
	@if [ -z "$(AI_DEST)" ]; then \
		echo "❌ Error: Destination path is required."; \
		exit 1; \
	fi
	@mkdir -p $(AI_DEST)/.ai
	@cp -r skills blueprints template $(AI_DEST)/.ai/
	@echo "✅ Skills vendored to $(AI_DEST)/.ai/"

install-skills:
	@node scripts/install-skills.mjs

# The OpenCode harness itself is not vendored here: the OAK kit owns it, and it
# installs and upgrades its own files through `oak`. See blueprints/opencode.md.
install-oak:
	@echo "Installing opencode-agent-orchestration-kit@$(OAK_VERSION) globally"
	@npm install -g opencode-agent-orchestration-kit@$(OAK_VERSION)
	@echo "✅ oak $(OAK_VERSION) installed."
	@echo "Next: run 'oak install' in $(OPENCODE_DIR) (or 'oak upgrade' if the kit is already there),"
	@echo "      then 'make install-opencode-overlay' to re-apply the local overlay."

install-opencode-overlay:
	@node scripts/apply-opencode-overlay.mjs --apply

install-pi:
	@echo "Converting + installing harness (pi format) to $(HOME)/.pi/agent"
	@node scripts/sync-harness.mjs --target pi

purge-gentle-ai:
	@node scripts/purge-gentle-ai.mjs

%:
	@:

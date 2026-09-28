.PHONY: ai help install-skills install-opencode install-pi

help:
	@echo "Usage:"
	@echo "  make ai <path>            Vendor skills+blueprints+template to <path>/.ai/"
	@echo "  make install-skills       Install third-party skills from skills.json (via npx skills add)"
	@echo "  make install-opencode     Install the OpenCode dev workflow to ~/.config/opencode"
	@echo "  make install-pi           Convert + install the dev workflow to ~/.pi/agent"

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

OPENCODE_DIR := $(HOME)/.config/opencode

install-opencode:
	@echo "Installing OpenCode dev workflow (symlinks) to $(OPENCODE_DIR)"
	@mkdir -p $(OPENCODE_DIR)/agents $(OPENCODE_DIR)/commands $(OPENCODE_DIR)/docs/ai
	@for f in harness/opencode/agents/*.md; do \
		ln -sfn "$$(pwd)/$$f" "$(OPENCODE_DIR)/agents/$$(basename $$f)"; \
	done
	@for f in harness/opencode/commands/*.md; do \
		ln -sfn "$$(pwd)/$$f" "$(OPENCODE_DIR)/commands/$$(basename $$f)"; \
	done
	@rm -rf $(OPENCODE_DIR)/docs/ai/harness
	@ln -sfn "$$(pwd)/harness/opencode/docs/harness" "$(OPENCODE_DIR)/docs/ai/harness"
	@echo "✅ Agents, commands and harness docs linked."
	@echo "⚠ AGENTS.md is not linked automatically: merge harness/opencode/AGENTS.md content into $(OPENCODE_DIR)/AGENTS.md manually."

install-pi:
	@echo "Converting + installing dev workflow (pi format) to $(HOME)/.pi/agent"
	@node scripts/sync-harness.mjs --target pi

%:
	@:

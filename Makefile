.PHONY: ai vendor help install-skills install-own-skills install-opencode-overlay render-catalog test-catalog FORCE

OWN_REPO ?= didacrios/ai-coding-protocols

help:
	@echo "Usage:"
	@echo "  make vendor <path>              Vendor skills+blueprints+template to <path>/.agents/ (alias: make ai)"
	@echo "  make install-skills             Install third-party skills from skills.json (via npx skills add)"
	@echo "  make install-own-skills         Install this repo's own skills via the skills CLI (OWN_REPO=$(OWN_REPO))"
	@echo "  make install-opencode-overlay   Merge harness/*-overlay.json into live opencode.json, package.json, tui.json (see blueprints/opencode.md)"
	@echo "  make test-catalog               Run catalog YAML + adapter tests"
	@echo "  make render-catalog             Render catalog to ./generated (gitignored; not a live install)"

# .agents/ is the canonical cross-client location the skills CLI itself uses
# (AGENTS_DIR=".agents", SKILLS_SUBDIR="skills"), so a vendored tree and a
# `npx skills add` tree land in the same place instead of drifting apart.
AGENTS_DEST := $(word 2, $(MAKECMDGOALS))

vendor ai:
	@if [ -z "$(AGENTS_DEST)" ]; then \
		echo "❌ Error: Destination path is required."; \
		exit 1; \
	fi
	@if [ -d "$(AGENTS_DEST)/.ai" ]; then \
		echo "⚠  Legacy .ai/ found at $(AGENTS_DEST)/.ai"; \
		echo "   Remove it once you have verified the new .agents/ tree."; \
	fi
	@mkdir -p $(AGENTS_DEST)/.agents
	@cp -r skills blueprints template $(AGENTS_DEST)/.agents/
	@echo "✅ Skills vendored to $(AGENTS_DEST)/.agents/"

install-skills:
	@node scripts/install-skills.mjs

install-own-skills:
	@npx -y skills@latest add $(OWN_REPO)

install-opencode-overlay:
	@node scripts/apply-opencode-overlay.mjs --apply

test-catalog:
	@node --test scripts/catalog.test.mjs scripts/review-preflight.test.mjs

# Catalog YAML is the source of truth. This writes ./generated only.
render-catalog:
	@node scripts/render-catalog.mjs --target all --dest generated

# `make vendor <path>` takes the destination as a positional goal, which make
# would otherwise try to build. FORCE keeps that goal perpetually out of date
# so its no-op recipe actually runs — silently. Without it, make prints
# "make: '<path>' is up to date." (or "Nothing to be done") on every call.
FORCE:
%: FORCE
	@true

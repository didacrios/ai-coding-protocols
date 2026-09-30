.PHONY: ai help install-skills install-opencode-overlay render-catalog test-catalog

help:
	@echo "Usage:"
	@echo "  make ai <path>                  Vendor skills+blueprints+template to <path>/.ai/"
	@echo "  make install-skills             Install third-party skills from skills.json (via npx skills add)"
	@echo "  make install-opencode-overlay   Merge harness/*-overlay.json into live opencode.json, package.json, tui.json (see blueprints/opencode.md)"
	@echo "  make test-catalog               Run catalog YAML + adapter tests"
	@echo "  make render-catalog             Render catalog to ./generated (gitignored; not a live install)"

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

install-opencode-overlay:
	@node scripts/apply-opencode-overlay.mjs --apply

test-catalog:
	@node --test scripts/catalog.test.mjs scripts/review-preflight.test.mjs

# Catalog YAML is the source of truth. This writes ./generated only.
render-catalog:
	@node scripts/render-catalog.mjs --target all --dest generated

%:
	@:

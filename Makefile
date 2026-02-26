.PHONY: ai help

help:
	@echo "Usage: make ai <path>"

AI_DEST := $(word 2, $(MAKECMDGOALS))

ai:
	@if [ -z "$(AI_DEST)" ]; then \
		echo "❌ Error: Destination path is required."; \
		exit 1; \
	fi
	@mkdir -p $(AI_DEST)/.ai
	@cp -r skills blueprints template $(AI_DEST)/.ai/
	@echo "✅ Skills vendored to $(AI_DEST)/.ai/"

%:
	@:

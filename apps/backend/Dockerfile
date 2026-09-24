# Use the official Bun image
FROM oven/bun:1-slim AS base
WORKDIR /usr/src/app

# Install tectonic LaTeX compiler for PDF generation
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates libfontconfig1 libgraphite2-3 libharfbuzz0b libssl3t64 \
    && curl -fsSL https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-gnu.tar.gz \
    | tar xz -C /usr/local/bin \
    && chmod +x /usr/local/bin/tectonic \
    && apt-get purge -y curl \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Create non-root group and user
RUN groupadd -r appgroup && useradd -r -g appgroup -d /usr/src/app appuser

# Copy package files and Prisma schema with appropriate ownership
COPY --chown=appuser:appgroup package.json ./
COPY --chown=appuser:appgroup prisma ./prisma/

# Install dependencies (triggers postinstall: prisma generate)
RUN bun install

# Copy the rest of the source code
COPY --chown=appuser:appgroup src ./src
COPY --chown=appuser:appgroup entrypoint.js ./

# Set correct ownership for the workspace
RUN chown -R appuser:appgroup /usr/src/app

# Expose the API port
EXPOSE 8080

# Set environment production flag
ENV NODE_ENV=production

# Switch to non-root user
USER appuser

# Use entrypoint script to clean environment variables
ENTRYPOINT ["bun", "run", "./entrypoint.js"]

# Run migrations and start the application
CMD ["bun", "run", "start"]

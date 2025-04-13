#!/bin/sh
# Switch to root to copy files
USER=`whoami`
if [ "$USER" != "root" ]; then
  echo "Script must be run as root to copy files"
  exit 1
fi

# Copy custom nodes to the correct location
mkdir -p /home/node/.n8n/custom
cp -r /tmp/custom-nodes-backup/* /home/node/.n8n/custom/
# Fix permissions
chown -R node:node /home/node/.n8n/custom

# Then start n8n with the original entrypoint
exec /usr/local/bin/docker-entrypoint.sh "$@"
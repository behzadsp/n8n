# Run the behzadsp/n8n fork with Docker

Build the application images from this repository. The upstream npm package,
`get.n8n.io`, and upstream n8n images do not include this fork's changes.

## Build the images

Install Node.js 24 or newer, pnpm 12.4.2, Docker, and Docker Buildx.

```sh
git clone https://github.com/behzadsp/n8n.git
cd n8n
pnpm install --frozen-lockfile
IMAGE_BASE_NAME=behzadsp/n8n RUNNERS_IMAGE_BASE_NAME=behzadsp/runners pnpm build:docker > build-docker.log 2>&1
```

This builds `behzadsp/n8n:local` and `behzadsp/runners:local` in your local
Docker engine. It does not publish them. The build uses the source in your
checkout, including any uncommitted changes.

To use a numeric image tag, set `IMAGE_TAG` for the build. Use the same tag
with the installer's `--version` option.

Base images and the task-runner launcher still come from their original
providers. Changing the application repository does not replace those dependencies.

## Start the application

```sh
docker volume create n8n_data
docker run -it --rm --pull=never \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  behzadsp/n8n:local
```

Open http://localhost:5678. Keep the `n8n_data` volume when replacing the container.
It stores the database, settings, and encryption key.

Use your own API credentials for workflow integrations, including OpenAI.
Upstream hosted AI services require their own authorization.

## Install the full compose stack

Build both fork images first. Then run this command from the repository root:

```sh
N8N_COMPOSE_URL="$PWD/docker/get-n8n-compose.yml" sh docker/get-n8n.sh
```

The installer writes its configuration to `./n8n`. Set `N8N_DIR` to use a
different directory. Add `--no-start` to write the files without starting containers.

The stack uses the local fork images for the application and Code-node runners.
Their pull policy is `never`, so a missing local image causes an error instead
of installing another build. The installer downloads only the separate sandbox
and search service images from their original providers.

If you download the installer separately, use this fork's URL:

```sh
curl -fsSL https://raw.githubusercontent.com/behzadsp/n8n/master/docker/get-n8n.sh -o get-n8n.sh
sh get-n8n.sh
```

You must still build the two local fork images before running the downloaded
installer. The fork does not currently provide published application images.

## Update an installation

Update your source checkout and rebuild the images:

```sh
git pull --ff-only
IMAGE_BASE_NAME=behzadsp/n8n RUNNERS_IMAGE_BASE_NAME=behzadsp/runners pnpm build:docker > build-docker.log 2>&1
```

For a compose installation, run:

```sh
N8N_COMPOSE_URL="$PWD/docker/get-n8n-compose.yml" sh docker/get-n8n.sh --upgrade
```

For a standalone container, stop it and recreate it with the same data volume.
Do not pull an upstream n8n image to update this fork.

Existing upstream compose installations keep their configuration. Back up the
data and review the [fork compose file](../../get-n8n-compose.yml) before
switching their application and runner image references. The installer does
not rewrite those references in an existing installation.

## Configuration

See the upstream documentation for
[environment variables](https://docs.n8n.io/hosting/configuration/environment-variables/),
[PostgreSQL](https://docs.n8n.io/hosting/configuration/supported-databases-settings/),
and [task runners](https://docs.n8n.io/hosting/configuration/task-runners/).
Use the fork image names when adapting upstream examples.

## License

See [LICENSE.md](../../../LICENSE.md) and [LICENSE_EE.md](../../../LICENSE_EE.md).

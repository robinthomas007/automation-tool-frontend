## 1. development docker setup:

- `git clone git@github.com:sedinqa/automation-tool-frontend.git`
- Create a file `.env`
- Copy content of `.env.default` and paste in the `.env` file
- `docker build -f Dockerfile.dev -t automation-tool-frontend .`
- `docker compose up -d`

## 1. Production docker setup:

- `docker build -t automation-tool-frontend .`
- `docker compose up -d`

# Payload Template

A Payload template with some modifications.

## Quick start

```sh
pnpm dlx degit kwabe007/payload-cms-v3-template my-payload-app
```

### Development

1. `cd my-payload-app && cp .env.example .env` to copy the example environment variables.
2. `pnpm install && pnpm dev` to install dependencies and start the dev server
3. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create
your first admin user.

#### Docker (Optional)

If you prefer to use Docker for local development, the provided docker-compose.yml file can be used.

Run `docker compose up`. The default docker-compose.yml is configured to use the `.env` file in the project root. And
it will also directly use the host machine network.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this
functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/3.x/examples/auth) or
  the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you
  manage your pictures.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start
a [GitHub discussion](https://github.com/payloadcms/payload/discussions).

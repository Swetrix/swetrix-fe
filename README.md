<img src="src/public/assets/logo_blue.svg" alt="" height="100" />

[![Dockerhub pulls](https://img.shields.io/docker/pulls/swetrix/swetrix-fe.svg?style=flat)](https://hub.docker.com/r/swetrix/swetrix-fe)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/swetrix/swetrix-fe/issues)

## Description

Swetrix is a privacy-oriented, simple and fully cookie-less web analytics service.\
It provides lots of metrics like unique visitors, live visitors monitoring, custom events, pageviews and many more.

The service also supports many other features, like dashboard metrics & GDPR exports, email reports and more.

The project's purpose is to fight web analytics giants like Google Analytics while providing better quality and experience of using service.

## License

Swetrix is released under the AGPL v3.0 licence, see [LICENSE](LICENSE).

## Install Swetrix

See the API installation process at https://github.com/Swetrix/swetrix-api#readme. \
To selfhost the frontend part of Swetrix, you simply need to set up `.env` variables, install the dependencies (`npm i`), build the code (`npm run build`) and host it as a regular React application ([how to host react apps](https://create-react-app.dev/docs/deployment/)).\
On production, swetrix.com uses Cloudflare Pages to host the frontend part of the application.\
The minimum supported NodeJS version is v14.

### Docker Setup

Swetrix provides a Docker Image based on Alpine, Nginx and Node.
To use it you just just pull `swetrix/swetrixfe` from dockerhub.

#### Docker Environment Variables

The following environment variables are available, alongside their default values.
`API_URL` = `https://example.com/` | The URL of the Swetrix API
`TZ` = `Etc/UTC` | Sets the Timezone of the Container

## Bugs and security

Swetrix is open to pull-requests. Feel free to propose new features or submit bug requests via pull reuqests.\
For severe security issues, please contact us at security@swetrix.com

## Contributions
Contributions are welcome! You can find and pick any task on our [public roadmap](https://github.com/orgs/Swetrix/projects/2) page.\
Feel free to also offer any feature or improvement proposal, all of it is highly appreciated!\
You can also contribute translations on your [Crowdin](https://crowdin.com/project/swetrix) page.

## Contact

You can contact us via email at contact@swetrix.com

## Donate
You can support the project by donating us at https://ko-fi.com/andriir \
We can only run our services by once again asking for your financial support!

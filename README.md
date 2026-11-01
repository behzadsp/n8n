![Banner image](assets/readme-banner.jpg)

# n8n – The Platform for AI Agents and Workflow Automation

This is the [behzadsp/n8n fork](https://github.com/behzadsp/n8n). Build and run this repository to use its local enterprise features. Upstream npm packages, Docker images, and n8n Cloud do not include this fork's changes.

![n8n.io - Screenshot](assets/n8n-screenshot-readme.png)

## Key Capabilities

- **AI-Native Automation Platform**: Build and operationalize AI workflows and multi-step agents using your own data, models, and tools
- **Model Flexibility, No Lock-In**: Connect to OpenAI, Anthropic, Google, or open-source models and switch providers without changing your architecture
- **From Prototype to Production**: Design multi-step AI workflows with logic, tool use, human approvals, and full observability
- **Code When You Need It**: Combine visual building with JavaScript, Python, and npm packages for advanced AI workflows
- **Enterprise-Ready AI**: Self-host or deploy securely with role-based access, audit trails, and support for sensitive data
- **Leverage What Already Exists**: 1500+ integrations and 9,000+ workflow [templates](https://n8n.io/workflows) to connect AI with your existing systems

## Quick Start

Install Node.js 24 or newer and pnpm 12.4.2. Then build this repository:

```sh
git clone https://github.com/behzadsp/n8n.git
cd n8n
pnpm install --frozen-lockfile
pnpm build > build.log 2>&1
pnpm start
```

Access the editor at http://localhost:5678.

### Docker

Build the fork images from the same checkout. This command also prepares the production deployment:

```sh
IMAGE_BASE_NAME=behzadsp/n8n RUNNERS_IMAGE_BASE_NAME=behzadsp/runners pnpm build:docker > build-docker.log 2>&1
```

Then run the local image:

```
docker volume create n8n_data
docker run -it --rm --pull=never --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n behzadsp/n8n:local
```

For the full compose stack, see the [Docker guide](docker/images/n8n/README.md). The fork images must be built locally before you run the installer. Separate base images and sandbox services still come from their original providers.

## Resources

- 📚 [Documentation](https://docs.n8n.io)
- 🔧 [1500+ Integrations](https://n8n.io/integrations)
- 💡 [Example Workflows](https://n8n.io/workflows)
- 🤖 [AI & LangChain Guide](https://docs.n8n.io/advanced-ai/)
- 👥 [Community Forum](https://community.n8n.io)
- 📖 [Community Tutorials](https://community.n8n.io/c/tutorials/28)

## Support

Need help? Our community forum is the place to get support and connect with other users:
[community.n8n.io](https://community.n8n.io)

## License

See this repository's [LICENSE.md](LICENSE.md) and [LICENSE_EE.md](LICENSE_EE.md). Third-party components retain their own licenses.

## Contributing

See the [Contributing Guide](CONTRIBUTING.md) for setup instructions. Report fork-specific issues in [behzadsp/n8n](https://github.com/behzadsp/n8n/issues).

## Join the Team

Want to shape the future of automation? Check out our [job posts](https://n8n.io/careers) and join our team!

## What does n8n mean?

**Short answer:** It means "nodemation" and is pronounced as n-eight-n.

**Long answer:** "I get that question quite often (more often than I expected) so I decided it is probably best to answer it here. While looking for a good name for the project with a free domain I realized very quickly that all the good ones I could think of were already taken. So, in the end, I chose nodemation. 'node-' in the sense that it uses a Node-View and that it uses Node.js and '-mation' for 'automation' which is what the project is supposed to help with. However, I did not like how long the name was and I could not imagine writing something that long every time in the CLI. That is when I then ended up on 'n8n'." - **Jan Oberhauser, Founder and CEO, n8n.io**

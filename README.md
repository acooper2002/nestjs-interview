# nextjs-interview / TodoApi

[![Open in Coder](https://dev.crunchloop.io/open-in-coder.svg)](https://dev.crunchloop.io/templates/fly-containers/workspace?param.Git%20Repository=git@github.com:crunchloop/nextjs-interview.git)

This is a simple Todo List API built in Nest JS and Typescript. This project is currently being used for Javascript/Typescript full-stack candidates.

## Installation

```bash
$ npm install
```

## Running the API and MCP Server

To run the full application, you need to start both the NestJS API server and the MCP server.

1.  **Start the NestJS API Server:**

    This will start the backend providing the REST endpoints for todo lists and items.

    ```bash
    # development mode with watching
    $ npm run start:dev
    ```

2.  **Start the MCP Server:**

    Open a **new terminal** session in the project root directory and run the following command. This server exposes the API functionality as tools for MCP clients.

    ```bash
    $ npm run mcp:start
    ```

Both processes should remain running in their respective terminals.

## Model Context Protocol (MCP) Server

The project includes an MCP server that allows interacting with the Todo API using natural language prompts via an MCP client like Claude Desktop.

### Connecting with Claude Desktop

To use the MCP server with Claude Desktop, you need to configure Claude Desktop to connect to it. This is done by editing the `claude_desktop_config.json` file.

1.  **Locate the config file:**

    The location varies by OS:
    -   macOS: `~/Library/Application Support/Claude Desktop/claude_desktop_config.json`
    -   Windows: `%APPDATA%\Claude Desktop\claude_desktop_config.json`
    -   Linux: `~/.config/Claude Desktop/claude_desktop_config.json`

2.  **Add the server configuration:**

    Add or modify the `mcpServers` section to include the configuration for your Todo MCP server. Replace `/Users/andrewcooper/Desktop/Interview_crunchloop/nestjs-interview` with the actual absolute path to your project directory.

    ```json
    {
      "mcpServers": {
        "todo": {
          "command": "npm",
          "args": [
            "--silent",
            "--prefix",
            "/Users/andrewcooper/Desktop/Interview_crunchloop/nestjs-interview",
            "run",
            "mcp:start"
          ],
          "cwd": "/Users/andrewcooper/Desktop/Interview_crunchloop/nestjs-interview"
        }
      }
    }
    ```

3.  **Restart Claude Desktop:**

    After saving the config file, restart Claude Desktop. You should see a message indicating that the MCP server is connected.

### Using the Tools

Once connected, you can use natural language prompts in Claude Desktop to interact with your Todo API. For example:

-   "Create a todo list named 'Groceries'"
-   "Show me all my todo lists"
-   "Add item 'Buy milk' to the 'Groceries' list"
-   "Mark item 'Buy milk' in 'Groceries' as completed"
-   "Delete the 'Groceries' list"

The MCP server will translate these prompts into calls to your NestJS services.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Check integration tests at: (https://github.com/crunchloop/interview-tests)

## Contact

- Martín Fernández (mfernandez@crunchloop.io)

## About Crunchloop

![crunchloop](https://s3.amazonaws.com/crunchloop.io/logo-blue.png)

We strongly believe in giving back :rocket:. Let's work together [`Get in touch`](https://crunchloop.io/#contact).

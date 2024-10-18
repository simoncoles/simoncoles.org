# simoncoles.org

## Development

### Using DevContainer

This project includes a DevContainer configuration for easy setup and consistent development environments.

1. Install [Visual Studio Code](https://code.visualstudio.com/) and the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.
2. Open this project in VS Code.
3. When prompted, click "Reopen in Container" or run the "Remote-Containers: Reopen in Container" command from the Command Palette (F1).
4. Once the container is built and running, open a terminal in VS Code and run:

   ```
   bundle exec jekyll serve --livereload
   ```

5. Your site will be available at `http://localhost:4000`.

### Manual Setup

To build run:

```
./development_autobuild.sh
```

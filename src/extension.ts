import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('SkillFlow extension activated');

    // Register search command
    let searchCmd = vscode.commands.registerCommand('skillflow.search', async () => {
        const query = await vscode.window.showInputBox({
            placeHolder: 'Search AI skills...',
            prompt: 'Enter a skill name, category, or keyword'
        });
        if (query) {
            vscode.env.openExternal(
                vscode.Uri.parse(`https://skillflow.builders/explore?q=${encodeURIComponent(query)}`)
            );
        }
    });

    // Register browse command
    let browseCmd = vscode.commands.registerCommand('skillflow.browse', () => {
        const panel = vscode.window.createWebviewPanel(
            'skillflow', 'SkillFlow Marketplace',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );
        panel.webview.html = getMarketplaceHtml();
    });

    // Register install command
    let installCmd = vscode.commands.registerCommand('skillflow.install', async () => {
        const skillId = await vscode.window.showInputBox({
            placeHolder: 'e.g., credit-optimizer',
            prompt: 'Enter the skill ID to install'
        });
        if (skillId) {
            const terminal = vscode.window.createTerminal('SkillFlow');
            terminal.sendText(`pip install skillflow && skillflow install ${skillId}`);
            terminal.show();
        }
    });

    context.subscriptions.push(searchCmd, browseCmd, installCmd);
}

function getMarketplaceHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); }
            h1 { color: #4ECDC4; }
            .skill-card { border: 1px solid var(--vscode-panel-border); border-radius: 8px; padding: 16px; margin: 12px 0; }
            .skill-card:hover { background: var(--vscode-list-hoverBackground); }
            .trust-score { color: #4ECDC4; font-weight: bold; font-size: 18px; }
            a { color: #4ECDC4; }
        </style>
    </head>
    <body>
        <h1>SkillFlow Marketplace</h1>
        <p>Browse curated AI agent skills with trust scores.</p>
        <div class="skill-card">
            <h3>Credit Optimizer v5</h3>
            <p>Optimize AI credits by 30-75% with zero quality loss</p>
            <span class="trust-score">Trust: 94</span>
        </div>
        <div class="skill-card">
            <h3>Fast Navigation</h3>
            <p>Accelerate web navigation by 30-2000x</p>
            <span class="trust-score">Trust: 91</span>
        </div>
        <p><a href="https://skillflow.builders/explore">View all skills on SkillFlow →</a></p>
    </body>
    </html>`;
}

export function deactivate() {}

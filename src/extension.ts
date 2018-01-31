'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let previewUri = vscode.Uri.parse('network-tool://showNetworkTool');
	
	context.logger.info('This is a info');
	context.logger.debug('This is debug');
	context.logger.trace('This is trace');

	class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
		private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

		public provideTextDocumentContent(uri: vscode.Uri): string {
			return this.render();
		}

		get onDidChange(): vscode.Event<vscode.Uri> {
			return this._onDidChange.event;
		}

		public update(uri: vscode.Uri) {
			this._onDidChange.fire(uri);
		}

		private render(): string {
			return `
				<body>
					<h1>Network Tool</h1>
					<script> alert(window.external) </script>
				</body>`;
		}
	}

	let provider = new TextDocumentContentProvider();
	let registration = vscode.workspace.registerTextDocumentContentProvider('network-tool', provider);

	let disposable = vscode.commands.registerCommand('extension.showNetworkTool', () => {
		return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.One, 'Network Tool').then((success) => {
		}, (reason) => {
			vscode.window.showErrorMessage(reason);
		});
	});

	context.subscriptions.push(disposable, registration);
}

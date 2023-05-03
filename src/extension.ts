import * as vscode from 'vscode';
import * as yaml from 'js-yaml';

export function activate(context: vscode.ExtensionContext) {
	const provider = vscode.languages.registerDocumentFormattingEditProvider('python', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const edits: vscode.TextEdit[] = [];

			// regex pattern to match YAML inside Python strings
			const yamlRegex = /("""|''')([\s\S]*?)\1/gm;
			const text = document.getText();
			let match;

			while (match = yamlRegex.exec(text)) {
				const yamlString = match[2];
				const yamlObject = yaml.load(yamlString);
				const beautifiedYaml = yaml.dump(yamlObject, { indent: 2 });
				const startPos = document.positionAt(match.index + match[1].length);
				const endPos = document.positionAt(match.index + match[0].length - match[1].length);
				edits.push(vscode.TextEdit.replace(new vscode.Range(startPos, endPos), beautifiedYaml));
			}

			return edits;
		}
	});

	context.subscriptions.push(provider);
}
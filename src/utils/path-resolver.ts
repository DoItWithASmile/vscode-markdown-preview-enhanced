import * as vscode from "vscode";

export class PathResolver {
  /**
   * resolve placeholder in string
   */
  public static resolvePath(path: string) {
    let result = path;

    // guard: empty
    if (result.trim() == "") {
      return path;
    }

    // resolve VS Code predefined variables
    result = this.resolve_vscode_predefined_variables(result);

    // resolve environment variables
    result = this.resolve_environment_variable(result);

    // done
    return result;
  }

  /**
   * resolve vscode predefined variables in string
   */
  public static resolve_vscode_predefined_variables(path: string) {
    let result = path;

    // ... workspaceFolder
    result = this.resolve_vscode_predefined_variable_workspaceFolder(result);

    // done
    return result;
  }

  /**
   * resolve vscode predefined variables in string
   */
  public static resolve_vscode_predefined_variable_workspaceFolder(
    path: string,
  ) {
    let result = path;

    // guard: nothing to do
    if (!path.includes("${workspaceFolder}")) return path;

    // guard: error
    if (vscode.workspace.workspaceFolders == undefined) {
      vscode.window.showErrorMessage(
        "Working folder not found, open a folder an try again",
      );

      return path;
    }

    // determine workspace folder
    // let workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path ;
    let workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;

    // replace in configPath
    result = path.replace("${workspaceFolder}", workspaceFolder);

    // log
    //vscode.window.showInformationMessage(
    //  `Resolved '${this}' to '${result}'`
    //);

    // done
    return result;
  }

  /**
   * resolve environment variables in string
   */
  public static resolve_environment_variable(path: string) {
    // try to replace environment variables for windows (%ENV_VAR%) and bash (${ENV_VAR} as well as $ENV_VAR)
    // line as suggested in https://stackoverflow.com/questions/21363912/how-to-resolve-a-path-that-includes-an-environment-variable-in-nodejs
    return path.replace(
      /%([A-Z_]+[A-Z0-9_]*)%|\$([A-Z_]+[A-Z0-9_]*)|\${([A-Z0-9_]*)}/gi,
      (_, windows, bash1, bash2) => process.env[windows || bash1 || bash2],
    );
  }
}

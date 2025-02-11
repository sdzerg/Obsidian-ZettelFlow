import { ActionSetting } from "architecture/api";
import { t } from "architecture/lang";
import { CodeElement, dispatchEditor } from "architecture/components/core";

export const scriptSettings: ActionSetting = (contentEl, _, action) => {
  const scriptAction = action as CodeElement;
  const { code } = scriptAction;
  contentEl.createEl("h3", {
    text: t("step_builder_element_type_script_title"),
  });
  contentEl.createEl("p", {
    text: t("step_builder_element_type_script_description"),
  });
  const editorEl = contentEl.createDiv();
  editorEl.id = "script-editor";

  dispatchEditor(editorEl, code, (update) => {
    if (update.docChanged) {
      scriptAction.code = update.state.doc.toString();
    }
  });
};
